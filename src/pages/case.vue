<template>
  <el-container direction="vertical" style="padding: 20px 50px">
    <my-breadcrumb v-bind:index=5></my-breadcrumb>

    <!-- CaseListContainer -->
    <el-container v-if="caseListContainerVisible" direction="vertical">
      <el-row>
        <el-col :span="12">
          <el-input type="text" placeholder="病例名" clearable v-model="addingCase.name" :maxlength="255" style="width: 160px"></el-input>
            <el-select v-model="addingCase.diseaseId" filterable placeholder="病名（不支持新增）" style="width: 160px">
              <el-option
                v-for="item in diseaseList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          <el-button type="primary" @click="addCase" icon="el-icon-plus">快速新增病例</el-button>
        </el-col>

        <el-col :span="12" style="text-align: right">
          <el-form :inline="true" @submit.native.prevent>
            <el-form-item>
              <el-input v-model="keyword" placeholder="病例名/病名/类别" style="width: 120px" clearable @keyup.enter.native="getCaseList" @change="getCaseList">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>

      </el-row>

      <el-table style="flex: inherit" stripe :data="caseList.slice((currentPage-1)*pageSize,currentPage*pageSize)">
        <el-table-column prop="name" label="病例名"></el-table-column>
        <el-table-column prop="diseaseName" label="病名"></el-table-column>
        <el-table-column prop="categoryName" label="类别"></el-table-column>
        <el-table-column label="操作" fixed="right" width="350px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button @click="showCaseDetail(scope.row.id, scope.row.name, scope.row.diseaseName)" type="primary" size="medium" icon="el-icon-info">查看详情</el-button>
              <el-button @click="showUpdateCaseDialog(scope.row.id, scope.row.name, scope.row.diseaseName)" type="primary" size="medium" icon="el-icon-edit">修改基本信息</el-button>
              <el-button @click="deleteCase(scope.row.id)" type="primary" size="medium" icon="el-icon-delete"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10]"
      :page-size="pageSize"
      layout="total, prev, pager, next, sizes"
      :total="caseList.length"
      class="row-col-center"
      style="margin: 20px">
      </el-pagination>

      <el-dialog
        title="修改病例基本信息"
        :visible.sync="updateCaseDialogVisible"
        width="30%">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="病例名">
            <el-input type="text" clearable v-model="operatingCase.name" style="width: 160px" placeholder="请输入新病例名" :maxlength="255"></el-input>
          </el-form-item>
          <el-form-item label="病名">
            <el-select v-model="operatingCase.diseaseId" filterable style="width: 160px">
              <el-option
                v-for="item in diseaseList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateCase">确定</el-button>
        </span>
      </el-dialog>
    </el-container>

    <!-- CaseDetailContainer -->
    <el-container v-else direction="vertical">
      <div>
        <el-button type="primary" icon="el-icon-d-arrow-left" @click="caseListContainerVisible = true">返回 </el-button>
        <span style="font-size: x-large">
          &nbsp;
          病例名：{{operatingCase.name}}
          &nbsp;
          病名：{{operatingCase.diseaseName}}
        </span>
      </div>
      <el-tabs type="card" tab-position="left" style="margin-top: 20px">
        <el-tab-pane label="接诊"><stage :caseId="operatingCase.id" :stage="1"></stage></el-tab-pane>
        <el-tab-pane label="病例检查"><stage :caseId="operatingCase.id" :stage="2"></stage></el-tab-pane>
        <el-tab-pane label="诊断结果"><stage :caseId="operatingCase.id" :stage="3"></stage></el-tab-pane>
        <el-tab-pane label="治疗方案"><stage :caseId="operatingCase.id" :stage="4"></stage></el-tab-pane>
      </el-tabs>
    </el-container>
  </el-container>
</template>

<script>
import myBreadcrumb from '../components/breadcrumb'
import stage from '../components/stage'
export default {
  components: {
    myBreadcrumb, stage
  },
  data () {
    return {
      // display
      currentPage: 1,
      pageSize: 5,
      caseListContainerVisible: true,

      // disease
      keyword: '',
      diseaseList: [],
      caseList: [],
      addingCase: {},
      operatingCase: {},
      updateCaseDialogVisible: false
    }
  },
  created () {
    this.getDiseaseList()
    this.getCaseList()
    this.resetAddingCase()
    this.$root.Bus.$emit('updateIndex', '/case')
  },
  methods: {
    // display
    handleSizeChange: function (size) {
      this.pageSize = size
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },

    // case
    getCaseList () {
      this.$api.post(
        '/case/filter',
        {
          keyword: this.keyword
        },
        response => { // status, caseList[id, name, diseaseName, categoryName]
          if (response.status === 'success') {
            this.caseList = response.caseList
          } else {
            this.$notify.error({
              title: '错误',
              message: '病例列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    getDiseaseList () {
      this.$api.post(
        '/disease/filter',
        {keyword: ''},
        response => { // status, diseaseList[id, name, category]
          if (response.status === 'success') {
            this.diseaseList = response.diseaseList
          } else {
            this.$notify.error({
              title: '错误',
              message: '病种列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    resetAddingCase () {
      this.addingCase = {name: '', diseaseId: null}
    },
    addCase () {
      if (this.addingCase.name === '' || this.addingCase === null) {
        this.$message.error('病例名和病名为必填项！')
        return
      }
      this.$api.post(
        '/case/add',
        this.addingCase,
        response => { // status, id
          if (response.status === 'success') {
            this.$message.success('病例添加成功')
            this.getCaseList()
            this.resetAddingCase()
          } else {
            this.$notify.error({
              title: '错误',
              message: '病例添加失败，请等待后重试'
            })
          }
        }
      )
    },
    deleteCase (id) {
      this.$api.post(
        '/case/delete',
        {id: id},
        response => { // status
          if (response.status === 'success') {
            this.$message.success('病例删除成功')
            this.getCaseList()
          } else {
            this.$notify.error({
              title: '错误',
              message: '病例删除失败，请等待后重试'
            })
          }
        }
      )
    },
    showUpdateCaseDialog (id, name, diseaseName) {
      this.updateCaseDialogVisible = true
      this.operatingCase.id = id
      this.operatingCase.name = name
      this.diseaseList.forEach(disease => {
        if (disease.name === diseaseName) this.operatingCase.diseaseId = disease.id
      })
    },
    updateCase () {
      if (this.operatingCase.name === '') {
        this.$message.error('病例名为必填项！')
        return
      }
      this.$api.post(
        '/case/update',
        {id: this.operatingCase.id, name: this.operatingCase.name, diseaseId: this.operatingCase.diseaseId},
        response => { // status
          if (response.status === 'success') {
            this.$message.success('病例基本信息修改成功')
            this.getCaseList()
            this.updateCaseDialogVisible = false
          } else {
            this.$notify.error({
              title: '错误',
              message: '病例基本信息修改失败，请等待后重试'
            })
          }
        }
      )
    },
    showCaseDetail (id, name, diseaseName) {
      this.caseListContainerVisible = false
      this.operatingCase.id = id
      this.operatingCase.name = name
      this.operatingCase.diseaseName = diseaseName
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
</style>
