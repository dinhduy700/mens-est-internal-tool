import Swal from 'sweetalert2';

interface ConfirmDeleteOptions {
  title?: string;
  itemCode?: string | number;
  message?: string;
}

export const confirmDeleteSwal = async ({
                                          title = 'Cảnh Báo Nguy Hiểm',
                                          itemCode,
                                          message = 'Dữ liệu đã xóa không thể phục hồi lại!',
                                        }: ConfirmDeleteOptions) => {
  return Swal.fire({
    title: `<span class="text-rose-600 font-bold text-xl uppercase tracking-wider flex items-center justify-center gap-2">⚠️ ${title}</span>`,
    html: `
      <div class="text-slate-600 text-sm mt-2">
        Hành động này sẽ <b class="text-rose-600 underline">xóa vĩnh viễn</b> Subtask 
        ${
        itemCode
            ? `<span class="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 font-mono font-bold rounded border border-slate-300 ml-1">#${itemCode}</span>`
            : ''
    }
      </div>
      <p class="text-xs text-rose-500 font-semibold mt-3 italic bg-rose-50 p-2.5 rounded-lg border border-rose-200">
        ${message}
      </p>
    `,
    icon: 'warning',
    iconColor: '#e11d48',
    showCancelButton: true,
    confirmButtonText: '🗑️ Có, Xóa Vĩnh Viễn',
    cancelButtonText: 'Hủy Bỏ',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: 'border-2 border-rose-500/30 rounded-2xl shadow-2xl p-6 bg-white',
      title: 'm-0 p-0',
      confirmButton:
          'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg shadow-md shadow-rose-900/20 transition-all cursor-pointer border-0 ml-2',
      cancelButton:
          'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer border border-slate-300 mr-2',
    },
  });
};