import React from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import s from "./auth.module.css";
import { FaTelegram } from "react-icons/fa";

export const Auth = (props) => {
  return (
    <div className={s.bg}>
      <div className={s.bg__img}>
        <div className={s.auth}>
          <div className={s.title}>Пирамида подписок</div>
          <div className={s.text}>
            Подписавшись на 6 ссылок вы получаете примерно 4500 подписчиков в
            ответ!
          </div>
          <div className={s.auth__card}>
            <div className={s.auth__head}>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${s.auth__headerItem} ${s.auth__headerItem_active}`
                    : `${s.auth__headerItem}`
                }
                to="/auth"
              >
                Вход
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${s.auth__headerItem} ${s.auth__headerItem_active}`
                    : `${s.auth__headerItem}`
                }
                to="/register"
              >
                Регистрация
              </NavLink>
            </div>
            <div className={s.auth__form}>
              <Routes>
                <Route path="/auth" element={<LoginForm />} />
                <Route path="/register" end element={<RegisterForm />} />
                <Route path="/register/:uid" end element={<RegisterForm />} />
                <Route
                  path="/*"
                  end
                  element={<Navigate replace to="/auth" />}
                />
              </Routes>
            </div>
          </div>

          <div className={s.title}>Как это работает?</div>
          <div className={s.text}>
            Этот инструмент работает по принципу финансовых пирамид. Вы
            активируете ссылку , затем подписываетесь всего на 6 ссылок и ждете.
            По мере того как будут регистрироваться новые участники вы получаете
            подписчиков. Мы активно рекламируем этот инструмент с целью
            привлечения новых участников, но так же и вам предоставляем такую
            возможность. Поэтому для активации вам необходимо привлечь 5
            участников в проект.
            <div>
              <a target="_blank" href={"https://t.me/pyramid_follow"}>
                <FaTelegram className={s.icon} size="40px" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
