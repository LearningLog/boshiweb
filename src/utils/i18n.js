/**
* @Author: YanHuaKang
* @Date: 2019/7/26
* @Description: 使router.meta.title国际化，用于面包屑、侧边菜单栏、标签
* @remarks:
*/
export function generateTitle(title) {
  // $te 为vue-i18n提供的检测API，检测入参是否包含在已配置的国际化语言中，返回 boolean
  const hasKey = this.$te('route.' + title)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t('route.' + title)

    return translatedTitle
  }
  return title
}
