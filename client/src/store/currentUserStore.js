import { makeAutoObservable } from "mobx";
import { authAPI, userAPI } from "../api/api";
import { notification } from "./notificationStore";

export const currentUserStore = makeAutoObservable({
  user: {},
  isAuth: false,
  initialized: false,
  loading: false,
  loadingPhoto: false,
  logout() {
    this.isAuth = false;
    localStorage.removeItem("userData");
  },
  async login(value) {
    try {
      const data = await authAPI.login(value);
      localStorage.setItem("userData", data.token);
      this.user = data.user;
      this.isAuth = true;
    } catch (e) {
      notification.setInfo("error", e.message);
    }
  },

  async me() {
    try {
      const data = await authAPI.auth(localStorage.getItem("userData"));
      localStorage.setItem("userData", data.token);
      this.user = data.user;
      this.isAuth = true;
    } catch (e) {
      //notification.setInfo("error", e.message);
      this.logout();
    }
  },

  async changePhoto(formData) {
    try {
      this.setLoadingPhoto();
      const data = await userAPI.changePhoto(
        formData,
        localStorage.getItem("userData")
      );
      this.user.avatar = data.path;
      this.setLoadingPhoto();
      notification.setInfo("success", data.message);
    } catch (e) {
      this.setLoadingPhoto();
      notification.setInfo("error", e.message);
      if (e.message === "Не действительный токкен") {
        this.logout();
      }
    }
  },
  async change(form) {
    try {
      this.setLoading();
      const data = await userAPI.change(form, localStorage.getItem("userData"));
      this.user = data.user;
      this.setLoading();
      notification.setInfo("success", data.message);
    } catch (e) {
      this.setLoading();
      notification.setInfo("error", e.message);
      if (e.message === "Не действительный токкен") {
        this.logout();
      }
    }
  },

  async initializedApp() {
    await this.me();
    this.initialized = true;
  },

  async register(form) {
    try {
      const formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }
      const data = await authAPI.register(formData);
      notification.setInfo("success", data.data.message);
    } catch (e) {
      console.log(e);
      notification.setInfo("error", e.response.data.message);
    }
  },

  setLoading() {
    this.loading = !this.loading;
  },
  setLoadingPhoto() {
    this.loadingPhoto = !this.loadingPhoto;
  },
});
