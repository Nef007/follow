const User = require("../models/user.model");
const Link = require("../models/link.model");
const Follower = require("../models/follower.model");
const Petition = require("../models/petition.model");

const createLinkInTree = require("../utils/createLinkInTree");

class LinkController {
  constructor(io) {
    this.io = io;
  }

  create = async (req, res) => {
    try {
      const { link } = req.body;
      const userId = req.user._id;
      const { type } = req.params;

      //Валидация

      if (type === "vk") {
        let valid = /https:\/\/vk.com\/.*/.test(link);

        if (!valid) {
          return res
            .status(400)
            .json({ message: 'не соответствует шаблону "https://vk.com/" ' });
        }
      }
      if (type === "youtube") {
        let valid = /https:\/\/www.youtube.com\/.*/.test(link);

        if (!valid) {
          return res.status(400).json({
            message: 'не соответствует шаблону "https://www.youtube.com/" ',
          });
        }
      }
      if (type === "telegram") {
        let valid = /https:\/\/t.me\/.*/.test(link);

        if (!valid) {
          return res.status(400).json({
            message: 'не соответствует шаблону "https://t.me/" ',
          });
        }
      }

      const candidate = await Link.findOne({ link });
      if (candidate) {
        return res.status(400).json({ message: "Такая ссылка уже существует" });
      }

      let { newLink, status, message } = await createLinkInTree(
        link,
        type,
        userId
      );

      res.status(status).json({ link: newLink, message });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };

  get = async (req, res) => {
    try {
      const linkId = req.params.id;
      const arrLink = [];

      // const user = await User.findByPk(id)
      const linkMy = await Link.findOne({ _id: linkId }).populate("petitions");

      async function getParent(parentLink, linkMy) {
        const followers = await Follower.find({
          linkIdUser: parentLink._id,
        });

        const isFollow = followers.some(
          (follow) => follow.link === linkMy.link
        );
        if (parentLink.status !== "Блокирован") {
          if (isFollow) {
            arrLink.push({ parentLink, isFollow: true });
          } else {
            arrLink.push({ parentLink, isFollow: false });
          }
        }
      }

      if (!linkMy) {
        return res.status(200).json({ arrLink, linkMy });
      }

      if (linkMy.parent) {
        let linkParent1 = await Link.findById(linkMy.parent);
        if (linkParent1) {
          await getParent(linkParent1, linkMy);
          if (linkParent1.parent) {
            let linkParent2 = await Link.findById(linkParent1.parent);
            if (linkParent2) {
              await getParent(linkParent2, linkMy);
              if (linkParent2.parent) {
                let linkParent3 = await Link.findById(linkParent2.parent);
                if (linkParent3) {
                  await getParent(linkParent3, linkMy);
                  if (linkParent3.parent) {
                    let linkParent4 = await Link.findById(linkParent3.parent);
                    if (linkParent4) {
                      await getParent(linkParent4, linkMy);
                      if (linkParent4.parent) {
                        let linkParent5 = await Link.findById(
                          linkParent4.parent
                        );
                        if (linkParent5) {
                          await getParent(linkParent5, linkMy);
                          if (linkParent5.parent) {
                            let linkParent6 = await Link.findById(
                              linkParent5.parent
                            );
                            if (linkParent6) {
                              await getParent(linkParent6, linkMy);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      res.status(201).json({ arrLink, linkMy });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };
  getAll = async (req, res) => {
    try {
      const id = req.user._id;
      const type = req.params.type;

      const links = await Link.find({ userId: id, type }).populate("petitions");

      res.status(201).json(links);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };

  active = async (req, res) => {
    try {
      const id = req.user._id;
      const idLink = req.params.id;

      const user = await User.findOne({ _id: id });
      const link = await Link.findOne({ _id: idLink });

      if (!link) {
        return res
          .status(400)
          .json({ message: "Ссылка удалена из дерева т.к. прошло 30 мин" });
      }

      if (user.balance < 100 || user.countRef < 5) {
        return res.status(400).json({ message: "Недостаточно средств" });
      }

      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: { balance: user.balance - 100, countRef: user.countRef - 5 },
        }
      );

      await Link.updateOne(
        {
          _id: idLink,
        },
        { $set: { status: "Активный" } }
      );

      res.status(201).json({ message: "Активация успешна" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };

  block = async (req, res) => {
    try {
      const idLink = req.params.id;

      await Link.updateOne(
        {
          _id: idLink,
        },
        {
          $set: { status: "Блокирован" },
        }
      );

      const link = await Link.findOne({ _id: idLink });

      res.status(201).json({ link, message: "Ссылка заблокирована" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };

  reset = async (req, res) => {
    try {
      const userId = req.user._id;
      const idLink = req.params.id;
      const userLink = await Link.findById(idLink);

      const link = userLink.link;
      const type = userLink.type;

      let { newLink, status, message } = await createLinkInTree(
        link,
        type,
        userId
      );

      if (status === 201) {
        await Link.deleteOne({
          _id: idLink,
        });
      }

      res.status(status).json({ link: newLink, message });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };

  follow = async (req, res) => {
    try {
      const userId = req.user._id;
      const linkId = req.params.id;
      const { linkIdMy } = req.body;

      const linkUser = await Link.findById(linkId);
      const linkMy = await Link.findById(linkIdMy);

      const followers = await Follower.find({
        linkIdUser: linkUser._id,
      });

      const isfollow = followers.some((follow) => follow.link === linkMy.link);

      if (isfollow) {
        return res.status(401).json({ message: "Уже подписаны" });
      }

      //  const checkData = await checkInstagram(linkUser.link, linkMy.link, this.instagram)

      // if (!checkData) {
      //   return   res.status(401).json({message: 'Не подписались'})
      // }

      let follower = new Follower({
        link: linkMy.link,
        linkIdUser: linkUser._id,
        linkIdMy: linkMy._id,
      });

      await follower.save();

      await Link.updateOne(
        {
          _id: linkId,
        },
        { $set: { follow: linkUser.follow + 1 } }
      );

      if (linkUser.follow > 39) {
        await Link.updateOne(
          {
            _id: linkId,
          },
          { $set: { status: "Блокирован" } }
        );
      }

      res.status(201).json({ message: "Выполнено" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };

  getFollow = async (req, res) => {
    try {
      const linkId = req.params.id;

      const { pagination } = req.body;

      let followers = await Follower.paginate(
        { linkIdUser: linkId },
        {
          page: pagination.current,
          limit: pagination.pageSize,
          populate: "linkIdMy",
        }
      );

      // const link = await Link.findById(linkId);
      // const followers = await Follower.find({
      //   linkIdUser: linkId,
      // }).populate("linkIdMy");
      res.status(200).json(followers);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };

  setPetition = async (req, res) => {
    try {
      const linkIdUser = req.params.id;
      const myId = req.user._id;
      const { comment } = req.body;

      let candidate = await Petition.findOne({
        linkIdUser,
        linkIdMy: myId,
      });

      if (candidate) {
        return res.status(400).json({ message: "Уже жаловались!" });
      }

      let petition = new Petition({
        comment,
        linkIdUser,
        linkIdMy: myId,
      });

      await petition.save();

      await Link.updateOne(
        {
          _id: linkIdUser,
        },
        { $push: { petitions: petition._id } }
      );

      res.status(201).json({ message: "Жалоба принята" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что то пошло не так попробуйте снова" });
    }
  };
}

module.exports = LinkController;
