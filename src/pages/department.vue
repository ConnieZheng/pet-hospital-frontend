<template>
  <el-container direction="vertical" style="padding: 50px">
    <my-breadcrumb v-bind:index=4></my-breadcrumb>

    <el-row>
      <el-col :span="2">
        <el-button type="primary" @click="addDeptDialogVisible = true" icon="el-icon-plus">增加科室</el-button>
      </el-col>

      <el-col :span="19" class="row-col-center">
        <el-pagination background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes"
        :total="filteredDeptList.length">
        </el-pagination>
      </el-col>

      <el-col :span="3">
        <el-input type="text" placeholder="科室名" v-model="name" @keyup.enter.native="getDeptList" style="width: 120px;">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-row>

    <el-table stripe :data="filteredDeptList.slice((currentPage-1)*pageSize,currentPage*pageSize)" @filter-change="roleFilterChange">
      <el-table-column type="expand">
        <template slot-scope="currentRowScope">
          <div style="display: flex; align-items: flex-start">
            <img v-if="currentRowScope.row.picture" :src="currentRowScope.row.picture" style="max-height: 300px; width: 45%; margin-right: 10px" :alt="currentRowScope.row.picture">
            <div v-else style="max-height: 300px; width: 45%; margin-right: 10px">无科室照片</div>
            <div>
              <b style="margin: 30px">科室信息</b>
              <el-button type="primary" @click="showDrugDialog(currentRowScope.row.id)" size="small">查看相关药品</el-button>
              <el-button type="primary" @click="showFacDialog(currentRowScope.row.id)" size="small">查看相关设备</el-button>
              <br />
              <div style="margin: 30px">{{ currentRowScope.row.info }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="name" label="科室名">
      </el-table-column>
      <el-table-column prop="role" label="角色" :filters="roleList" :filter-multiple="false" filter-placement="bottom-start" :filter-method="roleFilterHandler" column-key="role">
        <template slot-scope="scope">
          <el-tag :type="scope.row.role === 1 ? 'primary' : (scope.row.role === 2 ? 'success' : 'warning')" close-transition>{{showRole(scope.row.role)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="240">
        <template slot-scope="currentRowScope">
          <el-button @click="showModifyDeptDialog(currentRowScope.row)" type="primary" size="small" icon="el-icon-delete">修改科室</el-button>
          <el-button @click="removeDept(currentRowScope.row.id)" type="primary" size="small" icon="el-icon-delete">删除科室</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="增加科室"
      :visible.sync="addDeptDialogVisible"
      :before-close="handleAddDialogClose"
      width="50%">
      <el-form ref="addDeptForm" :model="operatingDept" label-width="80px" :rules="deptRule" size="small"  label-position="left">
        <el-form-item label="科室名" prop="name">
          <el-input v-model="operatingDept.name"/>
        </el-form-item>
        <el-form-item inline label="角色" prop="role">
          <el-select v-model="operatingDept.role" filterable placeholder="请选择(支持搜索)">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室信息" prop="info">
          <el-input v-model="operatingDept.info"/>
        </el-form-item>
        <!-- https://www.ecnupet.cn/pet/file -->
        <el-form-item label="科室照片">
          <el-upload
            class="avatar-uploader"
            action="http://111.231.62.36:8080/pet/file"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="this.operatingDept.picture" :src="this.operatingDept.picture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDept">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改科室"
      :visible.sync="modifyDeptDialogVisible"
      :before-close="handleModifyDialogClose"
      width="50%">
      <el-form ref="modifyDeptForm" :model="operatingDept" label-width="80px" :rules="deptRule" size="small"  label-position="left">
        <el-form-item label="科室名" prop="name">
          <el-input v-model="operatingDept.name"/>
        </el-form-item>
        <el-form-item inline label="角色" prop="role">
          <el-select v-model="operatingDept.role" filterable placeholder="请选择(支持搜索)">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室信息" prop="info">
          <el-input v-model="operatingDept.info"/>
        </el-form-item>
        <el-form-item label="科室照片">
          <el-upload
            class="avatar-uploader"
            action="http://111.231.62.36:8080/pet/file"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="this.operatingDept.picture" :src="this.operatingDept.picture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyDept">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="科室相关药品" :visible.sync="drugDialogVisible" :before-close="handleDrugDialogClose">
      <el-transfer v-loading="loadingDrugDialog"
        filterable
        v-model="selectedDrugList"
        :titles="['其余可选药品', '本科室相关药品']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        :props="{
          key: 'id',
          label: 'name'
        }"
        @change="handleDrugChange"
        :data="allDrugList">
        <el-button type="primary" size="small" slot="left-footer" style="margin-left: 20px" icon="el-icon-plus" @click="addDrugDialogVisible = true">增加药品</el-button>
        <div slot="right-footer" style="height: 12px"></div>
      </el-transfer>
    </el-dialog>

    <el-dialog title="增加药品"
      :visible.sync="addDrugDialogVisible"
      :before-close="handleAddDrugDialogClose"
      width="50%">
      <el-form ref="addDrugForm" :model="operatingDrug" label-width="80px" :rules="drugRule" size="small"  label-position="left">
        <el-form-item label="药品名" prop="name">
          <el-input v-model="operatingDrug.name"/>
        </el-form-item>
        <el-form-item label="药品信息" prop="info">
          <el-input v-model="operatingDrug.info"/>
        </el-form-item>
        <!-- https://www.ecnupet.cn/pet/file -->
        <el-form-item label="药品照片">
          <el-upload
            class="avatar-uploader"
            action="http://111.231.62.36:8080/pet/file"
            :show-file-list="false"
            :on-success="handleDrugSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="this.operatingDrug.picture" :src="this.operatingDrug.picture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDrug">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="科室相关设备" :visible.sync="facDialogVisible" :before-close="handleFacDialogClose">
      <el-transfer v-loading="loadingFacDialog"
        filterable
        v-model="selectedFacList"
        :titles="['其余可选设备', '本科室相关设备']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        :props="{
          key: 'id',
          label: 'name'
        }"
        @change="handleFacChange"
        :data="allFacList">
        <el-button type="primary" size="small" slot="left-footer" style="margin-left: 20px" icon="el-icon-plus" @click="addFacDialogVisible = true">增加设备</el-button>
        <div slot="right-footer" style="height: 12px"></div>
      </el-transfer>
    </el-dialog>

    <el-dialog title="增加设备"
      :visible.sync="addFacDialogVisible"
      :before-close="handleAddFacDialogClose"
      width="50%">
      <el-form ref="addFacForm" :model="operatingFac" label-width="80px" :rules="facRule" size="small"  label-position="left">
        <el-form-item label="设备名" prop="name">
          <el-input v-model="operatingFac.name"/>
        </el-form-item>
        <el-form-item label="设备信息" prop="info">
          <el-input v-model="operatingFac.info"/>
        </el-form-item>
        <!-- https://www.ecnupet.cn/pet/file -->
        <el-form-item label="设备照片">
          <el-upload
            class="avatar-uploader"
            action="http://111.231.62.36:8080/pet/file"
            :show-file-list="false"
            :on-success="handleFacSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="this.operatingFac.picture" :src="this.operatingFac.picture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addFac">确定</el-button>
      </span>
    </el-dialog>

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
      deptList: [],
      name: '',
      roleFilter: '',
      currentPage: 1,
      pageSize: 5,
      addDeptDialogVisible: false,
      modifyDeptDialogVisible: false,
      deptRule: {
        name: [
          { required: true, message: '请输入科室名', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        info: [
          { min: 0, max: 255, message: '科室信息的合法长度为0-255个字符', trigger: 'change,blur' }
        ]
      },
      operatingDept: {},
      roleList: [
        {text: '前台', value: 1},
        {text: '医助', value: 2},
        {text: '医师', value: 3}
      ],
      // drug
      drugDialogVisible: false,
      drugList: [],
      selectedDrugList: [], // 仅包含drug_id的数组，用于transfer显示
      allDrugList: [],
      loadingDrugDialog: false,
      addDrugDialogVisible: false,
      operatingDrug: {
        id: 0,
        name: '',
        info: '',
        picture: ''
      },
      drugRule: {
        name: [
          { required: true, message: '请输入药品名', trigger: 'blur' }
        ],
        info: [
          { min: 0, max: 255, message: '药品信息的合法长度为0-255个字符', trigger: 'change,blur' }
        ]
      },
      // facility
      facDialogVisible: false,
      facList: [],
      selectedFacList: [],
      allFacList: [],
      loadingFacDialog: false,
      addFacDialogVisible: false,
      operatingFac: {
        id: 0,
        name: '',
        info: '',
        picture: ''
      },
      facRule: {
        name: [
          { required: true, message: '请输入药品名', trigger: 'blur' }
        ],
        info: [
          { min: 0, max: 255, message: '药品信息的合法长度为0-255个字符', trigger: 'change,blur' }
        ]
      }
    }
  },
  created () {
    this.getDeptList()
    this.resetOperatingDept()
    this.getAllDrugList()
    this.getAllFacList()
  },
  computed: {
    filteredDeptList () {
      if (this.roleFilter === '') return this.deptList
      else {
        return this.deptList.filter(function (dept) {
          return dept.role === this.roleFilter
        }.bind(this))
      }
    }
  },
  methods: {
    getDeptList () {
      // if (!this.name) {
      //   this.deptList = [
      //     {id: 1, name: 'dept1', role: 1, info: 'test', picture: 'http://111.231.62.36:8080/pet/img/c6b67855-41ef-4acc-9359-483c1a7213d61.jpg'},
      //     {id: 2, name: 'dept2', role: 2, info: '', picture: ''},
      //     {id: 3, name: 'dept3', role: 3, info: '', picture: ''}
      //   ]
      // } else {
      //   this.deptList = [
      //     {id: 2, name: 'dept2', role: 2, info: '', picture: ''},
      //     {id: 3, name: 'dept3', role: 3, info: '', picture: ''}
      //   ]
      // }
      this.$api.post(
        '/department/filter',
        {name: this.name},
        response => { // status, departmentList[id, name, role, info, picture]
          if (response.status === 'success') {
            this.deptList = response.departmentList
          } else {
            this.$notify.error({
              title: '错误',
              message: '科室列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    roleFilterChange (columnKey) {
      if (columnKey.role.length === 0) this.roleFilter = ''
      else this.roleFilter = columnKey.role[0]
    },
    showRole (role) {
      if (role === 1) return '前台'
      else if (role === 2) return '医助'
      else return '医师'
    },
    handleSizeChange: function (size) {
      this.pageSize = size
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    roleFilterHandler (value, row, column) {
      const property = column['property'] // property就是prop属性
      return row[property] === value
    },
    resetOperatingDept () {
      this.operatingDept = {
        id: 0,
        name: '',
        role: 1,
        info: '',
        picture: '' // 111.231.62.36:8080/pet/img/70e48e31-ca48-4dd9-94d0-9cf3dcb520d72.jpg
      }
    },
    handleAvatarSuccess (res, file) {
      this.operatingDept.picture = 'http://111.231.62.36:8080/pet/' + res.webURL
      // this.operatingDept.picture = 'https://www.ecnupet.cn/pet/' + res.webURL
      this.$message.success('科室图片已成功上传至服务器~')
      console.log('科室图片的URL为' + this.operatingDept.picture)
    },
    beforeAvatarUpload (file) {
      const isLt4M = file.size / 1024 / 1024 < 4
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/jpg') || (file.type === 'image/bmp') || (file.type === 'image/gif')
      if (!isJPG) {
        this.$message.error('请上传图片！')
      }
      if (!isLt4M) {
        this.$message.error('上传头像图片大小不能超过 4MB!')
      }
      return isJPG && isLt4M
    },
    addDept () {
      this.$refs['addDeptForm'].validate((valid) => {
        if (valid) {
          this.$api.post(
            '/department/add',
            this.operatingDept,
            response => { // status, id, name, role, info, picture
              if (response.status === 'success') {
                this.deptList.push(response) // TODO: check
                this.$notify.success({
                  title: '成功',
                  message: '新科室ID为' + response.id
                })
                // this.$refs['addDeptForm'].resetFields()
                this.resetOperatingDept()
                this.addDeptDialogVisible = false
              } else if (response.status === 'inputFail') {
                this.$notify.error({
                  title: '错误',
                  message: '新增的科室名已经存在'
                })
              } else if (response.status === 'invalidInputFail') {
                this.$notify.error({
                  title: '错误',
                  message: '新增的科室名或者信息不合法'
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '新增试题失败，请等待后重试'
                })
              }
            }
          )
        }
      })
    },
    handleAddDialogClose (done) {
      this.$refs['addDeptForm'].resetFields()
      this.resetOperatingDept()
      done()
    },
    showModifyDeptDialog (row) {
      this.modifyDeptDialogVisible = true
      this.operatingDept = row
    },
    handleModifyDialogClose (done) {
      this.$refs['modifyDeptForm'].resetFields()
      this.resetOperatingDept()
      done()
    },
    modifyDept () {
      this.$refs['modifyDeptForm'].validate((valid) => {
        if (valid) {
          this.$api.post(
            '/department/update',
            this.operatingDept,
            response => { // status
              if (response.status === 'success') {
                this.getDeptList()
                this.$notify.success({
                  title: '成功',
                  message: '已成功修改ID为' + this.operatingDept.id + '的科室'
                })
                this.resetOperatingDept()
                this.modifyDeptDialogVisible = false
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '修改科室信息失败，请等待后重试'
                })
              }
            }
          )
        }
      })
    },
    removeDept (id) {
      this.$api.post(
        '/department/delete',
        {id: id},
        response => { // status
          if (response.status === 'success') {
            this.getDeptList()
            this.$notify.success({
              title: '成功',
              message: '已成功删除ID为' + id + '的科室题'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '删除科室信息失败，请等待后重试'
            })
          }
        }
      )
    },

    // drug
    getAllDrugList () {
      this.$api.post(
        '/drug/all',
        null,
        response => { // status, drugList[id, name, info, picture]
          if (response.status === 'success') {
            this.allDrugList = response.drugList
          } else {
            this.$notify.error({
              title: '错误',
              message: '药品列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    getDrugList (deptId) {
      this.loadingDrugDialog = true
      this.$api.post(
        '/department/drug/all',
        {id: deptId},
        response => { // status, status, drugList[id, name, info, picture]
          if (response.status === 'success') {
            this.drugList = response.drugList
            this.loadingDrugDialog = false
            this.drugList.forEach((drug, index) => {
              this.selectedDrugList.push(drug.id)
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '科室相关药品列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    showDrugDialog (id) {
      this.drugDialogVisible = true
      this.operatingDept.id = id
      this.getDrugList(id)
    },
    handleDrugChange (value, direction, movedKeys) {
      // [1, 2] "left" [3]
      if (direction === 'right') {
        this.loadingDrugDialog = true
        this.$api.post(
          '/department/drug/add',
          { // id, drugList[]
            id: this.operatingDept.id,
            drugList: movedKeys
          },
          response => { // status
            if (response.status === 'success') {
              this.loadingDrugDialog = false
              this.$notify.success({
                title: '成功',
                message: '科室相关药品增加成功'
              })
            } else if (response.status === 'inputFail') {
              this.$notify.error({
                title: '错误',
                message: '该科室已有该药品'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: '科室相关药品增加失败'
              })
            }
          }
        )
      } else {
        this.loadingDrugDialog = true
        this.$api.post(
          '/department/drug/delete',
          { // id, drugList[]
            id: this.operatingDept.id,
            drugList: movedKeys
          },
          response => { // status
            if (response.status === 'success') {
              this.loadingDrugDialog = false
              this.$notify.success({
                title: '成功',
                message: '科室相关药品删除成功'
              })
            } else if (response.status === 'inputFail') {
              this.$notify.error({
                title: '错误',
                message: '该科室在数据库中不存在该药品'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: '科室相关药品删除失败'
              })
            }
          }
        )
      }
      console.log(value, direction, movedKeys)
    },
    handleDrugDialogClose (done) {
      this.selectedDrugList = []
      done()
    },
    handleDrugSuccess (res, file) {
      this.operatingDrug.picture = 'http://111.231.62.36:8080/pet/' + res.webURL
      this.$message.success('药品图片已成功上传至服务器~')
      console.log('药品图片的URL为' + this.operatingDrug.picture)
    },
    handleAddDrugDialogClose (done) {
      this.operatingDrug = {id: 0, name: '', info: '', picture: ''}
      done()
    },
    addDrug () {
      this.$api.post(
        '/drug/add',
        this.operatingDrug,
        response => { // status, id, name, info
          if (response.status === 'success') {
            this.$notify.success({
              title: '成功',
              message: '成功增加药品'
            })
            this.addDrugDialogVisible = false
            this.operatingDrug = {id: 0, name: '', info: '', picture: ''}
            this.getAllDrugList()
          } else if (response.status === 'inputFail') {
            this.$notify.error({
              title: '错误',
              message: '新增的药品名已经存在'
            })
          } else if (response.status === 'invalidInputFail') {
            this.$notify.error({
              title: '错误',
              message: '药品名或信息不合法'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '药品列表获取失败，请等待后重试'
            })
          }
        }
      )
    },

    // facility
    getAllFacList () {
      this.$api.post(
        '/facility/all',
        null,
        response => { // status, facilityList[id, name, info, picture]
          if (response.status === 'success') {
            this.allFacList = response.facilityList
          } else {
            this.$notify.error({
              title: '错误',
              message: '设备列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    getFacList (deptId) {
      this.loadingFacDialog = true
      this.$api.post(
        '/department/facility/all',
        {id: deptId},
        response => { // status, status, facilityList[id, name, info, picture]
          if (response.status === 'success') {
            this.facList = response.facilityList
            this.loadingFacDialog = false
            this.facList.forEach((facility, index) => {
              this.selectedFacList.push(facility.id)
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '科室相关设备列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    showFacDialog (id) {
      this.facDialogVisible = true
      this.operatingDept.id = id
      this.getFacList(id)
    },
    handleFacChange (value, direction, movedKeys) {
      // [1, 2] "left" [3]
      if (direction === 'right') {
        this.loadingFacDialog = true
        this.$api.post(
          '/department/facility/add',
          { // id, facilityList[]
            id: this.operatingDept.id,
            facilityList: movedKeys
          },
          response => { // status
            if (response.status === 'success') {
              this.loadingFacDialog = false
              this.$notify.success({
                title: '成功',
                message: '科室相关设备增加成功'
              })
            } else if (response.status === 'inputFail') {
              this.$notify.error({
                title: '错误',
                message: '该科室已有该设备'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: '科室相关设备增加失败'
              })
            }
          }
        )
      } else {
        this.loadingFacDialog = true
        this.$api.post(
          '/department/facility/delete',
          { // id, facilityList[]
            id: this.operatingDept.id,
            facilityList: movedKeys
          },
          response => { // status
            if (response.status === 'success') {
              this.loadingFacDialog = false
              this.$notify.success({
                title: '成功',
                message: '科室相关设备删除成功'
              })
            } else if (response.status === 'inputFail') {
              this.$notify.error({
                title: '错误',
                message: '该科室在数据库中不存在该设备'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: '科室相关设备删除失败'
              })
            }
          }
        )
      }
      console.log(value, direction, movedKeys)
    },
    handleFacDialogClose (done) {
      this.selectedFacList = []
      done()
    },
    handleFacSuccess (res, file) {
      this.operatingFac.picture = 'http://111.231.62.36:8080/pet/' + res.webURL
      this.$message.success('设备图片已成功上传至服务器~')
      console.log('设备图片的URL为' + this.operatingFac.picture)
    },
    handleAddFacDialogClose (done) {
      this.operatingFac = {id: 0, name: '', info: '', picture: ''}
      done()
    },
    addFac () {
      this.$api.post(
        '/facility/add',
        this.operatingFac,
        response => { // status, id, name, info
          if (response.status === 'success') {
            this.$notify.success({
              title: '成功',
              message: '成功增加设备'
            })
            this.addFacDialogVisible = false
            this.operatingFac = {id: 0, name: '', info: '', picture: ''}
            this.getAllFacList()
          } else if (response.status === 'inputFail') {
            this.$notify.error({
              title: '错误',
              message: '新增的设备名已经存在'
            })
          } else if (response.status === 'invalidInputFail') {
            this.$notify.error({
              title: '错误',
              message: '设备名或信息不合法'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '设备列表获取失败，请等待后重试'
            })
          }
        }
      )
    }
  }
}
</script>

<style scoped>
.row-col-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
