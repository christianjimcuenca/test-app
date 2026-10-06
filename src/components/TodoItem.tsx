import { useState } from 'react'
import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed) onEdit(todo.id, trimmed)
    else setDraft(todo.text)
    setEditing(false)
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'active' : 'completed'}`}
      />
      {editing ? (
        <input
          className="edit-input"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') {
              setDraft(todo.text)
              setEditing(false)
            }
          }}
        />
      ) : (
        <span className="todo-text" onDoubleClick={() => setEditing(true)}>
          {todo.text}
        </span>
      )}
      <button className="delete-btn" onClick={() => onDelete(todo.id)} aria-label="Delete todo">
        ×
      </button>
    </li>
  )
}
