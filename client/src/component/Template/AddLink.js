import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Input } from "antd";
import "./template.css";
import { useRootStore } from "../../store";

export const AddLink = observer(({ type, name }) => {
  const { linkStore } = useRootStore();
  const [linkInputText, setLinkInputText] = useState("");

  const onChangeInputLink = (e) => {
    setLinkInputText(e.target.value);
  };

  const onCreateLink = async () => {
    await linkStore.create(linkInputText, type);
  };

  return (
    <>
      <div>
        <span className="title">Ваша ссылка:</span>
      </div>
      <div>
        <Input onChange={onChangeInputLink} value={linkInputText} type="text" />
      </div>

      <div className="btn">
        <Button type="primary" onClick={onCreateLink}>
          Добавить
        </Button>
      </div>
    </>
  );
});
