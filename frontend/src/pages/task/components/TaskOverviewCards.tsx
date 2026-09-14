import React, { useState, useEffect } from 'react';
import { StatCard } from './StatCard';
import { QuickView, StatusFilter, QuickViewTask } from './QuickView';

import { taskService } from '@/services/taskService';

interface OverviewCardsProps {
  tasks?: any[];
  filterState?: any;
  setFilterState?: any;
}

export interface TaskStatsResponse {
  todo_count: string | number;
  in_progress_count: string | number;
  near_release_count: string | number;
  release_count: string | number;
  total: number;
}

export const TaskOverviewCards: React.FC<OverviewCardsProps> = ({ stats } ) => {
  const STATUS_VALUE_MAP: Record<StatusFilter, number | string> = {
    TODO: 1,
    IN_PROGRESS: 2,
    NEAR_RELEASE: 6,
    RELEASE: 7,
    ALL: ''
  };


  /*==== STATES(start) ====*/
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('DOING');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [quickViewTasks, setQuickViewTasks] = useState<QuickViewTask[]>([]);
  const [isQuickViewLoading, setIsQuickViewLoading] = useState(false);
  /*==== STATES(end) ====*/


  /* ===== HANDLE FUNCTION(start) =====*/
  const handleCardClick = (statusFilter: StatusFilter) => {
    setActiveStatus(statusFilter);
    setIsQuickViewOpen(true);
  };

  const fetchQuickViewData = async () => {
    if (!isQuickViewOpen || activeStatus === 'ALL') return;

    setIsQuickViewLoading(true);
    try {
      const status = STATUS_VALUE_MAP[activeStatus];

      // 2. TRUYỀN OBJECT PARAMS VÀO SERVICE
      const response = await taskService.getQuickViewTasks({
        status: status,
      });

      setQuickViewTasks(response.data);
    } catch (error) {
      console.error("Lỗi khi fetch danh sách Quick View:", error);
      setQuickViewTasks([]);
    } finally {
      setIsQuickViewLoading(false);
    }
  };

  useEffect(() => {
    fetchQuickViewData();
  }, [activeStatus, isQuickViewOpen]);

  /* ==== HANDLE FUNCTION(end) ====*/


  return (
      <div className="mb-6">
        {/* OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
              variant="IN_PROGRESS"
              count={stats.in_progress_count}
              isActive={activeStatus === 'IN_PROGRESS'}
              onClick={() => handleCardClick('IN_PROGRESS')}
          />
          <StatCard
              variant="NEAR_RELEASE"
              count={stats.near_release_count}
              isActive={activeStatus === 'NEAR_RELEASE'}
              onClick={() => handleCardClick('NEAR_RELEASE')}

          />
          <StatCard
              variant="TODO"
              count={stats.todo_count}
              isActive={activeStatus === 'TODO'}
              onClick={() => handleCardClick('TODO')}
          />
          <StatCard
              variant="RELEASE"
              count={stats.release_count}
              total={stats.total}
              isActive={activeStatus === 'RELEASE'}
              onClick={() => handleCardClick('RELEASE')}
          />
        </div>

        {/* QUICK VIEW */}
        {isQuickViewOpen && activeStatus !== 'ALL' && (
            <QuickView
                activeStatus={activeStatus}
                tasks={quickViewTasks}
                isLoading={isQuickViewLoading}
                // SỬA LẠI ĐOẠN onClose NÀY:
                onClose={() => {
                  setIsQuickViewOpen(false);
                }}
                onViewAll={() => {
                  setIsQuickViewOpen(false);
                  setActiveStatus('ALL');
                }}
            />
        )}
      </div>
  );
};