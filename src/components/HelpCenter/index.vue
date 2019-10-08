<template>
	<div class="help-center" >
		<a :href="helpUrl" target="_blank"><i class="iconfont iconbangzhuzhongxin">帮助中心</i></a>
	</div>
</template>

<script>
export default {
  name: 'HelpCenter',
  data() {
    return {
      helpUrl: 'https://help.yunshicloud.com/boshi/'
    }
  }
}
</script>

<style lang="scss" scoped>
.help-center {
	display: inline-block;
	height: 50px;
	line-height: 50px;
}
</style>

