import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Code, FolderGit2, Smartphone, Globe, Computer } from 'lucide-react'
import { supabase } from '@/core/supabase'

const DashboardPage = () => {
  const [data, setData] = useState({
    projects: [],
    techStacks: [],
    journeys: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const [
          { data: projects },
          { data: techStacks },
          { data: journeys }
        ] = await Promise.all([
          supabase
            .from('lab_projects')
            .select('title, type_id, status, is_active, created_at')
            .order('created_at', { ascending: false }),
          supabase
            .from('tech_stacks')
            .select('name, is_active')
            .order('created_at', { ascending: false }),
          supabase
            .from('journeys')
            .select('position, is_active')
            .order('date_start', { ascending: false })
        ])

        if (isMounted) {
          setData({
            projects: projects || [],
            techStacks: techStacks || [],
            journeys: journeys || []
          })
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        if (isMounted) setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  const activeProjects = data.projects.filter(p => p.is_active)
  const publishedProjects = activeProjects.filter(p => p.status === 'published').length
  const developmentProjects = activeProjects.filter(p => p.status === 'development').length

  const mobileProjects = activeProjects.filter(p => p.type_id === 'mobile').length
  const webProjects = activeProjects.filter(p => p.type_id === 'web').length
  const desktopProjects = activeProjects.filter(p => p.type_id === 'desktop').length

  const activeTechStacks = data.techStacks.filter(t => t.is_active)
  const techStackNames = activeTechStacks.slice(0, 3).map(t => t.name).join(', ') + (activeTechStacks.length > 3 ? ', dll' : '')

  const activeJourneys = data.journeys.filter(j => j.is_active)
  const journeyPositions = [...new Set(activeJourneys.map(j => j.position))].slice(0, 2).join(' & ')

  const stats = [
    { title: 'Total Proyek', value: activeProjects.length.toString(), icon: FolderGit2, desc: `${publishedProjects} published · ${developmentProjects} development` },
    { title: 'Aplikasi Mobile', value: mobileProjects.toString(), icon: Smartphone, desc: 'Dari total proyek' },
    { title: 'Aplikasi Web', value: webProjects.toString(), icon: Globe, desc: 'Dari total proyek' },
    { title: 'Aplikasi Desktop', value: desktopProjects.toString(), icon: Computer, desc: 'Dari total proyek' },
    { title: 'Tech Stack', value: activeTechStacks.length.toString(), icon: Code, desc: techStackNames || 'Belum ada data' },
    { title: 'Pengalaman Kerja', value: activeJourneys.length.toString(), icon: Briefcase, desc: journeyPositions || 'Belum ada data' },
  ]

  const recentProjects = activeProjects.slice(0, 5).map(p => {
    let typeLabel = p.type_id
    if (p.type_id === 'mobile') typeLabel = 'Mobile'
    if (p.type_id === 'web') typeLabel = 'Web'
    if (p.type_id === 'desktop') typeLabel = 'Desktop'

    return {
      title: p.title,
      type: typeLabel,
      status: p.status
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="mt-1 text-white/55">Ringkasan statistik portfolio dan proyek.</p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/3">
          <p className="text-white/50">Memuat data dashboard...</p>
        </div>
      ) : (
        <>
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
              {recentProjects.length === 0 ? (
                <p className="text-sm text-white/50">Belum ada proyek terbaru.</p>
              ) : (
                <div className="space-y-3">
                  {recentProjects.map((project, idx) => (
                    <div key={`${project.title}-${idx}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-white">{project.title}</p>
                        <p className="text-xs text-white/45">{project.type}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        project.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default DashboardPage
