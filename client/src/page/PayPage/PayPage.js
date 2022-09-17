import React, { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../store";
import moment from "moment";
import { useToggle } from "react-use";

import RedoOutlined from "@ant-design/icons/lib/icons/RedoOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import ExportOutlined from "@ant-design/icons/lib/icons/ExportOutlined";
import StopOutlined from "@ant-design/icons/lib/icons/StopOutlined";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 5 },
    sm: { span: 24 },
  },
};

export const PayPage = observer((props) => {
  const { pay } = useRootStore();
  const [form] = Form.useForm();
  useEffect(() => {
    pay.getBill();
  }, []);

  const [activeServerAddedModal, setActiveServerAddedModal] = useToggle(false);

  const onSaveForm = async (values) => {
    await pay.pay(values);
  };
  const onTableChange = async (pagination, filters) => {
    await pay.getBill({
      pagination,
      filters,
    });
  };

  const columns = [
    {
      title: "Действие",
      render: (record) =>
        record.status === "WAITING" && (
          <>
            <Space size="middle">
              <Tooltip title="Оплатить">
                {/*<NavLink to={`/request/${record.id}`}>*/}
                <Button
                  shape="circle"
                  key="link"
                  href={record.payUrl}
                  icon={<ExportOutlined />}
                  target="_blank"
                  //  onClick={() => onGetLog(record.id)}
                  size="large"
                />
                {/*</NavLink>*/}
              </Tooltip>
              <Tooltip title="Отменить">
                {/*<NavLink to={`/request/${record.id}`}>*/}
                <Button
                  shape="circle"
                  icon={<StopOutlined />}
                  onClick={() => pay.cancelBill(record.qiwiId)}
                  size="large"
                />
                {/*</NavLink>*/}
              </Tooltip>
            </Space>
          </>
        ),
    },

    {
      title: "Сумма",
      dataIndex: "value",
      //  render: (text) => moment(text).format('HH:mm DD:MM:YYYY')
    },
    {
      title: "Статус",
      dataIndex: "status",
      render: (text) => (
        <Space size="middle">
          <Tag
            color={
              text === "PAID"
                ? "green"
                : text === "WAITING"
                ? "blue"
                : "volcano"
            }
          >
            {text}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Срок действия",
      dataIndex: "expirationDateTime",
      render: (text) => moment(text).format("HH:mm DD.MM.YYYY"),
    },
  ];

  return (
    <>
      <div className="title">Оплата</div>
      <div className="contentOut">
        <Table
          scroll={{ x: 900 }}
          size="small"
          rowKey={(record) => record.id}
          loading={pay.loading}
          columns={columns}
          dataSource={pay.bills}
          pagination={pay.pagination}
          onChange={onTableChange}
          title={() => (
            <div className="table_header">
              {/*<span>Всего: {servers.paginationServer.total}</span>*/}
              <Space>
                <Button
                  className="btn"
                  onClick={() => pay.getBill()}
                  type="primary"
                >
                  <RedoOutlined /> Обновить
                </Button>
                <Button
                  className="btn"
                  onClick={() => setActiveServerAddedModal()}
                  type="primary"
                >
                  <PlusOutlined /> Создать счет
                </Button>
              </Space>
            </div>
          )}
        />

        <Modal
          title="Создать счет"
          visible={activeServerAddedModal}
          //  footer={null}
          okText="Создать"
          onCancel={setActiveServerAddedModal}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                onSaveForm(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          <Form {...formItemLayout} form={form}>
            <Form.Item
              label="Сумма"
              name="amount"
              initialValue={200}
              rules={[{ required: true, message: "" }]}
            >
              <InputNumber placeholder="Сумма" />
            </Form.Item>
            <Form.Item label="Комментарий" name="comment">
              <Input.TextArea placeholder="Комментарий (Необязательно)" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
});
