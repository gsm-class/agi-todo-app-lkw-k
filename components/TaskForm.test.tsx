import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskForm from './TaskForm'

describe('TaskForm', () => {
  const mockOnAddTask = vi.fn()

  beforeEach(() => {
    mockOnAddTask.mockClear()
  })

  it('작업 이름과 기한 입력 필드가 표시된다', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />)

    expect(screen.getByLabelText('작업 이름')).toBeInTheDocument()
    expect(screen.getByLabelText('기한 (선택)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '작업 추가' })).toBeInTheDocument()
  })

  it('작업 이름을 입력해 제출할 수 있다', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const input = screen.getByLabelText('작업 이름')
    const submitButton = screen.getByRole('button', { name: '작업 추가' })

    await user.type(input, '새 작업')
    await user.click(submitButton)

    expect(mockOnAddTask).toHaveBeenCalledWith('새 작업', undefined)
    expect(input).toHaveValue('')
  })

  it('작업 이름과 기한을 입력해 제출할 수 있다', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const titleInput = screen.getByLabelText('작업 이름')
    const dueDateInput = screen.getByLabelText('기한 (선택)')
    const submitButton = screen.getByRole('button', { name: '작업 추가' })

    await user.type(titleInput, '기한 있는 작업')
    await user.type(dueDateInput, '2024-12-31')
    await user.click(submitButton)

    expect(mockOnAddTask).toHaveBeenCalledWith('기한 있는 작업', '2024-12-31')
    expect(titleInput).toHaveValue('')
    expect(dueDateInput).toHaveValue('')
  })

  it('빈 작업 이름은 제출되지 않는다', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    await user.click(screen.getByRole('button', { name: '작업 추가' }))

    expect(mockOnAddTask).not.toHaveBeenCalled()
  })

  it('공백뿐인 작업 이름은 제출되지 않는다', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    await user.type(screen.getByLabelText('작업 이름'), '   ')
    await user.click(screen.getByRole('button', { name: '작업 추가' }))

    expect(mockOnAddTask).not.toHaveBeenCalled()
  })

  it('IME 변환 중이 아니면 Enter 키로 제출된다', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const input = screen.getByLabelText('작업 이름')
    await user.type(input, 'Enter로 제출')

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', isComposing: false })

    expect(mockOnAddTask).toHaveBeenCalledWith('Enter로 제출', undefined)
  })

  it('IME 변환 중에는 Enter 키로 제출되지 않는다', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const input = screen.getByLabelText('작업 이름')
    await user.type(input, '변환 중인 글자')

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', isComposing: true })

    expect(mockOnAddTask).not.toHaveBeenCalled()
  })

  it('Shift+Enter로는 제출되지 않는다', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const input = screen.getByLabelText('작업 이름')
    await user.type(input, 'Shift+Enter')

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true, isComposing: false })

    expect(mockOnAddTask).not.toHaveBeenCalled()
  })

  it('기한을 설정하면 지우기 버튼이 나타난다', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const dueDateInput = screen.getByLabelText('기한 (선택)')

    expect(screen.queryByRole('button', { name: '지우기' })).not.toBeInTheDocument()

    await user.type(dueDateInput, '2024-12-31')

    expect(screen.getByRole('button', { name: '지우기' })).toBeInTheDocument()
  })

  it('지우기 버튼을 누르면 기한이 비워진다', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const dueDateInput = screen.getByLabelText('기한 (선택)')

    await user.type(dueDateInput, '2024-12-31')
    await user.click(screen.getByRole('button', { name: '지우기' }))

    expect(dueDateInput).toHaveValue('')
    expect(screen.queryByRole('button', { name: '지우기' })).not.toBeInTheDocument()
  })
})
