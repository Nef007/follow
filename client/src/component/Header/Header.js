import React from "react";
import { Button, Dropdown, Menu, Space } from "antd";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import ExportOutlined from "@ant-design/icons/lib/icons/ExportOutlined";
import { useRootStore } from "../../store";
import s from "./header.module.css";
import { BiRuble } from "react-icons/bi";
import { BsPeopleFill } from "react-icons/bs";

export const Header = ({ user }) => {
  const { currentUserStore, referalStore } = useRootStore();
  return (
    <div className={s.toolsControl}>
      <div className={s.toolsElement}>
        <div>
          <BiRuble /> Баланс: {currentUserStore.user.balance}{" "}
        </div>
        <div>
          {" "}
          <BsPeopleFill /> Приглашено: {currentUserStore.user.countRef}
        </div>
      </div>
      <Dropdown
        ttrigger={["click"]}
        overlay={
          <Menu>
            <Menu.Item
              onClick={() => currentUserStore.logout()}
              key="2"
              icon={<ExportOutlined />}
            >
              Выйти
            </Menu.Item>
          </Menu>
        }
        placement="bottomRight"
      >
        <Button>
          {currentUserStore.user.email}
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};
