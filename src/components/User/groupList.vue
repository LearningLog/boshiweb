<template>
  <div class="user-group-list">
    <span v-for="item in data" :key="item._id" class="group-list-box">
        <span>{{item.groupName}}</span>
        <span class="manage-tips" v-if="item.manage">负责人</span>
    </span>
  </div>
</template>

<script>

export default {
  name: 'GroupList',
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .manage-tips {
    font-size: 12px;
  }

  .group-list-box {
    display: inline-block;
    margin-right: 10px;
  }
</style>
