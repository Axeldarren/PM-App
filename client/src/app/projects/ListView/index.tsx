"use client";

import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { Task, useGetTasksQuery } from '@/state/api';
import React, { useState } from 'react';
import { Plus } from 'lucide-react'; 

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const ListView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const { 
    data: tasks, 
    error, 
    isLoading 
  } = useGetTasksQuery({ projectId: Number(id) });
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleMenuToggle = (taskId: number) => {
    setOpenMenuId(openMenuId === taskId ? null : taskId);
  };
  
  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading Tasks...</div>;
  if (error) return <div className="p-6 text-center text-red-500">An error occurred while fetching tasks.</div>;

    return (
        <div className='px-4 pb-8 xl:px-6'>
            <div className='pt-5'>
                <Header 
                    name='List'
                    buttonComponent={
                        <button
                            className="flex items-center gap-2 rounded-md bg-[#0275ff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => setIsModalNewTaskOpen(true)}
                        >
                            <Plus size={18} />
                            Add Task
                        </button>
                    }
                />
            </div>

            <div className='mt-4 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6'>
                {tasks?.map((task: Task) => (
                    <TaskCard 
                        key={task.id} 
                        task={task}
                        openMenuId={openMenuId}
                        onMenuToggle={handleMenuToggle}
                    />
                ))}
            </div>
        </div>
    );
}

export default ListView;