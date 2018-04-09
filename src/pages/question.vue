<template>
  <el-container direction="vertical" style="padding: 20px 50px">
    <my-breadcrumb v-bind:index=2></my-breadcrumb>

    <el-row>
      <el-col :span="8">
        <el-button-group>
          <el-button type="primary" @click="addQuestionDialogVisible = true" icon="el-icon-plus">增加试题</el-button>
          <el-button type="primary" @click="uploadQuestionDialogVisible = true" icon="el-icon-upload">批量导入试题</el-button>
        </el-button-group>
      </el-col>

      <el-col style="text-align: right" :span="16">
        <el-input v-model="id" placeholder="题目编号" clearable style="width: 200px;" @keyup.native="id=id.replace(/[^\d]/ig,'')"></el-input>
        <el-input v-model="keyword" placeholder="题干/任意选项" clearable style="width: 200px;"></el-input>
        <el-button type="primary" v-on:click="getQuestionList" icon="el-icon-search">搜索试题</el-button>
      </el-col>
    </el-row>

    <el-table stripe :data="filteredQuestionList.slice((currentPage-1)*pageSize,currentPage*pageSize)" @filter-change="categoryFilterChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="题干（完整）" v-if="props.row.stem.length > 40">
              <span>{{ props.row.stem }}</span>
            </el-form-item>
            <el-form-item label="A选项" class="demo-option">
              <span>{{ props.row.optA }}</span>
            </el-form-item>
            <el-form-item label="B选项" class="demo-option">
              <span>{{ props.row.optB }}</span>
            </el-form-item>
            <el-form-item label="C选项" class="demo-option">
              <span>{{ props.row.optC }}</span>
            </el-form-item>
            <el-form-item label="D选项" class="demo-option">
              <span>{{ props.row.optD }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
       <el-table-column prop="id" label="题目编号" width="100px">
      </el-table-column>
      <el-table-column label="题干">
        <template slot-scope="props">
          <span>{{showStem(props.row.stem)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="试题类别" :filters="categoryList" :filter-multiple="false" filter-placement="bottom-start" :filter-method="categoryFilterHandler" column-key="category" width="250px">
      </el-table-column>
      <el-table-column prop="answer" label="正确选项" width="100px" />
      <el-table-column label="操作" fixed="right" width="350px">
        <template slot-scope="scope">
          <el-button-group>
          <el-button @click="showModifyQuestionDialog(scope.row)" type="primary" size="medium" icon="el-icon-edit">修改试题</el-button>
          <el-button @click="removeQuestion(scope.row.id)" type="primary" size="medium" icon="el-icon-delete">删除试题</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-row :gutter="20">
      <el-col class="row-col-center" style="margin: 20px">
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
      width="50%">
      <el-form ref="modifyQuestionForm" :model="modifyingQuestion" label-width="80px" :rules="questionRule" size="small"  label-position="left">
        <el-form-item label="题干" prop="stem">
          <el-input type="textarea" autosize clearable v-model="modifyingQuestion.stem"></el-input>
        </el-form-item>
        <el-form-item inline label="类别" prop="category">
          <el-select v-model="modifyingQuestion.category" filterable placeholder="请选择(支持搜索和输入新增)" allow-create style="width: 247.9px;" default-first-option>
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项A" prop="optA">
          <el-input v-model="modifyingQuestion.optA"/>
        </el-form-item>
        <el-form-item label="选项B" prop="optB">
          <el-input v-model="modifyingQuestion.optB"/>
        </el-form-item>
        <el-form-item label="选项C" prop="optC">
          <el-input v-model="modifyingQuestion.optC"/>
        </el-form-item>
        <el-form-item label="选项D" prop="optD">
          <el-input v-model="modifyingQuestion.optD"/>
        </el-form-item>
        <el-form-item inline label="正确选项" prop="answer">
          <el-select v-model="modifyingQuestion.answer" filterable placeholder="请选择" style="width: 247.9px;">
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
      <el-form ref="addQuestionForm" :model="addingQuestion" label-width="80px" :rules="questionRule" size="small"  label-position="left">
        <el-form-item label="题干" prop="stem">
          <el-input type="textarea" autosize clearable v-model="addingQuestion.stem"/>
        </el-form-item>
        <el-form-item inline label="类别" prop="category">
          <el-select v-model="addingQuestion.category" filterable placeholder="请选择(支持搜索和输入新增)" allow-create style="width: 247.9px;">
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项A" prop="optA">
          <el-input v-model="addingQuestion.optA"/>
        </el-form-item>
        <el-form-item label="选项B" prop="optB">
          <el-input v-model="addingQuestion.optB"/>
        </el-form-item>
        <el-form-item label="选项C" prop="optC">
          <el-input v-model="addingQuestion.optC"/>
        </el-form-item>
        <el-form-item label="选项D" prop="optD">
          <el-input v-model="addingQuestion.optD"/>
        </el-form-item>
        <el-form-item inline label="正确选项" prop="answer">
          <el-select v-model="addingQuestion.answer" filterable placeholder="请选择" style="width: 247.9px;">
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
      title="上传试题文件"
      :visible.sync="uploadQuestionDialogVisible"
      width="30%">
      <a href="http://111.231.62.36:8080/pet/img/371465a9-2997-426f-967e-355414c759f0question_title.txt" target="_blank">试题文件样例1（含标题行）</a>
      <br>
      <a href="http://111.231.62.36:8080/pet/img/499a28e9-9022-470f-bd47-8d51e38f0c18questions_no_title.txt" target="_blank">试题文件样例2（无标题行）</a>
      <el-upload accept=".txt"
        action="/api/question/file"
        :before-upload="beforeUploadFileUpload"
        :on-progress="handleUploadFileProgress"
        :on-success="handleUploadFileSuccess"
        :on-remove="handleUploadFileRemove"
        :on-error="handleUploadFileError"
        multiple>
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传txt文件，且文件结构（种类、题干、A选项、B选项、C选项、D选项、答案)完整，支持不含标题行</div>
      </el-upload>
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
      addingQuestion: {},
      modifyingQuestion: {},
      keyword: '',
      id: '',
      addQuestionDialogVisible: false,
      modifyQuestionDialogVisible: false,
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
      },
      uploadQuestionDialogVisible: false
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
    resetAddingQuestion () {
      this.addingQuestion = {
        category: '',
        stem: '',
        optA: '',
        optB: '',
        optC: '',
        optD: '',
        answer: ''
      }
    },
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
      this.modifyingQuestion = row
    },
    addQuestion () {
      this.$refs['addQuestionForm'].validate((valid) => {
        if (valid) {
          this.$api.post(
            '/question/add',
            this.addingQuestion,
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
                this.resetAddingQuestion()
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
            this.modifyingQuestion,
            response => { // status
              if (response.status === 'success') {
                this.getQuestionList()
                this.$notify.success({
                  title: '成功',
                  message: '已成功修改ID为' + this.modifyingQuestion.id + '的试题'
                })
                this.getCategoryList() // 防止有新的试题类别
                // this.$refs['modifyQuestionForm'].resetFields()
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
    removeQuestion (id) {
      this.$api.post(
        '/question/delete',
        {id: id},
        response => { // status, id，category，stem，optA，optB，optC，optD，answer
          if (response.status === 'success') {
            this.getQuestionList()
            this.$notify.success({
              title: '成功',
              message: '已成功删除ID为' + id + '的试题'
            })
            this.getCategoryList() // 防止该试题恰为该类别的唯一一题
          } else {
            this.$notify.error({
              title: '错误',
              message: '删除试题失败，请等待后重试'
            })
          }
        }
      )
    },
    handleAddDialogClose (done) {
      this.$refs['addQuestionForm'].resetFields()
      done()
    },
    showStem (stem) {
      if (stem.length > 40) return stem.substr(0, 40) + '...'
      else return stem
    },
    beforeUploadFileUpload (file) {
      // console.log(file.type)
      const isTxt = file.type === 'text/plain'
      if (!isTxt) {
        this.$message.error('请上传TXT文件！')
      }
      return isTxt
    },
    handleUploadFileRemove (file, fileList) {
      this.$notify.error('文件已上传至服务器，无法移除！')
    },
    handleUploadFileProgress (event, file, fileList) { // 文件上传时的钩子
      this.loading = true
    },
    handleUploadFileSuccess (res, file, fileList) {
      console.log('success', res)
      if (res.status === 'success') {
        this.$message.success('文件已上传至服务器，重新获取试题列表中...')
        this.getQuestionList()
      }
      this.loading = false
    },
    handleUploadFileError (err, file, fileList) {
      console.log('error', err, file, fileList)
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
.demo-table-expand .demo-option {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
