import { useState } from 'react';
import ProjectList from './components/ProjectList.jsx';
import TaskBoard from './components/TaskBoard.jsx';

export default function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  return (
    <div className="layout min-h-screen flex flex-col">
      <header className="topbar flex flex-col gap-1 bg-gray-900 text-white px-4 py-3.5 sm:flex-row sm:items-baseline sm:gap-3 sm:px-6">
        <span className="brand text-lg font-bold tracking-wide">✓ TaskFlow</span>
        <span className="brand-sub text-sm text-gray-400">Project &amp; task manager</span>
      </header>

      <div className="app flex flex-1 flex-col gap-4 p-4 w-full max-w-6xl mx-auto md:flex-row md:gap-6 md:p-6">
        <aside className="sidebar w-full shrink-0 md:w-64">
          <h2 className="sidebar-title text-xs uppercase tracking-widest text-gray-500 mb-3 ml-1">
            Projects
          </h2>
          <ProjectList
            selectedProjectId={selectedProjectId}
            onSelect={setSelectedProjectId}
          />
        </aside>

        <main className="board flex-1 min-w-0">
          {selectedProjectId ? (
            <TaskBoard projectId={selectedProjectId} />
          ) : (
            <div className="empty-state text-gray-500 px-6 py-12 text-center border border-dashed border-gray-300 rounded-xl bg-white">
              <p>Select a project from the left to view its tasks.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
