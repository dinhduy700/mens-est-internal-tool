import React from 'react';
import { 
  Clock, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Check
} from 'lucide-react';
import { Task, FilterState } from '../types';
import { computeTaskStats } from '../utils/date';

interface OverviewCardsProps {
  tasks: Task[];
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  tasks,
  filterState,
  setFilterState,
}) => {
  const stats = computeTaskStats(tasks);

  const handleCardClick = (statusFilter: 'TODO' | 'DOING' | 'DONE' | 'ALL') => {
    setFilterState((prev) => ({
      ...prev,
      status: prev.status === statusFilter ? 'ALL' : statusFilter,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* 1. Chưa làm (To Do) Card */}
      <div
        id="card-todo-tasks"
        onClick={() => handleCardClick('TODO')}
        className={`bg-white border rounded-xl p-5 shadow-sm transition-all duration-200 cursor-pointer relative overflow-hidden group hover:shadow-md ${
          filterState.status === 'TODO'
            ? 'border-slate-800 ring-2 ring-slate-800/10'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
              Chưa làm
            </span>
            {filterState.status === 'TODO' && (
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.todoCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">tasks</span>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            {stats.blockedCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                {stats.blockedCount} task có blocker
              </span>
            ) : (
              <span className="text-slate-400">Không có blocker</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Đang làm (In Progress) Card */}
      <div
        id="card-doing-tasks"
        onClick={() => handleCardClick('DOING')}
        className={`bg-white border rounded-xl p-5 shadow-sm transition-all duration-200 cursor-pointer relative overflow-hidden group hover:shadow-md ${
          filterState.status === 'DOING'
            ? 'border-blue-600 ring-2 ring-blue-600/10'
            : 'border-slate-200 hover:border-blue-300'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
            <RotateCw className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
              Đang làm
            </span>
            {filterState.status === 'DOING' && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.doingCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">tasks active</span>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            {stats.nearDeadlineCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-orange-600 font-medium">
                <Flame className="w-3.5 h-3.5" />
                {stats.nearDeadlineCount} task sắp đến hạn release
              </span>
            ) : (
              <span className="text-slate-400">Tiến độ ổn định</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Hoàn thành (Done) Card */}
      <div
        id="card-done-tasks"
        onClick={() => handleCardClick('DONE')}
        className={`bg-white border rounded-xl p-5 shadow-sm transition-all duration-200 cursor-pointer relative overflow-hidden group hover:shadow-md ${
          filterState.status === 'DONE'
            ? 'border-emerald-600 ring-2 ring-emerald-600/10'
            : 'border-slate-200 hover:border-emerald-300'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Hoàn thành
            </span>
            {filterState.status === 'DONE' && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.doneCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">tasks closed</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Sprint hiện tại</span>
            <span className="font-semibold text-emerald-700">
              {stats.total > 0 ? Math.round((stats.doneCount / stats.total) * 100) : 0}% hoàn thành
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
