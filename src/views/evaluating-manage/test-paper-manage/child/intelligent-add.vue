<template>
	<div id="intelligentAdd">
		222
	</div>
</template>

<script>

export default {
  data() {
    return {
      selectCompanyId: '', // 租户
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.selectCompanyId = this.$route.query.selectCompanyId
  },
  methods: {

  },
  beforeRouteLeave(to, from, next) {
    if (this.dataIsChange && !this.noLeaveprompt) { // 判断表单数据是否变化，以及提交后不进行此保存提示
      setTimeout(() => { // 此处必须要加延迟执行，主要解决浏览器前进后退带来的闪现
        this.$confirm('您的数据尚未保存，是否离开？', '离开页面', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next()
        }).catch(() => {
          next(false)
        })
      }, 200)
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
	@import "~@/styles/theme.scss";
	//$themeColor
</style>
