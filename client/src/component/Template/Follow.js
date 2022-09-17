import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "antd";
import { useRootStore } from "../../store";
import { Timer } from "../Timer/Timer";
import { Loader } from "../Loader/Loader";

export const Follow = observer(({ type, name }) => {
  const { linkStore } = useRootStore();

  const onFollower = (id) => {
    linkStore.follow(id);
  };

  // const  onSetPetition =  async (id) => {
  //     let comment = window.prompt("Введите причину", "Ссылка не работает");
  //
  //     if (comment) {
  //         await linkStore.setPetition(id, comment, linkStore.link.link);
  //     }
  // }

  return (
    <>
      <div>
        <span className="title">Ваша ссылка: </span>
        <span>{linkStore.link.link}</span>
      </div>
      <div>
        <span className="title">Осталось: </span>
        <Timer sec={Date.parse(linkStore.link.createdAt) + 1800000} />
      </div>
      <ol>
        {linkStore.links.map((link) => (
          <li>
            <div className="check_link">
              <a
                onClick={() => onFollower(link.parentLink._id)}
                target="_blank"
                href={link.parentLink.link}
              >
                {link.parentLink.link}
              </a>
              {!link.isFollow && (
                <>
                  <Button
                    className="btn_span"
                    href={link.parentLink.link}
                    target="_blank"
                    onClick={() => onFollower(link.parentLink._id)}
                  >
                    Подписаться
                  </Button>
                  {/*<Button*/}
                  {/*  danger*/}
                  {/*  className="btn_span"*/}
                  {/*  onClick={(event) =>*/}
                  {/*    onSetPetition(link.parentLink.id, link.parentLink.link)*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  Пожаловаться*/}
                  {/*</Button>*/}
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
});
