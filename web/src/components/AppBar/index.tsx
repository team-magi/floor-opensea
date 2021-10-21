import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import useWindowDimensions from '../../utils/layout';
import { MenuOutlined } from '@ant-design/icons';

const DefaultActions = ({ vertical = false }: { vertical?: boolean }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
      }}
    >
      <Link to={`/floor`}>
        <Button className="app-btn">Floor</Button>
      </Link>
    </div>
  );
};

const MetaplexMenu = () => {
  const { width } = useWindowDimensions();
  if (width < 768)
    return (
      <>
        <Dropdown
          arrow
          placement="bottomLeft"
          trigger={['click']}
          overlay={
            <Menu>
              <Menu.Item>
                <Link to={`/floor`}>
                  <Button className="app-btn">Floor</Button>
                </Link>
              </Menu.Item>
            </Menu>
          }
        >
          <MenuOutlined style={{ fontSize: '1.4rem' }} />
        </Dropdown>
      </>
    );

  return <DefaultActions />;
};

export const AppBar = () => {
  return (
    <>
      <div className="app-left app-bar-box">
        <div className="divider" />
        <MetaplexMenu />
      </div>
    </>
  );
};
