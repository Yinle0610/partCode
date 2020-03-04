<!-- 稽核方法 -->
<template>
  <div class="auditingQuesDetails dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline height-class">
        <el-form-item label="所属系统：">
          <el-select style="width: 198px" v-model="formInline.systemCode" size="small" placeholder="请选择" @change="systemCodeChange" clearable>
            <el-option
                v-for="item in sysList"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方法种类：">
          <el-select style="width: 198px" v-model="formInline.classId" size="small" placeholder="请选择" @change="classIdChange" clearable>
            <el-option
                v-for="item in classList"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input size="small" placeholder="请输入方法名称/描述" v-model="keyword" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" class="height-class" @click="toSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="card-container card-table">
      <el-card class="card-table">
        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column
              label="方法编号"
              width="182">
            <template slot-scope="scope"><a class="a-color" @click="clickToAuditFuncsDetails(scope.row)">
              {{scope.row.functionId}} </a></template>
          </el-table-column>
          <el-table-column
              prop="functionName"
              label="方法名称"
              width="182">
          </el-table-column>
          <el-table-column
              prop="functionDesc"
              label="方法描述"
              width="182">
          </el-table-column>
          <el-table-column
              prop="belongSystem"
              label="所属系统"
              width="182">
          </el-table-column>
          <el-table-column
              prop="className"
              label="方法种类"
              width="182">
          </el-table-column>
          <el-table-column
              prop="createDate"
              label="创建时间">
          </el-table-column>
        </el-table>
      </el-card>

      <div style="text-align: center; padding: 10px 0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="oPage.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="oPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="oPage.total">
        </el-pagination>
      </div>

    </el-card>
  </div>
</template>

<script>
  import { get, parseAjaxResponse } from '../../../src/utils/request'

  export default {
    name: 'auditingFuncs',
    data() {
      return {
        formInline: {
          systemCode: '', // 所属系统代码Code
          classId: '' // 方法种类ID
        },
        sysList: [], // 所属系统
        classList: [], // 方法种类
        tableData: [],
        oPage: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        keyword: '' // 关键字
      }
    },
    methods: {
      // 获取所属系统下拉框信息 /dqms/checkfunction/listBelongSystemInfo
      getListBelongSystemInfo() {
        get('/dqms/checkfunction/listBelongSystemInfo').then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.sysList = res.data
            }
          })
        })
      },
      // 获取方法种类信息 /dqms/checkfunction/listFunctionTypesInfo
      getListFunctionTypesInfo() {
        get('/dqms/checkfunction/listFunctionTypesInfo').then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.classList = res.data
            }
          })
        })
      },
      // 分页获取稽核方法信息列表 /dqms/checkfunction/listKpiFunctionsInfos
      getListKpiFunctionsInfos() {
        get('/dqms/checkfunction/listKpiFunctionsInfos', {
          systemCode: this.formInline.systemCode, // 所属系统代码Code
          classId: this.formInline.classId, // 方法种类ID
          keyword: this.keyword, // 关键字
          pageCurrent: this.oPage.currentPage,
          pageSize: this.oPage.pageSize
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.oPage.currentPage = res.data.current
              this.oPage.total = res.data.total
              this.tableData = res.data.records
            }
          })
        })
      },
      // 跳转到 稽核方法详情-检核表
      clickToAuditFuncsDetails(row) {
        this.$router.push({
          name: 'auditingFuncsDetail',
          params: {
            id: row.classId,
            classId: row.classId,
            functionId: row.functionId,
            tableType: row.tableType
          }
        })
      },
      systemCodeChange() {
        this.handleCurrentChange(1)
      },
      classIdChange() {
        this.handleCurrentChange(1)
      },
      toSearch() {
        this.handleCurrentChange(1)
      },
      // 分页
      handleSizeChange(val) {
        this.oPage.pageSize = val
        this.getListKpiFunctionsInfos()
      },
      handleCurrentChange(val) {
        this.oPage.currentPage = val
        this.getListKpiFunctionsInfos()
      }
    },
    created() {
      this.getListBelongSystemInfo()
      this.getListFunctionTypesInfo()
      this.getListKpiFunctionsInfos()
    },
    mounted() {

    }
  }
</script>


<style lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';

  .el-form-item {
    margin-bottom: 0px;
  }

  //form表单，label字体
  .el-form .el-form-item /deep/ .el-form-item__label {
    font-size: 12px;
    font-weight: normal;
    color: #515a6e;
  }

  .height-class {
    height: 32px;
  }


</style>
