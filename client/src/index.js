import { createRoot } from "react-dom/client";
import { Main } from "./page/Main/Main";
import React from "react";
import { rootStore, RootStoreProvider } from "./store";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import ru_RU from "antd/lib/locale-provider/ru_RU";
import "antd/dist/antd.min.css";
import "./index.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <RootStoreProvider store={rootStore}>
    <BrowserRouter>
      <ConfigProvider locale={ru_RU}>
        <Main />
      </ConfigProvider>
    </BrowserRouter>
  </RootStoreProvider>
);
