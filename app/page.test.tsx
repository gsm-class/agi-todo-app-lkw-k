import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './page'
import { STORAGE_KEY } from '@/utils/constants'

const addTask = async (user: ReturnType<typeof userEvent.setup>, title: string) => {
  await user.type(screen.getByLabelText('작업 이름'), title)
  await user.click(screen.getByRole('button', { name: '작업 추가' }))
}

describe('Home', () => {
  it('작업이 없으면 안내 메시지를 보여준다', async () => {
    render(<Home />)

    expect(await screen.findByText('작업이 없습니다. 새 작업을 추가해주세요.')).toBeInTheDocument()
  })

  it('저장된 작업을 불러와 표시한다', async () => {
    localStorage.setItem('todos_version', '1')
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: '1',
          title: '저장된 작업',
          completed: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ])
    )

    render(<Home />)

    expect(await screen.findByText('저장된 작업')).toBeInTheDocument()
  })

  it('작업을 추가하면 목록과 localStorage에 반영된다', async () => {
    const user = userEvent.setup()
    render(<Home />)

    await addTask(user, '장보기')

    expect(await screen.findByText('장보기')).toBeInTheDocument()
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) as string)).toHaveLength(1)
    })
  })

  it('완료된 작업 표시를 끄면 목록에서 숨겨진다', async () => {
    const user = userEvent.setup()
    render(<Home />)

    await addTask(user, '완료할 작업')
    await screen.findByText('완료할 작업')

    await user.click(screen.getByRole('checkbox', { checked: false }))
    await user.click(screen.getByLabelText('완료된 작업 표시'))

    await waitFor(() => {
      expect(screen.queryByText('완료할 작업')).not.toBeInTheDocument()
    })
  })
})
