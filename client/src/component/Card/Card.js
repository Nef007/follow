import React from "react";
import "./card.css";
import moment from "moment";
import "moment/locale/ru";
import avatarImg from "../../asset/img/avatar.png";

export const Card = ({ name, birthday, avatar }) => {
  return (
    <div className="card">
      <div className="card__avatar">
        <div className="card__sharp">
          <img
            className="card__img"
            src={
              avatar
                ? `${window.location.origin.replace("9000", "5000")}/${avatar}`
                : avatarImg
            }
            alt="avatar"
          />
        </div>
      </div>
      <div className="card__description">
        <div className="name">{name}</div>
        <div>{moment(birthday).fromNow().replace("назад", "")}</div>
      </div>
    </div>
  );
};
