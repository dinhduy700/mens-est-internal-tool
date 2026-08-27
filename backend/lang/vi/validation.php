<?php

return [
	/*
	|--------------------------------------------------------------------------
	| Các thông báo lỗi dùng chung cho mọi rule
	|--------------------------------------------------------------------------
	*/
	'required'    => ':attribute không được để trống.',
	'url'         => ':attribute không hợp lệ.',
	'enum'        => ':attribute không hợp lệ.',
	'date_format' => ':attribute phải theo định dạng :format.',

	/*
	|--------------------------------------------------------------------------
	| Tùy biến thông báo lỗi cho TỪNG TRƯỜNG CỤ THỂ (Nếu cần)
	|--------------------------------------------------------------------------
	| Dùng khi bạn muốn một trường nào đó có câu thông báo đặc biệt hơn bình thường
	*/
	'custom' => [
		'planned_dev_up' => [
			'date_format' => 'Ngày planned_dev_up phải theo định dạng YYYY-MM-DD (VD: 2026-08-27).',
		],
		// Bạn có thể thêm custom cho các trường ngày tháng khác ở đây
	],

	/*
	|--------------------------------------------------------------------------
	| Định nghĩa tên hiển thị của các trường (Attributes)
	|--------------------------------------------------------------------------
	| Laravel sẽ lấy các từ này thế vào biến :attribute ở trên
	*/
	'attributes' => [
		'title'          => 'Tiêu đề task',
		'redmine_url'    => 'Đường dẫn Redmine',
		'status'         => 'Trạng thái task',
		'blocker'        => 'Blocker',
		'planned_dev_up' => 'Ngày dự kiến code xong',
		'actual_dev_up'  => 'Ngày thực tế code xong',
	],
];