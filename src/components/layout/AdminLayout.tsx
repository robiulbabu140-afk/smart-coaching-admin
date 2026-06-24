import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F0A1E' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 220, padding: 28, minHeight: '100vh', background: '#0F0A1E' }}>
        <Outlet />
      </main>
    </div>
  );
}
