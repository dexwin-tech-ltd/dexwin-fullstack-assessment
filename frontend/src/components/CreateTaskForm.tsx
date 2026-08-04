import { useState } from 'react';
import { createTask } from '../api/client';

export default function CreateTaskForm({ projectId, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('2');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!projectId || !title.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await createTask(projectId, {
        title: title.trim(),
        description: description.trim(),
        priority: Number(priority),
        status: 'TODO',
      });
      onCreated(created);
      setTitle('');
      setDescription('');
      setPriority('2');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <h3>Create task</h3>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
        required
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Task description"
        rows={3}
      />
      <select value={priority} onChange={(event) => setPriority(event.target.value)}>
        <option value="1">High</option>
        <option value="2">Medium</option>
        <option value="3">Low</option>
      </select>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create task'}
      </button>
    </form>
  );
}
