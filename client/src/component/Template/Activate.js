import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Tag } from "antd";
import { useRootStore } from "../../store";
import { Timer } from "../Timer/Timer";
import { Loader } from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

export const Activate = observer(({ type, name }) => {
  const { linkStore } = useRootStore();

  let navigate = useNavigate();

  const onActivated = async () => {
    await linkStore.activated(() => navigate(-1));
  };

  return (
    <>
      <div>
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
          <span className="title">Осталось: </span>{" "}
          <Timer sec={Date.parse(linkStore.link.createdAt) + 1800000} />
        </div>
      </div>
      <Button onClick={onActivated}>
        Активировать Стоимость: 100 руб , 5 приглашенных
      </Button>
    </>
  );
});
