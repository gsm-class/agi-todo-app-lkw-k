import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodos } from './useTodos'
import * as storage from '@/utils/storage'

// Mock storage module
vi.mock('@/utils/storage', () => ({
  loadTasks: vi.fn(),
  saveTasks: vi.fn(),
}))

describe('useTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset localStorage mock
    vi.mocked(storage.loadTasks).mockReturnValue([])
  })

  it('useEffect 실행 후 isLoading이 false가 된다', async () => {
    const { result } = renderHook(() => useTodos())
    
    expect(result.current.isLoading).toBe(false)
  })

  it('클라이언트에서 데이터를 불러온다', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]
    vi.mocked(storage.loadTasks).mockReturnValue(mockTasks)

    const { result } = renderHook(() => useTodos())

    // Wait for useEffect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.tasks).toEqual(mockTasks)
  })

  it('작업을 추가할 수 있다', async () => {
    const { result } = renderHook(() => useTodos())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    act(() => {
      result.current.addTask('New Task', '2024-12-31')
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0]).toMatchObject({
      title: 'New Task',
      dueDate: '2024-12-31',
      completed: false,
    })
    expect(storage.saveTasks).toHaveBeenCalledWith(result.current.tasks)
  })

  it('작업을 삭제할 수 있다', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Task to delete',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]
    vi.mocked(storage.loadTasks).mockReturnValue(mockTasks)

    const { result } = renderHook(() => useTodos())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    act(() => {
      result.current.deleteTask('1')
    })

    expect(result.current.tasks).toHaveLength(0)
    expect(storage.saveTasks).toHaveBeenCalledWith([])
  })

  it('작업의 완료 상태를 전환할 수 있다', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Task',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]
    vi.mocked(storage.loadTasks).mockReturnValue(mockTasks)

    const { result } = renderHook(() => useTodos())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    act(() => {
      result.current.toggleComplete('1')
    })

    expect(result.current.tasks[0].completed).toBe(true)
  })

  it('작업을 편집할 수 있다', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Old Title',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]
    vi.mocked(storage.loadTasks).mockReturnValue(mockTasks)

    const { result } = renderHook(() => useTodos())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    act(() => {
      result.current.editTask('1', 'New Title', '2024-12-31')
    })

    expect(result.current.tasks[0]).toMatchObject({
      title: 'New Title',
      dueDate: '2024-12-31',
    })
  })

  it('완료된 작업을 필터링할 수 있다', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Completed Task',
        completed: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        title: 'Active Task',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]
    vi.mocked(storage.loadTasks).mockReturnValue(mockTasks)

    const { result } = renderHook(() => useTodos())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.tasks).toHaveLength(2)

    act(() => {
      result.current.setShowCompleted(false)
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('Active Task')
  })
})