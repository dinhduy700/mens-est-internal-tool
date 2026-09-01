import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
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
  Task,
  SubTask,
  TaskStatus,
  DateFieldType,
  TaskEditModalState,
  SubtaskModalState,
  DateEditModalState,
  BlockerModalState,
  NoteModalState
} from '../types';
import { formatDateDisplay } from '../../utils/date';
import { confirmDeleteSwal } from '../../utils/sweetAlert';

import { taskService } from '../../services/taskService';
import { getPriorityInfo } from '../../constants/priority.ts';
import { formatDateToDMY } from '../../utils/date';
import { TASK_STATUS_OPTIONS, getStatusBadgeConfig, TaskStatus as TaskStatusEnum } from '../../constants/taskStatus';
// Import các Modal Components của bạn ở đây:
import { TaskModal } from './TaskModal';
import { SubtaskModal } from './/SubtaskModal';
import { DateEditModal } from './DateEditModal';
import { Toolbar } from './Toolbar';

// import { BlockerModal } from '../modal/BlockerModal';
// import { NoteModal } from '../modal/NoteModal';


export const TaskTable: React.FC = () => {
  // 1. Task State & Filter States
//   const [tasks, setTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState({
      data: [],
      links: {},
      meta: {},
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});

  // 2. Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // 2. Hàm gọi API lấy danh sách Task
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await taskService.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Tự động gọi API khi Component vừa mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // 3. Modal States
  const [taskModalState, setTaskModalState] = useState<TaskEditModalState>({
    isOpen: false,
    mode: 'add',
  });
  const [subtaskModalState, setSubtaskModalState] = useState<SubtaskModalState>({
    isOpen: false,
    taskId: '',
    taskTitle: '',
  });
  const [dateModalState, setDateModalState] = useState<DateEditModalState>({
    isOpen: false,
    taskId: '',
    taskTitle: '',
    fieldName: 'planned_dev_up',
    fieldLabel: '',
    currentValue: '',
  });
//   const [blockerModalState, setBlockerModalState] = useState<BlockerModalState>({
//     isOpen: false,
//     taskId: '',
//     taskCode: '',
//     hasBlocker: false,
//     blockerDescription: '',
//   });
//   const [noteModalState, setNoteModalState] = useState<NoteModalState>({
//     isOpen: false,
//     taskId: '',
//     taskCode: '',
//     note: '',
//   });

  // 4. Filtered Tasks Logic
  const filteredTasks = useMemo(() => {
      return '123';
//     return tasks.filter((task) => {
//       const matchesSearch =
//         task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         task.taskCode.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus =
//         statusFilter === 'ALL' || task.status === statusFilter;
//       return matchesSearch && matchesStatus;
//     });
  }, [tasks, searchTerm, statusFilter]);

  // 5. Paginated Tasks Logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
//   const paginatedTasks = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredTasks.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredTasks, currentPage, itemsPerPage]);
//
//   // 6. Action Handlers
  const handleOpenTaskModal = (task?: Task, targetFocus?: 'redmine' | 'all') => {
    const isEdit = Boolean(task && task.id);
    setTaskModalState({
      isOpen: true,
      mode: isEdit ? 'edit' : 'add',
      task,
      targetFocus,
    });
  };

  const handleOpenSubtaskModal = (parentTaskId: string, parentTaskTitle: string, subtask?: SubTask) => {
    setSubtaskModalState({
      isOpen: true,
      parentTaskId,
      parentTaskTitle,
      subtask,
      mode: subtask ? 'edit' : 'add',
    });
  };

  const handleOpenDateModal = (
    isOpen: boolean,
    taskId: string,
    taskTitle: string,
    fieldName: DateFieldType,
    fieldLabel: string,
    currentValue: string
  ) => {
    setModalErrors({});
    setDateModalState({
      isOpen: true,
      taskId: taskId,
      taskTitle: taskTitle,
      fieldName: fieldName,
      fieldLabel: fieldLabel,
      currentValue: currentValue,
    });
  };
//
//   const handleOpenBlockerModal = (task: Task) => {
//     setBlockerModalState({
//       isOpen: true,
//       taskId: task.id,
//       taskCode: task.taskCode,
//       hasBlocker: task.hasBlocker,
//       blockerDescription: task.blockerDescription || '',
//     });
//   };
//
//   const handleOpenNoteModal = (task: Task) => {
//     setNoteModalState({
//       isOpen: true,
//       taskId: task.id,
//       taskCode: task.taskCode,
//       note: task.note || '',
//     });
//   };
//
//   const handleUpdateSubtaskStatus = (taskId: string, subtaskId: string, newStatus: TaskStatus) => {
//     setTasks((prev) =>
//       prev.map((task) => {
//         if (task.id !== taskId) return task;
//         return {
//           ...task,
//           subtasks: task.subtasks?.map((sub) =>
//             sub.id === subtaskId ? { ...sub, status: newStatus } : sub
//           ),
//         };
//       })
//     );
//   };

