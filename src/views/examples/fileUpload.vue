<template>
  <div class="page">
    <file-uploader :belongs="belongs" />
    <el-radio-group v-model="radio" @change="changes">
      <el-radio :label="2">企业文件夹2</el-radio>
      <el-radio :label="3">小组文件夹1</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import FileUploader from '@/components/VueWebuploader'

export default {
  components: {
    FileUploader
  },
  data() {
    return {
      radio: 2,
      belongs: {
        data_type: 1,
        ownerId: '5dafca369a301f6a9902207a',
        parentId: '5dafca369a301f6a9902207a',
        selectCompanyId: '5dafca369a301f6a9902207a' // zuhu001
      }
    }
  },
  methods: {
    changes(val) {
      switch (val) {
        case 1:
          this.belongs = {
            data_type: 1,
            ownerId: '5db92d009a301f5b3f7d906c',
            parentId: '5db92d009a301f5b3f7d906c',
            selectCompanyId: '5db92d009a301f5b3f7d906c'
          }
          break
        case 2:
          this.belongs = {
            data_type: 1,
            ownerId: '5dafca369a301f6a9902207a',
            parentId: '5dafca369a301f6a9902207a',
            selectCompanyId: '5dafca369a301f6a9902207a'
          }
          break
        case 3:
          this.belongs = {
            data_type: 2,
            ownerId: '295',
            parentId: '295',
            selectCompanyId: '5db985d79a301f47ede1fb5c'
          }
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
