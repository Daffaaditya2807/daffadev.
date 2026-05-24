import {
  SiDart,
  SiFirebase,
  SiFlutter,
  SiLaravel,
  SiMysql,
  SiPhp,
  SiPostman,
  SiVuedotjs,
} from 'react-icons/si'

export const initialTechStackForm = {
  name: '',
  icon_key: 'flutter',
  color: '#02569B',
  sort_order: 0,
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
]

export const iconMap = iconOptions.reduce((icons, option) => {
  icons[option.value] = option.Icon
  return icons
}, {})

export const colorMap = iconOptions.reduce((colors, option) => {
  colors[option.value] = option.color
  return colors
}, {})
