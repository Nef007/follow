import React from "react";
import { Button, Form, Input } from "antd";

import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import { useRootStore } from "../../store";

export const LoginForm = (props) => {
  const { currentUserStore } = useRootStore();

  return (
    <Form name="login" onFinish={(value) => currentUserStore.login(value)}>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Пожалуйста введите логин!",
          },
        ]}
      >
        <Input prefix={<UserOutlined />} type="text" placeholder="Логин" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Пожалуйста введите пароль!",
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Пароль"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
};
