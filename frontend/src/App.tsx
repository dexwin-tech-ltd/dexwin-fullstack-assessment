import { useState } from 'react';
import ProjectList from './components/ProjectList';
import TaskBoard from './components/TaskBoard';
import {login} from "./api/client.ts"

export default function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [userId, setUserId] = useState(null)


  async function handleSubmit(){
    const loginMessage = await login(username, password);
    console.log(loginMessage)
    setUserId(loginMessage.userId)
  }


  if(userId){

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
            <TaskBoard projectId={selectedProjectId} />
          ) : (
            <div className="empty-state">
              <p>Select a project from the left to view its tasks.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );}

  return (
    <>
    {/* <form method="POST" onSubmit={handleSubmit} > */}
    <h2>Login</h2>
    <input name="username" placeholder="username" value={username} onChange={(e)=>{setUsername(e.target.value)}} required />
    <input name="password" placeholder="password" type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} required />
    <button type="submit" onClick={handleSubmit}>submit</button>
    {/* </form> */}
    </>
  )
}
