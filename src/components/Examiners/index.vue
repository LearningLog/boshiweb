<template>
  <div class="examiners">
    <div>
      <span class="group">选择小组</span><span class="member">选择人员</span>
    </div>
    <el-cascader-panel v-model="selectedOptions2" :options="list2" :props="props" @change="handleChange" />
  </div>
</template>

<script>
import { getExamUserInfo } from '@/api/evolution-manage/test-paper-manage'
const $ = window.$
export default {
  name: 'Examiners',
  props: {
    // 租户id
    selectCompanyId: {
      type: String,
      default: ''
    },
    selectedOptions: {
      type: Array,
      default() {
        return []
      }
    },
    targetUser: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      list: [],
      list2: [],
      selectedOptions2: [],
      props: {
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'userinfo'
      }
    }
  },
  watch: {
    selectedOptions: function(val, val2) {
      if (val) {
        this.selectedOptions2 = val
      }
    },
    targetUser: function(val, val2) {
      if (val) {
        for (const key in val) {
          const item = val[key]
          item.forEach(value => {
            this.selectedOptions.push([key, value])
          })
        }
      }
    }
  },
  created() {
    this.get_list()
  },
  methods: {
    // 获取小组和人员列表
    get_list() {
      getExamUserInfo({ selectCompanyId: this.selectCompanyId }).then(
        response => {
          this.list = response.data.groupList
          this.list.forEach((item, index) => {
            item.name = item.groupName
            item.id = item.inc
            if (item.userinfo) {
              item.userinfo.forEach(item2 => {
                item2.name = item2.nickname
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
      var obj = {}
      val.forEach(item => {
        if (!obj[item[0]]) {
          obj[item[0]] = [item[1]]
        } else {
          obj[item[0]].push(item[1])
        }
      })
      this.$emit('examiners', obj)
    }
  }
}
</script>

<style scoped>
/deep/ .el-cascader-menu:last-child {
  border-right: solid 0px #dfe4ed;
}
/deep/ .el-cascader-menu {
  width: 50%;
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
