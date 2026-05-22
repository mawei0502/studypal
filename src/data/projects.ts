export interface Project {
  id: string
  name: string
  description: string
  imageUrl: string
  githubUrl: string
}

export const projects: Project[] = [
  {
    id: 'my-website',
    name: '个人品牌站',
    description: '基于 React 19 + Vite + Tailwind CSS v4 构建的个人品牌网站，支持亮/暗模式切换，含 Canvas 粒子动画背景。',
    imageUrl: '',
    githubUrl: 'https://github.com/mawei/my-website',
  },
  {
    id: 'vibe-coding-course',
    name: 'Vibe Coding AI 编程实战课',
    description: '面向 AI 时代的编程实战课程体系，覆盖 Claude Code、OpenSpec、Cursor 等前沿 AI 工程工具链。',
    imageUrl: '',
    githubUrl: 'https://github.com/mawei/vibe-coding-course',
  },
  {
    id: 'openspec-workflow',
    name: 'OpenSpec 工作流',
    description: '规格驱动的 AI 辅助开发工作流，通过 proposal → design → specs → tasks 四阶段保障代码质量与需求一致性。',
    imageUrl: '',
    githubUrl: 'https://github.com/mawei/openspec-workflow',
  },
  {
    id: 'graph-rag-agent',
    name: 'GraphRAG Agent',
    description: '基于知识图谱的检索增强生成智能体，结合 LLM 与图数据库实现复杂多跳推理问答。',
    imageUrl: '',
    githubUrl: 'https://github.com/mawei/graph-rag-agent',
  },
]
