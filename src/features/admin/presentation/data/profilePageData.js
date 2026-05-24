
export const initialForm = {
  name: '',
  text_hero_1: '',
  text_hero_2: '',
  link_porto: '',
  header_text: '',
  description: '',
  hero_image_bw: '',
  hero_image_rgb: '',
  about_image: '',
}

export const profileFields = [
  {
    id: 'name',
    label: 'Name',
    placeholder: 'Daffa Aditya',
    required: true,
  },
  {
    id: 'text_hero_1',
    label: 'Text Hero 1',
    placeholder: 'Software Engineer',
  },
  {
    id: 'text_hero_2',
    label: 'Text Hero 2',
    placeholder: 'Frontend Developer',
  },
  {
    id: 'header_text',
    label: 'Header Text',
    placeholder: 'About Me',
  },
]

export const imageFields = [
  {
    id: 'hero_image_bw',
    label: 'Hero Image BW',
    placeholder: 'profile/hero-bw.png',
    fileName: 'hero-bw',
  },
  {
    id: 'hero_image_rgb',
    label: 'Hero Image RGB',
    placeholder: 'profile/hero-rgb.png',
    fileName: 'hero-rgb',
  },
  {
    id: 'about_image',
    label: 'About Image',
    placeholder: 'profile/about.png',
    fileName: 'about',
  },
]