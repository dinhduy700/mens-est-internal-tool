/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { 
  Task, 
  SubTask, 
  TaskStatus, 
  FilterState, 
  DateFieldType, 
  DateEditModalState, 
  TaskEditModalState, 
  SubtaskModalState,
  BlockerModalState,
  NoteModalState
} from './types';
import { INITIAL_TASKS } from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewCards } from './components/OverviewCards';
import { Toolbar } from './components/Toolbar';
import { TaskTable } from './pages/task/TaskTable';
import { TaskModal } from './pages/task/TaskModal';
import { SubtaskModal } from './pages/task/SubtaskModal';
import { DateEditModal } from './pages/task/DateEditModal';
import { BlockerModal } from './pages/task/BlockerModal';
import { NoteModal } from './pages/task/NoteModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  Download, 
  Layers, 
  Sparkles,
  Info
} from 'lucide-react';

const STORAGE_KEY = 'taskhub_pro_team_tasks_v2';

export default function App() {
  // Load initial tasks from localStorage or mock data
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
    return INITIAL_TASKS;
  });

  // Save to localStorage on any state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save to storage', e);
    }
  }, [tasks]);

  // Filter & Search State
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    status: 'ALL',
    hasBlocker: 'ALL',
    sortField: 'createdAt',
    sortOrder: 'desc',
    currentTab: 'overview',
  });

  const [activeTopTab, setActiveTopTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Modals States
  const [taskModalState, setTaskModalState] = useState<TaskEditModalState>({
    isOpen: false,
    mode: 'create',
  });

  const [subtaskModalState, setSubtaskModalState] = useState<SubtaskModalState>({
    isOpen: false,
    parentTaskId: '',
    parentTaskCode: '',
    mode: 'add',
  });

  const [dateModalState, setDateModalState] = useState<DateEditModalState>({
    isOpen: false,
    taskId: '',
    taskCode: '',
    fieldName: 'planDevUp',
    fieldLabel: '',
    currentValue: '',
  });

  const [blockerModalState, setBlockerModalState] = useState<BlockerModalState>({
    isOpen: false,
    taskId: '',
    taskCode: '',
    hasBlocker: false,
    blockerDescription: '',
  });

  const [noteModalState, setNoteModalState] = useState<NoteModalState>({
    isOpen: false,
    taskId: '',
    taskCode: '',
    note: '',
  });

  // Task Handlers
  const handleSaveTask = (savedTask: Task) => {
    if (taskModalState.mode === 'create') {
      setTasks((prev) => [savedTask, ...prev]);
      showToast(`Đã tạo Task ${savedTask.taskCode} thành công!`);
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === savedTask.id ? savedTask : t))
      );
      showToast(`Đã cập nhật Task ${savedTask.taskCode}`);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (window.confirm(`Bạn có chắc chắn muốn xóa task "${taskToDelete?.taskCode}: ${taskToDelete?.title}" không?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast(`Đã xóa Task ${taskToDelete?.taskCode || ''}`);
    }
  };

  const handleDuplicateTask = (task: Task) => {
    const duplicated: Task = {
      ...task,
      id: `task-${Date.now()}`,
      taskCode: `${task.taskCode}-COPY`,
      title: `${task.title} (Bản sao)`,
      createdAt: new Date().toISOString().split('T')[0],
      subtasks: task.subtasks.map((s, idx) => ({
        ...s,
        id: `sub-${Date.now()}-${idx}`,
      })),
    };
    setTasks((prev) => [duplicated, ...prev]);
    showToast(`Đã nhân bản Task thành ${duplicated.taskCode}`);
  };

  // Subtask Handlers
  const handleSaveSubtask = (
    parentTaskId: string,
    subtaskData: {
      id?: string;
      title: string;
      status: TaskStatus;
      assignee?: string;
      notes?: string;
    }
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== parentTaskId) return t;

        let updatedSubtasks = [...(t.subtasks || [])];
        if (subtaskData.id) {
          // Edit existing
          updatedSubtasks = updatedSubtasks.map((s) =>
            s.id === subtaskData.id ? { ...s, ...subtaskData } : s
          );
        } else {
          // Add new
          const newSub: SubTask = {
            id: `sub-${Date.now()}`,
            title: subtaskData.title,
            status: subtaskData.status,
            assignee: subtaskData.assignee,
            notes: subtaskData.notes,
            createdAt: new Date().toISOString().split('T')[0],
          };
          updatedSubtasks.push(newSub);
        }

        // Auto update task status if all subtasks done
        let newStatus = t.status;
        if (updatedSubtasks.length > 0) {
          const allDone = updatedSubtasks.every((s) => s.status === 'DONE');
          const anyDoing = updatedSubtasks.some((s) => s.status === 'DOING');
          const anyBlocked = updatedSubtasks.some((s) => s.status === 'BLOCKED');

          if (allDone) {
            newStatus = 'DONE';
          } else if (anyBlocked) {
            newStatus = 'BLOCKED';
          } else if (anyDoing) {
            newStatus = 'DOING';
          }
        }

        return {
          ...t,
          subtasks: updatedSubtasks,
          status: newStatus,
        };
      })
    );
    showToast('Đã lưu Sub-task thành công');
  };

  const handleUpdateSubtaskStatus = (
    taskId: string,
    subtaskId: string,
    newStatus: TaskStatus
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;

        const updatedSubtasks = t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, status: newStatus } : s
        );

        // Auto update parent task status logic
        let updatedTaskStatus = t.status;
        if (updatedSubtasks.every((s) => s.status === 'DONE')) {
          updatedTaskStatus = 'DONE';
        } else if (updatedSubtasks.some((s) => s.status === 'DOING')) {
          updatedTaskStatus = 'DOING';
        } else if (updatedSubtasks.some((s) => s.status === 'BLOCKED')) {
          updatedTaskStatus = 'BLOCKED';
        }

        return {
          ...t,
          subtasks: updatedSubtasks,
          status: updatedTaskStatus,
        };
      })
    );
  };

  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
        };
      })
    );
    showToast('Đã xóa Sub-task');
  };

  // Date Field Modal Handler
  const handleSaveDate = (
    taskId: string,
    fieldName: string,
    newDate: string
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          [fieldName]: newDate,
        };
      })
    );
    showToast('Đã cập nhật ngày thành công');
  };

  // Blocker Modal Handler
  const handleSaveBlocker = (
    taskId: string,
    hasBlocker: boolean,
    description: string
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          hasBlocker,
          blockerDescription: description,
          status: hasBlocker ? 'BLOCKED' : t.status === 'BLOCKED' ? 'DOING' : t.status,
        };
      })
    );
    showToast('Đã cập nhật thông tin Blocker');
  };

  // Note Modal Handler
  const handleSaveNote = (taskId: string, note: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          note,
        };
      })
    );
    showToast('Đã lưu ghi chú');
  };

  // Reset Data to Initial
  const handleResetData = () => {
    if (window.confirm('Bạn có muốn khôi phục lại dữ liệu task mẫu ban đầu không?')) {
      setTasks(INITIAL_TASKS);
      showToast('Đã khôi phục dữ liệu mẫu ban đầu');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      '#',
      'Task Code',
      'Title',
      'Redmine URL',
      'Status',
      'Priority',
      'Assignee',
      'Plan DevUp',
      'Actual DevUp',
      'Create At',
      'Actual Start',
      'Actual End',
      'Release Date',
      'Has Blocker',
      'Blocker Description',
      'Note',
      'Subtasks Count',
      'Subtasks Details',
    ];

    const rows = filteredTasks.map((t, idx) => {
      const subtaskStr = (t.subtasks || [])
        .map((s) => `[${s.status}] ${s.title}`)
        .join('; ');
      return [
        idx + 1,
        `"${t.taskCode}"`,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${t.redmineUrl || ''}"`,
        `"${t.status}"`,
        `"${t.priority || ''}"`,
        `"${t.assignee || ''}"`,
        `"${t.planDevUp || ''}"`,
        `"${t.actDevUp || ''}"`,
        `"${t.createdAt || ''}"`,
        `"${t.actStart || ''}"`,
        `"${t.actEnd || ''}"`,
        `"${t.releaseDate || ''}"`,
        t.hasBlocker ? 'YES' : 'NO',
        `"${(t.blockerDescription || '').replace(/"/g, '""')}"`,
        `"${(t.note || '').replace(/"/g, '""')}"`,
        t.subtasks ? t.subtasks.length : 0,
        `"${subtaskStr.replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `TaskHub_Export_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file CSV thành công!');
  };

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Tab filter
        if (filterState.currentTab === 'myTasks') {
          if (task.assignee && !task.assignee.includes('Duy')) {
            return false;
          }
        } else if (filterState.currentTab === 'archive') {
          if (task.status !== 'DONE') return false;
        } else if (filterState.currentTab === 'milestones') {
          if (!task.releaseDate) return false;
        }

        // Search text
        if (filterState.search.trim()) {
          const q = filterState.search.toLowerCase().trim();
          const matchCode = task.taskCode.toLowerCase().includes(q);
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchRedmine = task.redmineUrl.toLowerCase().includes(q);
          const matchNote = task.note.toLowerCase().includes(q);
          const matchAssignee = (task.assignee || '').toLowerCase().includes(q);
          const matchSubtask = (task.subtasks || []).some((s) =>
            s.title.toLowerCase().includes(q)
          );
          if (
            !matchCode &&
            !matchTitle &&
            !matchRedmine &&
            !matchNote &&
            !matchAssignee &&
            !matchSubtask
          ) {
            return false;
          }
        }

        // Status Filter
        if (filterState.status !== 'ALL') {
          if (task.status !== filterState.status) return false;
        }

        // Blocker Filter
        if (filterState.hasBlocker !== 'ALL') {
          if (task.hasBlocker !== filterState.hasBlocker) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = (a as any)[filterState.sortField] || '';
        let valB = (b as any)[filterState.sortField] || '';

        if (valA < valB) return filterState.sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return filterState.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [tasks, filterState]);

  // Paginated tasks
  const paginatedTasks = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredTasks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">
      {/* Sidebar (Desktop) */}
      <Sidebar
        filterState={filterState}
        setFilterState={setFilterState}
        onOpenCreateModal={() =>
          setTaskModalState({ isOpen: true, mode: 'create' })
        }
        onResetData={handleResetData}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          filterState={filterState}
          setFilterState={setFilterState}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          activeTopTab={activeTopTab}
          setActiveTopTab={setActiveTopTab}
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-[1500px] w-full mx-auto">
          {/* Page Title & Quick Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
                  Sprint Backlog
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {tasks.length} tasks registered
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Tổng Quan Tiến Độ & Task Team
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Theo dõi sub-tasks, timeline DevUp, release date và tình trạng blocker cho cả team.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                id="btn-export-top"
                onClick={handleExportCSV}
                className="h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export CSV</span>
              </button>

              <button
                id="btn-create-task-top"
                onClick={() =>
                  setTaskModalState({ isOpen: true, mode: 'create' })
                }
                className="h-9 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-sm rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-900/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Tạo Task Mới</span>
              </button>
            </div>
          </div>

          {/* 1. Tổng quan số task đang làm, chưa làm, đã hoàn thành */}
          <OverviewCards
            tasks={tasks}
            filterState={filterState}
            setFilterState={setFilterState}
          />

          {/* 2. Toolbar: Search, Sort, Filter, Export */}
          {/**

             <Toolbar
                         filterState={filterState}
                         setFilterState={setFilterState}
                         onOpenCreateModal={() =>
                           setTaskModalState({ isOpen: true, mode: 'create' })
                         }
                         onExportCSV={handleExportCSV}
                         totalFilteredCount={filteredTasks.length}
                       /> */

          }

          <TaskTable />
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        modalState={taskModalState}
        onClose={() => setTaskModalState({ isOpen: false, mode: 'create' })}
        onSaveTask={handleSaveTask}
      />

      <SubtaskModal
        modalState={subtaskModalState}
        onClose={() =>
          setSubtaskModalState({
            isOpen: false,
            parentTaskId: '',
            parentTaskCode: '',
            mode: 'add',
          })
        }
        onSaveSubtask={handleSaveSubtask}
      />

      <DateEditModal
        modalState={dateModalState}
        onClose={() =>
          setDateModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onSaveDate={handleSaveDate}
      />

      <BlockerModal
        modalState={blockerModalState}
        onClose={() =>
          setBlockerModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onSaveBlocker={handleSaveBlocker}
      />

      <NoteModal
        modalState={noteModalState}
        onClose={() =>
          setNoteModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onSaveNote={handleSaveNote}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      <ToastContainer
          position="top-right"
          autoClose={3000} // Tự động đóng sau 3 giây
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </div>
  );
}
