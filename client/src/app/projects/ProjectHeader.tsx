import Header from '@/components/Header';
import { Clock, Filter, GitBranch, Grid3X3, List, PlusSquare, Share2, Table } from 'lucide-react';
import React, { useState } from 'react';
import ModalNewProject from './ModalNewProject';

type Props = {
    activeTab: string;
    setActiveTab: (tabName: string) => void;
    projectName: string;
    // --- NEW: Add description and version props ---
    description: string | undefined;
    version: number | undefined;
}

const ProjectHeader = ({ activeTab, setActiveTab, projectName, description, version }: Props) => {
    const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  
    return (
        <div className='px-4 xl:px-6'>
            <ModalNewProject
                isOpen={isModalNewProjectOpen}
                onClose={() => setIsModalNewProjectOpen(false)}
            />
            <div className='pb-6 pt-6 lg:pb-4 lg:pt-8'>
                <Header name={projectName}
                    buttonComponent={
                        <button
                            className='flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'
                            onClick={() => setIsModalNewProjectOpen(true)}
                        >
                            <PlusSquare className='mr-2 size-5' /> New Board
                        </button>
                    }
                />
                {/* --- NEW: Display project description and version --- */}
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <p className='max-w-2xl'>{description || "No description available."}</p>
                    {version && (
                        <div className="flex items-center gap-2">
                            <GitBranch className="h-4 w-4" />
                            <span>Version {version}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* TABS */}
            <div className='flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center'>
                <div className='flex flex-1 items-center gap-2 md:gap-4'>
                    <TabButton name="Board" icon={<Grid3X3 className='size-5' />} setActiveTab={setActiveTab} activeTab={activeTab} />
                    <TabButton name="List" icon={<List className='size-5' />} setActiveTab={setActiveTab} activeTab={activeTab} />
                    <TabButton name="Timeline" icon={<Clock className='size-5' />} setActiveTab={setActiveTab} activeTab={activeTab} />
                    <TabButton name="Table" icon={<Table className='size-5' />} setActiveTab={setActiveTab} activeTab={activeTab} />
                </div>
                <div className='flex items-center gap-2'>
                    <button className='text-gray-500 hover:text-gray-600 dark:text-neutral-500 dar:hover:text-gray-300'>
                        <Filter className='size-5' />
                    </button>
                    <button className='text-gray-500 hover:text-gray-600 dark:text-neutral-500 dar:hover:text-gray-300'>
                        <Share2 className='size-5' />
                    </button>
                    <div className='relative'>
                        <input type='text' placeholder='Search Task' className='rounded-md border py-1 pl-10 pr-4 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white' />
                        <Grid3X3 className='absolute left-3 top-2 h-4 w-4 text-gray-400 dark:text-neutral-500' />
                    </div>
                </div>
            </div>
        </div>
    );
}

type TabButtonProps = {
    name: string;
    icon: React.ReactNode;
    setActiveTab: (tabName: string) => void;
    activeTab: string;
}

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
    const isActive = activeTab === name;

    return (
        <button
            className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4 ${
                isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""
            }`}
            onClick={() => setActiveTab(name)}
        >
            {icon}
            {name}
        </button>
    );
}

export default ProjectHeader;