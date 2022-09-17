import { makeAutoObservable } from "mobx";
import { payAPI } from "../api/api";
import { notification } from "./notificationStore";
import { currentUserStore } from "./currentUserStore";

export const pay = makeAutoObservable({
  bills: [],
  loading: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },

  async pay(values) {
    try {
      window.location.href = await payAPI.pay(
        values,
        localStorage.getItem("userData")
      );
    } catch (e) {
      notification.setInfo("error", e.message);
    }
  },

  async cancelBill(id) {
    try {
      const data = await payAPI.cancelBill(
        id,
        localStorage.getItem("userData")
      );
      await this.getBill();
      notification.setInfo("success", data.message);
    } catch (e) {
      notification.setInfo("error", e.message);
    }
  },
  async getBill(
    params = {
      pagination: {
        current: 1,
        pageSize: 10,
      },
    }
  ) {
    try {
      this.setLoading();
      const data = await payAPI.getBill(
        params,
        localStorage.getItem("userData")
      );
      await currentUserStore.me();
      this.bills = data.docs;
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
