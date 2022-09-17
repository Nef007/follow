import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Steps } from "antd";
import { useRootStore } from "../../store";

import { useParams } from "react-router-dom";
import { AddLink } from "../../component/Template/AddLink";
import { Follow } from "../../component/Template/Follow";
import { Activate } from "../../component/Template/Activate";
import { Rezult } from "../../component/Template/Rezult";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../component/Loader/Loader";

const { Step } = Steps;

export const LinkInfo = observer(({ type, name }) => {
  const { linkStore } = useRootStore();

  const linkId = useParams().id;
  let navigate = useNavigate();

  useEffect(() => {
    linkStore.get(linkId, () => navigate(-1));
  }, []);

  const steps = [
    {
      title: "Подписаться",
    },
    {
      title: "Активация",
    },
    {
      title: "Результат",
    },
  ];

  if (!linkStore.link) {
    return <Loader />;
  }

  return (
    <>
      <div className="title">Информация</div>
      <div className="contentOut">
        <Steps current={linkStore.step}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
          {linkStore.links.length !== 0 &&
          !linkStore.links.every((item) => item.isFollow) ? (
            <Follow />
          ) : linkStore.link.status === "Ожидание" ? (
            <Activate />
          ) : (
            <Rezult />
          )}
        </div>
      </div>
    </>
  );
});
