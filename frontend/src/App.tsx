import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { TaskManagement } from '@/pages/task/TaskManagement';

export default function App() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">
      <Sidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-[1500px] w-full mx-auto">

          <Routes>
            <Route path="/" element={<TaskManagement />} />
            {/*<Route path="/team-member" element={<MemberManagement />} />*/}

            {/* Có thể thêm trang 404 nếu người dùng gõ sai link */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>

        </main>
      </div>

      <ToastContainer
          position="top-right"
          autoClose={3000} // Tự động đóng sau 3 giây
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </div>
  );
}
