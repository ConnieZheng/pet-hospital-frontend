<template>
  <el-container direction="vertical" v-loading="loading">
    <!-- <el-row>
      {{caseId}} - {{stage}}
    </el-row> -->
    <el-row>
      <h3>
        文字描述
        <el-button type="primary" size="small" v-if="hasInfo" @click="infoInputVisible = true">修改</el-button>
        <el-button type="primary" size="small" v-else @click="infoInputVisible = true">新增</el-button>
        <el-button type="primary" size="small" :disabled="hasInfo === false" @click="deleteInfo">删除</el-button>
        <el-input v-show="infoInputVisible" type="text" size="small" :maxlength="255" placeholder="请输入文字描述" style="width: 160px" v-model="newInfo"/>
        <el-button type="primary" size="small" v-show="infoInputVisible" @click="addOrUpdateInfo">确定</el-button>
      </h3>
      <span v-if="hasInfo">{{info}}</span>
      <i v-else>暂无</i>
    </el-row>

    <el-row>
      <h3>图片列表</h3>
      <el-upload accept="image/*"
        :action="this.$fileApi.getUploadUrl()"
        list-type="picture-card"
        :file-list="picList"
        :before-upload="beforePicUpload"
        :on-success="handlePicSuccess"
        :on-remove="handlePicRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-row>
    <el-row>
      <h3>视频列表</h3>
      <el-upload accept="video/*"
        :file-list="videoList"
        :action="this.$fileApi.getUploadUrl()"
        :before-upload="beforeVideoUpload"
        :on-progress="handleVideoProgress"
        :on-success="handleVideoSuccess"
        :on-remove="handleVideoRemove">
        <el-button type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传视频文件，且大小不超过50MB</div>
      </el-upload>
    </el-row>
  </el-container>
</template>

