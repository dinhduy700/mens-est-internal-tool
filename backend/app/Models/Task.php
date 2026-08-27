<?php

namespace App\Models;

class Task
{
	protected $table = 'tasks';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'redmine_url',
		'description',
		'status',
		'planned_dev_up',
		'actual_dev_up',
		'planned_start',
		'actual_start',
		'actual_end',
		'release_date',
		'blocker',
		'note'
    ];
}
