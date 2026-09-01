import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Check, ListPlus, User } from 'lucide-react';
import { SubtaskModalState, TaskStatus } from '../types';
import { TASK_STATUS_OPTIONS, getStatusBadgeConfig, TaskStatus as TaskStatusEnum } from '../../constants/taskStatus';
import { taskService } from '../../services/taskService';

interface SubtaskModalProps {
  modalState: SubtaskModalState;
  onClose: () => void;
  onSaveSubtask: (
    parentTaskId: string,
    subtaskData: {
      id?: string;
      title: string;
      status: TaskStatus;
      assignee?: string;
      notes?: string;
    }
  ) => void;
}

export const SubtaskModal: React.FC<SubtaskModalProps> = ({
  modalState,
  onSuccess,
  onClose,
  onSaveSubtask,
}) => {
  const [title, setTitle] = useState('');
  const [parentTaskId, setParentTaskId] = useState('');
  const [subTaskId, setSubTaskId] = useState('');
  const [parentTaskTitle, setParentTaskTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatusEnum.NEW);
  const [assignee, setAssignee] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (modalState.isOpen) {
      if (modalState.mode === 'add') {
        setParentTaskTitle(modalState.parentTaskTitle);
        setParentTaskId(modalState.parentTaskId);
        setAssignee('Nguyễn Đinh Duy');
      }

      if (modalState.mode === 'edit') {
        setParentTaskTitle(modalState.parentTaskTitle);
        setParentTaskId(modalState.parentTaskId);
        setSubTaskId(modalState.subtask.id);
        setTitle(modalState.subtask.title);
        setStatus(modalState.subtask.status);
        setAssignee('Nguyễn Đinh Duy');
        setNotes(modalState.subtask.note);
      }
    }
  }, [modalState]);

  if (!modalState.isOpen) return null;

  const handleSaveSubtask = async (e: React.FormEvent) => {
    if (!title.trim()) return;

    try {
        if (modalState.mode === 'edit') {
          const response = await taskService.updateSubtask(parentTaskId, subTaskId, {
                                                                                     title: title,
                                                                                     status: status,
                                                                                     notes: notes,
                                                                                   });
          toast.success('Lưu subtask thành công!');
        } else {
          const response = await taskService.createSubtask({
            task_id: parentTaskId,
            title: title,
            status: status,
            notes: notes,
          });

          toast.success('Thêm subtask thành công!');
        }

        if (onSuccess) onSuccess();
        onClose();
      } catch (error: any) {
        console.error('Lỗi khi tạo subtask:', error);
        toast.error('Không thể tạo subtask, vui lòng thử lại!');
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <ListPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {modalState.mode === 'edit' ? 'Chỉnh sửa Sub-task' : 'Thêm Sub-task mới'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Task cha: <span className="font-bold text-blue-600">{parentTaskTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form className="p-6 flex flex-col gap-4">
          {/* Parent task read-only info */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Task cha (Parent Task)
            </label>
            <input
              type="text"
              value={parentTaskTitle}
              disabled
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 font-mono cursor-not-allowed"
            />
          </div>

          {/* Subtask Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tên Sub-task <span className="text-rose-500">*</span>
            </label>
            <input
              id="subtask-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Viết API logic, Tạo schema database, Viết test..."
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
              autoFocus
            />
          </div>

          {/* Status & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                  {TASK_STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Người phụ trách
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="VD: Duy ND"
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Subtask Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Ghi chú thêm (Tùy chọn)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Chi tiết yêu cầu hoặc lưu ý..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={!title.trim()}
              onClick={() => handleSaveSubtask()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {modalState.mode === 'edit' ? 'Lưu thay đổi' : 'Thêm Sub-task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
