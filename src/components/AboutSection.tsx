import { useState } from 'react'

const AVATAR_URL = ''

export default function AboutSection() {
  const [imgFailed, setImgFailed] = useState(false)

  const resolvedAvatarUrl = AVATAR_URL
    ? `${import.meta.env.BASE_URL}${AVATAR_URL}`.replace(/\/\//g, '/')
    : ''

  const showAvatar = resolvedAvatarUrl && !imgFailed

  return (
    <section id="about" className="py-20 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            关于我
          </h2>
        </div>

        {/* 左右两栏 */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14">
          {/* 左栏：头像 */}
          <div className="flex-shrink-0 w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden">
            {showAvatar ? (
              <img
                src={resolvedAvatarUrl}
                alt="马维斯"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-500/30 via-indigo-500/30 to-cyan-500/30 dark:from-violet-900/50 dark:via-indigo-900/50 dark:to-cyan-900/50 flex items-center justify-center">
                <span className="text-5xl opacity-40 select-none">👤</span>
              </div>
            )}
          </div>

          {/* 右栏：简介 + 品牌标签 */}
          <div className="flex flex-col gap-4 flex-1 text-center md:text-left">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              我是<strong className="text-gray-900 dark:text-white">马维斯</strong>，AI 工程师与技术讲师，深耕人工智能与工程实践交汇的领域。我相信，真正的工程师不只会写代码，更懂得如何用 AI 工具链放大自己的能力边界。
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              在教学上，我致力于打造面向 AI 时代的实战课程体系，覆盖 Claude Code、OpenSpec、Cursor 等前沿工程工具，帮助开发者从"会用 AI"升级到"用 AI 做工程"。每一门课程都是一次完整的工程实践，而不是孤立的技术演示。
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              我的目标是构建一个以规格驱动、质量第一为核心理念的工程师社区，让每一个参与者都能在 AI 时代找到自己的价值锚点。
            </p>

            {/* 品牌标签 */}
            <div className="mt-2 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border border-violet-400 dark:border-violet-500 text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/30">
                挺而立之
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
