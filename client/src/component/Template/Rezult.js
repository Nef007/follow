import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button, Space, Table, Tag, Tooltip } from "antd";
import { useRootStore } from "../../store";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import StopOutlined from "@ant-design/icons/lib/icons/StopOutlined";

export const Rezult = observer(({ type, name }) => {
  const { linkStore } = useRootStore();

  useEffect(() => {
    linkStore.getFollowers({
      pagination: {
        current: 1,
        pageSize: linkStore.pagination.pageSize,
      },
    });
  }, [linkStore.link]);

  const onReset = async () => {
    await linkStore.reset(linkStore.link.id, type);
  };

  const onSetPetition = async (id) => {
    let comment = window.prompt("Введите причину", "Не подписался");

    if (comment) {
      await linkStore.petition(id, comment);
    }
  };

  const onChangePagination = (newPagination, filters, sorter) => {
    linkStore.getFollowers({
      pagination: newPagination,
    });
  };

  const columnsPetition = [
    {
      title: "Описание",
      dataIndex: "comment",
      //  render: (text) => moment(text).format('HH:mm DD:MM:YYYY')
    },

    {
      title: "Дата",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("DD.MM.YYYY HH:mm"),
    },
  ];

  const columns = [
    {
      title: "Ссылка",
      dataIndex: "link",
      key: "link",
      render: (text) => (
        <a target="_blank" href={text}>
          {text}
        </a>
      ),
    },
    {
      title: "Жалобы",
      dataIndex: "linkIdMy",
      key: "linkIdMy",
      render: (linkIdMy) => linkIdMy.petitions.length,
    },
    {
      title: "Действие",
      render: (record) => (
        <Space size="middle">
          <Tooltip title="Пожаловаться">
            <Button
              shape="circle"
              icon={<StopOutlined />}
              onClick={() => onSetPetition(record.linkIdMy._id)}
              size="large"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {linkStore.link.status === "Блокирован" && (
        <div>
          <Button type="primary" onClick={onReset}>
            Разблокировать
          </Button>
        </div>
      )}
      <div>
        <span className="title">Ваша ссылка: </span> {linkStore.link.link}
      </div>
      <div>
        <span className="title">Статус: </span>
        <Tag
          color={
            linkStore.link.status === "Активный"
              ? "green"
              : linkStore.link.status === "Ожидание"
              ? "orange"
              : "magenta"
          }
        >
          {linkStore.link.status}
        </Tag>
      </div>

      <div>
        <span className="title">Жалобы:</span>
        <Tag color="magenta">{linkStore.link.petitions.length}/3</Tag>
        {linkStore.link.petitions.length > 0 && (
          <Table
            scroll={{ x: 400 }}
            size="small"
            rowKey={(record) => record.id}
            columns={columnsPetition}
            dataSource={linkStore.link.petitions}
          />
        )}
      </div>

      <span>
        <span className="title">Подписалось: </span> {linkStore.link.follow} /
        4000
      </span>

      <Table
        scroll={{ x: 500 }}
        size="small"
        loading={linkStore.loadingFollowers}
        rowKey={(record) => record.id}
        columns={columns}
        pagination={linkStore.pagination}
        onChange={onChangePagination}
        dataSource={linkStore.followers}
      />

      {/*{linkStore.link.follow &&*/}
      {/*  (linkStore.followers.length === 0 ? (*/}
      {/*    <div className="btn_check">*/}
      {/*      <Button*/}
      {/*        onClick={(event) => linkStore.getFollow(linkStore.link._id)}*/}
      {/*      >*/}
      {/*        Показать Подписчиков*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  ) : (*/}
      {/*    <div className="btn_check">*/}
      {/*      <Button onClick={() => linkStore.cleanFollower()}>*/}
      {/*        Скрыть Подписчиков*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*{linkStore.followers.map((follow) => (*/}
      {/*  <div>*/}
      {/*    {follow.link}*/}
      {/*    <Button onClick={() => onSetPetition(follow.id)}>*/}
      {/*      Пожаловаться*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*))}*/}
    </div>
  );
});
