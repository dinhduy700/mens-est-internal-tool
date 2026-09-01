import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  X, 
  Check, 
  ExternalLink, 
  Trash2, 
  Plus,
  AlertTriangle,
  FileText,
  Calendar,
  Layers
} from 'lucide-react';

import { Task, TaskEditModalState, TaskStatus } from '../types';
import { formatDateToDMY, formatDateForInput, formatDateDisplay } from '../../utils/date';
import { TASK_STATUS_OPTIONS, TaskStatus as TaskStatusEnum } from '../../constants/taskStatus';
import { PRIORITY_OPTIONS, Priority as PriorityEnum } from '../../constants/priority';
import { Blocker as BlockerEnum } from '../../constants/blocker';
import { taskService } from '../../services/taskService';

interface TaskModalProps {
  modalState: TaskEditModalState;
  onSuccess: () => void;
  onClose: () => void;
  onSaveTask: (task: Task) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  modalState,
  onSuccess,
  onClose,
  onSaveTask,
}) => {
  const [title, setTitle] = useState('');
  const [redmineUrl, setRedmineUrl] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatusEnum.NEW);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [assignee, setAssignee] = useState('');
  
  // Dates
  const [planDevUp, setPlanDevUp] = useState('');
  const [actDevUp, setActDevUp] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [actStart, setActStart] = useState('');
  const [actEnd, setActEnd] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  // Blocker & Note
  const [hasBlocker, setHasBlocker] = useState(BlockerEnum.NO);
  const [blockerDescription, setBlockerDescription] = useState('');
  const [note, setNote] = useState('');

  // Subtasks list inside modal
  const [subtasksText, setSubtasksText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ api?: string; [key: string]: any }>({});

  useEffect(() => {
    if (modalState.isOpen) {
      if (modalState.mode === 'edit') {
        const t = modalState.task;
        setTitle(t.title);
        setRedmineUrl(t.redmine_url || '');
        setStatus(t.status);
        setPriority(t.priority || 1);
        setPlanDevUp(t.planned_dev_up || '');
        setActDevUp(t.actual_dev_up || '');
        setCreatedAt(t.created_at || '');
        setActStart(t.actual_start || '');
        setActEnd(t.actual_end || '');
        setReleaseDate(t.release_date || '');
        setHasBlocker(t.blocker);
        setBlockerDescription(t.blockerDescription || '');
        setNote(t.note || '');
        setSubtasksText(
          t.subtasks && t.subtasks.length > 0
            ? t.subtasks.map((s) => s.title).join('\n')
            : ''
        );
      } else {
        // New Task defaults
        const today = new Date().toISOString().split('T')[0];
        setTitle('');
        setRedmineUrl('');
        setStatus(TaskStatusEnum.NEW);
        setPriority(PriorityEnum.LOW);
        setAssignee('Nguyễn Đinh Duy');
        setPlanDevUp(today);
        setActDevUp(today);
        setCreatedAt(today);
        setActStart(today);
        setActEnd('');
        setReleaseDate('');
        setHasBlocker(BlockerEnum.NO);
        setBlockerDescription('');
        setNote('');
        setSubtasksText('');
      }
    }
  }, [modalState]);

  if (!modalState.isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setIsSubmitting(true);
    const payload = {
      title: title,
      redmine_url: redmineUrl,
      status: status,
      priority: priority,
      planned_dev_up: formatDateToDMY(planDevUp),
      actual_dev_up: formatDateToDMY(actDevUp),
      actual_start: formatDateToDMY(actStart),
      actual_end: formatDateToDMY(actEnd),
      release_date: formatDateToDMY(releaseDate),
      blocker: hasBlocker,
      note: note,
    };

    try {
        if (modalState.mode === 'edit') {
          await taskService.updateTask(modalState.task.id, payload);
          toast.success('Cập nhật công việc thành công!');
        } else {
          await taskService.createTask(payload);
          toast.success('Tạo mới công việc thành công!');
        }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
        if (err.response && err.response.status === 422) {
          const serverErrors = err.response.data.errors;
          const formattedErrors: Record<string, string> = {};

          Object.keys(serverErrors).forEach((key) => {
            formattedErrors[key] = serverErrors[key][0];
          });

          setErrors(formattedErrors);
        } else {
          setErrors({ api: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col my-auto overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {modalState.mode === 'edit' ? 'Chỉnh sửa Task' : 'Tạo Task mới'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Cập nhật thông tin Task, Redmine URL, Timeline & Sub-tasks
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow flex flex-col gap-5">
          {/* Section 1: Task ID, Title, Redmine URL */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-4 flex flex-col gap-3.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Thông tin cơ bản & Redmine Link
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiêu đề <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-task-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);

                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: '' }));
                    }
                  }}
                  placeholder="VD: EST-888"
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 focus:outline-none transition-colors ${
                        errors.title
                          ? 'border-rose-500 focus:ring-2 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-2 focus:ring-blue-600'
                      }`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Redmine URL
                </label>
                <div className="relative">
                  <input
                    id="input-redmine-url"
                    type="url"
                    value={redmineUrl}
                    onChange={(e) => {
                        setRedmineUrl(e.target.value);

                        if (errors.redmine_url) {
                          setErrors((prev) => ({ ...prev, redmine_url: '' }));
                        }
                    }}
                    placeholder="https://redmine.example.com/issues/988"
                    className={`w-full pl-3 pr-8 py-2 bg-white rounded-lg text-sm text-slate-900 focus:outline-none transition-colors ${
                          errors.redmine_url
                            ? 'border-2 border-rose-500 focus:ring-2 focus:ring-rose-500'
                            : 'border border-slate-300 focus:ring-2 focus:ring-blue-600'
                        }`}
                  />
                  {redmineUrl && (
                    <a
                      href={redmineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800"
                      title="Mở link Redmine"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                 {errors.redmine_url && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">
                      {errors.redmine_url}
                    </p>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mức độ ưu tiên
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  { PRIORITY_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Người phụ trách
                </label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="VD: Nguyễn Đinh Duy"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Date Timeline (All 6 Datepicker fields) */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Lịch trình & Ngày tháng (Datepickers)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Plan DevUp
                </label>
                <input
                  type="date"
                  value={formatDateForInput(planDevUp)}
                  onChange={(e) => setPlanDevUp(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Actual DevUp
                </label>
                <input
                  type="date"
                  value={formatDateForInput(actDevUp)}
                  onChange={(e) => setActDevUp(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Create At
                </label>
                <input
                  type="date"
                  value={formatDateForInput(createdAt)}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Actual Start
                </label>
                <input
                  type="date"
                  value={formatDateForInput(actStart)}
                  onChange={(e) => setActStart(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Actual End
                </label>
                <input
                  type="date"
                  value={formatDateForInput(actEnd)}
                  onChange={(e) => setActEnd(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Release Date
                </label>
                <input
                  type="date"
                  value={formatDateForInput(releaseDate)}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Subtasks quick input (when creating new task) */}
          {!modalState.task && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Danh sách Sub-tasks ban đầu (Mỗi dòng 1 subtask)
              </label>
              <textarea
                rows={3}
                value={subtasksText}
                onChange={(e) => setSubtasksText(e.target.value)}
                placeholder="- Viết schema database&#10;- Viết logic API&#10;- Viết unit test"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          )}

          {/* Section 4: Blocker & Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Blocker */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBlocker}
                    onChange={(e) => setHasBlocker(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Đang có Blocker / Trở ngại</span>
                </label>
                {hasBlocker && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                    Active Blocker
                  </span>
                )}
              </div>
              <textarea
                rows={2}
                disabled={!hasBlocker}
                value={blockerDescription}
                onChange={(e) => setBlockerDescription(e.target.value)}
                placeholder={
                  hasBlocker
                    ? 'Mô tả vấn đề đang bị chặn (VD: Timeout kết nối DB, chờ quyền server...)'
                    : 'Tích chọn để nhập nội dung blocker'
                }
                className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none ${
                  hasBlocker
                    ? 'border-rose-300'
                    : 'border-slate-200 bg-slate-100/50 cursor-not-allowed opacity-60'
                }`}
              />
            </div>

            {/* Note */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-3.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Ghi chú (Note)
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú chi tiết cho team hoặc dev..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-900/30 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{modalState.mode === 'edit' ? 'Lưu thay đổi' : 'Tạo Task'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
