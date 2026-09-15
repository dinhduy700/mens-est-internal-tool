import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Task, SubTask, TaskStatus, DateFieldType, DateEditModalState, NoteModalState } from '@/types.ts';
import { TaskToolbar } from '@/pages/task/components/TaskToolbar';
import { TaskTable } from '@/pages/task/components/TaskTable';
import { TaskPagination } from '@/pages/task/components/TaskPagination';
import {TaskOverviewCards, TaskStatsResponse} from "@/pages/task/components/TaskOverviewCards.tsx";
import { taskService } from '@/services/taskService';
import { TaskModal } from "@/pages/task/components/TaskModal.tsx";
import { SubtaskModal } from "@/pages/task/components/SubtaskModal.tsx";
import { DateEditModal } from "@/pages/task/components/DateEditModal.tsx";
import { NoteModal } from "@/pages/task/components/NoteModal.tsx";
import { formatDateToDMY } from '@/utils/date.ts';
import { APP_MESSAGES} from "@/constants/messages.ts";

export const TaskManagement = () => {

  /* ==== STATE(start) ==== */
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState({
    data: [],
    links: {},
    meta: {},
  });
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerpage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const searchQuery = searchParams.get('search_query') || '';
  const status = searchParams.get('status') || '';
  const blocker = searchParams.get('blocker') || '';
  const page = searchParams.get('page') || '1';

  const [taskModalState, setTaskModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    task?: Task;
    targetFocus?: 'redmine' | 'all';
  }>({ isOpen: false, mode: 'add' });

  const [subtaskModalState, setSubtaskModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    parentId?: number;
    parentTitle?: string;
    subtask?: SubTask;
  }>({ isOpen: false, mode: 'add' });

  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});
  const [dateModalState, setDateModalState] = useState<DateEditModalState>({
    isOpen: false,
    taskId: '',
    taskTitle: '',
    fieldName: 'planned_dev_up',
    fieldLabel: '',
    currentValue: '',
  });

  const [noteModalState, setNoteModalState] = useState<NoteModalState>({
    isOpen: false,
    taskId: '',
    taskTitile: '',
    note: '',
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [taskStats, setTaskStats] = useState({
    todo_count: 0,
    in_progress_count: 0,
    near_release_count: 0,
    release_count: 0,
    total: 0
  });

  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  /* ==== STATE(end) ==== */


  /* ==== HANDLE FUNCTION(start) ==== */
  const handleOpenTaskModal = (task?: Task, targetFocus?: 'redmine' | 'all') => {
    const isEdit = Boolean(task && task.id);
    setTaskModalState({
      isOpen: true,
      mode: isEdit ? 'edit' : 'add',
      task: isEdit ? task : undefined,
      targetFocus,
    });
  };

  const handleCloseTaskModal = () => {
    setTaskModalState((prev) => ({ ...prev, isOpen: false }));
  }

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await taskService.getTasks({
        search_query: searchQuery,
        status: status,
        blocker: blocker,
        page: page,
        sort_by: sortField,
        sort_dir: sortDir
      });
      setTasks(response.data);
      setTotalItems(response.data.meta.total);
      setPerpage(response.data.meta.per_page);
    } catch (error) {
      console.error(APP_MESSAGES.ERROR.FAILED, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSuccess = async () => {
    await fetchTasks();
    setRefreshTrigger(prev => prev + 1);
    handleCloseTaskModal();
  };

  const handleOpenSubtaskModal = (
      parentTaskId?: number,
      parentTaskTitle?: string,
      subtask?: SubTask
  ) => {
    const isEdit = Boolean(subtask && subtask.id);

    setSubtaskModalState({
      isOpen: true,
      mode: isEdit ? 'edit' : 'add',
      parentTaskId: parentTaskId,
      parentTaskTitle,
      subtask: isEdit ? subtask : undefined,
    });
  };

  const handleCloseSubtaskModal = () => {
    setSubtaskModalState({ isOpen: false });
  };

  const handleSubtaskSaveSuccess = async () => {
    await fetchTasks();
    handleCloseSubtaskModal();
  };

  useEffect(() => {
    fetchTasks();
  }, [searchQuery, status, blocker, page, sortField, sortDir, refreshTrigger]);

  useEffect(() => {
    fetchTaskStats();
  }, [refreshTrigger]);

  const handleTaskModalSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUpdateSubtaskStatus = async (
      taskId: number | string,
      subtaskId: number | string,
      newStatus: TaskStatus
  ) => {
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

    // 3. Gọi API lưu vào Database
    try {
      await taskService.updateSubtaskStatus(taskId, subtaskId, newStatus);
      toast.success(APP_MESSAGES.SUCCESS.UPDATE_SUBTASK);
    } catch (error) {
      console.error(APP_MESSAGES.ERROR.FAILED, error);
      toast.error(APP_MESSAGES.ERROR.FAILED);
    }
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
      toast.success(APP_MESSAGES.SUCCESS.DATE);
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
          [fieldName]: APP_MESSAGES.ERROR.FAILED,
        });
      }
    }
  };
  /* Save Date --- end*/
  const handleCloseDateModal = () => {
    setDateModalState({ isOpen: false });
  };
  const handleDateSaveSuccess = async (taskId: string, fieldName: string, newDate: string) => {
    await handleSaveDate(taskId, fieldName, newDate);
    handleCloseDateModal();
  };

  const handleOpenNoteModal = (task) => {
    setNoteModalState({
      isOpen: true,
      taskId: task.id,
      taskTitle: task.title,
      note: task.note
    });
  };

  const saveNote = async (taskId: string, note: string) => {
    // 1. Cập nhật State UI ngay lập tức (Optimistic UI)
    setTasks((prevTasks: any) => ({
      ...prevTasks,
      data: (prevTasks.data || []).map((task: any) => {
        if (String(task.id) !== String(taskId)) return task;
        return {
          ...task,
          note: note,
        };
      }),
    }));

    // 2. Gọi Service để gửi API lên Backend
    try {
      await taskService.updateTaskNote(taskId, note);
      toast.success(APP_MESSAGES.SUCCESS.UPDATE_NOTE);

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
          note: APP_MESSAGES.ERROR.FAILED,
        });
      }
    }
  };
  const handleCloseNoteModal = () => {
    setNoteModalState({ isOpen: false });
  };

  const handleNoteSaveSuccess = async (taskId: string, note: string) => {
    await saveNote(taskId, note);
    handleCloseNoteModal();
  };

  const fetchTaskStats = async () => {
    try {
      const response = await taskService.getTaskStats();
      setTaskStats(response.data); // Cập nhật state cho Cards
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Dùng Promise.all để chạy 2 API song song thay vì đợi cái này xong mới gọi cái kia
      await Promise.all([
        fetchTasks(),
        fetchTaskStats()
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSortChange = (field: string, dir: 'asc' | 'desc') => {
    setSortField(field);
    setSortDir(dir);
    // Khi sort, thường ta sẽ đưa page về 1 để UX tốt hơn
    setPage(1);
  };
  /* ==== HANDLE FUNCTION(end) ==== */



  return (
      <div className="space-y-4 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
                  Sprint Backlog
                </span>
              <span className="text-xs text-slate-400 font-medium">
                  { totalItems } tasks đã đăng ký
                </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Tổng Quan Tiến Độ & Task Team
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Theo dõi sub-tasks, timeline DevUp, release date và tình trạng blocker cho cả team.
            </p>
          </div>
        </div>

        <TaskOverviewCards stats={taskStats}/>

        {/* 1. Bộ lọc */}
        <TaskToolbar onCreateTask={ handleOpenTaskModal }
                     sortField={sortField}
                     sortDir={sortDir}
                     onSortChange={handleSortChange}
        />

        {/* 2. Bảng dữ liệu */}
        <TaskTable tasks={tasks}
                   isLoading={isLoading}
                   onEditTask={handleOpenTaskModal}
                   onOpenSubtaskModal={handleOpenSubtaskModal}
                   onOpenDateModal={handleOpenDateModal}
                   onOpenNoteModal={handleOpenNoteModal}
                   onDeleteSuccess={fetchTasks}
                   onUpdateSubtaskStatus={handleUpdateSubtaskStatus}
        />

        {/* 3. Phân trang */}
        <TaskPagination totalItems={totalItems} itemsPerPage={perPage}/>

        {/*4. Modal*/}
        {taskModalState.isOpen && (
          <TaskModal
            modalState={taskModalState}
            onClose={() => setTaskModalState((prev) => ({ ...prev, isOpen: false }))}
            onSuccess={handleSaveSuccess}
          />
        )}
        {subtaskModalState.isOpen && (
          <SubtaskModal
            modalState={subtaskModalState}
            onClose={handleCloseSubtaskModal}
            onSuccess={handleSubtaskSaveSuccess}
          />
        )}
        {dateModalState.isOpen && (
          <DateEditModal
              modalState={dateModalState}
              errors={modalErrors}
              onClose={handleCloseDateModal}
              onSuccess={handleDateSaveSuccess}
          />
        )}
        {noteModalState.isOpen && (
          <NoteModal
              modalState={noteModalState}
              errors={modalErrors}
              onClose={handleCloseNoteModal}
              onSuccess={handleNoteSaveSuccess}
          />
        )}
      </div>
  );
};