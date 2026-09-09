import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadTasks, saveTasks } from './storage'
import { STORAGE_KEY } from './constants'
import { Task } from '@/types/task'

const validTask: Task = {
  id: '1',
  title: '작업',
  completed: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

const readStored = () => JSON.parse(localStorage.getItem(STORAGE_KEY) as string)

describe('storage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('저장된 데이터가 없으면 빈 배열을 반환한다', () => {
    expect(loadTasks()).toEqual([])
  })

  it('배열이 아닌 데이터가 저장되어 있으면 빈 배열을 반환한다', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ notAnArray: true }))

    expect(loadTasks()).toEqual([])
  })

  it('JSON으로 파싱할 수 없으면 빈 배열을 반환한다', () => {
    localStorage.setItem(STORAGE_KEY, '{{{')

    expect(loadTasks()).toEqual([])
    expect(console.error).toHaveBeenCalled()
  })

  it('유효한 작업을 그대로 불러온다', () => {
    localStorage.setItem('todos_version', '1')
    localStorage.setItem(STORAGE_KEY, JSON.stringify([validTask]))

    expect(loadTasks()).toEqual([validTask])
  })

  it('필수 필드가 빠진 항목은 걸러내고 결과를 다시 저장한다', () => {
    localStorage.setItem('todos_version', '1')
    localStorage.setItem(STORAGE_KEY, JSON.stringify([validTask, { id: '2' }]))

    expect(loadTasks()).toEqual([validTask])
    expect(readStored()).toEqual([validTask])
  })

  it('구 버전 데이터를 마이그레이션해서 불러온다', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ name: '옛 작업', done: true }]))

    const tasks = loadTasks()

    expect(tasks).toHaveLength(1)
    expect(tasks[0]).toMatchObject({ title: '옛 작업', completed: true })
  })

  it('작업 목록을 localStorage에 저장한다', () => {
    saveTasks([validTask])

    expect(readStored()).toEqual([validTask])
  })

  it('저장에 실패해도 예외를 던지지 않는다', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(() => saveTasks([validTask])).not.toThrow()
    expect(console.error).toHaveBeenCalled()
  })
})
