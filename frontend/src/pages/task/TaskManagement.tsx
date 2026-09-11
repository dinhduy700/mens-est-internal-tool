import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
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
} from '@/types.ts';

import { TaskToolbar } from '@/pages/task/components/TaskToolbar';
import { TaskTable } from '@/pages/task/components/TaskTable';
import { TaskPagination } from '@/pages/task/components/TaskPagination';
import { TaskOverviewCards } from "@/pages/task/components/TaskOverviewCards.tsx";
import { taskService } from '@/services/taskService';
import { TaskModal } from "@/pages/task/components/TaskModal.tsx";
import { SubtaskModal } from "@/pages/task/components/SubtaskModal.tsx";

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
        status,
        blocker,
        page,
      });
      setTasks(response.data);
      setTotalItems(response.data.meta.total);
      setPerpage(response.data.meta.per_page);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSuccess = async () => {
    await fetchTasks();
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
  }, [searchQuery, status, blocker, page]);

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
      toast.success('Cập nhật trạng thái subtask thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái subtask:', error);
      toast.error('Cập nhật thất bại, đang hoàn tác!');
    }
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

        <TaskOverviewCards tasks={tasks}/>

        {/* 1. Bộ lọc */}
        <TaskToolbar onCreateTask={ handleOpenTaskModal }/>

        {/* 2. Bảng dữ liệu */}
        <TaskTable tasks={tasks}
                   isLoading={isLoading}
                   onEditTask={handleOpenTaskModal}
                   onOpenSubtaskModal={handleOpenSubtaskModal}
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
      </div>
  );
};