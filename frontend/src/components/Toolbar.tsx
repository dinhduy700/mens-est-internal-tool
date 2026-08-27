import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Filter, 
  Download, 
  Plus, 
  X,
  AlertOctagon,
  FileSpreadsheet
} from 'lucide-react';
import { FilterState, SortField } from '../types';

interface ToolbarProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenCreateModal: () => void;
  onExportCSV: () => void;
  totalFilteredCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  filterState,
  setFilterState,
  onOpenCreateModal,
  onExportCSV,
  totalFilteredCount,
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const sortOptions: { value: SortField; label: string }[] = [
    { value: 'createdAt', label: 'Ngày tạo (Create At)' },
    { value: 'releaseDate', label: 'Ngày release (Release Date)' },
    { value: 'planDevUp', label: 'Kế hoạch DevUp (Plan DevUp)' },
    { value: 'actDevUp', label: 'Thực tế DevUp (Act. DevUp)' },
    { value: 'taskCode', label: 'Mã Task / ID (Task Code)' },
    { value: 'title', label: 'Tên Task' },
    { value: 'status', label: 'Trạng thái (Status)' },
  ];

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState((prev) => ({
      ...prev,
      sortField: e.target.value as SortField,
    }));
  };

  const toggleSortOrder = () => {
    setFilterState((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const clearFilters = () => {
    setFilterState((prev) => ({
      ...prev,
      search: '',
      status: 'ALL',
      hasBlocker: 'ALL',
    }));
  };

  const isFilterActive = filterState.search || filterState.status !== 'ALL' || filterState.hasBlocker !== 'ALL';

  return (
    <div className="bg-white border border-slate-200 rounded-t-xl p-4 shadow-sm border-b-0">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Left Side: Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="input-search-tasks"
            type="text"
            value={filterState.search}
            onChange={(e) =>
              setFilterState((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="Tìm kiếm Task ID (EST-988), tên task, sub-task, note..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
          />
          {filterState.search && (
            <button
              onClick={() => setFilterState((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Side: Sort, Filters, Export, Create */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Sort Selection */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-2.5 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:block border-r border-slate-200">
              Sắp xếp:
            </div>
            <select
              id="select-sort-field"
              value={filterState.sortField}
              onChange={handleSortChange}
              className="bg-transparent py-2 pl-3 pr-8 text-sm text-slate-800 font-medium focus:outline-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={toggleSortOrder}
              title={`Thứ tự: ${filterState.sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}`}
              className="px-2.5 py-2 hover:bg-slate-200/60 text-slate-600 transition-colors border-l border-slate-200"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Dropdown Toggle */}
          <div className="relative">
            <button
              id="btn-filter-toggle"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`h-9 px-3 border rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isFilterActive
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
              {isFilterActive && (
                <span className="w-2 h-2 rounded-full bg-blue-600 ml-0.5"></span>
              )}
            </button>

            {/* Filter Dropdown Popover */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-30 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Lọc dữ liệu
                  </span>
                  {isFilterActive && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Đặt lại
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Trạng thái Task
                  </label>
                  <select
                    value={filterState.status}
                    onChange={(e) =>
                      setFilterState((prev) => ({
                        ...prev,
                        status: e.target.value as any,
                      }))
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="TODO">Chưa làm (To Do)</option>
                    <option value="DOING">Đang làm (Doing)</option>
                    <option value="DONE">Hoàn thành (Done)</option>
                    <option value="BLOCKED">Bị chặn (Blocked)</option>
                  </select>
                </div>

                {/* Blocker Filter */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Blocker
                  </label>
                  <select
                    value={String(filterState.hasBlocker)}
                    onChange={(e) =>
                      setFilterState((prev) => ({
                        ...prev,
                        hasBlocker:
                          e.target.value === 'ALL'
                            ? 'ALL'
                            : e.target.value === 'true',
                      }))
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="ALL">Tất cả</option>
                    <option value="true">Chỉ task có Blocker</option>
                    <option value="false">Không có Blocker</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setShowFilterDropdown(false)}
                    className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            id="btn-export-csv"
            onClick={onExportCSV}
            title="Xuất danh sách sang file CSV"
            className="h-9 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Create Task Button */}
          <button
            id="btn-create-task-toolbar"
            onClick={onOpenCreateModal}
            className="h-9 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-900/30 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips bar */}
      {isFilterActive && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Đang lọc:</span>
          {filterState.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Từ khóa: "{filterState.search}"
              <button
                onClick={() => setFilterState((p) => ({ ...p, search: '' }))}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterState.status !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              Trạng thái: {filterState.status}
              <button
                onClick={() => setFilterState((p) => ({ ...p, status: 'ALL' }))}
                className="hover:text-slate-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterState.hasBlocker !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Blocker: {filterState.hasBlocker ? 'Có Blocker' : 'Không có Blocker'}
              <button
                onClick={() => setFilterState((p) => ({ ...p, hasBlocker: 'ALL' }))}
                className="hover:text-rose-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-slate-500 hover:text-slate-800 underline font-medium ml-1"
          >
            Xóa bộ lọc ({totalFilteredCount} kết quả)
          </button>
        </div>
      )}
    </div>
  );
};
