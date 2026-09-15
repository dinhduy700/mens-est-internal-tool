import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  X,
  ArrowDown, ArrowUp
} from 'lucide-react';
import { FilterState, SortField } from '@/types.ts';
import { BlockerOptions, Blocker as BlockerEnum } from '@/constants/blocker.ts';
import { TASK_STATUS_OPTIONS } from "@/constants/taskStatus.ts";
interface ToolbarProps {
  onCreateTask: () => void;
}

export const TaskToolbar: React.FC<ToolbarProps> = ({ onCreateTask, sortField, sortDir, onSortChange }) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy từ khóa 'search_query' từ URL hiện tại nếu có
  const currentSearch = searchParams.get('search_query') || '';
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  // Ref để đánh dấu vừa bấm nút Clear Filters
  const isClearingRef = useRef(false);

  // Debounce input: Cập nhật URL sau khi dừng gõ 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (isClearingRef.current) {
        isClearingRef.current = false;
        return;
      }
      const params = new URLSearchParams(searchParams);

      if (searchTerm.trim()) {
        params.set('search_query', searchTerm.trim());
      } else {
        params.delete('search_query'); // Nếu ô tìm kiếm trống thì xóa param 's'
      }

      // Khi tìm kiếm từ khóa mới -> Luôn reset về page 1
      params.set('page', '1');

      setSearchParams(params);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Blocker
  const handleBlockerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value === BlockerEnum.ALL) {
      params.delete('blocker'); // Nếu chọn 'ALL' -> Xóa khỏi URL
    } else {
      params.set('blocker', value); // Set '0' hoặc '1'
    }

    // Đổi bộ lọc -> Reset về trang 1
    params.set('page', '1');

    setSearchParams(params);
  };

  // Hàm xử lý riêng cho Status filter
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value === 'All') {
      params.delete('status');
    } else {
      params.set('status', value);
    }

    // Đổi bộ lọc -> Reset về trang 1
    params.set('page', '1');

    setSearchParams(params);
  };

  const sortOptions: { value: SortField; label: string }[] = [
    { value: 'created_at', label: 'Ngày tạo' },
    { value: 'release_date', label: 'Ngày release' },
    { value: 'id', label: 'ID Task' },
    { value: 'title', label: 'Tên công việc' }
  ]

  const clearFilters = () => {
    // Bật cờ đánh dấu đang Clear
    isClearingRef.current = true;

    // Reset local state ô search
    setSearchTerm('');

    // Tạo params mới tinh (Xóa toàn bộ query string)
    const params = new URLSearchParams();
    params.set('page', '1');

    // Cập nhật thẳng lên URL ngay lập tức
    setSearchParams(params);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-t-xl p-4 shadow-sm border-b-0">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">

        {/* Left Side: Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="input-search-tasks"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm Task ID (EST-988), tên task, sub-task, note..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
          />
          {searchTerm && (
            <button
                onClick={() => setSearchTerm('')}
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
                value={sortField} // Lấy value từ props thay vì hardcode 123
                onChange={(e) => onSortChange(e.target.value, sortDir)} // Giữ nguyên chiều, chỉ đổi field
                className="bg-transparent py-2 pl-3 pr-8 text-sm text-slate-800 font-medium focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
              ))}
            </select>
            <button
                onClick={() => onSortChange(sortField, sortDir === 'asc' ? 'desc' : 'asc')} // Đảo chiều asc <-> desc
                title={`Thứ tự: ${sortDir === 'asc' ? 'Tăng dần' : 'Giảm dần'}`}
                className="px-2.5 py-2 hover:bg-slate-200/60 text-slate-600 transition-colors border-l border-slate-200 flex items-center justify-center w-9"
            >
              {/* Đổi icon trực quan theo chiều */}
              {sortDir === 'asc' ? <ArrowUp className="w-4 h-4 text-blue-600" /> : <ArrowDown className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

          {/* Filter Dropdown Toggle */}
          <div className="relative d-flex">
            <button
              id="btn-filter-toggle"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`h-9 px-3 border rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
              { showFilterDropdown && (
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
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Đặt lại
                  </button>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Trạng thái Task
                  </label>
                  <select
                    value={searchParams.get('status') ?? 'All'}
                    onChange={handleStatusChange}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option key='All' value='All'> Tất cả </option>
                    {TASK_STATUS_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                    ))}
                  </select>
                </div>

                {/* Blocker Filter */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Blocker
                  </label>
                  <select
                    value={searchParams.get('blocker') ?? BlockerEnum.ALL}
                    onChange={handleBlockerChange}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    {BlockerOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                    ))}
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

          {/* Create Task Button */}
          <button
            id="btn-create-task-toolbar"
            onClick={ onCreateTask }
            className="h-9 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-900/30 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo Task</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips bar */}
      {/*{isFilterActive && (*/}
      {/*  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap text-xs">*/}
      {/*    <span className="text-slate-400 font-medium">Đang lọc:</span>*/}
      {/*    {filterState.search && (*/}
      {/*      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">*/}
      {/*        Từ khóa: "{filterState.search}"*/}
      {/*        <button*/}
      {/*          onClick={() => setFilterState((p) => ({ ...p, search: '' }))}*/}
      {/*          className="hover:text-blue-900"*/}
      {/*        >*/}
      {/*          <X className="w-3 h-3" />*/}
      {/*        </button>*/}
      {/*      </span>*/}
      {/*    )}*/}
      {/*    {filterState.status !== 'ALL' && (*/}
      {/*      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">*/}
      {/*        Trạng thái: {filterState.status}*/}
      {/*        <button*/}
      {/*          onClick={() => setFilterState((p) => ({ ...p, status: 'ALL' }))}*/}
      {/*          className="hover:text-slate-900"*/}
      {/*        >*/}
      {/*          <X className="w-3 h-3" />*/}
      {/*        </button>*/}
      {/*      </span>*/}
      {/*    )}*/}
      {/*    {filterState.hasBlocker !== 'ALL' && (*/}
      {/*      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">*/}
      {/*        Blocker: {filterState.hasBlocker ? 'Có Blocker' : 'Không có Blocker'}*/}
      {/*        <button*/}
      {/*          onClick={() => setFilterState((p) => ({ ...p, hasBlocker: 'ALL' }))}*/}
      {/*          className="hover:text-rose-900"*/}
      {/*        >*/}
      {/*          <X className="w-3 h-3" />*/}
      {/*        </button>*/}
      {/*      </span>*/}
      {/*    )}*/}
      {/*    <button*/}
      {/*      onClick={clearFilters}*/}
      {/*      className="text-slate-500 hover:text-slate-800 underline font-medium ml-1"*/}
      {/*    >*/}
      {/*      Xóa bộ lọc ({totalFilteredCount} kết quả)*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};
