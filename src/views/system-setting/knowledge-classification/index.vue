<template>
  <div class="app-container">
    <p>小提示：最多可创建2个一级主题哦，主题可输入2-8个字符</p>
    <el-tree
      class="knowledgeTree"
      :data="treeList"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :props="defaultProps"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
	      <span>
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="data.children && data.children.length > 0 ? '#iconwenjianjia' : '#iconzu'" />
          </svg>
          {{ node.label }}
        </span>
        <span v-if="node.level === 1">
          <el-button type="text" size="mini" @click="() => createTheme(1)" v-if="node.childNodes && node.childNodes.length < 2">
            <span><i class="iconfont iconjia" /></span>
          </el-button>
        </span>
        <span v-else>
          <el-button type="text" size="mini" @click="() => createTheme(2, data)">
            <span><i class="iconfont iconjia" /></span>
          </el-button>
          <el-button type="text" size="mini" @click="() => editTheme(data)">
            <span><i class="iconfont iconxiugai" /></span>
          </el-button>
          <el-button type="text" size="mini" @click="() => deleteNode(node, data)">
            <span><i class="iconfont iconshanchu" /></span>
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      v-el-drag-dialog
      title="创建主题"
      :visible.sync="createTreeVisible"
      width="350px"
    >
      <el-form ref="createTheme" :model="theme" :rules="rules" label-width="80px">
        <el-form-item label="主题名称" prop="treeName" v-if="level === 1">
          <el-input
            v-model="theme.treeName"
            placeholder="请输入主题"
            clearable
          />
        </el-form-item>
	      <el-form-item label="主题名称" prop="nodeName" v-else>
		      <el-input
				      v-model="theme.nodeName"
				      placeholder="请输入主题"
				      clearable
		      />
	      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCreateTheme">确定</el-button>
        <el-button type="primary" plain @click="createTreeVisible = false">取消</el-button>
      </div>
    </el-dialog>
	  <el-dialog
			  v-el-drag-dialog
			  title="修改主题"
			  :visible.sync="editTreeVisible"
			  width="350px"
	  >
		  <el-form ref="editTheme" :model="theme" :rules="rules2" label-width="80px">
			  <el-form-item label="主题名称" prop="nodeName">
				  <el-input
						  v-model="theme.nodeName"
						  placeholder="请输入主题"
						  clearable
				  />
			  </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
			  <el-button type="primary" @click="submitEditTheme">确定</el-button>
			  <el-button type="primary" plain @click="editTreeVisible = false">取消</el-button>
		  </div>
	  </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import {
  getCompanyAllTree,
  createTree,
  createNode,
  deleteNode,
  updateNodeName
} from '@/api/system-setting/knowledge-classification'
export default {
  directives: { elDragDialog },
  data() {
    return {
      dataIsChange: 0, // 计数器，据此判断表单是否已编辑
      noLeaveprompt: false, // 表单提交后，设置为true，据此判断提交不再弹出离开提示
      createTreeVisible: false, // 创建主题弹窗
      editTreeVisible: false, // 创建主题弹窗
      level: null, // 创建的主题级别 1，一级主题；2，子级主题
	    // 知识树列表
      treeList: [{
        title: '知识分类',
	      id: '0',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'title',
        id: 'id'
      },
	    // 编辑的主题
      theme: {
        treeId: '', // 树id
        parentId: '', // 父节点id
        nodeId: '', // 当前节点id
        treeName: '', // 主题名
        nodeName: '' // 节点名
      },
      rules: {
        treeName: [
          {
            required: true,
            message: '请输入主题名称（长度在 2 到 8 个字符）',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入主题名称（长度在 2 到 8 个字符）',
            trigger: 'change'
          },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'change' }
        ],
        nodeName: [
          {
            required: true,
            message: '请输入主题名称（长度在 2 到 8 个字符）',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入主题名称（长度在 2 到 8 个字符）',
            trigger: 'change'
          },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'change' }
        ]
      },
      rules2: {
        nodeName: [
          {
            required: true,
            message: '请输入主题名称（长度在 2 到 8 个字符）',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入主题名称（长度在 2 到 8 个字符）',
            trigger: 'change'
          },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    // 监听表单数据变化
    treeList: {
      handler(val) {
        if (val) {
          this.dataIsChange++
        }
      },
      deep: true
    }
  },
  created() {
    this.getCompanyAllTree()
  },
  methods: {
    // 知识树获取租户所有树
    getCompanyAllTree() {
      this.treeList[0].children.length = 0
      getCompanyAllTree().then(res => {
        res.data.treeList = res.data.treeList || []
        var arr = JSON.parse(JSON.stringify(res.data.treeList))
        arr[0].node.parentrRootNodeIdId = arr[0].rootNodeId
        arr[0].node.parentId = arr[0].id
        this.treeList[0].children.push(arr[0].node)
        if (arr[1]) {
          arr[1].node.parentrRootNodeIdId = arr[1].rootNodeId
          arr[1].node.parentId = arr[1].id
          this.treeList[0].children.push(arr[1].node)
        }
      })
    },

	  // 弹出创建
    createTheme(level, data) {
      this.level = level
	    if (level === 2) {
        this.theme.treeId = data.treeId
        this.theme.parentId = data.parentrRootNodeIdId
      }
      this.createTreeVisible = true
    },

	  // 保存创建
    submitCreateTheme() {
      this.$refs.createTheme.validate((valid) => {
        if (valid) {
          if (this.level === 1) {
            createTree({ treeName: this.theme.treeName }).then(res => {
              this.$message.success('创建主题成功！')
              this.getCompanyAllTree()
              this.createTreeVisible = false
              this.theme.treeName = ''
              this.$refs.createTheme.clearValidate()
            })
          } else {
            createNode(this.theme).then(res => {
              this.$message.success('创建主题成功！')
              this.getCompanyAllTree()
              this.createTreeVisible = false
              this.theme.treeId = ''
              this.theme.parentId = ''
              this.theme.nodeName = ''
              this.$refs.createTheme.clearValidate()
            })
          }
        }
      })
    },

    // 弹出修改
    editTheme(data) {
      this.theme.nodeId = data.id
      this.theme.nodeName = data.title
      this.editTreeVisible = true
    },

	  // 保存修改
    submitEditTheme() {
      this.$refs.editTheme.validate((valid) => {
        if (valid) {
          updateNodeName(this.theme).then(res => {
            this.$message.success('修改主题成功！')
            this.getCompanyAllTree()
            this.editTreeVisible = false
            this.theme.nodeId = ''
            this.theme.nodeName = ''
            this.$refs.editTheme.clearValidate()
          })
        }
      })
    },

	  // 删除节点
    deleteNode(node, data) {
      console.log(node)
      this.$confirm('确定要删除【' + data.title + '】吗？', '删除主题', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNode({ treeId: data.treeId, nodeId: data.id }).then(res => {
          this.$message.success('删除成功！')
          this.getCompanyAllTree()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.knowledgeTree {
  width: 400px;
  margin: 0 auto;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
