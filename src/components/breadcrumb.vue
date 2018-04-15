<template>
  <el-row>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="index <= 5">{{showPageName(index)}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="index === 6" :to="{ path: '/case' }">病例管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="index === 6">病种管理</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
</template>

<script>
export default {
  props: {
    index: Number
  },
  methods: {
    showPageName (index) {
      if (index === 1) return '用户管理'
      if (index === 2) return '试题管理'
      if (index === 3) return '流程管理'
      if (index === 4) return '科室管理'
      if (index >= 5) return '病例管理'
    }
  }
}
</script>
