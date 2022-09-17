import { makeAutoObservable } from "mobx";
import { payAPI, referalAPI } from "../api/api";
import { notification } from "./notificationStore";
import { currentUserStore } from "./currentUserStore";

export const referalStore = makeAutoObservable({
  referals: [],
  loading: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },

  async get(
    params = {
      pagination: {
        current: 1,
        pageSize: 10,
      },
    }
  ) {
    try {
      this.setLoading();
      const data = await referalAPI.get(
        params,
        localStorage.getItem("userData")
      );
      this.referals = data.docs;
      this.pagination = {
        ...params.pagination,
        total: data.total,
      };

      this.setLoading();
    } catch (e) {
      this.setLoading();
      notification.setInfo("error", e.message);
    }
  },

  setLoading(bool) {
    this.loading = bool ? bool : !this.loading;
  },
});
