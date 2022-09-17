import React, { useState } from "react";
import { Button, Form, Select } from "antd";

import { observer } from "mobx-react-lite";
import MinusCircleOutlined from "@ant-design/icons/lib/icons/MinusCircleOutlined";

export const MySelect = ({ data, item, onRemoveItem, onChangeItem }) => {
  const { category: categoryItem, subcategory: subcategoryItem, id } = item;

  const onChangeCategory = (value) => {
    onChangeItem({ id, category: value, subcategory: data[value][0] });
  };

  const onChangeSubCategory = (value) => {
    onChangeItem({ id, subcategory: value });
  };

  return (
    <div>
      <Select
        style={{
          width: 120,
        }}
        defaultValue={categoryItem}
        onChange={onChangeCategory}
      >
        {Object.keys(data).map((province) => (
          <Select.Option key={province}>{province}</Select.Option>
        ))}
      </Select>

      <Select
        style={{
          width: 120,
        }}
        placeholder="Выберите значение"
        value={subcategoryItem}
        onChange={onChangeSubCategory}
      >
        {categoryItem &&
          data[categoryItem].map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
      </Select>

      <MinusCircleOutlined onClick={() => onRemoveItem(id)} />
    </div>
  );
};

export const Test = observer(() => {
  const data = {
    Овощи: ["Картошка", "Марковка", "Лук"],
    Фрукты: ["Ананас", "Яблоко", "Апельсин"],
    Неведанное: [],
  };

  const [arr, setArr] = useState([]);

  const onAddItem = () => {
    setArr([
      ...arr,
      {
        id: arr.length + 1,
        category: Object.keys(data)[0],
        subcategory: data[Object.keys(data)[0]],
      },
    ]);
  };

  const onRemoveItem = (id) => {
    setArr(arr.filter((item) => item.id !== id));
  };
  const onChangeItem = (formItem) => {
    setArr(
      arr.map((item) => {
        if (item.id === formItem.id) {
          item = { ...item, ...formItem };
        }
        return item;
      })
    );
  };
  const onSaveForm = (value) => {
    console.log({ ...value, arr });
  };
  return (
    <>
      <div className="title">Тест</div>
      <div className="contentOut">
        <Form onFinish={onSaveForm}>
          <Form.Item initialValue={"Утро"} label="Время" name="time">
            <Select
              style={{
                width: 120,
              }}
            >
              <Select.Option key="Утро" value="Утро">
                Утро
              </Select.Option>{" "}
              <Select.Option key="Обед" value="Обед">
                Обед
              </Select.Option>{" "}
              <Select.Option key="Вечер" value="Вечер">
                Вечер
              </Select.Option>{" "}
            </Select>
          </Form.Item>
          <Form.Item>
            <div>
              <Button onClick={onAddItem} type="primary">
                Добавить
              </Button>

              {arr.map((item) => (
                <MySelect
                  data={data}
                  key={item.id}
                  item={item}
                  onRemoveItem={onRemoveItem}
                  onChangeItem={onChangeItem}
                />
              ))}
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
});
