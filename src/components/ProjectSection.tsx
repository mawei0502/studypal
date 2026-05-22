import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

export default function ProjectSection() {
  return (
    <section id="projects" className="py-20 px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            我的项目
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            用 AI 工程工具链构建的实战项目，涵盖全栈开发、课程体系与智能体系统。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
