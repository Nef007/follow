const fs = require("fs");
const bcryptjs = require("bcryptjs");
const createJWTToken = require("../utils/createJWTToken");
const { validationResult } = require("express-validator");

const User = require("../models/user.model");
const { nanoid } = require("nanoid");

class UserController {
  constructor(io) {
    this.io = io;
  }
  register = async (req, res) => {
    try {
      const { email, password, ...value } = req.body;

      // const avatar = req.files.avatar;
      const referrer = req.cookies.referrer || undefined;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Такой пользователь уже существует" });
      }

      const hashedPassword = await bcryptjs.hash(password, 12);
      const uid = nanoid(6);

      // const path = nanoid(10) + `.${avatar.name.split(".").reverse()[0]}`;
      //  await avatar.mv(process.env.STATIC_PATH + "/" + path);

      const user = new User({
        ...value,
        email,
        uid,
        password: hashedPassword,
        // avatar: path,
        referrer,
      });
      await user.save();

      if (referrer) {
        await User.updateOne(
          {
            uid: referrer,
          },
          {
            $inc: {
              countRef: 1,
            },
          }
        );
      }

      return res.status(201).json({ message: "Пользователь зарегистрирован" });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Что то пошло не так попробуйте снова" });
    }
  };
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).lean();

      if (!user) {
        return res
          .status(403)
          .json({ message: "Неверный логин или пароль, попробуйте снова" });
      }

      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(403)
          .json({ message: "Неверный логин или пароль, попробуйте снова" });
      }

      const token = createJWTToken(user);
      delete user.password;

      return res.json({ user, token });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Что то пошло не так попробуйте снова" });
    }
  };
  me = async (req, res) => {
    try {
      const { _id } = req.user;
      const user = await User.findOne({ _id }).lean();

      const token = createJWTToken(user);
      delete user.password;

      return res.json({ user, token });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Что то пошло не так попробуйте снова" });
    }
  };
  changePhoto = async (req, res) => {
    try {
      const { _id } = req.user;
      const file = req.files.croppedImage;

      let user = await User.findOne({ _id });

      fs.unlinkSync(process.env.STATIC_PATH + "/" + user.avatar);

      const path = nanoid(10) + `.${file.name.split(".").reverse()[0]}`;
      await file.mv(process.env.STATIC_PATH + "/" + path);
      await User.updateOne({ _id }, { $set: { avatar: path } });

      return res.status(200).json({ path, message: "Изменено" });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Что то пошло не так попробуйте снова" });
    }
  };
  change = async (req, res) => {
    try {
      const { _id } = req.user;
      const { ...value } = req.body;

      let user = await User.findOne({ _id });

      const isMatch = await bcryptjs.compare(value.password, user.password);

      if (!isMatch) {
        return res
          .status(403)
          .json({ message: "Неверный пароль, попробуйте снова" });
      }

      if (value.new_password) {
        value.password = await bcryptjs.hash(value.new_password, 12);
      } else {
        delete value.password;
      }

      user = await User.findOneAndUpdate(
        { _id },
        { $set: { ...value } },
        {
          new: true,
        }
      );

      return res.status(200).json({ user, message: "Изменено" });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Что то пошло не так попробуйте снова" });
    }
  };

  users = async (req, res) => {
    try {
      const { _id } = req.user;
      const { pagination } = req.body;

      let users = await User.paginate(
        { _id: { $ne: { _id } } },
        {
          page: pagination.current,
          limit: pagination.pageSize,
          select: "name birthday avatar",
        }
      );

      return res.json(users);
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Что то пошло не так попробуйте снова" });
    }
  };
  referals = async (req, res) => {
    try {
      const { uid } = req.user;
      const { pagination } = req.body;

      let users = await User.paginate(
        { referrer: uid },
        {
          page: pagination.current,
          limit: pagination.pageSize,
        }
      );

      return res.json(users);
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Что то пошло не так попробуйте снова" });
    }
  };
}

module.exports = UserController;
