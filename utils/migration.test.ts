import { describe, it, expect } from 'vitest'
import { migrateData } from './migration'

describe('migrateData', () => {
  it('구 버전 필드명을 현재 스키마로 변환한다', () => {
    const result = migrateData([{ name: '옛 작업', done: true, deadline: '2024-12-31' }])

    expect(result[0]).toMatchObject({
      title: '옛 작업',
      completed: true,
      dueDate: '2024-12-31',
    })
    expect(result[0].id).toBeTruthy()
    expect(result[0].createdAt).toBeTruthy()
    expect(result[0].updatedAt).toBeTruthy()
  })

  it('제목이 없으면 기본 제목을 넣는다', () => {
    const result = migrateData([{}])

    expect(result[0].title).toBe('제목 없는 작업')
    expect(result[0].completed).toBe(false)
    expect(result[0].dueDate).toBeUndefined()
  })

  it('마이그레이션 후 현재 버전을 기록한다', () => {
    migrateData([])

    expect(localStorage.getItem('todos_version')).toBe('1')
  })

  it('이미 최신 버전이면 데이터를 변환하지 않는다', () => {
    localStorage.setItem('todos_version', '1')
    const data = [{ id: 'x' }]

    expect(migrateData(data)).toBe(data)
  })
})
