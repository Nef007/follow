import React, { createContext, useContext } from "react";
import { currentUserStore } from "./currentUserStore";
import { notification } from "./notificationStore";
import { usersStore } from "./usersStore";
import { linkStore } from "./linkStore";
import { pay } from "./payStore";
import { referalStore } from "./referalStore";

export const rootStore = {
  currentUserStore,
  usersStore,
  notification,
  linkStore,
  pay,
  referalStore,
};

export const RootStoreContext = createContext({ rootStore });

export const useRootStore = () => useContext(RootStoreContext);

export const RootStoreProvider = ({ store, children }) => {
  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  );
};
