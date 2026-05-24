import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Code, FolderGit2, Smartphone, Globe, Computer } from 'lucide-react'

const stats = [
  { title: 'Total Proyek', value: '7', icon: FolderGit2, desc: '4 published · 3 development' },
  { title: 'Aplikasi Mobile', value: '4', icon: Smartphone, desc: 'Flutter & Java' },
  { title: 'Aplikasi Web', value: '2', icon: Globe, desc: 'Laravel & Vue' },
  { title: 'Aplikasi Desktop', value: '1', icon: Computer, desc: 'Python & PyQT5' },
  { title: 'Tech Stack', value: '8', icon: Code, desc: 'Flutter, Laravel, Vue, dll' },
  { title: 'Pengalaman Kerja', value: '2', icon: Briefcase, desc: 'Frontend & Mobile Dev' },
]

const recentProjects = [
  { title: 'eBendungan', type: 'Mobile', status: 'development' },
  { title: 'Antriqu', type: 'Mobile', status: 'development' },
  { title: 'Piscis AI', type: 'Web', status: 'published' },
  { title: 'Primadona Apps', type: 'Desktop', status: 'published' },
  { title: 'Lumintu Energi Persada', type: 'Web', status: 'published' },
]

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="mt-1 text-white/55">Ringkasan statistik portfolio dan proyek.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-white/10 bg-white/[0.07] text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-white/40" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-white/45">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/[0.07] text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Proyek Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.title} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{project.title}</p>
                  <p className="text-xs text-white/45">{project.type}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  project.status === 'published'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-amber-500/15 text-amber-400'
                }`}>
                  {project.status === 'published' ? 'Published' : 'Development'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
