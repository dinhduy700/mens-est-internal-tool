import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { BlockerModalState } from '../types';

interface BlockerModalProps {
  modalState: BlockerModalState;
  onClose: () => void;
  onSaveBlocker: (taskId: string, hasBlocker: boolean, description: string) => void;
}

export const BlockerModal: React.FC<BlockerModalProps> = ({
  modalState,
  onClose,
  onSaveBlocker,
}) => {
  const [hasBlocker, setHasBlocker] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (modalState.isOpen) {
      setHasBlocker(modalState.hasBlocker);
      setDescription(modalState.blockerDescription || '');
    }
  }, [modalState]);

  if (!modalState.isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBlocker(modalState.taskId, hasBlocker, description.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasBlocker ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {hasBlocker ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Quản lý Blocker</h3>
              <p className="text-xs text-slate-500 font-mono">Task: {modalState.taskCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Trạng thái Blocker</div>
              <div className="text-xs text-slate-500">Đánh dấu nếu task đang gặp trở ngại</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasBlocker}
                onChange={(e) => setHasBlocker(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Mô tả chi tiết nguyên nhân (Blocker Description)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Timeout kết nối DB, Chưa có API docs từ bên thứ 3..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Lưu Blocker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
