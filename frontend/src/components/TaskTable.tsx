import React, { useState } from 'react';
import { 
  Edit, 
  Plus, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Trash2, 
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  User,
  Copy,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  Task, 
  SubTask, 
  TaskStatus, 
  DateFieldType, 
  DateEditModalState, 
  TaskEditModalState, 
  SubtaskModalState,
  BlockerModalState,
  NoteModalState
} from '../types';
import { formatDateDisplay, getStatusBadgeConfig } from '../utils/date';

interface TaskTableProps {
  tasks: Task[];
  onOpenTaskModal: (task: Task, targetFocus?: 'redmine' | 'all') => void;
  onOpenSubtaskModal: (parentTaskId: string, parentTaskCode: string, subtask?: SubTask) => void;
  onOpenDateModal: (taskId: string, taskCode: string, fieldName: DateFieldType, fieldLabel: string, currentValue: string) => void;
  onOpenBlockerModal: (task: Task) => void;
  onOpenNoteModal: (task: Task) => void;
  onUpdateSubtaskStatus: (taskId: string, subtaskId: string, newStatus: TaskStatus) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDuplicateTask: (task: Task) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onOpenTaskModal,
  onOpenSubtaskModal,
  onOpenDateModal,
  onOpenBlockerModal,
  onOpenNoteModal,
  onUpdateSubtaskStatus,
  onDeleteSubtask,
  onDeleteTask,
  onDuplicateTask,
}) => {
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  const dateColumns: { key: DateFieldType; label: string; shortLabel: string }[] = [
    { key: 'planDevUp', label: 'Planned DevUp', shortLabel: 'Plan DevUp' },
    { key: 'actDevUp', label: 'Actual DevUp', shortLabel: 'Act. DevUp' },
    { key: 'createdAt', label: 'Create At', shortLabel: 'Create At' },
    { key: 'actStart', label: 'Actual Start', shortLabel: 'Act. Start' },
    { key: 'actEnd', label: 'Actual End', shortLabel: 'Act. End' },
    { key: 'releaseDate', label: 'Release Date', shortLabel: 'Release' },
  ];

  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-b-xl p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">Không tìm thấy task phù hợp</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Thử thay đổi từ khóa tìm kiếm hoặc bỏ các bộ lọc để xem danh sách đầy đủ.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-x-auto select-text relative">
      <table className="w-full text-left border-separate border-spacing-0 min-w-[1350px]">
        {/* Table Header */}
        <thead>
          <tr className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            {/* Sticky Col 1: # */}
            <th className="sticky left-0 z-20 bg-slate-100 py-3 px-3 w-12 min-w-[48px] max-w-[48px] text-center border-b border-r border-slate-200">
              #
            </th>

            {/* Sticky Col 2: Task (Redmine) */}
            <th className="sticky left-[48px] z-20 bg-slate-100 py-3 px-4 w-60 min-w-[240px] max-w-[240px] border-b border-r border-slate-200">
              Task (Redmine)
            </th>

            {/* Sticky Col 3: Sub-task */}
            <th className="sticky left-[288px] z-20 bg-slate-100 py-3 px-4 w-72 min-w-[270px] border-b border-r border-slate-200">
              Sub-task
            </th>

            {/* Sticky Col 4: Status (Edge of Sticky group) */}
            <th className="sticky left-[558px] z-20 bg-slate-100 py-3 px-3 w-32 min-w-[130px] border-b border-r-2 border-slate-300 text-center shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)]">
              Status
            </th>

            {/* Scrollable Columns */}
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

        {/* Table Body */}
        <tbody className="text-xs text-slate-800 align-top">
          {tasks.map((task, index) => {
            const isDone = task.status === 'DONE';
            const subtaskCount = task.subtasks ? task.subtasks.length : 0;
            const rowBgClass = isDone 
              ? 'bg-slate-50 group-hover:bg-blue-50/50' 
              : 'bg-white group-hover:bg-blue-50/50';

            return (
              <tr
                key={task.id}
                className="group transition-colors"
              >
                {/* 2.1 Cột #: Số thứ tự (Sticky) */}
                <td className={`sticky left-0 z-10 py-3.5 px-3 text-center font-medium text-slate-500 border-b border-r border-slate-200 pt-4 w-12 min-w-[48px] max-w-[48px] transition-colors ${rowBgClass}`}>
                  {index + 1}
                </td>

                {/* 2.2 Task: Redmine link, Task Name, Edit Button (Sticky) */}
                <td className={`sticky left-[48px] z-10 py-3.5 px-4 border-b border-r border-slate-200 pt-4 w-60 min-w-[240px] max-w-[240px] transition-colors ${rowBgClass}`}>
                  <div className="flex flex-col gap-1">
                    {/* Task ID / Code & Edit Button */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {task.redmineUrl ? (
                        <a
                          href={task.redmineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Mở trong Redmine"
                          className="font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 font-mono text-xs"
                        >
                          <span>{task.taskCode}</span>
                          <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                        </a>
                      ) : (
                        <span className="font-bold text-slate-900 font-mono text-xs">
                          {task.taskCode}
                        </span>
                      )}

                      {/* Edit Button for Task (Name & Redmine URL) */}
                      <button
                        id={`btn-edit-task-${task.id}`}
                        onClick={() => onOpenTaskModal(task, 'redmine')}
                        title="Chỉnh sửa tên Task và Redmine URL"
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {task.priority && task.priority !== 'Medium' && (
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                            task.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : task.priority === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {task.priority}
                        </span>
                      )}
                    </div>

                    {/* Task Title */}
                    <p
                      className={`text-xs text-slate-700 leading-snug line-clamp-3 ${
                        isDone ? 'line-through text-slate-400' : ''
                      }`}
                      title={task.title}
                    >
                      {task.title}
                    </p>

                    {task.assignee && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[140px]">{task.assignee}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* 2.3 & 2.4 Cột Sub-task & Status (Sticky, ends sticky group) */}
                <td 
                  className={`sticky left-[288px] z-10 p-0 border-b border-r-2 border-slate-300 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)] min-w-[400px] w-[400px] transition-colors ${rowBgClass}`} 
                  colSpan={2}
                >
                  <div className="flex flex-col h-full">
                    {/* Subtask list */}
                    {task.subtasks && task.subtasks.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {task.subtasks.map((sub) => {
                          const subConfig = getStatusBadgeConfig(sub.status);
                          return (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between p-2.5 hover:bg-slate-50/90 transition-colors gap-2"
                            >
                              {/* Subtask Title with Bullet */}
                              <div className="flex items-start gap-2 flex-1 min-w-0 pr-2">
                                <span
                                  className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${subConfig.dotColor}`}
                                ></span>
                                <div className="min-w-0 flex-1">
                                  <span
                                    className={`text-xs font-medium text-slate-800 block break-words ${
                                      sub.status === 'DONE'
                                        ? 'line-through text-slate-400'
                                        : ''
                                    }`}
                                  >
                                    {sub.title}
                                  </span>
                                  {sub.notes && (
                                    <span className="text-[10px] text-slate-400 block truncate">
                                      {sub.notes}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Subtask Status Selector & Actions */}
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <select
                                  value={sub.status}
                                  onChange={(e) =>
                                    onUpdateSubtaskStatus(
                                      task.id,
                                      sub.id,
                                      e.target.value as TaskStatus
                                    )
                                  }
                                  className={`text-[11px] font-semibold rounded px-2 py-0.5 border cursor-pointer focus:outline-none transition-colors ${subConfig.badgeClass}`}
                                >
                                  <option value="TODO">To Do</option>
                                  <option value="DOING">Doing</option>
                                  <option value="DONE">Done</option>
                                  <option value="BLOCKED">Blocked</option>
                                </select>

                                {/* Delete Subtask */}
                                <button
                                  onClick={() => onDeleteSubtask(task.id, sub.id)}
                                  title="Xóa subtask"
                                  className="p-0.5 text-slate-300 hover:text-rose-600 rounded transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
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

                    {/* 2.3 "+ Add Sub-task" Button */}
                    <div className="p-2 border-t border-slate-100 bg-slate-50/50 mt-auto">
                      <button
                        id={`btn-add-subtask-${task.id}`}
                        onClick={() => onOpenSubtaskModal(task.id, task.taskCode)}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add Sub-task</span>
                      </button>
                    </div>
                  </div>
                </td>

                {/* 2.5 - 2.10 Date Columns with Edit Button */}
                {dateColumns.map((col) => {
                  const rawVal = (task as any)[col.key] || '';
                  const formatted = formatDateDisplay(rawVal);
                  return (
                    <td
                      key={col.key}
                      className={`py-3.5 px-3 text-right border-b border-r border-slate-200 pt-4 transition-colors ${rowBgClass}`}
                    >
                      <div className="flex items-center justify-end gap-1.5 group/cell">
                        <span
                          className={`font-mono text-xs ${
                            formatted === '-'
                              ? 'text-slate-300'
                              : 'text-slate-700 font-medium'
                          }`}
                        >
                          {formatted}
                        </span>
                        <button
                          id={`btn-edit-date-${col.key}-${task.id}`}
                          onClick={() =>
                            onOpenDateModal(
                              task.id,
                              task.taskCode,
                              col.key,
                              col.label,
                              rawVal
                            )
                          }
                          title={`Chỉnh sửa ${col.label}`}
                          className="p-0.5 text-slate-300 group-hover/cell:text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  );
                })}

                {/* 2.11 Blocker Column */}
                <td className={`py-3.5 px-3 text-center border-b border-r border-slate-200 pt-4 transition-colors ${rowBgClass}`}>
                  <div className="flex items-center justify-center gap-1 group/blocker relative">
                    {task.hasBlocker ? (
                      <button
                        onClick={() => onOpenBlockerModal(task)}
                        title={task.blockerDescription || 'Đang có blocker'}
                        className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      >
                        <AlertTriangle className="w-4 h-4 fill-rose-100" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenBlockerModal(task)}
                        title="Không có blocker - Click để thêm blocker"
                        className="inline-flex items-center gap-1 text-slate-300 hover:text-slate-600 p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </button>
                    )}

                    {/* Blocker Tooltip if active */}
                    {task.hasBlocker && task.blockerDescription && (
                      <div className="hidden group-hover/blocker:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-30 pointer-events-none text-left">
                        <div className="font-bold text-rose-300 mb-0.5">Blocker:</div>
                        <p className="leading-snug">{task.blockerDescription}</p>
                      </div>
                    )}
                  </div>
                </td>

                {/* 2.12 Note Column */}
                <td className={`py-3.5 px-4 border-b border-r border-slate-200 pt-4 transition-colors ${rowBgClass}`}>
                  <div className="flex items-start justify-between gap-1 group/note">
                    <p
                      onClick={() => onOpenNoteModal(task)}
                      className="text-xs text-slate-600 italic line-clamp-3 hover:text-slate-900 cursor-pointer flex-1"
                      title={task.note || 'Click để thêm ghi chú'}
                    >
                      {task.note || <span className="text-slate-300">-</span>}
                    </p>
                    <button
                      onClick={() => onOpenNoteModal(task)}
                      title="Chỉnh sửa ghi chú"
                      className="p-1 text-slate-300 group-hover/note:text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* Actions Menu */}
                <td className={`py-3.5 px-2 text-center pt-4 border-b border-slate-200 transition-colors ${rowBgClass}`}>
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() =>
                        setActiveMenuTaskId(
                          activeMenuTaskId === task.id ? null : task.id
                        )
                      }
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeMenuTaskId === task.id && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setActiveMenuTaskId(null)}
                        ></div>
                        <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-30 flex flex-col text-xs text-slate-700 font-medium">
                          <button
                            onClick={() => {
                              setActiveMenuTaskId(null);
                              onOpenTaskModal(task, 'all');
                            }}
                            className="px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-600" />
                            <span>Chỉnh sửa toàn bộ</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuTaskId(null);
                              onDuplicateTask(task);
                            }}
                            className="px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Nhân bản Task</span>
                          </button>

                          <div className="h-px bg-slate-100 my-1"></div>

                          <button
                            onClick={() => {
                              setActiveMenuTaskId(null);
                              onDeleteTask(task.id);
                            }}
                            className="px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                          >
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
  );
};