/* update status subtask --- start ---- */
const handleUpdateSubtaskStatus = async (
  taskId: number | string,
  subtaskId: number | string,
  newStatus: TaskStatus
) => {
  // 1. Cập nhật State UI trước (Optimistic UI)
  setTasks((prevTasks: any) => ({
    ...prevTasks,
    data: (prevTasks.data || []).map((task: any) => {
      if (task.id !== taskId) return task;

      return {
        ...task,
        subtasks: task.subtasks?.map((sub: any) => {
          if (sub.id !== subtaskId) return sub;
          return { ...sub, status: newStatus };
        }),
      };
    }),
  }));

  // 2. Gọi API cập nhật Backend
  try {
    await taskService.updateSubtaskStatus(taskId, subtaskId, newStatus);
    toast.success('Cập nhật trạng thái subtask thành công!');
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái subtask:', error);
    alert('Cập nhật trạng thái thất bại, vui lòng thử lại!');
  }
};
/* update status subtask --- end ---- */

/* Save Date --- start ---- */
const handleSaveDate = async (taskId: string, fieldName: string, newDate: string) => {
  // 1. Cập nhật State UI ngay lập tức (Optimistic UI)
  setTasks((prevTasks: any) => ({
    ...prevTasks,
    data: (prevTasks.data || []).map((task: any) => {
      if (String(task.id) !== String(taskId)) return task;
      return {
        ...task,
        [fieldName]: formatDateToDMY(newDate), // Cập nhật cột ngày tương ứng
      };
    }),
  }));

  // 2. Gọi Service để gửi API lên Backend
  try {
    await taskService.updateTaskDate(taskId, fieldName, formatDateToDMY(newDate));
     toast.success('Cập nhật ngày thành công!');
  } catch (error) {
     if (error.response && error.response.status === 422) {
      const apiErrors = error.response.data.errors;
      const formattedErrors: Record<string, string> = {};

      Object.keys(apiErrors).forEach((key) => {
        formattedErrors[key] = apiErrors[key][0];
      });

      setModalErrors(formattedErrors);
    } else {
      setModalErrors({
        [fieldName]: 'Có lỗi xảy ra, vui lòng thử lại sau!',
      });
    }
  }
};
/* Save Date --- end*/

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
      if (typeof fetchTasks === 'function') {
        fetchTasks();
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, không thể xóa!');
    }
  };

//
//   const handleDuplicateTask = (task: Task) => {
//     const duplicatedTask: Task = {
//       ...task,
//       id: Date.now().toString(),
//       taskCode: `${task.taskCode}-COPY`,
//       title: `${task.title} (Bản sao)`,
//       createdAt: new Date().toISOString().split('T')[0],
//       subtasks: task.subtasks?.map((sub) => ({
//         ...sub,
//         id: `sub-${Date.now()}-${Math.random()}`,
//       })),
//     };
//     setTasks((prev) => [duplicatedTask, ...prev]);
//   };

  const dateColumns: { key: string; label: string; shortLabel: string }[] = [
    { key: 'planned_dev_up', label: 'Planned DevUp', shortLabel: 'Plan DevUp' },
    { key: 'actual_dev_up', label: 'Actual DevUp', shortLabel: 'Act. DevUp' },
    { key: 'created_at', label: 'Created At', shortLabel: 'Created At' },
    { key: 'actual_start', label: 'Actual Start', shortLabel: 'Act. Start' },
    { key: 'actual_end', label: 'Actual End', shortLabel: 'Act. End' },
    { key: 'release_date', label: 'Release Date', shortLabel: 'Release Date' },
  ];


/* Mockdata sẽ xóa ==== start ==== */
// 1. Mock State cho filterState
  const [filterState, setFilterState] = useState({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    assignee: 'ALL',
    dateRange: {
      from: '',
      to: '',
    },
  });

  // 2. Mock tổng số bản ghi đã filter
  const totalFilteredCount = 12;

  // 3. Mock Handler cho các nút hành động (Button Click Events)
  const handleOpenCreateModal = () => {
    console.log('Mock: Mở modal tạo Task');
    alert('Mở modal tạo mới Task');
  };

  const handleExportCSV = () => {
    console.log('Mock: Xuất file CSV với filter:', filterState);
    alert('Đang xuất file CSV...');
  };
