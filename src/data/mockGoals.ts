export interface DailyGoal {
  id: string
  title: string
  completed: boolean
  estimatedMinutes: number
}

export const mockGoals: DailyGoal[] = [
  { id: '1', title: '完成 React 19 新特性学习', completed: true, estimatedMinutes: 60 },
  { id: '2', title: '阅读 OpenSpec 工作流文档', completed: true, estimatedMinutes: 30 },
  { id: '3', title: '实现 Dashboard 统计卡片', completed: false, estimatedMinutes: 90 },
  { id: '4', title: '复习 TypeScript 泛型', completed: false, estimatedMinutes: 45 },
  { id: '5', title: '练习 Tailwind CSS v4 新语法', completed: false, estimatedMinutes: 30 },
  { id: '6', title: '看一节 FastAPI 入门视频', completed: false, estimatedMinutes: 50 },
]
