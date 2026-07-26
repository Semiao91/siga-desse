import { beforeEach, describe, expect, it } from 'vitest'
import { toggleTheme } from '../useTheme'

describe('toggleTheme', () => {
  beforeEach(() => {
    document.documentElement.className = ''
    localStorage.clear()
  })

  it('switches from light to dark and persists the choice', () => {
    document.documentElement.classList.add('light')

    toggleTheme()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
    expect(localStorage.getItem('mc-theme')).toBe('dark')
  })

  it('switches from dark to light and persists the choice', () => {
    document.documentElement.classList.add('dark')

    toggleTheme()

    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('mc-theme')).toBe('light')
  })
})
