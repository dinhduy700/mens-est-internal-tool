import React, { useState, useEffect } from 'react';
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

interface TaskModalProps {
  modalState: TaskEditModalState;
  onClose: () => void;
  onSaveTask: (task: Task) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  modalState,
  onClose,
  onSaveTask,
}) => {
  const [taskCode, setTaskCode] = useState('');
  const [title, setTitle] = useState('');
  const [redmineUrl, setRedmineUrl] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
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
  const [hasBlocker, setHasBlocker] = useState(false);
  const [blockerDescription, setBlockerDescription] = useState('');
  const [note, setNote] = useState('');

  // Subtasks list inside modal
  const [subtasksText, setSubtasksText] = useState('');

  useEffect(() => {
    if (modalState.isOpen) {
      if (modalState.task) {
        const t = modalState.task;
        setTaskCode(t.taskCode);
        setTitle(t.title);
        setRedmineUrl(t.redmineUrl || '');
        setStatus(t.status);
        setPriority(t.priority || 'Medium');
        setAssignee(t.assignee || '');
        setPlanDevUp(t.planDevUp || '');
        setActDevUp(t.actDevUp || '');
        setCreatedAt(t.createdAt || '');
        setActStart(t.actStart || '');
        setActEnd(t.actEnd || '');
        setReleaseDate(t.releaseDate || '');
        setHasBlocker(t.hasBlocker);
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
        setTaskCode(`EST-${Math.floor(1000 + Math.random() * 9000)}`);
        setTitle('');
        setRedmineUrl('');
        setStatus('TODO');
        setPriority('Medium');
        setAssignee('Nguyễn Đình Duy');
        setPlanDevUp('');
        setActDevUp('');
        setCreatedAt(today);
        setActStart('');
        setActEnd('');
        setReleaseDate('');
        setHasBlocker(false);
        setBlockerDescription('');
        setNote('');
        setSubtasksText('');
      }
    }
  }, [modalState]);

  if (!modalState.isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskCode.trim() || !title.trim()) return;

    // Build or preserve subtasks
    let updatedSubtasks = modalState.task?.subtasks ? [...modalState.task.subtasks] : [];
    
    // If creating or updated via text
    if (!modalState.task) {
      const lines = subtasksText
        .split('\n')
        .map((l) => l.trim().replace(/^[-*•]\s*/, ''))
        .filter((l) => l.length > 0);
      
      updatedSubtasks = lines.map((line, idx) => ({
        id: `sub-new-${Date.now()}-${idx}`,
        title: line,
        status: 'TODO',
        createdAt: new Date().toISOString().split('T')[0],
      }));
    }

    const newTask: Task = {
      id: modalState.task?.id || `task-${Date.now()}`,
      taskCode: taskCode.trim(),
      title: title.trim(),
      redmineUrl: redmineUrl.trim(),
      status,
      priority,
      assignee: assignee.trim(),
      planDevUp,
      actDevUp,
      createdAt: createdAt || new Date().toISOString().split('T')[0],
      actStart,
      actEnd,
      releaseDate,
      hasBlocker,
      blockerDescription: hasBlocker ? blockerDescription.trim() : '',
      note: note.trim(),
      subtasks: updatedSubtasks,
    };

    onSaveTask(newTask);
    onClose();
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã Task (ID) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-task-code"
                  type="text"
                  required
                  value={taskCode}
                  onChange={(e) => setTaskCode(e.target.value)}
                  placeholder="VD: EST-988"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Redmine URL
                </label>
                <div className="relative">
                  <input
                    id="input-redmine-url"
                    type="url"
                    value={redmineUrl}
                    onChange={(e) => setRedmineUrl(e.target.value)}
                    placeholder="https://redmine.example.com/issues/988"
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên Task (Tiêu đề) <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-task-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Implement new API endpoint for user auth & session management"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
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
                  <option value="TODO">Chưa làm (To Do)</option>
                  <option value="DOING">Đang làm (Doing)</option>
                  <option value="DONE">Hoàn thành (Done)</option>
                  <option value="BLOCKED">Bị chặn (Blocked)</option>
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
                  <option value="Low">Thấp (Low)</option>
                  <option value="Medium">Trung bình (Medium)</option>
                  <option value="High">Cao (High)</option>
                  <option value="Urgent">Khẩn cấp (Urgent)</option>
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
                  placeholder="VD: Nguyễn Đình Duy"
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
                  value={planDevUp}
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
                  value={actDevUp}
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
                  value={createdAt}
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
                  value={actStart}
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
                  value={actEnd}
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
                  value={releaseDate}
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
            disabled={!taskCode.trim() || !title.trim()}
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
