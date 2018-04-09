<template>
  <el-container style="padding: 25px 50px; background-image: url('../../static/img/homepage_bg.jpg'); background-repeat: no-repeat;background-position: 50% 50%; height: 500px" direction="vertical">
  <!-- <el-container style="padding: 20px 50px" direction="vertical" class="bg"> -->
    <el-row :gutter="5">
      <el-col :span="8">
        <el-card style="margin: 10px; height: 200px">
          <div slot="header">
            <i class="fa fa-users fa-lg"/>
            <span class="hidden-md-and-down">&nbsp;用户管理</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">
              <router-link to="/user">进入</router-link>
            </el-button> -->
          </div>
          <div>
            限制：管理员Admin只允许对User类用户的修改密码、删除用户操作
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="margin: 10px; height: 200px">
          <div slot="header">
            <i class="fa fa-book fa-lg"/>
            <span class="hidden-md-and-down">&nbsp;试题管理</span>
          </div>
          <div>
            特点：支持通过文件批量上传试题
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="margin: 10px; height: 200px">
          <div slot="header">
            <i class="fa fa-list-ol fa-lg"/>
            <span class="hidden-md-and-down">&nbsp;流程管理</span>
          </div>
          <div>
            特点：支持手动插入步骤，快速上下移动步骤
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-card style="margin: 10px; height: 200px">
          <div slot="header">
            <i class="fa fa-hospital-o fa-lg"/>
            <span class="hidden-md-and-down">&nbsp;科室管理</span>
          </div>
          <div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="margin: 10px; height: 200px">
          <div slot="header">
            <i class="fa fa-video-camera fa-lg"/>
            <span class="hidden-md-and-down">&nbsp;病例管理</span>
          </div>
          <div>
            特点：分4阶段，快速增删相关图片和视频列表
          </div>
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
