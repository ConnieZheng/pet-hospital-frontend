<template>
  <el-header>
    <el-row :gutter="5">
      <el-col :span="6">
        <div style="text-align: left">
          <big>宠物医院学习系统</big>
          <small>后台管理</small>
        </div>
      </el-col>

      <el-col :span="12">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="">首页</el-menu-item>
          <el-menu-item index="user">用户管理</el-menu-item>
          <el-menu-item index="question">试题管理</el-menu-item>
          <el-menu-item index="procedure">流程管理</el-menu-item>
          <el-menu-item index="department">科室管理</el-menu-item>
          <el-menu-item index="case">病例管理</el-menu-item>
        </el-menu>
        <div class="line"></div>
      </el-col>

      <el-col :span="6">
        <div style="text-align: right">
          用户：{{name}}
        </div>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
export default {
  props: {
    name: String,
    auth: String
  },
  data () {
    return {
      activeIndex: '',
      localname: this.name
    }
  },
  created () {
    this.activeIndex = this.$router.currentRoute.fullPath.split('/').pop()
  },
  methods: {
    handleSelect (key, keyPath) {
      // console.log(typeof key, keyPath)
      this.$router.push({
        path: '/' + key
      })
    }
  }
}
</script>

<style>
.el-header {
  line-height: 60px;
  color: #606266;
}
.bg-purple {
  background: #d3dce6;
}

</style>
