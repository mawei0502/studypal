export interface AiSuggestion {
  id: string
  title: string
  reason: string
  estimatedMinutes: number
  tags: string[]
}

export const mockSuggestions: AiSuggestion[] = [
  {
    id: '1',
    title: 'React Server Components 深度解析',
    reason: '你近期完成了多个 React 组件任务，进阶 RSC 是自然的下一步',
    estimatedMinutes: 60,
    tags: ['React', '进阶'],
  },
  {
    id: '2',
    title: 'Python 异步编程：asyncio 实战',
    reason: '即将接入 FastAPI 后端，异步基础必须打牢',
    estimatedMinutes: 90,
    tags: ['Python', 'FastAPI', '异步'],
  },
  {
    id: '3',
    title: 'Tailwind CSS v4 配置系统详解',
    reason: '本项目已升级 v4，掌握新配置能提升开发效率',
    estimatedMinutes: 40,
    tags: ['CSS', 'Tailwind'],
  },
  {
    id: '4',
    title: 'TypeScript 条件类型与 infer',
    reason: '你在泛型复习中遇到了阻塞，条件类型是关键缺口',
    estimatedMinutes: 50,
    tags: ['TypeScript', '类型系统'],
  },
  {
    id: '5',
    title: 'Recharts 深度定制：暗色主题与交互',
    reason: '当前 Dashboard 趋势图需要精细化，掌握 Recharts 配置层',
    estimatedMinutes: 45,
    tags: ['React', '数据可视化'],
  },
  {
    id: '6',
    title: 'SQLite + FastAPI 数据库集成',
    reason: '后端开发路径中最高优先级的技能点',
    estimatedMinutes: 75,
    tags: ['FastAPI', 'SQLite', '后端'],
  },
  {
    id: '7',
    title: 'Vite 7 构建优化：代码分割与懒加载',
    reason: '本项目已用 React.lazy，系统学习可减少更多包体积',
    estimatedMinutes: 35,
    tags: ['Vite', '性能'],
  },
  {
    id: '8',
    title: 'Claude Code 工程实践精讲',
    reason: '当前课程核心技能，持续深化使用效率',
    estimatedMinutes: 60,
    tags: ['AI 工程', 'Claude Code'],
  },
]
