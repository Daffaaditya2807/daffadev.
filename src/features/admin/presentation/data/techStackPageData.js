import {
  SiDart,
  SiFirebase,
  SiFlutter,
  SiLaravel,
  SiMysql,
  SiPhp,
  SiPostman,
  SiVuedotjs,
  SiReact,
  SiNodedotjs,
  SiTailwindcss,
  SiNextdotjs,
  SiVite,
  SiJavascript,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiPython,
  SiDjango,
  SiDocker
} from 'react-icons/si'

export const initialTechStackForm = {
  name: '',
  icon_key: 'flutter',
  color: '#02569B',
  is_active: true,
}

export const iconOptions = [
  { value: 'flutter', label: 'Flutter', Icon: SiFlutter, color: '#02569B' },
  { value: 'dart', label: 'Dart', Icon: SiDart, color: '#0175C2' },
  { value: 'laravel', label: 'Laravel', Icon: SiLaravel, color: '#FF2D20' },
  { value: 'php', label: 'PHP', Icon: SiPhp, color: '#777BB4' },
  { value: 'mysql', label: 'MySQL', Icon: SiMysql, color: '#4479A1' },
  { value: 'firebase', label: 'Firebase', Icon: SiFirebase, color: '#FFCA28' },
  { value: 'vue', label: 'Vue', Icon: SiVuedotjs, color: '#4FC08D' },
  { value: 'postman', label: 'Postman', Icon: SiPostman, color: '#FF6C37' },
  { value: 'react', label: 'React', Icon: SiReact, color: '#61DAFB' },
  { value: 'node', label: 'Node.js', Icon: SiNodedotjs, color: '#339933' },
  { value: 'tailwind', label: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06B6D4' },
  { value: 'nextjs', label: 'Next.js', Icon: SiNextdotjs, color: '#000000' },
  { value: 'vite', label: 'Vite', Icon: SiVite, color: '#646CFF' },
  { value: 'javascript', label: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
  { value: 'typescript', label: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
  { value: 'mongodb', label: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
  { value: 'postgresql', label: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1' },
  { value: 'git', label: 'Git', Icon: SiGit, color: '#F05032' },
  { value: 'github', label: 'GitHub', Icon: SiGithub, color: '#181717' },
  { value: 'python', label: 'Python', Icon: SiPython, color: '#3776AB' },
  { value: 'django', label: 'Django', Icon: SiDjango, color: '#092E20' },
  { value: 'docker', label: 'Docker', Icon: SiDocker, color: '#2496ED' },
]

export const iconMap = iconOptions.reduce((icons, option) => {
  icons[option.value] = option.Icon
  return icons
}, {})

export const colorMap = iconOptions.reduce((colors, option) => {
  colors[option.value] = option.color
  return colors
}, {})
