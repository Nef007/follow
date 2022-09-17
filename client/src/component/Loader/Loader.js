import { Space, Spin } from "antd";
import React from "react";
import s from "./loader.module.css";

export const Loader = () => {
  return (
    <div className={s.loader}>
      <Space size="middle">
        <Spin size="large" />
      </Space>
    </div>
  );
};
