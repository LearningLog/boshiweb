<template>
  <div class="help-center">
    <a :href="helpUrl" target="_blank"><i class="iconfont iconbangzhuzhongxin" />帮助中心</a>
  </div>
</template>

<script>
export default {
  name: 'HelpCenter',
  props: {
    helpUrl: {
      type: String,
      default: 'https://help.yunshicloud.com/boshi/'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/theme.scss";
	.help-center {
		display: inline-block;
		height: 50px;
		line-height: 50px;
		margin-right: 20px;
		float: left;

    & a {
      font-size: 14px;

      i.iconbangzhuzhongxin {
        margin-right: 4px;
      }
    }

    & a:hover {
      color: $themeColor;
    }
}
</style>

