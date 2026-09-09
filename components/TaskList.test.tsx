import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import TaskList from './TaskList'
import { Task } from '@/types/task'

vi.mock('./TaskItem', () => ({
  default: vi.fn(({ task, onToggleComplete, onEdit, onDelete }) => (
    <div data-testid={`task-item-${task.id}`}>
      <span>{task.title}</span>
      <button onClick={() => onToggleComplete(task.id)}>Toggle</button>
      <button onClick={() => onEdit(task.id, 'edited', '2024-12-31')}>Edit</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  )),
}))

describe('TaskList', () => {
  const mockOnToggleComplete = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  const mockTasks: Task[] = [
    {
      id: '1',
      title: '작업 1',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: '작업 2',
      completed: true,
      dueDate: '2024-12-31',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('작업이 없으면 안내 메시지가 표시된다', () => {
    render(
      <TaskList
        tasks={[]}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('작업이 없습니다. 새 작업을 추가해주세요.')).toBeInTheDocument()
  })

  it('작업이 있으면 모든 작업이 표시된다', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByTestId('task-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('task-item-2')).toBeInTheDocument()
    expect(screen.getByText('작업 1')).toBeInTheDocument()
    expect(screen.getByText('작업 2')).toBeInTheDocument()
  })

  it('TaskItem에 올바른 props가 전달된다', async () => {
    const TaskItemModule = await import('./TaskItem')
    const TaskItem = vi.mocked(TaskItemModule.default)
    
    render(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(TaskItem).toHaveBeenCalledWith(
      {
        task: mockTasks[0],
        onToggleComplete: mockOnToggleComplete,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete,
      },
      undefined
    )

    expect(TaskItem).toHaveBeenCalledWith(
      {
        task: mockTasks[1],
        onToggleComplete: mockOnToggleComplete,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete,
      },
      undefined
    )
  })

  it('작업 개수가 바뀌어도 올바르게 표시된다', () => {
    const { rerender } = render(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getAllByTestId(/task-item-/)).toHaveLength(2)

    const newTasks = [
      ...mockTasks,
      {
        id: '3',
        title: '작업 3',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]

    rerender(
      <TaskList
        tasks={newTasks}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getAllByTestId(/task-item-/)).toHaveLength(3)
  })
})