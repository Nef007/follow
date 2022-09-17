import { makeAutoObservable } from "mobx";
import { notification } from "./notificationStore";
import { currentUserStore } from "./currentUserStore";

export const followerStore = makeAutoObservable({
  async getFollow(id) {
    try {
      this.setLoading();
      this.followers = await linkAPI.getFollow(
        id,
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
  async setPetition(id, comment, link) {
    try {
      this.setLoading();
      const data = await linkAPI.setPetition(
        id,
        comment,
        link,
        localStorage.getItem("userData")
      );

      this.links = this.links.map((link) => {
        if (link.parentLink.id === id) {
          link.isFollow = true;
        }
        return link;
      });

      if (this.links.every((item) => item.isFollow) && this.links.length > 0) {
        this.current_step = 2;
      }

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
  async cleanFollower() {
    try {
      this.followers = [];
    } catch (e) {
      notification.setInfo("error", e.message);
      this.setLoading();
      if (e.message === "Не действительный токен") {
        currentUserStore.logout();
      }
    }
  },

  setLoading(bool) {
    this.loading = bool ? bool : !this.loading;
  },
});
