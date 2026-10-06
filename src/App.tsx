import { useEffect, useMemo, useState } from 'react'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'
import type { Filter, Todo } from './types'

const STORAGE_KEY = 'todos'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (text: string) =>
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, completed: false }])

  const toggleTodo = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))

  const deleteTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id))

  const editTodo = (id: string, text: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)))

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed)
      case 'completed':
        return todos.filter((t) => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const remaining = todos.filter((t) => !t.completed).length

  return (
    <main className="todo-app">
      <h1>Todos</h1>
      <TodoForm onAdd={addTodo} />

      {todos.length > 0 && (
        <>
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
          {visibleTodos.length === 0 && <p className="empty">Nothing here.</p>}

          <div className="todo-footer">
            <span>{remaining} item{remaining === 1 ? '' : 's'} left</span>
            <div className="filters">
              {(['all', 'active', 'completed'] as Filter[]).map((f) => (
                <button
                  key={f}
                  className={filter === f ? 'active' : ''}
                  onClick={() => setFilter(f)}
                >
                  {f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {todos.some((t) => t.completed) && (
              <button className="clear" onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}>
                Clear completed
              </button>
            )}
          </div>
        </>
      )}
    </main>
  )
}
