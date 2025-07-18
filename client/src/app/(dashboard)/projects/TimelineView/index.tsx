"use client";

import { useAppSelector } from '@/app/redux';
import { DisplayOption, Gantt, Task as GanttTask, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import ModalEditTask from '@/components/ModalEditTask';
import { Task as TaskType } from '@/state/api'; // Renamed to avoid conflict with Gantt's Task type

type Props = {
    tasks: TaskType[]; // --- UPDATED: Receive tasks as a prop ---
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
    searchTerm: string;
}

type TaskTypeItems = "task" | "milestone" | "project";

const TimelineView = ({ tasks, setIsModalNewTaskOpen, searchTerm }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  
  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US"
  });
  
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // The component no longer fetches its own data. It just filters and maps the props.
  const ganttTasks = useMemo(() => {
    if (!tasks) return [];
    
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const filtered = searchTerm
      ? tasks.filter(task => 
            task.title.toLowerCase().includes(lowercasedSearchTerm) ||
            (task.description && task.description.toLowerCase().includes(lowercasedSearchTerm)) ||
            (task.tags && task.tags.toLowerCase().includes(lowercasedSearchTerm)) ||
            (task.priority && task.priority.toLowerCase().includes(lowercasedSearchTerm))
        )
      : tasks;

    return (
      filtered.map((task) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `${task.id}`,
        type: "task" as TaskTypeItems,
        progress: task.status === 'Completed' ? 100 : (task.points ? (task.points / 10) * 100 : 50), // Example progress logic
        isDisabled: false
      })) || []
    )
  }, [tasks, searchTerm]);

  const handleTaskClick = (task: GanttTask) => {
    setSelectedTaskId(Number(task.id));
  };

  const handleCloseModal = () => {
    setSelectedTaskId(null);
  };

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  return (
    <div className='px-4 xl:px-6 py-6'>
      {selectedTaskId && (
        <ModalEditTask taskId={selectedTaskId} onClose={handleCloseModal} />
      )}
      <div className='flex flex-wrap items-center justify-between gap-2 mb-4'>
        <h1 className='me-2 text-lg font-bold dark:text-white'>
          Project Tasks Timeline
        </h1>
        <div className='relative inline-block w-64'>
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className='timeline'>
          {ganttTasks.length > 0 ? (
            <Gantt
                tasks={ganttTasks}
                {...displayOptions}
                onClick={handleTaskClick}
                columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                listCellWidth="100px"
                projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
                projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6">
                <h1 className="font-bold text-gray-500 dark:text-white">
                    {searchTerm ? 'No tasks match your search.' : 'No tasks to display in the timeline.'}
                </h1>
            </div>
          )}
        </div>
        <div className="px-4 pb-5 pt-3">
          <button
            className="flex items-center gap-2 rounded-md bg-[#0275ff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimelineView;