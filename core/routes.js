const bodyParser = require("body-parser");
const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const fileUpload = require("express-fileupload");
const loginValidation = require("../utils/validations/login");
const registerValidation = require("../utils/validations/registration");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const UserCtrl = require("../controllers/UserController");
const LinkCtrl = require("../controllers/LinkController");
const PayCtrl = require("../controllers/PayController");

const createRoutes = (app, qiwiApi) => {
  const UserController = new UserCtrl();
  const LinkController = new LinkCtrl();
  const PayController = new PayCtrl(qiwiApi);

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(express.static(__dirname + "/../static"));
  app.use(fileUpload({}));

  app.get("/api/user/me", checkAuth, UserController.me);
  app.post("/api/user/register", registerValidation, UserController.register);
  app.post("/api/user/login", loginValidation, UserController.login);
  app.put("/api/photo", checkAuth, UserController.changePhoto);
  app.put("/api/user", checkAuth, UserController.change);
  app.post("/api/users", checkAuth, UserController.users);

  app.post("/api/link/:type", checkAuth, LinkController.create);
  // app.post('/check/:type', checkAuth,  LinkController.checkLink)
  app.get("/api/link/:id", checkAuth, LinkController.get);
  app.get("/api/links/:type", checkAuth, LinkController.getAll);
  // app.put('/link/:id', checkAuth,  LinkController.check)
  //
  app.put("/api/link/:id", checkAuth, LinkController.active);
  app.put("/api/link/reset/:id", checkAuth, LinkController.reset);
  app.post("/api/link/follow/:id", checkAuth, LinkController.follow);
  app.post("/api/link/petition/:id", checkAuth, LinkController.setPetition);
  app.post("/api/followers/:id", checkAuth, LinkController.getFollow);
  app.patch("/api/link/:id", checkAuth, LinkController.block);

  app.post("/api/pay", checkAuth, PayController.createdBill);
  app.post("/api/pays", checkAuth, PayController.getBill);
  app.put("/api/pay/:id", checkAuth, PayController.cancelBill);

  app.post("/api/referals", checkAuth, UserController.referals);

  if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "../client", "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
    });
  }
};

module.exports = createRoutes;
