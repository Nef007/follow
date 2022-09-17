import React, { useEffect, useRef, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Skeleton, Upload } from "antd";
import "./profile.css";
import moment from "moment";
import { useToggle } from "react-use";
import { MyImgCorp } from "../../component/ImgCorp/ImgCorp";
import { useRootStore } from "../../store";
import { observer } from "mobx-react-lite";
import { Loader } from "../../component/Loader/Loader";

import avatar from "../../asset/img/avatar.png";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 11 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};

const tailLayout = {
  wrapperCol: { span: 24 },
};

export const Profile = observer(() => {
  const { currentUserStore } = useRootStore();

  const [form] = Form.useForm();
  const { user } = currentUserStore;
  const [activeModalChangeAvatar, setActiveModalChangeAvatar] =
    useToggle(false);
  const [image, setImage] = useState(null);

  const inputRef = useRef();
  const onTriggerFileSelect = () => inputRef.current.click();

  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImgUrl(reader.result);
      }
    };

    reader.readAsDataURL(e);
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
          setActiveModalChangeAvatar();
        }
      };
    }
  };

  const onChangeData = async (value) => {
    await currentUserStore.change(value);
    form.resetFields();
  };

  return (
    <>
      <div className="title">Профиль</div>
      <div className="content">
        <div className="container">
          <div className="section avatar-container">
            <div className="title profile__title">Аватар</div>
            <div className="avatar">
              {currentUserStore.loadingPhoto ? (
                <Loader />
              ) : user.avatar ? (
                <img
                  className="avatar__img"
                  alt="Загрузка..."
                  src={`${window.location.origin.replace("9000", "5000")}/${
                    user.avatar
                  }`}
                  // src={avatar}
                />
              ) : (
                <img
                  className="avatar__img"
                  alt="Загрузка..."
                  src={avatar}
                  // src={avatar}
                />
              )}
            </div>
            {/*  <div className="btn-position">*/}
            {/*    <input*/}
            {/*      type="file"*/}
            {/*      accept="image/*"*/}
            {/*      ref={inputRef}*/}
            {/*      style={{ display: "none" }}*/}
            {/*      onChange={(e) => onSelectFile(e)}*/}
            {/*    />*/}
            {/*    <Button onClick={onTriggerFileSelect} type="primary">*/}
            {/*      Изменить*/}
            {/*    </Button>*/}
            {/*  </div>*/}
            {/*  <MyImgCorp*/}
            {/*    isActive={activeModalChangeAvatar}*/}
            {/*    onChangeActive={() => setActiveModalChangeAvatar()}*/}
            {/*    image={image}*/}
            {/*    onUpload={(avatar) => currentUserStore.changePhoto(avatar)}*/}
            {/*  />*/}
          </div>
          <div className="section">
            <div className="title profile__title">Данные</div>
            {!currentUserStore.loading ? (
              <Form {...formItemLayout} form={form} onFinish={onChangeData}>
                <Form.Item initialValue={user.name} label="Имя" name="name">
                  <Input type="text" placeholder="Имя" />
                </Form.Item>
                <Form.Item initialValue={user.email} name="email" label="Email">
                  <Input disabled type="text" placeholder="Email" />
                </Form.Item>
                <Form.Item
                  initialValue={moment(user.birthday)}
                  name="birthday"
                  label="Дата рождения"
                >
                  <DatePicker disabled format={"DD.MM.YYYY"} />
                </Form.Item>
                <Form.Item initialValue={user.sex} name="sex" label="Пол">
                  <Input disabled type="text" placeholder="Пол" />
                </Form.Item>
                <Form.Item
                  label="Пароль"
                  name="password"
                  rules={[{ required: true, message: "" }]}
                >
                  <Input.Password placeholder="Пароль" />
                </Form.Item>
                <Form.Item name="new_password" label="Новый пароль">
                  <Input.Password placeholder="Новый пароль" />
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.new_password !== currentValues.new_password
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue("new_password") ? (
                      <Form.Item
                        name="confirm_password"
                        label="Повтор пароля"
                        dependencies={["new_password"]}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("new_password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Пароли не совпадают!")
                              );
                            },
                          }),
                          {
                            required: true,
                            message: "Повторите новый пароль",
                          },
                        ]}
                      >
                        <Input.Password placeholder="Повтор пароля" />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <div className="btn-position">
                    <Button
                      // disabled={
                      //   !form.getFieldValue("name") ||
                      //   !form.getFieldValue("new_password")
                      // }
                      htmlType="submit"
                      type="primary"
                    >
                      Сохранить
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            ) : (
              <Skeleton active paragraph={{ rows: 11 }} />
            )}
          </div>
        </div>
      </div>
    </>
  );
});
