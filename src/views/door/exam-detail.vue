<template>
  <div class="app-container">
    <div class="content">
    </div>
  </div>
</template>

<script>
import { getFileShowSize } from '@/utils/index'
import { knowledgeSearch, getExams } from '@/api/door/index'

export default {
  data() {
    return {
      listLoading: true, // 是否开启遮罩
      total: 0, // 总条数
      listQuery: {
        // 查询条件
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页请求条数
        keyword: '', // 搜索关键字
        fileTypes: [], // ["video"]
        notFileTypes: [], // ["video"] 不展示的文件类型
        classifyNodeIds: [] // 分类id列表
      },
      list: [],
    }
  },
  watch: {

  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
	.content {
		width: 1100px;
		margin: 0 auto;
		position: relative;

	}
</style>
