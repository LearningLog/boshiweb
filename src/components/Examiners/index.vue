<template>
  <div class="examiners">
    <div>
      <span class="group">选择小组</span><span class="member">选择人员</span>
    </div>
    <el-cascader-panel v-model="checkeList" :options="list2" :props="props" @change="handleChange" />
  </div>
</template>

<script>
import { getExamUserInfo } from '@/api/test-paper-manage'
const $ = window.$
export default {
  name: 'Examiners',
  props: {
    // 租户id
    selectCompanyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      radio: null,
      list: [],
      list2: [],
      checkeList: [],
      props: {
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'userinfo'
      }
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    // 获取标签列表
    get_list() {
      getExamUserInfo({ selectCompanyId: this.selectCompanyId }).then(
        response => {
          this.list = response.data.groupList
          this.list.forEach((item, index) => {
            item.name = item.groupName
            item.id = item.inc
            if (item.userinfo) {
              item.userinfo.forEach(item2 => {
                item2.name = item2.username
                item2.id = item2._id
              })
            }
          })
          this.list2 = this.list
          this.$nextTick(() => {
            $('.examiners /deep/ .el-cascader-menu:first-child li:first-child').click()
          })
        }
      )
    },
    handleChange(val) {
      this.$emit('examiners', val)
    }
  }
}
</script>

<style scoped>
/deep/ .el-cascader-menu:last-child {
  border-right: solid 1px #dfe4ed;
}
.examiners .el-cascader-panel {
  width: 379px;
}
.examiners .group {
	display: inline-block;
	width: 188px;
	background-color: #f5f7fa;
	padding-left: 20px;
}
.examiners .member {
	display: inline-block;
	width: 190px;
	background-color: #f5f7fa;
	padding-left: 20px;
}
</style>