<script>
export default {
  props: {
    caseId: Number,
    stage: Number
  },
  data () {
    return {
      loading: false,
      // info
      info: '',
      hasInfo: false,
      id: 0,
      newInfo: '',
      infoInputVisible: false,
      // picture
      picList: [],
      // video
      videoList: []
    }
  },
  created () {
    var param = { // caseId, stage
      caseId: this.caseId,
      stage: this.stage
    }
    this.getInfo(param)
    this.getPicList(param)
    this.getVideoList(param)
  },
  methods: {
    // info
    getInfo (param) {
      this.$api.post(
        '/case/text/all',
        param,
        response => { // status, info
          if (response.status === 'success') {
            this.hasInfo = true
            this.info = response.info
            this.id = response.id
          }
        }
      )
    },
    addOrUpdateInfo () {
      this.loading = true
      if (this.info) { // update
        this.$api.post(
          '/case/text/update',
          {
            id: this.id,
            info: this.newInfo
          },
          response => { // status, info
            if (response.status === 'success') {
              this.info = this.newInfo
              this.$message.success('文字描述修改成功')
              this.newInfo = ''
              this.infoInputVisible = false
            } else {
              this.$notify.error({
                title: '错误',
                message: '文字描述修改失败'
              })
            }
          }
        )
        this.loading = false
      } else { // add
        this.$api.post(
          '/case/text/add',
          {
            caseId: this.caseId,
            stage: this.stage,
            info: this.newInfo
          },
          response => { // status, info
            if (response.status === 'success') {
              this.hasInfo = true
              this.info = this.newInfo
              this.id = response.id
              this.$message.success('文字描述新增成功')
              this.newInfo = ''
              this.infoInputVisible = false
            } else {
              this.$notify.error({
                title: '错误',
                message: '文字描述新增失败'
              })
            }
          }
        )
        this.loading = false
      }
    },
    deleteInfo () {
      this.loading = true
      this.$api.post(
        '/case/text/delete',
        {id: this.id},
        response => { // status
          if (response.status === 'success') {
            this.hasInfo = false
            this.info = ''
            this.id = 0
            this.$message.success('文字描述删除成功')
          } else {
            this.$notify.error({
              title: '错误',
              message: '文字描述删除失败'
            })
          }
        }
      )
      this.loading = false
    },

    // picture
    getPicList (param) {
      this.$api.post(
        '/case/picture/all',
        param,
        response => { // status, pictureList[id, url]
          if (response.status === 'success') {
            this.picList = response.pictureList
          } else {
            this.$notify.error({
              title: '错误',
              message: '图片列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    beforePicUpload (file) {
      const isLt4M = file.size / 1024 / 1024 < 4
      const isImage = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/jpg') || (file.type === 'image/bmp') || (file.type === 'image/gif')
      if (!isImage) {
        this.$message.error('请上传图片！')
      }
      if (!isLt4M) {
        this.$message.error('上传头像图片大小不能超过 4MB!')
      }
      return isImage && isLt4M
    },
    handlePicRemove (file, fileList) {
      this.$api.post(
        '/case/picture/delete',
        { // id
          id: file.id
        },
        response => { // status
          if (response.status === 'success') {
            this.$message.success('图片成功删除')
          } else {
            this.$notify.error({
              title: '错误',
              message: '图片删除失败'
            })
          }
        }
      )
    },
    handlePicProgress (event, file, fileList) { // 文件上传时的钩子
      this.loading = true
    },
    handlePicSuccess (res, file, fileList) {
      this.$message.success('图片已成功上传至服务器，其URL正在写入数据库，请稍等~')
      this.$api.post(
        '/case/picture/add',
        { // caseId, stage, url
          caseId: this.caseId,
          stage: this.stage,
          url: this.$fileApi.getWebBaseUrl() + res.webURL
        },
        response => { // status
          if (response.status === 'success') {
            this.$message.success('图片URL成功写入数据库')
          } else {
            this.$notify.error({
              title: '错误',
              message: '图片写入数据库失败'
            })
          }
          this.loading = false
        }
      )
    },

    // video
    getVideoList (param) {
      this.$api.post(
        '/case/video/all',
        param,
        response => { // status, videoList[id, url]
          if (response.status === 'success') {
            // 因为video上传的饿了么组件需要一个name展示，所以手动添加一个name
            response.videoList.forEach((video, index) => {
              video = {
                id: video.id,
                url: video.url,
                name: '视频' + (index + 1)
              }
              this.videoList.push(video)
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '图片列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    beforeVideoUpload (file) {
      const isLt50M = file.size / 1024 / 1024 < 50
      const isVideo = file.type.indexOf('video') !== -1
      if (!isVideo) {
        this.$message.error('请上传视频！')
      }
      if (!isLt50M) {
        this.$message.error('上传头像视频大小不能超过 50MB!')
      }
      return isVideo && isLt50M
    },
    handleVideoRemove (file, fileList) {
      this.$api.post(
        '/case/video/delete',
        { // id
          id: file.id
        },
        response => { // status
          if (response.status === 'success') {
            this.$message.success('视频成功删除')
          } else {
            this.$notify.error({
              title: '错误',
              message: '视频删除失败'
            })
          }
        }
      )
    },
    handleVideoProgress (event, file, fileList) { // 文件上传时的钩子
      this.loading = true
    },
    handleVideoSuccess (res, file, fileList) {
      this.$message.success('视频已成功上传至服务器，其URL正在写入数据库，请稍等~')
      this.$api.post(
        '/case/video/add',
        { // caseId, stage, url
          caseId: this.caseId,
          stage: this.stage,
          url: this.$fileApi.getWebBaseUrl() + res.webURL
        },
        response => { // status
          if (response.status === 'success') {
            this.$message.success('视频URL成功写入数据库')
          } else {
            this.$notify.error({
              title: '错误',
              message: '视频写入数据库失败'
            })
          }
          this.loading = false
        }
      )
    }
  }
}
</script>
