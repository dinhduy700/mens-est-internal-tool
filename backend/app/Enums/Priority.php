<?php

namespace App\Enums;

enum Priority: int
{
	case LOW = 1;
	case HIGH = 2;
	case URGENT = 3;
}