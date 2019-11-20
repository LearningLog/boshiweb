<template>
  <div class="examiners">
    <el-dialog
      v-el-drag-dialog
      class="selectCompany"
      width="400px"
      :title="title"
      :visible.sync="isVisible"
      @close="close"
    >
      <el-form label-width="100px">
        <tenants-groups-roles
          :is-render-role="false"
          :isRenderGroup="isRenderGroup"
          which-group="manageEgroupInfo"
          @tenantsGroupsRolesVal="tenantsGroupsRolesVal"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectCompany">确定</el-button>
        <el-button @click="isVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TenantsGroupsRoles from '@/components/TenantsGroupsRoles'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'AddSelectGroup',
  components: { TenantsGroupsRoles },
  directives: { elDragDialog },
  props: {
    visibleSelectGroup: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择小组'
    },
    isRenderGroup: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isVisible: false, // 是否弹出选择租户、小组
      selectCompanyId: '', // 租户id
      egroup: '' // 小组inc
    }
  },
  watch: {
    visibleSelectGroup: function(val, val2) {
      if (val) {
        this.isVisible = true
      }
    }
  },
  methods: {
    // 新增监听三组数据变化
    tenantsGroupsRolesVal(val) {
      this.selectCompanyId = val.companyIds
      this.egroup = val.egroupId
    },
    // 新增选择租户、小组
    selectCompany() {
      if (!this.selectCompanyId && this.$store.state.user.isSystemManage) {
        this.$message.warning('请先选择租户！')
        return false
      }
      if (!this.egroup && this.isRenderGroup) {
        this.$message.warning('请先选择小组！')
        return false
      }
      const obj = {
        selectCompanyId: this.selectCompanyId,
        egroup: this.egroup
      }
      this.$emit('getSelectGroup', obj)
      this.isVisible = false
    },

    close() {
      this.$emit('getSelectGroup', {})
      this.isVisible = false
    }
  }
}
</script>

<style scoped>
.selectCompany /deep/ .tenantsGroupsRoles {
  width: 100% !important;
}
.selectCompany /deep/ .tenantsGroupsRoles .el-form-item {
  width: 100% !important;
}
</style>
