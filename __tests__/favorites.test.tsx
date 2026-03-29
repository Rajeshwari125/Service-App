import { renderHook, act } from '@testing-library/react'
import { FavoritesProvider, useFavorites } from '@/lib/favorites-context'
import { ReactNode } from 'react'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('FavoritesContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <FavoritesProvider>{children}</FavoritesProvider>
  )

  beforeEach(() => {
    window.localStorage.clear()
    jest.clearAllMocks()
  })

  it('should start with empty favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    expect(result.current.favorites).toEqual([])
  })

  it('should toggle a favorite item', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    act(() => {
      result.current.toggleFavorite('test-id', 'service')
    })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].id).toBe('test-id')
    expect(result.current.isFavorite('test-id')).toBe(true)

    act(() => {
      result.current.toggleFavorite('test-id', 'service')
    })

    expect(result.current.favorites).toHaveLength(0)
    expect(result.current.isFavorite('test-id')).toBe(false)
  })

  it('should persist favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    act(() => {
      result.current.toggleFavorite('persist-id', 'rental')
    })

    const stored = JSON.parse(window.localStorage.getItem('servicehub_favorites') || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('persist-id')
  })
})
