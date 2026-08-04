import { useState } from 'react';
import { createProject } from '../api/client';

export default function CreateProjectForm({ onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await createProject({
        name: name.trim(),
        description: description.trim(),
      });
      onCreated(created);
      setName('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <h3>Create project</h3>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Project name"
        required
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Project description"
        rows={3}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create project'}
      </button>
    </form>
  );
}
