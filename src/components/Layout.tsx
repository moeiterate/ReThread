import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="texture"></div>
      <Sidebar />
      <main className="flex-1 ml-64 p-12 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
