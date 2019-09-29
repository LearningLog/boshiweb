<template>
  <div>
    <h1>门户</h1>
    <button @click="goHome()">goHome</button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goHome() {
      debugger
      // this.$router.push({ path: this.$store.getters.homePath })
      this.$router.push({ path: '/nested/menu1/menu1-1' })
    }
  }
}
</script>

<style scoped></style>
