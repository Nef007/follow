import React from "react";
import s from "./logo.module.css";

export const Logo = ({ img, title }) => {
  return (
    <div className={s.logo}>
      <div className={s.logo__title}>{title}</div>
      <img className={s.logo__img} src={img} alt="logo" />
    </div>
  );
};
