<template>
  <div class="newProblems dashboard-editor-container">
    <el-card shadow="hover">
      <p style="font-weight: bold; font-size: 14px; ">基本信息</p>
      <div class="divider"></div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="问题描述：" prop="name">
          <el-input type="textarea" placeholder="请输入" :rows="5" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="影响范围：" prop="impactScope">
          <el-input type="textarea" placeholder="请输入影响范围" v-model="ruleForm.impactScope"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="来源：" prop="source">
              <el-select v-model="ruleForm.source" placeholder="请选择来源" size="small">
                <el-option label="请选择" value></el-option>
                <el-option
                  v-for="source in sourceList"
                  :key="source.code"
                  :label="source.name"
                  :value="source.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="问题等级：" prop="ques">
              <el-select v-model="ruleForm.ques" placeholder="请选择问题等级" size="small">
                <el-option label="请选择" value></el-option>
                <el-option
                  v-for="ques in questionLvlList"
                  :key="ques.code"
                  :label="ques.name"
                  :value="ques.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="4">
            <el-form-item label="期望解决时间:" label-width="110px">
              <el-form-item prop="date1">
                <el-date-picker
                  size="small"
                  type="date"
                  placeholder="选择日期"
                  v-model="ruleForm.date1"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="发起人：" prop="initiators">
          <el-button @click="add_show_person" size="small">
            <i class="el-icon-plus marginRight"></i>增加
          </el-button>
        </el-form-item>
        <el-form-item label="涉及系统：" prop="systems">
          <el-button @click="add_show_system" size="small">
            <i class="el-icon-plus marginRight"></i>增加
          </el-button>
        </el-form-item>
        <el-form-item label="涉及表：">
          <el-button @click="add_show_table" size="small">
            <i class="el-icon-plus marginRight"></i>增加
          </el-button>
        </el-form-item>

        <el-form-item label="初步分析：" prop="causeAnalys">
          <el-input type="textarea" v-model="ruleForm.causeAnalys" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="提升建议：" prop="suggestUp">
          <el-input type="textarea" v-model="ruleForm.suggestUp" placeholder="请输入"></el-input>
        </el-form-item>

        <p style="font-weight: bold; font-size: 14px; ">附件信息</p>
        <div class="divider"></div>
        <el-row :gutter="20">
          <el-col :span="12" :offset="8">
            <el-upload
              class="upload-demo"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <p class="el-upload__text">支持扩展名：.doc .docx .pdf .jpg .xls .xlsx</p>
            </el-upload>
          </el-col>
        </el-row>

        <el-form-item>
          <el-row>
            <el-col :span="8" :offset="10" class="marginTop">
              <el-button type="primary" size="small" @click="submitForm('ruleForm')">提交</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <!-- 发起人 -->
      <el-dialog title="添加" :visible.sync="visiblePerson">
        <el-input type="text" placeholder="输入关键字..."></el-input>
        <el-tree
          class="marginTop"
          :data="personData"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
          @node-click="handlePersonNodeClick"
          @check-change="handlePersonCheckChange"
        ></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="visiblePerson = false">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 涉及系统 -->
      <el-dialog title="添加" :visible.sync="visibleSystem">
        <el-transfer
          v-model="value3"
          filterable
          :left-default-checked="[2, 3]"
          :right-default-checked="[1]"
          :render-content="renderFunc"
          :titles="['Source', 'Target']"
          :button-texts="['到左边', '到右边']"
          size="small"
          :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
          @change="handleSystemChange"
          :data="systemData"
        ></el-transfer>

        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="visibleSystem = false">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 涉及表 -->
      <el-dialog title="选择涉及表" :visible.sync="visibleTables">
        <el-form :model="modalForm">
          <el-row>
            <el-col :span="6">
              <!-- 选择系统 -->
              <el-select
                v-model="modalForm.selectedSystem"
                placeholder="请选择系统"
                size="small"
                style="width: 143px"
              >
                <el-option
                  v-for="system in systems"
                  :key="system.id"
                  :label="system.LABEL"
                  :value="system.INSTANCE_ID"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <!-- 选择Schema -->
              <el-select v-model="modalForm.selectedSchema" placeholder="请选择Schema" size="small">
                <el-option
                  v-for="schema in schemas"
                  :key="schema.id"
                  :label="schema.LABEL"
                  :value="schema.INSTANCE_ID"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-input placeholder="请输入关键字..." size="small">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-col>
          </el-row>
          <div>11111</div>
          <el-pagination
            class="marginTop"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="100"
            layout="total, prev, pager, next"
            :total="1000"
          ></el-pagination>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="visibleTables = false">取 消</el-button>
          <el-button size="small" type="primary" @click="visibleTables = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    const generateData = _ => {
      // 涉及系统
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }

    return {
      modalForm: {
        selectedSystem: '',
        selectedSchema: ''
      },
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入问题描述', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        impactScope: [
          { required: true, message: '请输入影响范围', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        source: [{ required: true, message: '请选择来源', trigger: 'change' }],
        ques: [
          { required: true, message: '请选择问题等级', trigger: 'change' }
        ],
        initiators: [{ required: true, message: '请选择', trigger: 'change' }],
        systems: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      sourceList: [
        // 来源
        { name: '质量', code: 1 },
        { name: '统计', code: 2 }
      ],
      questionLvlList: [
        // 问题等级
        { name: '紧急', code: 1 },
        { name: '一般', code: 2 },
        { name: '重要', code: 3 }
      ],
      visiblePerson: false,
      visibleSystem: false,
      visibleTables: false,
      // 发起人
      personData: [
        {
          id: 1,
          label: '一级 2',
          children: [
            {
              id: 3,
              label: '二级 2-1',
              disabled: true,
              children: [
                {
                  id: 4,
                  label: '三级 3-1-1'
                },
                {
                  id: 5,
                  label: '三级 3-1-2'
                }
              ]
            },
            {
              id: 2,
              label: '二级 2-2',
              disabled: true,
              children: [
                {
                  id: 6,
                  label: '三级 3-2-1'
                },
                {
                  id: 7,
                  label: '三级 3-2-2'
                }
              ]
            }
          ]
        }
      ],
      // 涉及系统
      systemData: generateData(),
      value3: [1],
      renderFunc(h, option) {
        return (
          <span>
            {option.key} - {option.label}
          </span>
        )
      },
      // 涉及表-选择系统
      systems: [
        { INSTANCE_ID: '123', id: 1, LABEL: 123 },
        { INSTANCE_ID: '334', id: 2, LABEL: 334 },
        { INSTANCE_ID: '456', id: 3, LABEL: 456 }
      ],
      // 涉及表-选择schema
      schemas: [
        { INSTANCE_ID: 'abc', id: 1, LABEL: 'abc' },
        { INSTANCE_ID: 'def', id: 2, LABEL: 'def' },
        { INSTANCE_ID: 'ghj', id: 3, LABEL: 'ghj' }
      ],
      currentPage1: 1
    }
  },
  methods: {
    // 发起人
    add_show_person() {
      this.visiblePerson = true
    },
    // 涉及系统
    add_show_system() {
      this.visibleSystem = true
    },
    // 涉及表
    add_show_table() {
      this.visibleTables = true
    },

    handlePersonCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handlePersonNodeClick(data) {
      console.log(data)
    },

    handleSystemChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },

    // 涉及表-对话框-分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
   //外层card容器样式--开始
  .dashboard-editor-container {
    padding: 10px;
  }
  .dashboard-editor-container .el-card /deep/ .el-card__body {
    padding: 16px;
  }
  //外层card容器样式--结束

  .marginRight {
    margin-right: 5px;
  }

  .marginTop {
    margin-top: 10px;
  }

  .divider {
    margin: 24px 0;
    border-bottom: 1px solid #e8ebed;
  }

  .newProblems /deep/ .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__header {
        border-bottom: 1px solid #e8ebed;
      }
    }
  }

  .newProblems /deep/ .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__footer {
        border-top: 1px solid #e8ebed;
      }
    }
  }
</style>
