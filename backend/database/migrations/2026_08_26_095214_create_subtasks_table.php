<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('subtasks', function (Blueprint $table) {
			$table->id();

			$table->foreignId('task_id')
				->constrained('tasks')
				->cascadeOnDelete();

			$table->string('title');

			$table->string('status')->default('todo');

			$table->text('note')->nullable();

			$table->timestamps();

			$table->index('status');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('subtasks');
	}
};