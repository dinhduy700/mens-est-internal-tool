import React from 'react';
import { 
  Bell, 
  Settings, 
  Menu, 
  Calendar,
  Layers
} from 'lucide-react';
import { FilterState } from '../types';

interface HeaderProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onToggleMobileMenu: () => void;
  activeTopTab: string;
  setActiveTopTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  filterState,
  setFilterState,
  onToggleMobileMenu,
  activeTopTab,
  setActiveTopTab,
}) => {
  const topTabs = [
    { id: 'dashboard', label: 'Dashboard' },
//     { id: 'team', label: 'Team Members' },
//     { id: 'analytics', label: 'Analytics' },
//     { id: 'reports', label: 'Báo Cáo' },
  ];

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Left section: Title & Tabs */}
      <div className="flex items-center gap-6">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="md:hidden w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg tracking-tight leading-none">
              X
            </h1>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Project Alpha • 2026
            </span>
          </div>
        </div>

        {/* Desktop Top Tabs */}
        <nav className="hidden lg:flex items-center gap-1 pl-4 h-16 border-l border-slate-200">
          {topTabs.map((tab) => {
            const isActive = activeTopTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTopTab(tab.id)}
                className={`h-16 px-3.5 text-sm font-medium border-b-2 flex items-center transition-colors cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-700 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right section: Search, Actions, Profile */}
      <div className="flex items-center gap-3">
        {/* Date Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDate}</span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Thông báo hệ thống"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Settings */}
        <button
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Cài đặt hệ thống"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-blue-100 shadow-sm">
            ND
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
              Nguyễn Đinh Duy
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Senior Developer</div>
          </div>
        </div>
      </div>
    </header>
  );
};
