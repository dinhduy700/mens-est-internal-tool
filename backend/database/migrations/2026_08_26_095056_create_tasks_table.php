<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('tasks', function (Blueprint $table) {
			$table->id();

			// Task information
			$table->string('title');
			$table->text('redmine_url')->nullable();
			$table->text('description')->nullable();

			// Task status
			$table->tinyInteger('status')->default(1);
			$table->tinyInteger('priority')->default(1);

			// Development schedule
			$table->date('planned_dev_up')->nullable();
			$table->date('actual_dev_up')->nullable();

			// Development timeline
			$table->date('planned_start')->nullable();
			$table->date('actual_start')->nullable();
			$table->date('actual_end')->nullable();

			// Release
			$table->date('release_date')->nullable();

			// Business create date
			$table->date('created_date')->nullable();

			// Blocker / note
			$table->boolean('blocker')->default(false);
			$table->text('note')->nullable();

			$table->timestamps();

			$table->index('status');
			$table->index('planned_dev_up');
			$table->index('actual_dev_up');
			$table->index('release_date');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('tasks');
	}
};