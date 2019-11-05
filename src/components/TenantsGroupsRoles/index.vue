<template>
  <div class="tenantsGroupsRoles" :style="{ width: widths }">
    <el-form-item v-if="isSystemManage" label="所属租户" :style="{ width: itemWidth }">
      <el-select
        v-model="companyIds"
        placeholder="请选择所属租户"
        clearable
        filterable
        @change="changeCompany"
      >
        <el-option
          v-for="item in custom_list"
          :key="item._id"
          :label="item.customname"
          :value="item._id"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="isRenderGroup" label="小组" :style="{ width: itemWidth }">
      <el-select
        v-model="groupId"
        placeholder="请选择小组"
        clearable
        filterable
        @change="changeGroup"
      >
        <el-option
          v-for="item in groupList"
          :key="item.inc"
          :label="item.groupName"
          :value="item.inc"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="isRenderRole" label="角色" :style="{ width: itemWidth }">
      <el-select
        v-model="roleId"
        placeholder="请选择角色"
        clearable
        filterable
        @change="changeRole"
      >
        <el-option
          v-for="item in roleList"
          :key="item._id"
          :label="item.rolename"
          :value="item._id"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { getCustomManageList, getAllRole } from '@/api/systemManage-roleManage'
import { getUserEgroupInfo } from '@/api/userCenter-groupManage'

export default {
  name: 'TenantsGroupsRoles',
  props: {
    // 是否显示小组
    isRenderGroup: {
      type: Boolean,
      default: true
    },
    // 是否显示角色
    isRenderRole: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isSystemManage: this.$store.state.user.isSystemManage,
      companyIds: '', // 所属租户id
      groupId: '', // 小组id
      roleId: '', // 角色id
      custom_list: [], // 所属租户
      roleList: [], // 角色,
      groupList: [] // 小组
    }
  },
  computed: {
    widths: function() {
      var num = 0
      if (this.isSystemManage) {
        num++
      }
      if (this.isRenderGroup) {
        num++
      }
      if (this.isRenderRole) {
        num++
      }
      switch (num) {
        case 1:
          return '33%'
        case 2:
          return '66.2%'
        case 3:
          return '100%'
      }
    },
    itemWidth: function() {
      var num = 0
      if (this.isSystemManage) {
        num++
      }
      if (this.isRenderGroup) {
        num++
      }
      if (this.isRenderRole) {
        num++
      }
      switch (num) {
        case 1:
          return '100%'
        case 2:
          return '49.7%'
        case 3:
          return '33%'
      }
    }
  },
  created() {
    this.getCustomManageList()
    if (this.isRenderGroup) {
      this.getEgroups()
    }
    if (this.isRenderRole) {
      this.getAllRoles()
    }
  },
  methods: {
    // 获取所属租户list
    getCustomManageList() {
      getCustomManageList().then(res => {
        this.custom_list = res.data
      })
    },
    // 获取所有小组
    getEgroups() {
      getUserEgroupInfo({ selectCompanyId: this.companyIds }).then(response => {
        this.groupList = response.data.egroupInfo
      })
    },
    // 获取全部角色
    getAllRoles() {
      getAllRole({ companyIds: this.companyIds ? [this.companyIds] : [] }).then(response => {
        this.roleList = response.data.allRoleList
      })
    },

    // 更改所属租户
    changeCompany(val) {
      this.companyIds = val
      this.getAllRoles()
      this.getEgroups()
      this.$emit('tenantsGroupsRolesVal', { companyIds: this.companyIds, egroupId: this.groupId, roleId: this.roleId })
    },
    // 更改小组
    changeGroup(val) {
      this.groupId = val
      this.$emit('tenantsGroupsRolesVal', { companyIds: this.companyIds, egroupId: this.groupId, roleId: this.roleId })
    },
    // 更改角色
    changeRole(val) {
      this.roleId = val
      this.$emit('tenantsGroupsRolesVal', { companyIds: this.companyIds, egroupId: this.groupId, roleId: this.roleId })
    }
  }
}
</script>

<style scoped>
.tenantsGroupsRoles {
  display: inline-block;
}
</style>
