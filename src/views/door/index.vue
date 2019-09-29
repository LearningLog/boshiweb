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
      this.$router.push({ path: this.$store.getters.homePath })
    }
  }
}
</script>

<style scoped></style>
