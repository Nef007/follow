import React, { useEffect, useState } from "react";

import { Button, Input, Table } from "antd";

import { observer } from "mobx-react-lite";
import { useRootStore } from "../../store";
import moment from "moment";
import RedoOutlined from "@ant-design/icons/lib/icons/RedoOutlined";

export const ReferalPage = observer((props) => {
  const { currentUserStore, referalStore } = useRootStore();

  useEffect(() => {
    referalStore.get();
  }, []);

  const host = window.location.origin;

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      //  render: (text) => moment(text).format('HH:mm DD:MM:YYYY')
    },

    {
      title: "Зарегистрирован",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("HH:mm DD.MM.YYYY"),
    },
  ];

  return (
    <>
      <div className="title">Рефералы</div>
      <div className="contentOut">
        <div className="content_seti">
          <div>
            <span>Ваша реферальная ссылка</span>
            <Input value={`${host}/register/${currentUserStore.user.uid}`} />
          </div>

          <Table
            scroll={{ x: 900 }}
            size="small"
            rowKey={(record) => record.id}
            loading={referalStore.loading}
            columns={columns}
            dataSource={referalStore.referals}
            title={() => (
              <div className="table_header">
                <div>
                  <Button
                    className="btn"
                    onClick={() => referalStore.get()}
                    type="primary"
                  >
                    <RedoOutlined /> Обновить
                  </Button>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
});
