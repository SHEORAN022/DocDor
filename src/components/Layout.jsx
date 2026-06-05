import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const layoutStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Sora', sans-serif;
    background: #f4f6fa;
  }

  .layout-root {
    display: flex;
    min-height: 100vh;
    background: #f4f6fa;
  }

  .layout-sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .layout-main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
  }
`;

const Layout = () => {
  return (
    <>
      <style>{layoutStyles}</style>
      <div className="layout-root">
        <div className="layout-sidebar">
          <Sidebar />
        </div>
        <div className="layout-main">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;