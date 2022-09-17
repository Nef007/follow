const express = require("express");
const dotenv = require("dotenv");
const { createServer } = require("http");
const mongoose = require("mongoose");
const Link = require("./models/link.model");
const QiwiBillPaymentsAPI = require("@qiwi/bill-payments-node-js-sdk");

dotenv.config();

qiwiApi = new QiwiBillPaymentsAPI(process.env.SECRET_KEY);

const createRoutes = require("./core/routes");

const app = express();
const http = createServer(app);

createRoutes(app, qiwiApi);

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(process.env.NODE_ENV);
    http.listen(process.env.PORT, function () {
      console.log(`Сервер запушен на http://localhost:${process.env.PORT}`);
    });

    setInterval(async () => {
      const dests = await Link.find({
        status: "Ожидание",
        createdAt: {
          $lt: Date.now() - 1800000,
        },
      }).lean();

      await Link.deleteMany({
        status: "Ожидание",
        createdAt: {
          $lt: Date.now() - 1800000,
        },
      });

      for (let link of dests) {
        await Link.updateOne(
          {
            _id: link.parent,
          },
          {
            $inc: { branch: 1 },
          }
        );
      }

      await Link.updateMany(
        {
          status: "Активный",
          $where: "this.petitions.length >= 3",
        },
        {
          $set: {
            status: "Блокирован",
          },
        }
      );
    }, 30000); // 120000
  } catch (e) {
    console.log("Server Error", e.message);
    process.exit(1);
  }
}

connect();
