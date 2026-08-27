import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Flag, 
  Archive, 
  HelpCircle, 
  Plus, 
  FolderKanban,
  Sparkles
} from 'lucide-react';
import { FilterState } from '../types';

interface SidebarProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenCreateModal: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  filterState,
  setFilterState,
  onOpenCreateModal,
  onResetData,
}) => {
  const navItems = [
    {
      id: 'overview' as const,
      label: 'Tổng quan',
      sublabel: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'myTasks' as const,
      label: 'Task của tôi',
      sublabel: 'My Tasks',
      icon: CheckSquare,
    },
    {
      id: 'teamBacklog' as const,
      label: 'Team Backlog',
      sublabel: 'All items',
      icon: Users,
    },
    {
      id: 'milestones' as const,
      label: 'Milestones',
      sublabel: 'Release roadmap',
      icon: Flag,
    },
    {
      id: 'archive' as const,
      label: 'Lưu trữ',
      sublabel: 'Archive',
      icon: Archive,
    },
  ];

  return (
    <aside className="hidden md:flex bg-slate-900 text-slate-200 w-64 border-r border-slate-800 flex-col h-screen p-4 flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-3 border-b border-slate-800">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/30">
          <FolderKanban className="w-5 h-5 text-white" />
        </div>
        <div className="overflow-hidden">
          <h1 className="font-bold text-white text-base tracking-tight truncate flex items-center gap-1.5">
            TaskHub Pro
          </h1>
          <p className="text-xs text-slate-400 font-medium">Enterprise Tracking</p>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        id="btn-create-task-sidebar"
        onClick={onOpenCreateModal}
        className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white h-10 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 w-full mb-5 shadow-sm shadow-blue-900/50 transition-all duration-150 cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Tạo Task Mới</span>
      </button>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1 flex-grow">
        <div className="px-2 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Menu Điều Hướng
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = filterState.currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => {
                setFilterState((prev) => ({
                  ...prev,
                  currentTab: item.id,
                  status: item.id === 'archive' ? 'DONE' : 'ALL',
                }));
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <div className="flex-1">
                <div className="leading-none">{item.label}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Info & Reset */}
      <div className="pt-3 border-t border-slate-800 flex flex-col gap-1.5">
        <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-blue-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Redmine Integrated</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Click vào Task hoặc icon để cập nhật Redmine URL & Datepickers.
          </p>
        </div>

        <button
          onClick={onResetData}
          title="Khôi phục dữ liệu mẫu ban đầu"
          className="text-xs text-slate-400 hover:text-slate-200 py-1.5 px-2 rounded hover:bg-slate-800 flex items-center justify-between text-left transition-colors"
        >
          <span>Khôi phục mẫu</span>
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        <div className="text-[11px] text-slate-400 px-2 py-1 text-center">
          Team Task Tracker v2.5
        </div>
      </div>
    </aside>
  );
};
