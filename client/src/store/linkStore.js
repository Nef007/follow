import { makeAutoObservable } from "mobx";
import { notification } from "./notificationStore";
import { currentUserStore } from "./currentUserStore";
import { linkAPI } from "../api/api";

export const linkStore = makeAutoObservable({
  links: [],
  myLinks: [],
  followers: [],
  step: 0,
  link: "",
  loading: false,
  loadingFollowers: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },

  async create(link, type) {
    try {
      const data = await linkAPI.create(
        link,
        type,
        localStorage.getItem("userData")
      );

      //this.link = data.linkBD;
      await this.getAll(type);
      notification.setInfo("success", data.message);
    } catch (e) {
      notification.setInfo("error", e.message);
      if (e.message === "Не действительный токен") {
        currentUserStore.logout();
      }
    }
  },

  async get(linkId, callback) {
    try {
      this.setLoading();
      const data = await linkAPI.get(linkId, localStorage.getItem("userData"));
      this.links = data.arrLink;
      this.link = data.linkMy;

      if (data.linkMy) {
        if (data.linkMy && this.link.status !== "Ожидание") {
          this.step = 2;
        } else if (
          data.linkMy &&
          this.links.length &&
          this.links.every((item) => item.isFollow)
        ) {
          this.step = 1;
        } else {
          this.step = 0;
        }
      } else callback();

      this.setLoading();
    } catch (e) {
      notification.setInfo("error", e.message);
      this.setLoading();
      if (e.message === "Не действительный токен") {
        currentUserStore.logout();
      }
    }
  },

  async getAll(type) {
    try {
      this.setLoading();
      this.myLinks = await linkAPI.getAll(
        type,
        localStorage.getItem("userData")
      );
      this.setLoading();
    } catch (e) {
      notification.setInfo("error", e.message);
      this.setLoading();
      if (e.message === "Не действительный токен") {
        currentUserStore.logout();
      }
    }
  },

  async activated(callback) {
    try {
      this.setLoading();
      const data = await linkAPI.activated(
        this.link._id,
        localStorage.getItem("userData")
      );
      await this.get(this.link._id, callback);

      notification.setInfo("success", data.message);

      this.setLoading();
    } catch (e) {
      notification.setInfo("error", e.message);
      this.setLoading();
      if (e.message === "Не действительный токен") {
        currentUserStore.logout();
      }
    }
  },

  async block(linkId) {
    try {
      this.setLoading();
      const data = await linkAPI.block(
        linkId,
        localStorage.getItem("userData")
      );

      this.myLinks = this.myLinks.map((item) =>
        item._id === linkId ? data.link : item
      );

      notification.setInfo("success", data.message);

      this.setLoading();
    } catch (e) {
      notification.setInfo("error", e.message);
      this.setLoading();
      if (e.message === "Не действительный токен") {
        currentUserStore.logout();
      }
    }
  },
  async reset() {
    try {
      this.setLoading();
      const data = await linkAPI.reset(
        this.link._id,
        localStorage.getItem("userData")
      );

      if (data.link) {
        if (data.link && this.link.status !== "Ожидание") {
          this.step = 2;
        } else if (
          data.link &&
          this.links.length &&
          this.links.every((item) => item.isFollow)
        ) {
          this.step = 1;
        } else {
          this.step = 0;
        }
      }

      this.link = data.link;

      notification.setInfo("success", data.message);
      this.setLoading();
    } catch (e) {
      notification.setInfo("error", e.message);
      this.setLoading();
      if (e.message === "Не действительный токен") {
        currentUserStore.logout();
      }
    }
  },
  async follow(linkIdUser) {
    try {
      this.setLoading();
      const data = await linkAPI.follow(
        linkIdUser,
        this.link._id,
        localStorage.getItem("userData")
      );

      await this.get(this.link._id);

      notification.setInfo("success", data.message);
      this.setLoading();
    } catch (e) {
      notification.setInfo("error", e.message);
      this.setLoading();
      if (e.message === "Не действительный токен") {
        currentUserStore.logout();
      }
    }
  },

  async petition(linkId, comment) {
    try {
      this.setLoadingFollowers();
      const data = await linkAPI.petition(
        linkId,
        comment,
        localStorage.getItem("userData")
      );

      await this.getFollowers();
      notification.setInfo("success", data.message);
      this.setLoadingFollowers();
    } catch (e) {
      notification.setInfo("error", e.message);
      this.setLoadingFollowers();
      if (e.message === "Не действительный токен") {
        currentUserStore.logout();
      }
    }
  },
  async getFollowers(
    params = {
      pagination: {
        current: 1,
        pageSize: 10,
      },
    }
  ) {
    try {
      this.setLoadingFollowers();
      const data = await linkAPI.followers(
        this.link._id,
        params,
        localStorage.getItem("userData")
      );

      this.followers = data.docs;
      this.pagination = {
        ...params.pagination,
        total: data.total,
      };

      this.setLoadingFollowers();
    } catch (e) {
      notification.setInfo("error", e.message);
      this.setLoadingFollowers();
      if (e.message === "Не действительный токен") {
        currentUserStore.logout();
      }
    }
  },

  setLoading(bool) {
    this.loading = bool ? bool : !this.loading;
  },
  setLoadingFollowers(bool) {
    this.loadingFollowers = bool ? bool : !this.loadingFollowers;
  },
});
