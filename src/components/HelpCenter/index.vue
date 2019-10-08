<template>
  <div class="help-center">
    <a :href="helpUrl" target="_blank"><i class="iconfont iconbangzhuzhongxin" />&nbsp;帮助中心</a>
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
	@import "~@/styles/element-variables.scss";
	.help-center {
		display: inline-block;
		height: 50px;
		line-height: 50px;
		margin-right: 20px;
		float: left;

    & a {
      font-size: 14px;
    }

    & a:hover {
      color: $--color-primary;
    }
}
</style>

