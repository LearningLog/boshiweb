<template>
  <el-tooltip class="item" effect="dark" content="帮助中心" placement="bottom">
    <a class="help-center" :href="helpUrl" target="_blank"><i class="iconfont iconbangzhuzhongxin" /></a>
  </el-tooltip>
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
    padding: 0 8px;
		float: left;
    transition: background 0.5s;
    font-size: 14px;

    i.iconbangzhuzhongxin {
      margin-right: 0px;
      font-size: 18px;
    }

    &:hover {
      color: $themeColor;
      background-color: #f9f9f9;
      cursor: pointer;
    }
}
</style>

