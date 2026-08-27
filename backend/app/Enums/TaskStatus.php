<?php

namespace App\Enums;

enum TaskStatus: int
{
	case NEW = 1;
	case IN_PROGRESS = 2;
	case IN_REVIEW = 3;
	case NEED_FIX = 4;
	case REVIEW_DONE = 5;
	case DEV_UP = 6;
	case RELEASE = 7;

	public function label(): string
	{
		return match ($this) {
			self::NEW => 'New',
			self::IN_PROGRESS => 'In Progress',
			self::IN_REVIEW => 'In Review',
			self::NEED_FIX => 'Need Fix',
			self::REVIEW_DONE => 'Review Done',
			self::DEV_UP => 'DevUp',
			self::RELEASE => 'Release',
		};
	}
}