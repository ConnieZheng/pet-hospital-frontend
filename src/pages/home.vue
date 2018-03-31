<template>
  <el-container style="padding: 50px; background-image: url('../../static/img/homepage_bg.jpg');" direction="vertical">
  <!-- <el-container style="padding: 50px" direction="vertical" class="bg"> -->
    <el-row :gutter="5">
      <el-col :span="8">
        <el-card style="margin: 10px">
          <div slot="header">
          <i class="fa fa-users fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;用户管理</span>
          <el-button style="float: right; padding: 3px 0" type="text">
            <router-link to="/user">进入</router-link>
          </el-button>
          </div>
          <div>
            介绍
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="margin: 10px">
          <i class="fa fa-book fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;试题管理</span>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="margin: 10px">
          <i class="fa fa-list-ol fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;流程管理</span>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-card style="margin: 10px">
          <i class="fa fa-hospital-o fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;科室管理</span>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="margin: 10px">
          <i class="fa fa-video-camera fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;病例管理</span>
        </el-card>
      </el-col>
    </el-row>

  </el-container>
</template>

<style scoped>
.bg {
  /* TODO */
  /* background-image: url('static/img/homepage_bg.jpg'); */
  /* background-image: url('../../static/img/homepage_bg.jpg'); */
  background-repeat:no-repeat;
  height: 700px;
  /* background-position:20px 60px; */
  background-color:#529eff;
}
</style>
