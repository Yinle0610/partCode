<template>
<!-- 我的订阅 -->
  <div style="padding:13px;" class="subscription-container">
    <el-card shadow="hover" class="search-card">
      <div class="cardTitle">查询范围</div>
      <el-form :inline="true" :model="formInline" label-width="90px">
        <el-form-item label="变更日期：">
          <el-date-picker v-model="formInline.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                          :unlink-panels='wSubscribe.unlinkPanels' value-format="yyyy-MM-dd" size="small">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="变更类型：">
            <el-select v-model="formInline.type" placeholder="请选择" :disabled="ifDisabled" size="small" @change="getData" clearable>
                <el-option :label="item.label" :value="item.val" v-for="item in changeTypeList" :key="item.classifierId" ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="元数据类型：">
            <el-select v-model="formInline.classifierId" placeholder="请选择" :disabled="ifDisabled" size="small" @change="getData" clearable>
                <el-option :label="item.classifierName" :value="item.classifierId" v-for="item in classifierList" :key="item.classifierId" ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item style="margin-left:20px;">
          <el-button type="primary" @click="getData('current')" size="small"><i class="el-icon-search"></i> 查询</el-button>
          <!-- <el-button  @click="onCancel" size="small">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover" class="card-body">
      <div class="button-box">
        变更统计
      </div>
      <div class="table-box">
        <el-table :data="tableData"  style="width: 100%" :header-cell-style="{background:'#f8f8f9'}"
                      v-loading="wSubscribe.bLoading" size="mini" :cell-style="isClass" :header-cell-class-name="isClass2">
          <el-table-column prop="classifierId" label="元数据类型代码"  width="280">
          </el-table-column>
          <el-table-column prop="classifierName" label="元数据类型名称"  width="260">
          </el-table-column>
          <el-table-column label="变更类型"  >
            <template slot-scope="scope">
              <div>{{scope.row.alterationType==='0'?'新增':scope.row.alterationType==='1'?'删除':scope.row.alterationType==='2'?'修改':'-'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="changeNum" label="变更统计"  >
          </el-table-column>
          <el-table-column  label="操作" >
            <!-- <template slot-scope="scope"> -->
            <template slot-scope="scope">
              <div class="funKey">
                <el-tooltip class="item" effect="dark" content="变更详情" placement="bottom">
                  <i class="detail" @click="changeSubDetail(scope.row)" style="background: url(./../../../src/assets/images/commonIcon/icon-matter-yulan.png) no-repeat;background-size: 20px 20px"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      style="text-align:center;margin-top:15px;">
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { get } from '@/utils/request'
export default {
  name: 'changeSub',
  data() {
    return {
      wSubscribe: {
        bLoading: false,
        unlinkPanels: true
      },
      formInline: {
        type: null,
        classifierId: null,
        date: [],
        id: null
      },
      page: {
        size: 10,
        total: null,
        current: 1
      },
      tableData: [],
      changeTypeList: [
        { label: '新增', val: '0' },
        { label: '删除', val: '1' },
        { label: '修改', val: '2' }
      ],
      classifierList: [],
      ifDisabled: false
    }
  },
  methods: {
    // handleSizeChange(val) {
    //   this.page.size = val;
    //   this.getData();
    // },
    // handleCurrentChange(val) {
    //   this.page.current = val;
    //   this.getData();
    // },
    changeSubDetail(item) {
      console.log(item)
      this.$router.push({ name: 'changeSubDetail', params: {
        id: this.formInline.id,
        _title: item.alterationType === '0' ? item.classifierId + '-新增' : item.alterationType === '1' ? item.classifierId + '-删除' : item.classifierId + '-修改',
        type: item.alterationType,
        classifierId: item.classifierId,
        date: this.formInline.date
      }})
    },
    getNewData() {

    },
    handleSizeChange(val) {
      this.page.size = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getData();
    },
    // onCancel() {
    //   this.formInline.type = null;
    //   this.formInline.classifierId = null;
    //   this.formInline.date = [];
    //   this.getData('current');
    // },
    handleDel(item) {
      console.log(item)
      this.$confirm('确定删除该订阅吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        get('/home/subscribe/removeMySubscribe', {
          subId: item.id
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.$message.success(res.message);
            this.getData();
          } else {
            this.$message.error(res.message);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    isClass2({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        return 'thStyle'
      } else if (columnIndex === 0) {
        return 'thStyle2'
      }
    },
    isClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        return 'text-align:center;'
      } else if (columnIndex === 0) {
        return 'padding-left:10px;'
      }
    },
    goToNewSub(type, item) {
      if (!type) {
        this.$router.push({ name: 'newSubscription' })
      } else if (type && item) {
        this.$router.push({ name: 'newSubscription', params: {
          name: item.name, desc: item.description, isMail: item.sendEmail
        }})
      }
    },
    getData(type) {
      if (type === 'current') {
        this.page.current = 1;
      }
      this.wSubscribe.bLoading = true;
      let params = {
        changeType: this.formInline.type,
        classifierId: this.formInline.classifierId,
        startDate: this.formInline.date ? this.formInline.date[0] : null,
        endDate: this.formInline.date ? this.formInline.date[1] : null,
        subId: this.formInline.id,
        pageSize: this.page.size,
        pageCurrent: this.page.current
      }
      get('/home/subscribe/listMdChangeCountInfo', params).then(res => {
        if (res.code && res.success) {
          this.tableData = res.data.records;
          this.page.total = res.data.total
        }
        this.wSubscribe.bLoading = false;
      })
    },
    getChangeType() {
      get('/home/subscribe/listMdChangeClassifierType', { subId: this.formInline.id }).then(res => {
        if (res.code && res.success) {
          this.classifierList = res.data;
        }
      })
    }
  },
  created() {
    if (this.$route.params.id) {
      this.formInline.id = this.$route.params.id;
    }
    var day2 = new Date();
    day2.setTime(day2.getTime());
    let s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
    this.$set(this.formInline.date, 0, s2)
    this.$set(this.formInline.date, 1, s2)
    // this.formInline.date[1] = s2;
    this.getData();
    this.getChangeType();
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
 @import "../../../styles/variables";
  @import "../../../styles/treeIcon";
  @import './../../../styles/dq/main-card-table.scss';
.subscription-container{
  .search-card{
    .cardTitle{
      padding:0 8px 12px 8px;
      font-size: 14px;
      border-bottom:1px solid #e8eaec;
    }
    .el-card__body{
      padding:18px 10px;
      .el-form{
          padding-top:8px;
        .el-form-item{
          margin-bottom: 0;
          .el-date-editor{
            width: 220px;
          }
        }
      }
    }
  }
  .card-body{
    padding:18px 15px;
    margin-top:10px;
    .el-card__body{
      padding:0;
      .button-box{
        padding: 5px 0 12px 0;
        font-size: 14px;
        border-bottom: 1px solid #e8eaec;
        .el-button--small{
          padding: 8px 13px;
          .el-icon-circle-plus{
            font-size: 18px;
          }
          span{
            font-size: 13px;
            position: relative;
            bottom: 3px;
          }
        }

      }
      .table-box{
        .el-table{
          border:1px solid #d5d7da;
          margin-top: 15px;
          thead{
            color: #3b3d3f!important;
          }
        }
        .funKey{
          .immediately,.flow,.detail,.back{
            width: 20px;
            height: 20px;
            display: inline-block;
            background-size: 20px 20px;
            cursor: pointer;
            margin-right: 6px;
          }
        }
      }

    }

  }
}
.thStyle{
  text-align: center!important;
}
.thStyle2{
  padding-left:10px!important;
}
  </style>
