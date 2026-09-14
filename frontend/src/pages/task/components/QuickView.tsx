import React, { useEffect } from 'react';
import { Clock, RotateCw, CheckCircle2, Flame, X, ArrowRight, ListTodo } from 'lucide-react';

export type StatusFilter = 'TODO' | 'IN_PROGRESS' | 'NEAR_RELEASE' | 'RELEASE' | 'ALL';

export interface QuickViewTask {
  id: number;
  title: string;
  plannedDevUp?: string;
  status: StatusFilter;
}

interface QuickViewProps {
  activeStatus: Exclude<StatusFilter, 'ALL'>;
  tasks: QuickViewTask[];
  onClose: () => void;
  onViewAll: () => void;
}

const quickViewConfig = {
  TODO: {
    title: 'Chưa làm',
    desc: 'Các task đang chờ thực hiện',
    icon: <Clock className="w-4 h-4" />,
    style: 'bg-slate-100 text-slate-700 border-slate-200',
    tagStyle: 'bg-slate-100 text-slate-700',
  },
  IN_PROGRESS: {
    title: 'Đang làm',
    desc: 'Các task đang được thực hiện',
    icon: <RotateCw className="w-4 h-4" />,
    style: 'bg-blue-50 text-blue-600 border-blue-200',
    tagStyle: 'bg-blue-50 text-blue-700',
  },
  NEAR_RELEASE: {
    title: 'Sắp Release',
    desc: 'Các task sắp đến thời điểm Release',
    icon: <Flame className="w-4 h-4" />,
    style: 'bg-orange-50 text-orange-600 border-orange-200',
    tagStyle: 'bg-orange-50 text-orange-700',
  },
  RELEASE: {
    title: 'Đã Release',
    desc: 'Các task đã hoàn tất Release',
    icon: <CheckCircle2 className="w-4 h-4" />,
    style: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    tagStyle: 'bg-emerald-50 text-emerald-700',
  },
};

export const QuickView: React.FC<QuickViewProps> = ({ activeStatus, tasks, onClose, onViewAll }) => {
  const config = quickViewConfig[activeStatus];

  // Khóa scroll của body khi mở Modal
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!config) return null;

  return (
      // BACKDROP NỀN ĐEN MỜ
      <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] animate-fade-in p-4"
          onClick={onClose} // Đóng khi click ra ngoài
      >
        {/* NỘI DUNG MODAL */}
        <div
            className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg flex flex-col animate-modal-in"
            onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan ra backdrop
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${config.style}`}>
                {config.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">{config.title}</h3>
                <p className="text-xs text-slate-500">{config.desc}</p>
              </div>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TASK LIST (Có Scroll) */}
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
            {(tasks || []).map((task) => (
                <div key={task.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="w-12 shrink-0">
                    <span className="text-[11px] font-semibold text-slate-500">#{task.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                    {task.plannedDevUp && (
                        <p className="text-[10.5px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          DevUp: {task.plannedDevUp}
                        </p>
                    )}
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.tagStyle}`}>
                {config.title}
              </span>
                </div>
            ))}

            {(!tasks || tasks.length === 0) && (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Không có task nào</p>
                  <p className="text-xs text-slate-400 mt-1">Danh sách trống tại thời điểm này.</p>
                </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50">
            <button
                type="button"
                onClick={onViewAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-colors shadow-sm"
            >
              <ListTodo className="w-4 h-4 text-blue-500" />
              Tổng số: <span className="text-red-500 font-bold">{tasks?.length || 0}</span> công việc
            </button>
          </div>
        </div>
      </div>
  );
};