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
      default: 'https://easydoc.xyz/#/doc/96161216/qzQt5Mmz/LI9XTXYC'
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
		/*float: left;*/
    transition: 0.6s;
    font-size: 14px;

    i {
      margin-right: 0px;
      font-size: 14px;
    }

    &:hover {
      color: $themeColor;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      cursor: pointer;
    }
}
</style>

