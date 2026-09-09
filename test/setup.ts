import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '',
}))

const store = new Map<string, string>()

const localStorageMock = {
  getItem: vi.fn((key: string) => (store.has(key) ? store.get(key)! : null)),
  setItem: vi.fn((key: string, value: string) => {
    store.set(key, String(value))
  }),
  removeItem: vi.fn((key: string) => {
    store.delete(key)
  }),
  clear: vi.fn(() => {
    store.clear()
  }),
  key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
  get length() {
    return store.size
  },
}

global.localStorage = localStorageMock as any

beforeEach(() => {
  store.clear()
})
