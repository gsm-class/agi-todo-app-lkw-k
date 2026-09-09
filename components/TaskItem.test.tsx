import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskItem from './TaskItem'
import { Task } from '@/types/task'

const toLocalDateString = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

describe('TaskItem', () => {
  const mockOnToggleComplete = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  const mockTask: Task = {
    id: '1',
    title: '테스트 작업',
    completed: false,
    dueDate: '2024-12-31',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('작업 정보가 올바르게 표시된다', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('테스트 작업')).toBeInTheDocument()
    expect(screen.getByText('기한: 2024. 12. 31.')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('완료된 작업은 취소선과 그레이아웃으로 표시된다', () => {
    const completedTask = { ...mockTask, completed: true }
    render(
      <TaskItem
        task={completedTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('테스트 작업')).toHaveClass('line-through', 'opacity-50')
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('기한이 지난 작업은 빨간색으로 표시된다', () => {
    const overdueTask = { ...mockTask, dueDate: '2020-01-01' }
    render(
      <TaskItem
        task={overdueTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText(/기한:/)).toHaveClass('text-red-500')
  })

  it('오늘이 기한인 작업은 주황색으로 표시된다', () => {
    const todayTask = { ...mockTask, dueDate: toLocalDateString(new Date()) }
    render(
      <TaskItem
        task={todayTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText(/기한:/)).toHaveClass('text-orange-500')
  })

  it('기한이 남은 작업은 기본 색상으로 표시된다', () => {
    const future = new Date()
    future.setDate(future.getDate() + 7)
    const futureTask = { ...mockTask, dueDate: toLocalDateString(future) }
    render(
      <TaskItem
        task={futureTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText(/기한:/)).toHaveClass('text-gray-500')
  })

  it('기한이 없는 작업은 기한이 표시되지 않는다', () => {
    const noDueDateTask = { ...mockTask, dueDate: undefined }
    render(
      <TaskItem
        task={noDueDateTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.queryByText(/기한:/)).not.toBeInTheDocument()
  })

  it('체크박스를 클릭하면 완료 상태가 전환된다', async () => {
    const user = userEvent.setup()
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    await user.click(screen.getByRole('checkbox'))

    expect(mockOnToggleComplete).toHaveBeenCalledWith('1')
  })

  it('편집 버튼을 클릭하면 편집 모드가 된다', async () => {
    const user = userEvent.setup()
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    await user.click(screen.getByRole('button', { name: '편집' }))

    expect(screen.getByDisplayValue('테스트 작업')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: '편집' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '삭제' })).not.toBeInTheDocument()
  })

  it('편집 모드에서 저장하면 갱신된다', async () => {
    const user = userEvent.setup()
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    await user.click(screen.getByRole('button', { name: '편집' }))

    const titleInput = screen.getByDisplayValue('테스트 작업')
    const dueDateInput = screen.getByDisplayValue('2024-12-31')

    await user.clear(titleInput)
    await user.type(titleInput, '수정된 작업')
    await user.clear(dueDateInput)
    await user.type(dueDateInput, '2025-01-01')

    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(mockOnEdit).toHaveBeenCalledWith('1', '수정된 작업', '2025-01-01')
  })

  it('편집 모드에서 제목이 비면 저장되지 않는다', async () => {
    const user = userEvent.setup()
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    await user.click(screen.getByRole('button', { name: '편집' }))
    await user.clear(screen.getByDisplayValue('테스트 작업'))
    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(mockOnEdit).not.toHaveBeenCalled()
  })

  it('편집 모드에서 취소하면 원래 값으로 돌아간다', async () => {
    const user = userEvent.setup()
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    await user.click(screen.getByRole('button', { name: '편집' }))

    const titleInput = screen.getByDisplayValue('테스트 작업')
    await user.clear(titleInput)
    await user.type(titleInput, '바꾼 작업')

    await user.click(screen.getByRole('button', { name: '취소' }))

    expect(screen.getByText('테스트 작업')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('바꾼 작업')).not.toBeInTheDocument()
    expect(mockOnEdit).not.toHaveBeenCalled()
  })

  it('삭제 확인 대화상자에서 확인을 누르면 삭제된다', async () => {
    const user = userEvent.setup()
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    await user.click(screen.getByRole('button', { name: '삭제' }))

    expect(window.confirm).toHaveBeenCalledWith('이 작업을 삭제하시겠습니까?')
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('삭제 확인 대화상자에서 취소를 누르면 삭제되지 않는다', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    const user = userEvent.setup()
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    await user.click(screen.getByRole('button', { name: '삭제' }))

    expect(window.confirm).toHaveBeenCalledWith('이 작업을 삭제하시겠습니까?')
    expect(mockOnDelete).not.toHaveBeenCalled()
  })
})
