import { useTheme } from '../hooks/useTheme'
import ParticleCanvas from './ParticleCanvas'

export default function HeroSection() {
  const { theme } = useTheme()

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-gray-950 dark:via-violet-950 dark:to-indigo-950">
      {/* 粒子背景层 */}
      <ParticleCanvas theme={theme} />

      {/* 前景内容层 */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          马维斯
        </h1>
        <p className="text-xl sm:text-2xl font-medium text-violet-700 dark:text-violet-400 mb-4">
          AI 工程师 &amp; 技术讲师
        </p>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
          用 AI 重新定义编程方式，帮助开发者驾驭下一代工程工具。
        </p>

        {/* CTA 按钮 */}
        <a
          href="#projects"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white bg-violet-600 hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400 border border-violet-500 dark:border-violet-400 shadow-lg shadow-violet-500/30 dark:shadow-violet-500/20 transition-colors"
        >
          查看我的项目
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </div>
    </section>
  )
}
