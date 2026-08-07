import { useState } from 'react';
import ProjectList from './components/ProjectList';
import TaskBoard from './components/TaskBoard';

export default function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="layout">
      <header className="topbar">
        <span className="brand">✓ TaskFlow</span>
        <span className="brand-sub">Project &amp; task manager</span>
      </header>

      <div className="app">
        <aside className="sidebar">
          <h2 className="sidebar-title">Projects</h2>
          <ProjectList
            selectedProjectId={selectedProjectId}
            onSelect={setSelectedProjectId}
          />
        </aside>

        <main className="board">
          {selectedProjectId ? (
            <TaskBoard projectId={selectedProjectId} onSelect={setSelectedTask} />
          ) : (
            <div className="empty-state">
              <p>Select a project from the left to view its tasks.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