/* Mockdata sẽ xóa ==== end ==== */

  return (
    <div className="w-full">
      {/* Search & Filter Header Bar */}
      <Toolbar
        filterState={filterState}
        setFilterState={setFilterState}
        onOpenCreateModal={handleOpenTaskModal}
        onExportCSV={handleExportCSV}
        totalFilteredCount={totalFilteredCount}
      />

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
                    Task (Redmine)
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

              {/* Table Body (Sử dụng paginatedTasksThay vì tasks) */}
              <tbody className="text-xs text-slate-800 align-top">
                {tasks.data.map((task, index) => {
                  const isDone = task.status === 7;
                  const rowBgClass = isDone
                    ? 'bg-slate-50 group-hover:bg-blue-50/50'
                    : 'bg-white group-hover:bg-blue-50/50';

                  const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;

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
                            {task.redmineUrl ? (
                              <a
                                href={task.redmineUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 font-mono text-xs"
                              >
                                <span>{task.title}</span>
                                <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                              </a>
                            ) : (
                              <span className="font-bold text-slate-900 font-mono text-xs">
                                {task.title}
                              </span>
                            )}

                            <button
                              onClick={() => handleOpenTaskModal(task, 'redmine')}
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

                          <p className={`text-xs text-slate-700 leading-snug line-clamp-3 ${isDone ? 'line-through text-slate-400' : ''}`}>
                            Mô tả ngắn
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
                                          handleUpdateSubtaskStatus(
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
                                        onClick={() => handleOpenSubtaskModal(task.id, task.title, sub)}
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
                              onClick={() => handleOpenSubtaskModal(task.id, task.title)}
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
                                  handleOpenDateModal(true, task.id, task.title, col.key, col.label, rawVal);
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
                          onClick={() => handleOpenBlockerModal(task)}
                          className="inline-flex items-center gap-1 p-1 rounded cursor-pointer"
                        >
                          {task.hasBlocker ? (
                            <AlertTriangle className="w-4 h-4 text-rose-600 fill-rose-100" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </button>
                      </td>

                      {/* Note */}
                      <td className={`py-3.5 px-4 border-b border-r border-slate-200 pt-4 transition-colors ${rowBgClass}`}>
                        <div className="flex items-start justify-between gap-1 group/note">
                          <p onClick={() => handleOpenNoteModal(task)} className="text-xs text-slate-600 italic line-clamp-3 hover:text-slate-900 cursor-pointer flex-1">
                            {task.note || <span className="text-slate-300">-</span>}
                          </p>
                          <button onClick={() => handleOpenNoteModal(task)} className="p-1 text-slate-300 group-hover/note:text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-pointer">
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
                                <button onClick={() => { setActiveMenuTaskId(null); handleDuplicateTask(task); }} className="px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2 cursor-pointer">
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Nhân bản Task</span>
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

          {/* Thanh Paging Bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 px-2 pb-12">
            <div>
              Hiển thị{' '}
              <span className="font-semibold text-slate-800">
                {filteredTasks.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              đến{' '}
              <span className="font-semibold text-slate-800">
                {Math.min(currentPage * itemsPerPage, filteredTasks.length)}
              </span>{' '}
              trong tổng số{' '}
              <span className="font-semibold text-slate-800">
                {filteredTasks.length}
              </span>{' '}
              tasks
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Render các Modals ngay tại đây khi state isOpen = true */}
      {taskModalState.isOpen && (
        <TaskModal
          modalState={taskModalState}
          onClose={() => setTaskModalState((prev) => ({ ...prev, isOpen: false }))}
          onSuccess={fetchTasks}
        />
      )}

      {dateModalState.isOpen && (
        <DateEditModal
          modalState={dateModalState}
          errors={modalErrors}
          onClose={() =>
            setDateModalState((prev) => ({
             ...prev,
             isOpen: false,
           }))
          }
         onSaveDate={handleSaveDate}
        />
      )}

      {subtaskModalState.isOpen && (
        <SubtaskModal
          modalState={subtaskModalState}
          errors={modalErrors}
          onClose={() =>
            setSubtaskModalState((prev) => ({
             ...prev,
             isOpen: false,
           }))
          }
         onSuccess={fetchTasks}
        />
        )}
    </div>
  );
};