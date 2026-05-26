import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: '首页', href: '#hero' },
  { label: '关于我', href: '#about' },
  { label: '项目', href: '#projects' },
]

export default function PublicNavbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-white/20 dark:border-gray-700/50">
      <nav className="w-full max-w-5xl mx-auto px-6 flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-violet-700 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors"
        >
          马维斯
        </Link>

        <div className="flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
