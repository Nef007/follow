import * as React from "react";
import { useEffect, useState } from "react";

export const Timer = ({ sec }) => {
  useEffect(() => {
    timer(sec);
  }, [timer]);

  const [time, setTime] = useState("");

  function timer(endTime) {
    let now = new Date().getTime();
    let diff = endTime - now;
    if (diff > 0) {
      // let day = Math.floor(diff / (60 * 60) / 1000 / 24) ;
      // let hour = Math.floor(diff / (60 * 60) / 1000);
      let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTime(
        `${minutes}:${String(seconds).length < 2 ? "0" + seconds : seconds}`
      );
    } else {
      setTime("Ссылка удалена!!!");
    }
  }

  setInterval(() => timer(sec), 1000);

  return <span>{time}</span>;
};
