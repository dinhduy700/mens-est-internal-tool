import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskPaginationProps {
  totalItems: number;
  itemsPerPage?: number;
}

export const TaskPagination: React.FC<TaskPaginationProps> = ({
                                                                totalItems,
                                                                itemsPerPage,
                                                              }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Đọc trang hiện tại từ URL (mặc định là 1)
  const currentPage = Number(searchParams.get('page')) || 1;

  // 2. Tính toán số trang
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // 3. Hàm chuyển trang và cập nhật URL
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  const fromItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const toItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 px-2 pb-12">
        {/* Thông tin số lượng hiển thị */}
        <div>
          Hiển thị{' '}
          <span className="font-semibold text-slate-800">{fromItem}</span> đến{' '}
          <span className="font-semibold text-slate-800">{toItem}</span> trong tổng số{' '}
          <span className="font-semibold text-slate-800">{totalItems}</span> tasks
        </div>

        {/* Cụm nút chuyển trang */}
        <div className="flex items-center gap-1.5">
          <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {pageNum}
              </button>
          ))}

          <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
  );
};