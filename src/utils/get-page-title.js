import defaultSettings from '@/settings'

const title = defaultSettings.title || '博识'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
