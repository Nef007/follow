const User = require("../models/user.model");
const Link = require("../models/link.model");

module.exports = async (link, type, userId) => {
  let power = 6;
  let newLink = {};

  const link_max = (await Link.find({ type }).sort({ level: -1 }).limit(1))[0];

  if (!link_max) {
    let linkBD = new Link({
      link,
      level: 1,
      branch: power,
      status: "Ожидание",
      follow: 0,
      step: 1,
      type,
      userId,
    });

    let newLink = await linkBD.save();
    return { newLink, status: 201, message: "Создана" };
  }

  // const level = (await Link.max("level", { where: { type } })) || 1;

  const parent_candidate_pre_level = await Link.findOne({
    level: link_max.level - 2,
    branch: { $gt: 0 },
    status: "Активный",
    type,
  });

  if (!parent_candidate_pre_level) {
    const parent_candidate = await Link.findOne({
      level: link_max.level - 1,
      branch: { $gt: 0 },
      status: "Активный",
      type,
    });

    if (!parent_candidate) {
      const parent_candidate_wait = await Link.findOne({
        level: link_max.level - 1,
        branch: { $gt: 0 },
        status: "Ожидание",
        type,
      });

      if (parent_candidate_wait) {
        return {
          status: 400,
          message: "Нет подходящего места в дереве, попробуйте позже",
        };
      }

      const parent = await Link.findOne({
        level: link_max.level,
        branch: { $gt: 0 },
        status: { $in: ["Активный", "Блокирован"] },
        type,
      });

      if (parent) {
        await Link.updateOne(
          {
            _id: parent._id,
          },
          {
            $set: { branch: parent.branch - 1 },
          }
        );

        const linkBD = new Link({
          link,
          level: link_max.level + 1,
          parent: parent.id,
          branch: power,
          status: "Ожидание",
          ref: 0,
          follow: 0,
          type,
          userId,
        });

        newLink = await linkBD.save();
      } else {
        return {
          status: 400,
          message: "Нет подходящего места в дереве, попробуйте позже",
        };
      }
    } else {
      await Link.updateOne(
        {
          _id: parent_candidate.id,
        },
        {
          $set: { branch: parent_candidate.branch - 1 },
        }
      );

      const linkBD = new Link({
        link,
        level: link_max.level,
        parent: parent_candidate.id,
        branch: power,
        status: "Ожидание",
        ref: 0,
        follow: 0,
        type,
        userId,
      });

      newLink = await linkBD.save();
    }
  } else {
    await Link.updateOne(
      {
        _id: parent_candidate_pre_level.id,
      },
      {
        $set: { branch: parent_candidate_pre_level.branch - 1 },
      }
    );

    const link = new Link({
      link,
      level: link_max.level - 1,
      parent: parent_candidate_pre_level.id,
      branch: power,
      status: "Ожидание",
      ref: 0,
      follow: 0,
      type,
      userId,
    });

    let newLink = await link.save();

    return { newLink, status: 201, message: "Создана" };
  }

  return { newLink, status: 201, message: "Создана" };
};
