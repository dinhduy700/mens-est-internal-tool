import React, { useState, useEffect } from 'react';
import { X, Calendar, Check, Trash2 } from 'lucide-react';
import { DateEditModalState } from '../types';
import { formatDateForInput } from '../../utils/date';

interface DateEditModalProps {
  modalState: DateEditModalState;
  errors?: Record<string, string>;
  onClose: () => void;
  onSaveDate: (taskId: string, fieldName: string, newDate: string) => void;
}

export const DateEditModal: React.FC<DateEditModalProps> = ({
  modalState,
  errors,
  onClose,
  onSaveDate,
}) => {
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (modalState.isOpen) {
      setSelectedDate(formatDateForInput(modalState.currentValue));
    }
  }, [modalState]);

  if (!modalState.isOpen) return null;

  const errorMessage = errors?.[modalState.fieldName] || errors?.['date_value'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDate(modalState.taskId, modalState.fieldName, selectedDate);

    const isErrorsEmpty = !errors || Object.keys(errors).length === 0;
    if (isErrorsEmpty) {
      onClose();
    }
  };

  const setPresetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  const setPresetTomorrow = () => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    setSelectedDate(tmr.toISOString().split('T')[0]);
  };

  const setPresetNextWeek = () => {
    const nextWk = new Date();
    nextWk.setDate(nextWk.getDate() + 7);
    setSelectedDate(nextWk.toISOString().split('T')[0]);
  };

  const handleClear = () => {
    setSelectedDate('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Cập nhật {modalState.fieldLabel} | {modalState.currentValue}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Task: {modalState.taskTitle}
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

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Chọn ngày
            </label>
            <div className="relative">
              <input
                id="datepicker-field"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errorMessage
                    ? 'border-rose-400 focus:ring-rose-500 focus:bg-white'
                    : 'border-slate-300 focus:ring-blue-600 focus:bg-white'
                }`}
                autoFocus
              />
            </div>

             {errorMessage && (
               <p className="mt-1.5 text-xs text-rose-500 font-medium">
                 {errorMessage}
               </p>
             )}
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Chọn nhanh:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={setPresetToday}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Hôm nay
              </button>
              <button
                type="button"
                onClick={setPresetTomorrow}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Ngày mai
              </button>
              <button
                type="button"
                onClick={setPresetNextWeek}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                +7 ngày tới
              </button>
              {selectedDate && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2.5 py-1 text-xs rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium transition-colors flex items-center gap-1 ml-auto"
                >
                  <Trash2 className="w-3 h-3" />
                  Xóa ngày
                </button>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 mt-2 border-t border-slate-100">
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
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
