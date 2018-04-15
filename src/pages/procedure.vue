<template>
  <el-container direction="vertical" style="padding: 20px 50px">
    <my-breadcrumb v-bind:index=3></my-breadcrumb>

    <!-- domainContainer -->
    <el-container v-if="domainContainerVisible" direction="vertical">
      <el-row>
        <el-col :span="9">
          <el-input type="text" placeholder="流程名" clearable v-model="operatingDomain.domain" :maxlength="255" style="width: 140px"></el-input>
          <el-select placeholder="请选择角色名" v-model="operatingDomain.roleId" style="width: 140px">
            <el-option v-for="role in roleOptions" :key="role.id" :label="role.label" :value="role.id"></el-option>
          </el-select>
          <el-button type="primary" @click="addDomain" icon="el-icon-plus">快速新增流程</el-button>
        </el-col>

        <el-col :span="15" class="row-right-col-center">
          <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10]"
          :page-size="pageSize"
          layout="total, prev, pager, next, sizes"
          :total="domainList.length">
          </el-pagination>
        </el-col>
      </el-row>

      <el-table style="flex: inherit" stripe :data="domainList.slice((currentPage-1)*pageSize, currentPage*pageSize)" key="domainTable">
        <el-table-column prop="domain" label="流程名"></el-table-column>
        <el-table-column prop="roleId" label="角色名">
          <template slot-scope="scope">
            <el-tag :type="scope.row.roleId === 1 ? 'primary' : (scope.row.roleId === 2 ? 'success' : 'warning')" close-transition>{{showRole(scope.row.roleId)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="350px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="medium" icon="el-icon-info" @click="showDomainDetail(scope.row.roleId, scope.row.domain)">查看详情</el-button>
              <el-button type="primary" size="medium" icon="el-icon-edit" @click="showUpdateDomainDialog(scope.row.roleId, scope.row.domain)">修改基本信息</el-button>
              <el-button type="primary" size="medium" icon="el-icon-delete" @click="deleteDomain(scope.row.roleId, scope.row.domain)"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="修改流程基本信息"
        :visible.sync="updateDomainDialogVisible"
        width="30%">
        <el-form label-position="left" ref="updateDomainForm">
          <el-form-item label="流程名">
            <el-input type="text" clearable v-model="updatingDomain.newDomain" style="width: 150px" placeholder="请输入新流程名" :maxlength="255"></el-input>
          </el-form-item>
          <el-form-item label="角色名">
            <el-select placeholder="请选择新角色名" v-model="updatingDomain.newRoleId" style="width: 150px">
              <el-option v-for="role in roleOptions" :key="role.id" :label="role.label" :value="role.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateDomain">确定</el-button>
        </span>
      </el-dialog>

    </el-container>

    <!-- stepContainer -->
    <el-container v-else direction="vertical">
      <el-row>
        <el-col :span="5">
          <el-button type="primary" icon="el-icon-d-arrow-left" @click="switchContainer(-1)">返回 </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addStepDialogVisible = true">插入步骤</el-button>
        </el-col>
        <el-col :span="19" class="row-right-col-center">
          <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10]"
          :page-size="pageSize"
          layout="total, prev, pager, next, sizes"
          :total="stepList.length">
          </el-pagination>
        </el-col>
      </el-row>

      <el-table style="flex: inherit" stripe :data="stepList.slice((currentPage-1)*pageSize, currentPage*pageSize)" key="stepTable">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="top">
              <el-form-item label="步骤详情（完整）" v-if="props.row.info.length > 40">
                <span>{{ props.row.info }}</span>
              </el-form-item>
              <el-form-item label="图片列表">
                <a v-for="pic in props.row.pictureList" :key="pic.id" :href="pic.url" target="_Blank">
                  <img :src="pic.url" alt="图片" style="width: 20%; height: 200px; margin: 10px">
                </a>
              </el-form-item>
              <el-form-item label="视频列表">
                 <a v-for="video in props.row.videoList" :key="video.id" :href="video.url" target="_Blank">
                  <video :src="video.url" alt="视频" style="width: 20%; height: 200px; margin: 10px" controls="controls"></video>
                </a>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="step" label="步骤号" width="100px"></el-table-column>
        <el-table-column prop="stepName" label="步骤名" width="250px"></el-table-column>
        <el-table-column label="步骤详情">
          <template slot-scope="props">
            <span>{{showStepInfo(props.row.info)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="350px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="medium" icon="el-icon-arrow-up" :disabled="isOperationDisabled('up', scope.row.step)" @click="stepUp(scope.row.id)"></el-button>
              <el-button type="primary" size="medium" icon="el-icon-arrow-down" :disabled="isOperationDisabled('down', scope.row.step)" @click="stepDown(scope.row.id)"></el-button>
              <el-button type="primary" size="medium" icon="el-icon-edit" @click="showUpdateStepDialog(scope.row.id, scope.row.stepName, scope.row.info, scope.row.pictureList, scope.row.videoList)"></el-button>
              <el-button type="primary" size="medium" icon="el-icon-delete" @click="deleteStep(scope.row.id)"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="修改步骤"
        :visible.sync="updateStepDialogVisible"
        :before-close="handleClose2"
        v-loading="loadingUpdateStepDialog">
        <el-steps :active="updateStepDialogPanel" simple>
          <el-step title="基本信息" icon="el-icon-edit"></el-step>
          <el-step title="图片列表" icon="el-icon-picture"></el-step>
          <el-step title="视频列表" icon="el-icon-caret-right"></el-step>
        </el-steps>
        <el-form>
          <el-form-item label="步骤名" v-if="updateStepDialogPanel === 0">
            <el-input type="text" clearable v-model="updatingStep.stepName" :maxlength="255"></el-input>
          </el-form-item>
          <el-form-item label="步骤详情" v-if="updateStepDialogPanel === 0">
            <el-input type="textarea" autosize clearable v-model="updatingStep.info" :maxlength="255"></el-input>
          </el-form-item>
          <el-upload ref="uploadedPictures" v-else-if="updateStepDialogPanel === 1" style="margin-top: 20px"
            :action="this.$fileApi.getUploadUrl()"
            list-type="picture-card"
            accept="image/*"
            :file-list="updatingStep.pictureList"
            :before-upload="beforePicUpload"
            :on-preview="handlePictureCardPreview"
            :on-progress="handlePicProgress"
            :on-success="handlePicSuccess"
            :on-remove="handlePicRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-upload v-else style="margin-top: 20px"
            accept="video/*"
            :file-list="updatingStep.videoList"
            :action="this.$fileApi.getUploadUrl()"
            :before-upload="beforeVideoUpload"
            :on-progress="handleVideoProgress"
            :on-success="handleVideoSuccess"
            :on-remove="handleVideoRemove">
            <el-button type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传视频文件，且大小不超过50MB</div>
          </el-upload>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="updateStepDialogPanel === 0" type="primary" @click="updateStep">确定</el-button>
          <el-button v-if="updateStepDialogPanel !== 2" @click="next">下一步</el-button>
          <el-button v-else @click="next">关闭</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

      <el-dialog title="插入步骤"
        :before-close="handleClose"
        :visible.sync="addStepDialogVisible">
        <el-form>
          <el-form-item label="步骤号">
            <el-input type="text" clearable v-model="addingStep.step" @keyup.native="addingStep.step=addingStep.step.replace(/[^\d]/ig,'')"></el-input>
            <el-alert title="填入步骤号，表示插入到当前列表的该步之前；若不填，系统默认添加到列表尾部" type="info" show-icon close-text="知道了"></el-alert>
          </el-form-item>
          <el-form-item label="步骤名">
            <el-input type="text" clearable v-model="addingStep.stepName" :maxlength="255"></el-input>
          </el-form-item>
          <el-form-item label="步骤详情">
            <el-input type="textarea" autosize clearable v-model="addingStep.info" :maxlength="255"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-alert title="相关图片和视频请在新增后再点击修改按钮" type="info" show-icon close-text="知道了"></el-alert>
          <el-button type="primary" @click="addStep">确定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
import myBreadcrumb from '../components/breadcrumb'
export default {
  components: {
    myBreadcrumb
  },
  data () {
    return {
      // display
      currentPage: 1,
      pageSize: 5,
      domainContainerVisible: true,

      // domain
      operatingDomain: {}, // addDomain / showDomainDetail
      updatingDomain: {}, // updateDomain
      domainList: [],
      roleOptions: [
        {id: 1, label: '前台'},
        {id: 2, label: '医助'},
        {id: 3, label: '医师'}
      ],
      updateDomainDialogVisible: false,

      // step
      stepList: [],
      addingStep: {}, // 只包含stepName, info
      updatingStep: {}, // 只包含(step)id, stepName, info
      addStepDialogVisible: false,
      updateStepDialogVisible: false,
      updateStepDialogPanel: 0,
      loadingUpdateStepDialog: false,
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created () {
    this.resetOperatingDomain()
    this.resetAddingStep()
    this.getDomainList()
    this.$root.Bus.$emit('updateIndex', '/procedure')
  },
  methods: {
    // display
    showRole (id) {
      if (id === 1) return '前台'
      else if (id === 2) return '医助'
      else return '医师'
    },
    handleSizeChange: function (size) {
      this.pageSize = size
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    switchContainer (option) { // 重置分页参数
      if (option === -1) {
        this.domainContainerVisible = true // 后退到domain
        this.getDomainList()
        this.resetOperatingDomain()
      } else {
        this.domainContainerVisible = false // 前进到step
        this.domainList = {}
      }
      this.currentPage = 1
      this.pageSize = 5
    },
    resetOperatingDomain () {
      this.operatingDomain = {roleId: null, domain: ''}
    },

    // domain
    getDomainList () {
      // this.domainList = [ // 不包括procedure表的id
      //   {roleId: 1, domain: 'd1'},
      //   {roleId: 2, domain: 'd2'},
      //   {roleId: 3, domain: 'd3'},
      //   {roleId: 2, domain: 'd4'}
      // ]
      this.$api.post(
        '/procedure/all',
        null,
        response => { // status, procedureList[roleId, domain]
          if (response.status === 'success') {
            this.domainList = response.procedureList
          } else {
            this.$notify.error({
              title: '错误',
              message: '获取流程列表失败，请等待后重试'
            })
          }
        }
      )
    },
    addDomain () {
      if (this.operatingDomain.roleId === null || this.operatingDomain.domain === '') {
        this.$message.error('请输入流程名和选择角色名后再添加流程~')
      } else {
        this.switchContainer(1) // 强制跳转到流程详情页(无需查api，因为必然没有任何step)
      }
    },
    showDomainDetail (roleId, domain) {
      this.switchContainer(1) // 主动跳转到流程详情页

      this.operatingDomain.roleId = roleId
      this.operatingDomain.domain = domain

      this.getStepList()
    },
    showUpdateDomainDialog (roleId, domain) {
      this.updateDomainDialogVisible = true
      this.updatingDomain.oldRoleId = roleId
      this.updatingDomain.oldDomain = domain
      this.updatingDomain.newRoleId = roleId
      this.updatingDomain.newDomain = domain
    },
    updateDomain () {
      if (this.updatingDomain.newDomain === '') {
        this.$message.error('请输入新流程名')
      } else {
        this.$api.post(
          '/procedure/update',
          {
            roleId: this.updatingDomain.oldRoleId,
            domain: this.updatingDomain.oldDomain,
            newRoleId: this.updatingDomain.newRoleId,
            newDomain: this.updatingDomain.newDomain
          },
          response => { // status
            if (response.status === 'success') {
              this.$message.success('修改流程基本信息成功')
              this.getDomainList()
              this.updateDomainDialogVisible = false
            } else if (response.status === 'invalidInputFail') {
              this.$notify.error({
                title: '错误',
                message: '新流程名含有非法字符，请重新输入'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: '修改流程基本信息失败，请等待后重试'
              })
            }
          }
        )
      }
    },
    deleteDomain (roleId, domain) {
      this.$api.post(
        '/procedure/delete',
        {roleId: roleId, domain: domain},
        response => { // status
          if (response.status === 'success') {
            this.getDomainList()
            this.$message.success('删除流程\'' + domain + '\'成功')
          } else {
            this.$notify.error({
              title: '错误',
              message: '删除流程失败，请等待后重试'
            })
          }
        }
      )
    },

    // step
    stepCompare (a, b) {
      return a.step - b.step
    },
    getStepList () {
      // this.stepList = this.zyyStepList()
      this.$api.post(
        '/procedure/step/all',
        {roleId: this.operatingDomain.roleId, domain: this.operatingDomain.domain},
        response => { // status, stepList[id, roleId, domain, step, stepName, info，pictureList[picture对象], videoList[video对象]]
          if (response.status === 'success') {
            this.stepList = response.stepList
            this.stepList.sort(this.stepCompare) // 按照step由小到大排序
          } else {
            this.$notify.error({
              title: '错误',
              message: '获取步骤列表失败，请等待后重试'
            })
          }
        }
      )
    },
    showStepInfo (info) {
      if (info.length > 40) return info.substr(0, 40) + '...'
      else return info
    },
    resetAddingStep () {
      this.addingStep = {step: null, stepName: '', info: ''}
    },
    handleClose (done) { // 增加步骤
      this.resetAddingStep()
      done()
    },
    addStep () {
      if (this.addingStep.stepName === '') {
        this.$message.error('请输入步骤名')
        return
      }
      if (this.addingStep.step === null || this.addingStep.step === '') {
        this.$message.info('检测到未输入步骤号，将默认添加至列表尾部')
        this.addingStep.step = this.stepList.length + 1
      }
      if (this.addingStep.step > this.stepList.length + 1 || this.addingStep.step <= 0) {
        this.$message.error('请输入合法的步骤号，不能跳跃增加步骤！')
        return
      }

      this.$api.post(
        '/procedure/add',
        { // roleId, domain, step, stepName, info, pictures[], videos[]
          roleId: this.operatingDomain.roleId,
          domain: this.operatingDomain.domain,
          step: this.addingStep.step,
          stepName: this.addingStep.stepName,
          info: this.addingStep.info
        },
        response => { // status
          if (response.status === 'success') {
            this.getStepList()
            this.resetAddingStep()
            this.$message.success('步骤插入成功')
            this.addStepDialogVisible = false
          } else if (response.status === 'invalidInputFail') {
            this.$notify.error({
              title: '错误',
              message: '流程名/步骤名/步骤详情含有非法字符'
            })
          } else if (response.status === 'stepFail') {
            this.$notify.error({
              title: '错误',
              message: '不能跳跃增加步骤！'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '步骤插入失败，请等待后重试'
            })
          }
        }
      )
    },
    isOperationDisabled (operationName, step) {
      // 当disabled = false, 也就是button可点击
      if (operationName === 'up' && step === 1) return true
      if (operationName === 'down' && step === this.stepList.length) return true
      return false
    },
    stepUp (id) {
      this.$api.post(
        '/procedure/step/up',
        {id: id},
        response => { // status
          if (response.status === 'success') {
            this.getStepList()
            this.$message.success('步骤上移成功')
          } else {
            this.$notify.error({
              title: '错误',
              message: '步骤上移失败，请等待后重试'
            })
          }
        }
      )
    },
    stepDown (id) {
      this.$api.post(
        '/procedure/step/down',
        {id: id},
        response => { // status
          if (response.status === 'success') {
            this.getStepList()
            this.$message.success('步骤下移成功')
          } else {
            this.$notify.error({
              title: '错误',
              message: '步骤下移失败，请等待后重试'
            })
          }
        }
      )
    },
    showUpdateStepDialog (id, stepName, info, pictureList, videoList) {
      this.updateStepDialogVisible = true
      this.updatingStep.id = id
      this.updatingStep.stepName = stepName
      this.updatingStep.info = info
      this.updatingStep.pictureList = pictureList
      // this.updatingStep.videoList = videoList
      // 因为video上传的饿了么组件需要一个name展示，所以手动添加一个name
      this.updatingStep.videoList = []
      videoList.forEach((video, index) => {
        video = {
          id: video.id,
          url: video.url,
          name: '视频' + (index + 1)
        }
        this.updatingStep.videoList.push(video)
      })
    },
    deleteStep (id) {
      this.$api.post(
        '/procedure/step/delete',
        {id: id},
        response => { // status
          if (response.status === 'success') {
            this.getStepList()
            this.$message.success('步骤删除成功')
          } else {
            this.$notify.error({
              title: '错误',
              message: '步骤删除失败，请等待后重试'
            })
          }
        }
      )
    },
    zyyStepList () {
      return [
        {
          'id': 11,
          'roleId': 1,
          'domain': '前台流程1',
          'step': 1,
          'stepName': '第一步',
          'info': '前台用户的流程1的第一步的描述，具体要干什么事',
          'pictureList': [],
          'videoList': []
        },
        {
          'id': 12,
          'roleId': 1,
          'domain': '前台流程1',
          'step': 2,
          'stepName': '第二步',
          'info': '前台用户的流程1的第一步的描述，具体要干什么事',
          'pictureList': [],
          'videoList': []
        },
        {
          'id': 19,
          'roleId': 1,
          'domain': '前台流程1',
          'step': 3,
          'stepName': '第3步',
          'info': '前台用户的流程1的第一步的描述，具体要干什么事',
          'pictureList': [
            {
              'id': 22,
              'procedureId': 19,
              'url': 'PicUrlTest2018040610'
            },
            {
              'id': 23,
              'procedureId': 19,
              'url': 'PicUrlTest2018040611'
            }
          ],
          'videoList': [
            {
              'id': 12,
              'procedureId': 19,
              'url': 'videoUrlTest2018040610'
            }
          ]
        },
        {
          'id': 20,
          'roleId': 1,
          'domain': '前台流程1',
          'step': 4,
          'stepName': '第4步',
          'info': '前台用户的流程1的第4步的描述，具体要干什么事',
          'pictureList': [
            {
              'id': 24,
              'procedureId': 20,
              'url': 'kkkkkkkk'
            }
          ],
          'videoList': []
        }
      ]
    },
    handleClose2 (done) { // 修改步骤
      this.updateStepDialogPanel = 0
      done()
    },
    next () {
      this.updateStepDialogPanel++
      if (this.updateStepDialogPanel === 3) {
        this.updateStepDialogPanel = 0
        this.updateStepDialogVisible = false
      }
    },
    updateStep () { // 修改步骤的基本信息
      if (this.updatingStep.stepName === '') {
        this.$message.error('请输入新步骤名')
        return
      }
      this.$api.post(
        '/procedure/step/update',
        {
          id: this.updatingStep.id,
          stepName: this.updatingStep.stepName,
          info: this.updatingStep.info
        },
        response => { // status
          if (response.status === 'success') {
            this.getStepList()
            this.$message.success('步骤基本信息修改成功')
            this.next()
          } else {
            this.$notify.error({
              title: '错误',
              message: '步骤基本信息修改失败，请等待后重试'
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
        '/procedure/picture/delete',
        { // stepId, url
          id: file.id
        },
        response => { // status
          if (response.status === 'success') {
            this.$message.success('图片成功删除')
            this.getStepList()
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
      this.loadingUpdateStepDialog = true
    },
    handlePicSuccess (res, file, fileList) {
      this.$message.success('图片已成功上传至服务器，其URL正在写入数据库，请稍等~')
      this.$api.post(
        '/procedure/picture/add',
        { // stepId, url
          stepId: this.updatingStep.id,
          url: this.$fileApi.getWebBaseUrl() + res.webURL
        },
        response => { // status
          if (response.status === 'success') {
            this.$message.success('图片URL成功写入数据库')
            this.getStepList()
            file.id = response.id // for /picture/delete
          } else if (response.status === 'inputFail') {
            this.$notify.error({
              title: '错误',
              message: '图片的URL重复，无法写入数据库'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '图片写入数据库失败'
            })
          }
          this.loadingUpdateStepDialog = false
        }
      )
    },
    handlePictureCardPreview (file) { // 图片放大预览
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
        '/procedure/video/delete',
        { // stepId, url
          id: file.id
        },
        response => { // status
          if (response.status === 'success') {
            this.$message.success('视频成功删除')
            this.getStepList()
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
      this.loadingUpdateStepDialog = true
    },
    handleVideoSuccess (res, file, fileList) {
      this.$message.success('视频已成功上传至服务器，其URL正在写入数据库，请稍等~')
      this.$api.post(
        '/procedure/video/add',
        { // stepId, url
          stepId: this.updatingStep.id,
          url: this.$fileApi.getWebBaseUrl() + res.webURL
        },
        response => { // status
          if (response.status === 'success') {
            this.$message.success('视频URL成功写入数据库')
            this.getStepList()
            file.id = response.id
          } else if (response.status === 'inputFail') {
            this.$notify.error({
              title: '错误',
              message: '视频的URL重复，无法写入数据库'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '视频写入数据库失败'
            })
          }
          this.loadingUpdateStepDialog = false
        }
      )
    }
  }
}
</script>

<style scoped>
.row-right-col-center {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
</style>
