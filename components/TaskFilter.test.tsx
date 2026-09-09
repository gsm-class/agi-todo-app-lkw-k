import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskFilter from './TaskFilter'

describe('TaskFilter', () => {
  const mockOnToggleShowCompleted = vi.fn()

  beforeEach(() => {
    mockOnToggleShowCompleted.mockClear()
  })

  it('체크박스와 라벨이 표시된다', () => {
    render(
      <TaskFilter
        showCompleted={true}
        onToggleShowCompleted={mockOnToggleShowCompleted}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    const label = screen.getByText('완료된 작업 표시')

    expect(checkbox).toBeInTheDocument()
    expect(label).toBeInTheDocument()
  })

  it('showCompleted가 true면 체크박스가 체크되어 있다', () => {
    render(
      <TaskFilter
        showCompleted={true}
        onToggleShowCompleted={mockOnToggleShowCompleted}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('showCompleted가 false면 체크박스가 체크되어 있지 않다', () => {
    render(
      <TaskFilter
        showCompleted={false}
        onToggleShowCompleted={mockOnToggleShowCompleted}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('체크박스를 클릭하면 콜백이 호출된다', async () => {
    const user = userEvent.setup()
    render(
      <TaskFilter
        showCompleted={false}
        onToggleShowCompleted={mockOnToggleShowCompleted}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(mockOnToggleShowCompleted).toHaveBeenCalledWith(true)
    expect(mockOnToggleShowCompleted).toHaveBeenCalledTimes(1)
  })

  it('체크된 체크박스를 클릭하면 false로 호출된다', async () => {
    const user = userEvent.setup()
    render(
      <TaskFilter
        showCompleted={true}
        onToggleShowCompleted={mockOnToggleShowCompleted}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(mockOnToggleShowCompleted).toHaveBeenCalledWith(false)
    expect(mockOnToggleShowCompleted).toHaveBeenCalledTimes(1)
  })

  it('라벨을 클릭해도 체크박스가 전환된다', async () => {
    const user = userEvent.setup()
    render(
      <TaskFilter
        showCompleted={false}
        onToggleShowCompleted={mockOnToggleShowCompleted}
      />
    )

    const label = screen.getByText('완료된 작업 표시')
    await user.click(label)

    expect(mockOnToggleShowCompleted).toHaveBeenCalledWith(true)
  })

  it('여러 번 클릭해도 올바르게 동작한다', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <TaskFilter
        showCompleted={false}
        onToggleShowCompleted={mockOnToggleShowCompleted}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    
    await user.click(checkbox)
    expect(mockOnToggleShowCompleted).toHaveBeenLastCalledWith(true)

    rerender(
      <TaskFilter
        showCompleted={true}
        onToggleShowCompleted={mockOnToggleShowCompleted}
      />
    )

    await user.click(checkbox)
    expect(mockOnToggleShowCompleted).toHaveBeenLastCalledWith(false)

    expect(mockOnToggleShowCompleted).toHaveBeenCalledTimes(2)
  })
})