import React, { useEffect } from "react";
import { Route, Routes, Navigate, useParams, Link } from "react-router-dom";
import { message } from "antd";
import s from "./main.module.css";
import { Icon24LogoVk } from "@vkontakte/icons";

import { observer } from "mobx-react-lite";
import { useRootStore } from "../../store";
import { Loader } from "../../component/Loader/Loader";
import { Header } from "../../component/Header/Header";
import { Profile } from "../Profile/Profile";
import { Users } from "../Users/Users";
import { Auth } from "../Auth/Auth";
import { Menu } from "../../component/Menu/Menu";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import TeamOutlined from "@ant-design/icons/lib/icons/TeamOutlined";
import { Logo } from "../../component/Logo/Logo";
import logo from "../../asset/img/logo.png";
import { VkPage } from "../Page/VkPage";
import { LinkInfo } from "../Link/LinkInfo";
import { FaYoutube } from "react-icons/fa";
import { YouTubePage } from "../Page/YouTubePage";
import { PayPage } from "../PayPage/PayPage";
import { BiRuble } from "react-icons/bi";
import { ReferalPage } from "../ReferalPage/ReferalPage";

import { TelegramPage } from "../Page/TelegramPage";
import { FaTelegram } from "react-icons/fa";

export const Main = observer((props) => {
  const { currentUserStore, notification } = useRootStore();
  const { initialized, isAuth } = currentUserStore;
  const { info } = notification;

  useEffect(() => {
    currentUserStore.initializedApp();
  }, []);

  // const [cookies, setCookie] = useCookies();
  //
  // useEffect(() => {
  //   setCookie("referrer1", "5555", { sameSite: "none" });
  // }, []);

  useEffect(() => {
    if (info.message) {
      if (info.status === "success") message.success(info.message);
      if (info.status === "error") message.error(info.message);
      if (info.status === "info") message.info(info.message);
    }
  }, [info]);

  if (!initialized) {
    return <Loader />;
  }

  return isAuth ? (
    <div className={s.wrapper}>
      <header>
        <Header />
      </header>
      <aside>
        <Logo title="Пирамида подписок" img={logo} />
        <Menu
          menu_items={[
            {
              title: "Профиль",
              icon: <UserOutlined />,
              href: "/account",
            },
            {
              title: "Пользователи",
              icon: <TeamOutlined />,
              href: "/people",
            },
            {
              title: "Вконтакте",
              icon: <Icon24LogoVk />,
              href: "/vk",
            },
            {
              title: "YouTube",
              icon: <FaYoutube size="24px" />,
              href: "/youtube",
            },
            {
              title: "Telegram",
              icon: <FaTelegram size="24px" />,
              href: "/telegram",
            },
            {
              title: "Оплата",
              icon: <BiRuble />,
              href: "/pay",
            },
            {
              title: "Партнерка",
              icon: <TeamOutlined />,
              href: "/referal",
            },
          ]}
        />
      </aside>
      <article>
        <Routes>
          <Route path="/account" element={<Profile />} />
          <Route path="/referal" element={<ReferalPage />} />
          <Route path="/vk" element={<VkPage />} />
          <Route path="/pay" element={<PayPage />} />
          <Route path="/youtube" element={<YouTubePage />} />
          <Route path="/telegram" element={<TelegramPage />} />
          <Route path="/link/:id" element={<LinkInfo />} />
          <Route path="/people/:page" element={<Users />} />
          <Route path="/people" element={<Navigate replace to="/people/1" />} />

          <Route path="/*" element={<Navigate replace to="/account" />} />
        </Routes>
      </article>
      <footer>
        2022{" "}
        <a target="_blank" href={"https://t.me/pyramid_follow"}>
          <FaTelegram size="20px" />
        </a>
      </footer>
    </div>
  ) : (
    <Auth />
  );
});
