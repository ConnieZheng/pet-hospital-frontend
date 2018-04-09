<template>
  <el-container direction="vertical" style="padding: 20px 50px">
    <my-breadcrumb v-bind:index=6></my-breadcrumb>

    <el-row>
      <el-col :span="10">
        <el-input type="text" placeholder="病名" clearable v-model="addingDisease.name" :maxlength="255" style="width: 160px"></el-input>
          <el-select v-model="addingDisease.category" filterable placeholder="类别（支持新增）" allow-create :maxlength="255" style="width: 160px">
            <el-option
              v-for="item in categoryList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        <el-button type="primary" @click="addDisease" icon="el-icon-plus">快速新增病种</el-button>
      </el-col>

      <el-col :span="14"  style="text-align: right">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="keyword" placeholder="病名/类别" style="width: 120px" clearable @keyup.enter.native="getDiseaseList" @change="getDiseaseList">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>

   </el-row>

    <el-table stripe :data="diseaseList.slice((currentPage-1)*pageSize,currentPage*pageSize)">
      <el-table-column prop="name" label="病名"></el-table-column>
      <el-table-column prop="category" label="类别"></el-table-column>
      <el-table-column label="操作" fixed="right" width="350px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button @click="showUpdateDiseaseDialog(scope.row.id, scope.row.name, scope.row.category)" type="primary" size="medium" icon="el-icon-edit-outline">修改病种</el-button>
            <el-button @click="deleteDisease(scope.row.id)" type="primary" size="medium" icon="el-icon-delete">删除病种</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="修改病种"
      :visible.sync="updateDiseaseDialogVisible"
      width="30%">
      <el-form label-width="80px" label-position="left">
        <el-form-item label="病名">
          <el-input type="text" autosize clearable v-model="updatingDisease.name" :maxlength="255"></el-input>
        </el-form-item>
        <el-form-item inline label="类别">
          <el-select v-model="updatingDisease.category" filterable placeholder="请选择(支持搜索和输入新增)" allow-create style="width: 247.9px;" default-first-option>
            <el-option
              v-for="item in categoryList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateDisease">确定</el-button>
      </span>
    </el-dialog>

    <el-pagination background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[5, 10]"
    :page-size="pageSize"
    layout="total, prev, pager, next, sizes"
    :total="diseaseList.length"
    class="row-col-center"
    style="margin: 20px">
    </el-pagination>
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

      // disease
      keyword: '',
      diseaseList: [],
      categoryList: [],
      addingDisease: {},
      updatingDisease: {id: 0, name: '', category: ''},
      updateDiseaseDialogVisible: false
    }
  },
  created () {
    this.getDiseaseList()
    this.getCategoryList()
    this.resetAddingDisease()
  },
  methods: {
    // display
    handleSizeChange: function (size) {
      this.pageSize = size
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },

    // disease
    getDiseaseList () {
      this.$api.post(
        '/disease/filter',
        {keyword: this.keyword},
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
    getCategoryList () {
      this.$api.post(
        '/disease/category',
        null,
        response => { // status, categoryList[] (string数组）
          if (response.status === 'success') {
            this.categoryList = response.categoryList
          } else {
            this.$notify.error({
              title: '错误',
              message: '类别列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    resetAddingDisease () {
      this.addingDisease = {name: '', category: ''}
    },
    addDisease () {
      if (this.addingDisease.name === '' || this.addingDisease.category === '') {
        this.$message.error('病名和类别均为必填项！')
        return
      }
      this.$api.post(
        '/disease/add',
        { // name, category
          name: this.addingDisease.name,
          category: this.addingDisease.category
        },
        response => { // status, id, name, category
          if (response.status === 'success') {
            this.diseaseList.push({
              id: response.id,
              name: response.name,
              category: response.category
            })
            this.getCategoryList() // 防止增加了新的类别
            this.$message.success('添加病种成功~')
            this.resetAddingDisease()
          } else {
            this.$notify.error({
              title: '错误',
              message: '添加病种失败，请等待后重试'
            })
          }
        }
      )
    },
    deleteDisease (id) {
      this.$api.post(
        '/disease/delete',
        { // id
          id: id
        },
        response => { // status
          if (response.status === 'success') {
            this.getDiseaseList()
            this.getCategoryList() // 防止增加了新的类别
            this.$message.success('删除病种成功~')
          } else {
            this.$notify.error({
              title: '错误',
              message: '删除病种失败，请等待后重试'
            })
          }
        }
      )
    },
    showUpdateDiseaseDialog (id, name, category) {
      this.updateDiseaseDialogVisible = true
      this.updatingDisease.id = id
      this.updatingDisease.name = name
      this.updatingDisease.category = category
    },
    updateDisease () {
      if (this.updatingDisease.name === '' || this.updatingDisease.category === '') {
        this.$message.error('病名和类别均为必填项！')
        return
      }

      this.$api.post(
        '/disease/update',
        { // id, name, category
          id: this.updatingDisease.id,
          name: this.updatingDisease.name,
          category: this.updatingDisease.category
        },
        response => { // status
          if (response.status === 'success') {
            this.getDiseaseList()
            this.getCategoryList() // 防止增加了新的类别
            this.$message.success('修改病种成功~')
          } else {
            this.$notify.error({
              title: '错误',
              message: '修改病种失败，请等待后重试'
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
</style>
