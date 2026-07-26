export function toggleTheme() {
  const root = document.documentElement
  const isDark = root.classList.contains('dark')
  root.classList.toggle('dark', !isDark)
  root.classList.toggle('light', isDark)
  localStorage.setItem('mc-theme', isDark ? 'light' : 'dark')
}
