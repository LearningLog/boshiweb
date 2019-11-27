<template>
  <div class="miniPrograms">
    <el-popover
      placement="bottom"
      width="114"
      height="120"
    >
      <div class="tc">
        <img class="miniProgramsImg" :src="miniPrograms" alt="小程序">
      </div>
      <span
        slot="reference"
      ><i class="iconfont iconxiaochengxu" />小程序</span>
    </el-popover>
  </div>
</template>

<script>
import miniPrograms from '@/assets/images/miniPrograms.jpg'

export default {
  name: 'MiniPrograms',
  props: {

  },
  data() {
    return {
      miniPrograms
    }
  },
  watch: {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
	@import "~@/styles/theme.scss";

	.miniPrograms {
		display: inline-block;
		padding: 0 8px;
		font-size: 14px;
		transition: 0.6s;

	&:hover {
		color: $themeColor;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		cursor: pointer;
	}
		i {
			font-size: 14px;
			margin-right: 2px;
		}
}
.miniProgramsImg {
	width: 110px;
}
</style>
