const User = require("../models/user.model");
const Bill = require("../models/bill.model");

class PayController {
  constructor(qiwiApi) {
    this.qiwiApi = qiwiApi;
  }
  createdBill = async (req, res) => {
    try {
      const { amount, comment } = req.body;
      const { email, _id } = req.user;

      const candidate = await Bill.findOne({
        status: "WAITING",
        userId: _id,
      }).lean();

      if (candidate) {
        return res
          .status(400)
          .json({ message: "У Вас уже есть неоплаченный счет" });
      }

      const billId = this.qiwiApi.generateId();
      const lifetime = this.qiwiApi.getLifetimeByDay(1);

      const fields = {
        amount,
        currency: "RUB",
        comment,
        expirationDateTime: lifetime,
        email: email,
        account: email,
        successUrl: "http://localhost:3000/pay",
      };

      const link = await this.qiwiApi.createBill(billId, fields);

      const bill = new Bill({
        qiwiId: billId,
        value: link.amount.value,
        status: link.status.value,
        expirationDateTime: link.expirationDateTime,
        payUrl: link.payUrl,
        userId: _id,
      });

      await bill.save();

      res.status(201).json(link.payUrl);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };
  cancelBill = async (req, res) => {
    try {
      const { id } = req.params;
      await this.qiwiApi.cancelBill(id);

      res.status(201).json({ message: "Отменен" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };
  getBill = async (req, res) => {
    try {
      const { pagination } = req.body;
      // const minValue =
      //   pagination.current * pagination.pageSize - pagination.pageSize;

      const { _id } = req.user;

      const bills = await Bill.paginate(
        { userId: _id },
        {
          page: pagination.current,
          limit: pagination.pageSize,
          sort: { createdAt: -1 },
          lean: true,
        }
      );

      for (let bill of bills.docs) {
        if (bill.status === "WAITING") {
          const info = await this.qiwiApi.getBillInfo(bill.qiwiId);

          if (info.status.value === "PAID") {
            await User.update(
              { _id },
              {
                $inc: { balance: Number(bill.value) },
              }
            );
          }

          await Bill.updateOne(
            {
              _id: bill._id,
            },
            {
              $set: { status: info.status.value },
            }
          );

          bill.status = info.status.value;
        }
      }

      res.status(201).json(bills);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };
}

module.exports = PayController;
