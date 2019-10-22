<template>
  <div class="clearfix footer">
    <div class="footer">{{ footer }}</div>
  </div>
</template>

<script>

export default {
  name: 'Footer',
  data() {
    return {
      footer: '版权所有 © 2019 北京阳光云视科技有限公司 京公网安备11010802014739号 ICP证:京ICP备14009498'
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer {
    text-align: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #b0b4bf;
    background-color: #f2f5f8;
    font-size: 12px;
    z-index: 10;

    .footer-text {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 50px;
      line-height: 50px;
    }
  }
</style>
