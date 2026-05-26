import { NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuth, useMockAuth } from '../contexts/AuthContext'

const navItems = [
  {
    label: '学习数据',
    to: '/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'AI 对话建议',
    to: '/chat',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: '学习目标',
    to: '/goals',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  },
]

const activeClass =
  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
const inactiveClass =
  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400 transition-colors'

function UserArea() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const mockAuth = useMockAuth()

  if (!user && !mockAuth) return null

  const displayName = user?.display_name || user?.email || 'StudyPal User'
  const letter = displayName.charAt(0).toUpperCase()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="pt-3 border-t border-gray-200 dark:border-gray-700/60">
      <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-xs font-bold text-violet-700 dark:text-violet-300 shrink-0">
            {letter}
          </div>
        )}
        <span className="truncate text-sm text-gray-700 dark:text-gray-300 hidden lg:inline flex-1">
          {displayName}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          title="退出"
          className="shrink-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function DashboardSidebar() {
  return (
    <aside className="
      hidden md:flex
      flex-col w-16 lg:w-56 shrink-0
      min-h-screen
      bg-white dark:bg-gray-900
      border-r border-gray-200 dark:border-gray-700/60
      px-2 lg:px-4 py-6
    ">
      {/* Logo */}
      <div className="mb-8 px-3 overflow-hidden">
        <span className="text-xl font-bold tracking-tight text-violet-700 dark:text-violet-400 hidden lg:inline">
          StudyPal
        </span>
        <span className="text-xl font-bold tracking-tight text-violet-700 dark:text-violet-400 lg:hidden" aria-hidden="true">
          S
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => isActive ? activeClass : inactiveClass}
          >
            <span className="shrink-0">{icon}</span>
            <span className="truncate hidden lg:inline">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom: theme + user */}
      <div className="space-y-2">
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700/60 flex justify-center">
          <ThemeToggle />
        </div>
        <UserArea />
      </div>
    </aside>
  )
}
