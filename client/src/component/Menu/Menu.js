import React from "react";
import { NavLink } from "react-router-dom";
import s from "./menu.module.css";

export const Menu = ({ menu_items }) => {
  return (
    <>
      <ul className={s.menu}>
        {menu_items.map((menu_item, index) => (
          <li key={index}>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? `${s.menu__item} ${s.menu__item_active}`
                  : `${s.menu__item}`
              }
              to={menu_item.href}
            >
              <span className={s.menu__icon}>{menu_item.icon}</span>
              <span>{menu_item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  );
};
