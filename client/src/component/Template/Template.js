import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Modal, Space, Steps, Table, Tag, Tooltip } from "antd";
import { useRootStore } from "../../store";
import { AddLink } from "./AddLink";

import { Link } from "react-router-dom";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import StopOutlined from "@ant-design/icons/lib/icons/StopOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { useToggle } from "react-use";

const { Step } = Steps;

export const Template = observer(({ type, name }) => {
  const { linkStore } = useRootStore();

  const [activeAddedModal, setActiveAddedModal] = useToggle(false);

  useEffect(() => {
    linkStore.getAll(type);
  }, []);

  const columns = [
    {
      title: "Ссылка",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          color={
            text === "Активный"
              ? "green"
              : text === "Ожидание"
              ? "orange"
              : "magenta"
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Подписалось",
      dataIndex: "follow",
      key: "follow",
    },
    {
      title: "Жалобы",
      dataIndex: "petitions",
      key: "petitions",
      render: (petitions) => petitions.length,
    },
    {
      title: "Действие",
      render: (record) => (
        <Space size="middle">
          <Link to={`/link/${record._id}`}>
            <Tooltip title="Просмотр">
              <Button
                shape="circle"
                icon={<EyeOutlined />}
                // onClick={() => onEdit(record.id)}
                size="large"
              />
            </Tooltip>
          </Link>
          <Tooltip title="Блокировать">
            <Button
              onClick={() => linkStore.block(record._id)}
              shape="circle"
              icon={<StopOutlined />}
              size="large"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <>
      <div className="title">{name}</div>
      <div className="contentOut">
        <Table
          scroll={{ x: 500 }}
          size="small"
          loading={linkStore.loading}
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={linkStore.myLinks}
          title={() => (
            <Space>
              <Button
                className="btn"
                onClick={() => setActiveAddedModal()}
                type="primary"
              >
                <PlusOutlined /> Добавить
              </Button>
            </Space>
          )}
        />

        <Modal
          title="Добавить запись"
          visible={activeAddedModal}
          onCancel={() => setActiveAddedModal()}
          footer={null}
        >
          <AddLink type={type} />
          <div className={"redText"}>
            Рекомендуем набрать не менее 5 Приглашенных, так как после ввода
            ссылки вам будет дано 30 минут на Активацию!!{" "}
          </div>
        </Modal>
      </div>
    </>
  );
  // <Template type="vk" name="Вконтакте" />;
});
