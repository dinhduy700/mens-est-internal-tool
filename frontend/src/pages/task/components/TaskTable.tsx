import React, { useState, useMemo, useEffect } from 'react';
// @ts-ignore
import { toast } from 'react-toastify';

import {
  Edit,
  Plus,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  MoreHorizontal,
  User,
  Copy,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import {
  TaskStatus,
} from '@/types.ts';
import { formatDateDisplay, formatDateToDMY } from '@/utils/date.ts';
import { confirmDeleteSwal } from '@/utils/sweetAlert.ts';

import { taskService } from '@/services/taskService.ts';
import { getPriorityInfo } from '@/constants/priority.ts';
import { TASK_STATUS_OPTIONS, getStatusBadgeConfig } from '@/constants/taskStatus.ts';

export const TaskTable: React.FC = ({ tasks, onEditTask, onOpenSubtaskModal, onDeleteSuccess, onUpdateSubtaskStatus, onOpenDateModal, onOpenNoteModal}) => {
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});

  // 3. Modal States
  const handleDeleteTask = async (taskId: string) => {
    // 1. Gọi SweetAlert2 thông qua helper đã thiết kế sẵn
    const result = await confirmDeleteSwal({
      title: 'Cảnh Báo Nguy Hiểm',
      itemCode: taskId,
    });

    // 2. Nếu bấm Hủy Bỏ -> Dừng lại
    if (!result.isConfirmed) return;

    // 3. Thực thi API xóa
    try {
      await taskService.deleteTask(taskId);
      toast.success('Đã xóa vĩnh viễn task!');
      onDeleteSuccess();
    } catch (error) {
      toast.error('Có lỗi xảy ra, không thể xóa!');
    }
  };


  const handleDeleteSubtask = async (taskId: string, subtaskId: string) => {
    // 1. Gọi SweetAlert2 thông qua helper đã thiết kế sẵn
    const result = await confirmDeleteSwal({
      title: 'Cảnh Báo Nguy Hiểm',
      itemCode: subtaskId,
    });

    // 2. Nếu bấm Hủy Bỏ -> Dừng lại
    if (!result.isConfirmed) return;

    // 3. Thực thi API xóa
    try {
      await taskService.deleteSubtask(taskId, subtaskId);
      toast.success('Đã xóa vĩnh viễn subtask!');
      onDeleteSuccess();
    } catch (error) {
      toast.error('Có lỗi xảy ra, không thể xóa!');
    }
  };

  const dateColumns: { key: string; label: string; }[] = [
    { key: 'planned_dev_up', label: 'Planned DevUp' },
    { key: 'actual_dev_up', label: 'Actual DevUp' },
    { key: 'created_at', label: 'Created At' },
    { key: 'actual_start', label: 'Actual Start' },
    { key: 'actual_end', label: 'Actual End' },
    { key: 'release_date', label: 'Release Date' },
  ];

  return (
    <div className="w-full">
      {/* Main Table Content */}
      {(tasks.length == 0) ? (
        <div className="bg-white border border-slate-200 rounded-b-xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">Không tìm thấy task phù hợp</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc bỏ các bộ lọc để xem danh sách đầy đủ.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-x-auto select-text relative">
            <table className="w-full text-left border-separate border-spacing-0 min-w-[1350px]">
              {/* Table Header */}
              <thead>
                <tr className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="sticky left-0 z-20 bg-slate-100 py-3 px-3 w-12 min-w-[48px] max-w-[48px] text-center border-b border-r border-slate-200">
                    #
                  </th>
                  <th className="sticky left-[48px] z-20 bg-slate-100 py-3 px-4 w-60 min-w-[240px] max-w-[240px] border-b border-r border-slate-200">
                    Task
                  </th>
                  <th className="sticky left-[288px] z-20 bg-slate-100 py-3 px-4 w-72 min-w-[270px] border-b border-r border-slate-200">
                    Sub-task
                  </th>
                  <th className="sticky left-[558px] z-20 bg-slate-100 py-3 px-3 w-32 min-w-[150px] border-b border-r-2 border-slate-300 text-center shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)]">
                    Status
                  </th>
                  <th className="py-3 px-3 w-28 min-w-[110px] text-right border-b border-r border-slate-200 bg-slate-100">Plan DevUp</th>
                  <th className="py-3 px-3 w-28 min-w-[110px] text-right border-b border-r border-slate-200 bg-slate-100">Act. DevUp</th>
                  <th className="py-3 px-3 w-28 min-w-[110px] text-right border-b border-r border-slate-200 bg-slate-100">Create At</th>
                  <th className="py-3 px-3 w-28 min-w-[110px] text-right border-b border-r border-slate-200 bg-slate-100">Act. Start</th>
                  <th className="py-3 px-3 w-28 min-w-[110px] text-right border-b border-r border-slate-200 bg-slate-100">Act. End</th>
                  <th className="py-3 px-3 w-28 min-w-[110px] text-right border-b border-r border-slate-200 bg-slate-100">Release</th>
                  <th className="py-3 px-3 w-24 min-w-[90px] text-center border-b border-r border-slate-200 bg-slate-100">Blocker</th>
                  <th className="py-3 px-4 w-48 min-w-[180px] border-b border-r border-slate-200 bg-slate-100">Note</th>
                  <th className="py-3 px-2 w-12 min-w-[48px] text-center border-b border-slate-200 bg-slate-100"></th>
                </tr>
              </thead>

              <tbody className="text-xs text-slate-800 align-top">
                {tasks.data.map((task, index) => {
                  const rowBgClass = 'bg-white group-hover:bg-blue-50/50';

                  const globalIndex =  index + 1;
                  const statusBadgeConfig = getStatusBadgeConfig(task.status);
                  return (
                    <tr key={task.id} className="group transition-colors">
                      {/* STT */}
                      <td className={`sticky left-0 z-10 py-3.5 px-3 text-center font-medium text-slate-500 border-b border-r border-slate-200 pt-4 w-12 min-w-[48px] max-w-[48px] transition-colors ${rowBgClass}`}>
                        {globalIndex}
                      </td>

                      {/* Task Info */}
                      <td className={`sticky left-[48px] z-10 py-3.5 px-4 border-b border-r border-slate-200 pt-4 w-60 min-w-[240px] max-w-[240px] transition-colors ${rowBgClass}`}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${statusBadgeConfig.dotColor}`}></span>
                            {task.redmine_url ? (
                              <a
                                href={task.redmine_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 font-mono text-xs"
                              >
                                <span>{task.title}</span>
                                <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                              </a>
                            ) : (
                              <>
                                <span className="font-bold text-slate-900 font-mono text-xs">
                                  {task.title}
                                </span>
                              </>
                            )}

                            <button
                              onClick={() => onEditTask(task)}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                           {getPriorityInfo(task.priority) && (
                             <span
                               className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityInfo(task.priority)?.color}`}
                             >
                               {getPriorityInfo(task.priority)?.label}
                             </span>
                           )}
                          </div>

                          <p className={`text-xs text-slate-700 leading-snug line-clamp-3`}>
                            { task.note }
                          </p>

                          {task.assignee && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[140px]">{task.assignee}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Subtask & Status */}
                      <td className={`sticky left-[288px] z-10 p-0 border-b border-r-2 border-slate-300 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)] min-w-[400px] w-[400px] transition-colors ${rowBgClass}`} colSpan={2}>
                        <div className="flex flex-col h-full">
                          {task.subtasks && task.subtasks.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                              {task.subtasks.map((sub) => {
                                const subConfig = getStatusBadgeConfig(sub.status);
                                return (
                                  <div key={sub.id} className="flex items-center justify-between p-2.5 hover:bg-slate-50/90 transition-colors gap-2">
                                    <div className="flex items-start gap-2 flex-1 min-w-0 pr-2">
                                      <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${subConfig.dotColor}`}></span>
                                      <div className="min-w-0 flex-1">
                                        <span className={`text-xs font-medium text-slate-800 block break-words ${sub.status === 'DONE' ? 'line-through text-slate-400' : ''}`}>
                                          {sub.title}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <select
                                        value={Number(sub.status ?? '')}
                                        onChange={(e) =>
                                          onUpdateSubtaskStatus(
                                            task.id,
                                            sub.id,
                                            Number(e.target.value) as TaskStatus
                                          )
                                        }
                                        className={`text-[11px] font-semibold rounded px-2 py-0.5 border cursor-pointer focus:outline-none transition-colors ${subConfig.badgeClass}`}
                                      >
                                        {TASK_STATUS_OPTIONS.map((item) => (
                                          <option key={item.value} value={item.value}>
                                            {item.label}
                                          </option>
                                        ))}
                                      </select>

                                      <button
                                        onClick={() => onOpenSubtaskModal(task.id, task.title, sub)}
                                        className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSubtask(task.id, sub.id)}
                                        className="text-slate-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="py-2.5 px-3 text-[11px] text-slate-400 italic">
                              Chưa có sub-task
                            </div>
                          )}

                          <div className="p-2 border-t border-slate-100 bg-slate-50/50 mt-auto">
                            <button
                              onClick={() => onOpenSubtaskModal(task.id, task.title)}
                              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Tạo Sub-task</span>
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Date Columns */}
                      {dateColumns.map((col) => {
                        const rawVal = (task as any)[col.key] || '';
                        const formatted = formatDateDisplay(rawVal);
                        return (
                          <td key={col.key} className={`py-3.5 px-3 text-right border-b border-r border-slate-200 pt-4 transition-colors ${rowBgClass}`}>
                            <div className="flex items-center justify-end gap-1.5 group/cell">
                              <span className={`font-mono text-xs ${formatted === '-' ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>
                                {formatted}
                              </span>
                              <button
                                onClick={() => {
                                  onOpenDateModal(true, task.id, task.title, col.key, col.label, rawVal);
                                }}
                                className="p-0.5 text-slate-300 group-hover/cell:text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        );
                      })}

                      {/* Blocker */}
                      <td className={`py-3.5 px-3 text-center border-b border-r border-slate-200 pt-4 transition-colors ${rowBgClass}`}>
                        <button
                          className="inline-flex items-center gap-1 p-1 rounded cursor-pointer"
                        >
                          {task.blocker ? (
                            <AlertTriangle className="w-4 h-4 text-rose-600 fill-rose-100" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </button>
                      </td>

                      {/* Note */}
                      <td className={`py-3.5 px-4 border-b border-r border-slate-200 pt-4 transition-colors ${rowBgClass}`}>
                        <div className="flex items-start justify-between gap-1 group/note">
                          <p onClick={() => onOpenNoteModal(task)} className="text-xs text-slate-600 italic line-clamp-3 hover:text-slate-900 cursor-pointer flex-1">
                            {task.note || <span className="text-slate-300">-</span>}
                          </p>
                          <button onClick={() => onOpenNoteModal(task)} className="p-1 text-slate-300 group-hover/note:text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-pointer">
                            <Edit className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Action Menu */}
                      <td className={`py-3.5 px-2 text-center pt-4 border-b border-slate-200 transition-colors ${rowBgClass}`}>
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {activeMenuTaskId === task.id && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setActiveMenuTaskId(null)}></div>
                              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-30 flex flex-col text-xs text-slate-700 font-medium">
                                <button onClick={() => { setActiveMenuTaskId(null); handleOpenTaskModal(task, 'all'); }} className="px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2 cursor-pointer">
                                  <Edit className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Chỉnh sửa toàn bộ</span>
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button onClick={() => { setActiveMenuTaskId(null); handleDeleteTask(task.id); }} className="px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Xóa Task</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};