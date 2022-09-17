import { Button, DatePicker, Form, Input, Modal, Radio, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React, { useEffect, useState } from "react";
import { useRootStore } from "../../store";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { useToggle } from "react-use";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

function getBase64Prev(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const RegisterForm = () => {
  const { currentUserStore } = useRootStore();
  const [cookies, setCookie] = useCookies();

  let uid = useParams().uid;

  useEffect(() => {
    if (uid) {
      setCookie("referrer", uid, { path: "/" });
    }
  }, []);

  const [activeModalViewImg, setActiveModalViewImg] = useToggle(false);
  const [imgUrl, setImgUrl] = useState("");

  const [imgList, setImgList] = useState([]);

  const [form] = Form.useForm();

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const onChangeUpload = ({ fileList: newFileList }) => {
    form.setFieldsValue({
      avatar: newFileList[0],
    });
    setImgList(newFileList);
  };

  const onPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64Prev(file.originFileObj);
    }
    setActiveModalViewImg();
    setImgUrl(file.url || file.preview);
  };

  const onRegister = (form) => {
    currentUserStore.register({
      ...form,
      // avatar: form.avatar.originFileObj,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={(value) => onRegister(value)}>
      <Form.Item
        label="Имя"
        name="name"
        rules={[{ required: true, message: "Введите имя" }]}
      >
        <Input type="text" name="name" placeholder="Имя" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Введите Email" },
          { type: "email", message: "Введите правильный Email" },
        ]}
        hasFeedback
      >
        <Input type="text" name="email" placeholder="Email" />
      </Form.Item>
      <Form.Item
        label="Пароль"
        name="password"
        rules={[
          { required: true, message: "Введите пароль" },
          { min: 8, max: 20, message: "Длина от 8 до 20 символов" },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/,
            message: "Содержит строчные, заглавные символы, и цифры",
          },
        ]}
        hasFeedback
      >
        <Input.Password type="text" name="patronymic" placeholder="Пароль" />
      </Form.Item>
      <Form.Item
        label="Пол:"
        name="sex"
        rules={[{ required: true, message: "Выберите пол" }]}
      >
        <Radio.Group
          options={[
            {
              label: "Мужской",
              value: "Мужской",
            },
            {
              label: "Женский",
              value: "Женский",
            },
          ]}
          onChange={({ target: { value } }) => value}
          optionType="button"
          buttonStyle="solid"
        />
      </Form.Item>
      <Form.Item
        label="Дата рождения"
        name="birthday"
        rules={[{ required: true, message: "Введите дату рождения" }]}
      >
        <DatePicker format={"DD.MM.YYYY"} />
      </Form.Item>
      {/*<Form.Item*/}
      {/*  name="avatar"*/}
      {/*  label="Изображение:"*/}
      {/*  rules={[{ required: true, message: "Загрузите изображение" }]}*/}
      {/*>*/}
      {/*  <ImgCrop modalTitle="Редактировать фото" rotate>*/}
      {/*    <Upload*/}
      {/*      accept="image/*"*/}
      {/*      customRequest={dummyRequest}*/}
      {/*      fileList={imgList}*/}
      {/*      listType="picture-card"*/}
      {/*      onChange={onChangeUpload}*/}
      {/*      onPreview={onPreview}*/}
      {/*    >*/}
      {/*      {imgList.length < 1 && (*/}
      {/*        <div>*/}
      {/*          <PlusOutlined />*/}
      {/*          <div style={{ marginTop: 5 }}>Загрузить</div>*/}
      {/*        </div>*/}
      {/*      )}*/}
      {/*    </Upload>*/}
      {/*  </ImgCrop>*/}
      {/*</Form.Item>*/}
      <Modal
        visible={activeModalViewImg}
        title={"Просмотр"}
        footer={null}
        onCancel={() => setActiveModalViewImg()}
      >
        <img alt="example" style={{ width: "100%" }} src={imgUrl} />
      </Modal>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Регистрация
        </Button>
      </Form.Item>
    </Form>
  );
};
