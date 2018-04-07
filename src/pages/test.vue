<template>
  <div>
    <!-- \w表示字母或数字或下划线 -->
    <!-- <el-input type="text" v-model="model" @keyup.native="model=model.replace(/[^\w\.\/]/ig,'')"></el-input>
    <el-input type="text" v-model="model" @keyup.native="model=model.replace(/[^\d]/ig,'')"></el-input> -->
    <!-- <el-upload
      ref="uploads"
      :action="this.$fileApi.getUploadUrl()"
      list-type="picture-card"
      accept="image/*"
      multiple
      :file-list="fileList2"
      :before-upload="beforePictureUpload"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      @click="test(111)">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-button type="primary" @click="submitForm()">导出</el-button> -->
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning('当前限制选择 3 个文件，本次选择了' + files.length + '个文件，共选择了' + (files.length + fileList.length) + '个文件')
    },
    beforeRemove (file, fileList) {
      return this.$confirm('确定移除？' + file.name)
    }
  }
}
</script>

<style scoped>
</style>
