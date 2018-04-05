<template>
  <el-container direction="vertical" style="padding: 50px">
    <my-breadcrumb v-bind:index=2></my-breadcrumb>

    <el-row>
      <el-col :span="8">
        <el-button-group>
          <el-button type="primary" @click="addQuestionDialogVisible = true" icon="el-icon-plus">增加试题</el-button>
          <!-- <el-button type="primary" @click="this.addCategoryDialogVisible = true">
            <i class="fa fa-plus-square-o fa-fw"/>
            增加试题类别
          </el-button> -->
        </el-button-group>
      </el-col>

      <el-col style="text-align: right" :span="16">
        <el-input v-model="id" placeholder="题目编号" clearable style="width: 200px;"></el-input>
        <el-input v-model="keyword" placeholder="题干/任意选项" clearable style="width: 200px;"></el-input>
        <el-button type="primary" v-on:click="getQuestionList" icon="el-icon-search">搜索试题</el-button>
      </el-col>
    </el-row>

    <el-table stripe :data="filteredQuestionList.slice((currentPage-1)*pageSize,currentPage*pageSize)" @filter-change="categoryFilterChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="A选项">
              <span>{{ props.row.optA }}</span>
            </el-form-item>
            <el-form-item label="B选项">
              <span>{{ props.row.optB }}</span>
            </el-form-item>
            <el-form-item label="C选项">
              <span>{{ props.row.optC }}</span>
            </el-form-item>
            <el-form-item label="D选项">
              <span>{{ props.row.optD }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
       <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="stem" label="题干">
      </el-table-column>
      <el-table-column prop="category" label="试题类别" :filters="categoryList" :filter-multiple="false" filter-placement="bottom-start" :filter-method="categoryFilterHandler" column-key="category">
      </el-table-column>
      <el-table-column prop="answer" label="正确选项" />
      <el-table-column label="操作" fixed="right" width="240">
        <template slot-scope="scope">
          <el-button-group>
          <el-button @click="showModifyQuestionDialog(scope.row)" type="primary" size="small" icon="el-icon-edit">修改试题</el-button>
          <el-button @click="showRemoveQuestionDialog(scope.row.id)" type="primary" size="small" icon="el-icon-delete">删除试题</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-row :gutter="20">
      <el-col class="row-col-center">
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10]"
          :page-size="pageSize"
          layout="total, prev, pager, next, sizes"
          :total="filteredQuestionList.length"/>
      </el-col>
    </el-row>

    <el-dialog
      title="修改试题"
      :visible.sync="modifyQuestionDialogVisible"
      :before-close="handleModifyDialogClose"
      width="50%">
      <el-form ref="modifyQuestionForm" :model="operatingQuestion" label-width="80px" :rules="questionRule" size="small"  label-position="left">
        <el-form-item label="题干" prop="stem">
          <el-input v-model="operatingQuestion.stem"></el-input>
        </el-form-item>
        <el-form-item inline label="类别" prop="category">
          <el-select v-model="operatingQuestion.category" filterable placeholder="请选择(支持搜索和输入新增)" allow-create style="width: 247.9px;" default-first-option>
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项A" prop="optA">
          <el-input v-model="operatingQuestion.optA"/>
        </el-form-item>
        <el-form-item label="选项B" prop="optB">
          <el-input v-model="operatingQuestion.optB"/>
        </el-form-item>
        <el-form-item label="选项C" prop="optC">
          <el-input v-model="operatingQuestion.optC"/>
        </el-form-item>
        <el-form-item label="选项D" prop="optD">
          <el-input v-model="operatingQuestion.optD"/>
        </el-form-item>
        <el-form-item inline label="正确选项" prop="answer">
          <el-select v-model="operatingQuestion.answer" filterable placeholder="请选择" style="width: 247.9px;">
            <el-option
              v-for="item in ['A', 'B', 'C', 'D']"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyQuestion">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="增加试题"
      :visible.sync="addQuestionDialogVisible"
      :before-close="handleAddDialogClose"
      width="50%">
      <el-form ref="addQuestionForm" :model="operatingQuestion" label-width="80px" :rules="questionRule" size="small"  label-position="left">
        <el-form-item label="题干" prop="stem">
          <el-input v-model="operatingQuestion.stem"/>
        </el-form-item>
        <el-form-item inline label="类别" prop="category">
          <el-select v-model="operatingQuestion.category" filterable placeholder="请选择(支持搜索和输入新增)" allow-create style="width: 247.9px;">
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项A" prop="optA">
          <el-input v-model="operatingQuestion.optA"/>
        </el-form-item>
        <el-form-item label="选项B" prop="optB">
          <el-input v-model="operatingQuestion.optB"/>
        </el-form-item>
        <el-form-item label="选项C" prop="optC">
          <el-input v-model="operatingQuestion.optC"/>
        </el-form-item>
        <el-form-item label="选项D" prop="optD">
          <el-input v-model="operatingQuestion.optD"/>
        </el-form-item>
        <el-form-item inline label="正确选项" prop="answer">
          <el-select v-model="operatingQuestion.answer" filterable placeholder="请选择" style="width: 247.9px;">
            <el-option
              v-for="item in ['A', 'B', 'C', 'D']"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addQuestion">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="删除试题"
      :visible.sync="removeQuestionDialogVisible"
      width="30%">
      <span>试题编号为{{operatingQuestion.id}}，确认删除该试题吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="removeQuestion">确定</el-button>
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
      questionList: [],
      categoryList: [],
      operatingQuestion: {
        id: 0,
        category: '',
        stem: '',
        optA: '',
        optB: '',
        optC: '',
        optD: '',
        answer: ''
      },
      keyword: '',
      id: '',
      addQuestionDialogVisible: false,
      modifyQuestionDialogVisible: false,
      removeQuestionDialogVisible: false,
      currentPage: 1,
      pageSize: 5,
      categoryFilter: '',
      questionRule: {
        stem: [
          { required: true, message: '请输入题干', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请输入试题类别', trigger: 'change' }
        ],
        optA: [
          { required: true, message: '请输入选项', trigger: 'blur' }
        ],
        optB: [
          { required: true, message: '请输入选项', trigger: 'blur' }
        ],
        optC: [
          { required: true, message: '请输入选项', trigger: 'blur' }
        ],
        optD: [
          { required: true, message: '请输入选项', trigger: 'blur' }
        ],
        answer: [
          { required: true, message: '请输入正确答案', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getQuestionList()
    this.getCategoryList()
  },
  computed: {
    filteredQuestionList () {
      if (this.categoryFilter === '') return this.questionList
      else {
        return this.questionList.filter(function (question) {
          return question.category === this.categoryFilter
        }.bind(this))
      }
    }
  },
  methods: {
    getQuestionList () {
      // this.questionList = [
      //   {id: 1, category: 'c1', stem: 's1', optA: 'a', optB: 'b', optC: 'c', optD: 'd', answer: 'A'},
      //   {id: 2, category: 'c2', stem: 's2', optA: 'a', optB: 'b', optC: 'c', optD: 'd', answer: 'A'},
      //   {id: 3, category: 'c3', stem: 's3', optA: 'a', optB: 'b', optC: 'c', optD: 'd', answer: 'A'},
      //   {id: 4, category: 'c3', stem: 's4', optA: 'a', optB: 'b', optC: 'c', optD: 'd', answer: 'A'},
      //   {id: 5, category: 'c2', stem: 's5', optA: 'a', optB: 'b', optC: 'c', optD: 'd', answer: 'A'},
      //   {id: 6, category: 'c3', stem: 's6', optA: 'a', optB: 'b', optC: 'c', optD: 'd', answer: 'A'}
      // ]
      var param
      if (this.id === '') param = {keyword: this.keyword}
      else {
        param = {
          id: parseInt(this.id),
          keyword: this.keyword
        }
      }

      // console.log(param)
      this.$api.post(
        '/question/filter',
        param,
        response => { // status, questionList[id, category, stem,optA, optB,optC,optD,answer]
          if (response.status === 'success') {
            this.questionList = response.questionList
          } else {
            this.$notify.error({
              title: '错误',
              message: '题目列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    getCategoryList () {
      this.$api.post(
        '/question/category',
        null,
        response => { // status, categoryList(类型是List<String>)
          if (response.status === 'success') {
            // var api = {
            //   status: 'success',
            //   categoryList: ['c1', 'c2', 'c3']
            // }
            var result = []
            response.categoryList.forEach(function (elem) {
              result.push({
                value: elem,
                text: elem
              })
            })
            this.categoryList = result
          } else {
            this.$notify.error({
              title: '错误',
              message: '试题类别列表获取失败，请等待后重试'
            })
          }
        }
      )
    },
    categoryFilterChange (columnKey) {
      if (columnKey.category.length === 0) this.categoryFilter = ''
      else this.categoryFilter = columnKey.category[0]
    },
    handleSizeChange: function (size) {
      this.pageSize = size
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    categoryFilterHandler (value, row, column) {
      // console.log('xxx' + value)
      const property = column['property'] // property就是prop属性
      return row[property] === value
    },
    showModifyQuestionDialog (row) {
      this.modifyQuestionDialogVisible = true
      this.operatingQuestion = row
    },
    showRemoveQuestionDialog (id) {
      this.removeQuestionDialogVisible = true
      this.operatingQuestion.id = id
    },
    addQuestion () {
      this.$refs['addQuestionForm'].validate((valid) => {
        if (valid) {
          this.$api.post(
            '/question/add',
            this.operatingQuestion,
            response => { // status, id，category，stem，optA，optB，optC，optD，answer
              if (response.status === 'success') {
                this.questionList.push({
                  id: response.id,
                  category: response.category,
                  stem: response.stem,
                  optA: response.optA,
                  optB: response.optB,
                  optC: response.optC,
                  optD: response.optD,
                  answer: response.answer
                })
                this.$notify.success({
                  title: '成功',
                  message: '新试题ID为' + response.id
                })
                this.getCategoryList() // 防止有新的试题类别
                this.$refs['addQuestionForm'].resetFields()
                this.resetOperatingQuestion()
                this.addQuestionDialogVisible = false
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
    modifyQuestion () {
      this.$refs['modifyQuestionForm'].validate((valid) => {
        if (valid) {
          this.$api.post(
            '/question/update',
            this.operatingQuestion, // TODO: check
            response => { // status
              if (response.status === 'success') {
                this.getQuestionList()
                this.$notify.success({
                  title: '成功',
                  message: '已成功修改ID为' + this.operatingQuestion.id + '的试题'
                })
                this.getCategoryList() // 防止有新的试题类别
                this.$refs['modifyQuestionForm'].resetFields()
                this.resetOperatingQuestion()
                this.modifyQuestionDialogVisible = false
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '修改试题失败，请等待后重试'
                })
              }
            }
          )
        }
      })
    },
    removeQuestion () {
      this.$api.post(
        '/question/delete',
        {id: this.operatingQuestion.id},
        response => { // status, id，category，stem，optA，optB，optC，optD，answer
          if (response.status === 'success') {
            this.getQuestionList()
            this.$notify.success({
              title: '成功',
              message: '已成功删除ID为' + this.operatingQuestion.id + '的试题'
            })
            this.resetOperatingQuestion()
            this.removeQuestionDialogVisible = false
          } else {
            this.$notify.error({
              title: '错误',
              message: '删除试题失败，请等待后重试'
            })
          }
        }
      )
    },
    resetOperatingQuestion () {
      this.operatingQuestion.id = 0
      this.operatingQuestion.category = ''
      this.operatingQuestion.stem = ''
      this.operatingQuestion.optA = ''
      this.operatingQuestion.optB = ''
      this.operatingQuestion.optC = ''
      this.operatingQuestion.optD = ''
      this.operatingQuestion.answer = ''
    },
    handleAddDialogClose (done) {
      this.$refs['addQuestionForm'].resetFields()
      done()
    },
    handleModifyDialogClose (done) {
      this.$refs['modifyQuestionForm'].resetFields()
      done()
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
