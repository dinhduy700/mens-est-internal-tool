import React from 'react';
import { Clock, RotateCw, CheckCircle2, Flame, AlertTriangle, MousePointerClick } from 'lucide-react';

// 1. Cập nhật Variant khớp với API
export type CardVariant = 'TODO' | 'IN_PROGRESS' | 'NEAR_RELEASE' | 'RELEASE';

interface StatCardProps {
  variant: CardVariant;
  count: number;
  total?: number;
  isActive: boolean;
  onClick: () => void;
}

const themeMap = {
  TODO: {
    // Sử dụng Slate (Xám xanh) - Thể hiện sự tĩnh lặng, chờ đợi, chưa kích hoạt.
    activeStyle: 'border-slate-400 ring-4 ring-slate-100 bg-slate-50/80 shadow-sm',
    inactiveStyle: 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:bg-slate-50/50',
    iconWrapper: 'bg-white border-slate-200 shadow-sm text-slate-600',
    labelStyle: 'bg-slate-100 text-slate-700 border-slate-200/80 font-medium',
    clickIcon: 'text-slate-400 group-hover:text-slate-600',
    label: 'Chưa làm',
    icon: <Clock className="w-4 h-4" />,
    desc: <p className="text-[11px] text-slate-500 mt-1">Sẵn sàng đưa vào tiến độ</p>,
  },

  IN_PROGRESS: {
    // Sử dụng Blue sáng - Thể hiện sự chủ động, hành động, đang vận hành.
    activeStyle: 'border-blue-500 ring-4 ring-blue-50 bg-blue-50/50 shadow-sm',
    inactiveStyle: 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:bg-blue-50/30',
    iconWrapper: 'bg-blue-100 border-blue-200/60 text-blue-600 shadow-sm shadow-blue-100',
    labelStyle: 'bg-blue-50 text-blue-700 border-blue-200/50 font-medium',
    clickIcon: 'text-blue-400 group-hover:text-blue-600',
    label: 'Đang làm',
    icon: <RotateCw className="w-4 h-4 animate-spin-slow" />,
    desc: <p className="text-[11px] text-slate-500 mt-1">Đang tập trung hoàn thiện</p>,
  },

  NEAR_RELEASE: {
    // Sử dụng Amber (Cam vàng) thay vì Orange - Sang trọng hơn, tạo cảm giác cảnh báo (Warning) nhẹ nhàng nhưng sự tập trung cao độ.
    activeStyle: 'border-amber-500 ring-4 ring-amber-50 bg-amber-50/50 shadow-sm',
    inactiveStyle: 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md hover:bg-amber-50/30',
    iconWrapper: 'bg-amber-100 border-amber-200/60 text-amber-600 shadow-sm shadow-amber-100',
    labelStyle: 'bg-amber-50 text-amber-700 border-amber-200/50 font-medium',
    clickIcon: 'text-amber-400 group-hover:text-amber-600',
    label: 'Sắp Release',
    icon: <Flame className="w-4 h-4" />,
    desc: (
        <p className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 shrink-0" /> Đã sát hạn chót
        </p>
    ),
  },

  RELEASE: {
    // Sử dụng Emerald (Xanh ngọc) - Thể hiện sự hoàn tất, thành công, an toàn.
    activeStyle: 'border-emerald-500 ring-4 ring-emerald-50 bg-emerald-50/50 shadow-sm',
    inactiveStyle: 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md hover:bg-emerald-50/30',
    iconWrapper: 'bg-emerald-100 border-emerald-200/60 text-emerald-600 shadow-sm shadow-emerald-100',
    labelStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/50 font-medium',
    clickIcon: 'text-emerald-400 group-hover:text-emerald-600',
    label: 'Đã Release',
    icon: <CheckCircle2 className="w-4 h-4" />,
    desc: <p className="text-[11px] text-slate-500 mt-1">Đã hoàn tất bàn giao</p>, // Bổ sung desc cho đồng bộ layout nếu cần
  },
};

export const StatCard: React.FC<StatCardProps> = ({ variant, count, total, isActive, onClick }) => {
  const theme = themeMap[variant];

  // 2. Cập nhật logic check thanh Progress Bar cho thẻ RELEASE
  const isReleased = variant === 'RELEASE';
  const donePercentage = isReleased && total ? Math.round((count / total) * 100) : 0;

  return (
      <div
          onClick={onClick}
          className={`
            border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer group flex flex-col justify-between 
            select-none active:scale-[0.98] relative overflow-hidden
            ${isActive ? theme.activeStyle : theme.inactiveStyle}
          `}
      >
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center group-hover:scale-105 transition-transform ${theme.iconWrapper}`}>
            {theme.icon}
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${theme.labelStyle}`}>
              {theme.label}
            </span>

            <div
                className={`
                transition-all duration-300 ease-out flex items-center justify-center
                ${isActive
                    ? `opacity-100 translate-x-0 ${theme.clickIcon}`
                    : 'opacity-0 -translate-x-3 text-slate-400 group-hover:opacity-100 group-hover:translate-x-0'
                }
              `}
                title="Nhấn để lọc danh sách"
            >
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-1">
            {count}
            <span className="text-xs font-normal text-slate-500">
            {isReleased ? `/ ${total} tasks` : 'tasks'}
          </span>
          </div>

          {isReleased ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 flex-1 bg-slate-200/60 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${donePercentage}%` }} />
                </div>
                <span className="text-[10px] font-bold text-emerald-700">{donePercentage}%</span>
              </div>
          ) : (
              theme.desc
          )}
        </div>
      </div>
  );
};