<template>
  <div class="footer">{{ footer }}</div>
</template>

<script>

export default {
  name: 'Footer',
  data() {
    return {
      footer: '版权所有 北京阳光云视科技有限公司 2019保留一切权利 ICP证：京ICP备14009498'
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer {
    text-align: center;
  }
</style>
