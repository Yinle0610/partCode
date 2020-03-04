<template>
<!-- 我的订阅 -->
  <div style="padding:13px;" class="subscription-container">
    <el-card shadow="hover" class="search-card">
      <el-form :inline="true" :model="formInline" label-width="80px">
        <el-form-item label="创建日期：">
          <el-date-picker v-model="formInline.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                          :unlink-panels='wSubscribe.unlinkPanels' value-format="yyyy-MM-dd" size="small">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订阅名称：">
          <el-input v-model="formInline.subscribeName" placeholder="请输入" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="订阅描述：">
          <el-input v-model="formInline.subscribeDescription" placeholder="请输入" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item style="margin-left:20px;">
          <el-button type="primary" @click="onSubmit" size="small">
            <i class="el-icon-search"></i> 查询
          </el-button>
          <!-- <el-button  @click="onCancel" size="small">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover" class="card-body">
      <div class="button-box">
        <el-button type="primary" icon="el-icon-circle-plus" size="small" @click="goToNewSub(false)">新增订阅</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData"  style="width: 100%" :header-cell-style="{background:'#f8f8f9'}"
                      v-loading="wSubscribe.bLoading" size="mini" :cell-style="isClass" :header-cell-class-name="isClass2">
          <el-table-column prop="name" label="订阅名称"  width="280">
          </el-table-column>
          <el-table-column prop="description" label="订阅描述"  width="260">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"  >
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人">
          </el-table-column>
          <el-table-column prop="lastModifyTime" label="最后修改时间"  >
          </el-table-column>
          <el-table-column prop="remindWay" label="提醒方式"  >
            <template slot-scope="scope">
              <div>{{scope.row.sendEmail==='1'?'邮件':'无'}}</div>
            </template>
          </el-table-column>
          <el-table-column  label="操作" align="center">
            <!-- <template slot-scope="scope"> -->
            <template slot-scope="scope">
              <div class="funKey">
                <el-tooltip class="item" effect="dark" content="修改订阅" placement="bottom">
                  <el-button   @click="goToNewSub(true,scope.row)" type="text" size="small" >
                    <svg-icon icon-class="editor" class="editor"></svg-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="变更数据" placement="bottom">
                  <el-button   @click="goToChangeSub(scope.row)" type="text" size="small" >
                    <svg-icon icon-class="preview" class="preview"></svg-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除订阅" placement="bottom">
                  <el-button @click='handleDel(scope.row)' type="text" size="small" >
                    <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                  </el-button>
                </el-tooltip>
                <!-- <el-tooltip class="item" effect="dark" content="修改订阅" placement="bottom">
                  <i class="immediately" @click="goToNewSub(true,scope.row)"  style="background: url(./../../../src/assets/images/commonIcon/icon-matter-banli.png) no-repeat;background-size: 20px 20px"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="变更数据" placement="bottom">
                  <i class="detail" @click="goToChangeSub(scope.row)" style="background: url(./../../../src/assets/images/commonIcon/icon-matter-yulan.png) no-repeat;background-size: 20px 20px"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除订阅" placement="bottom">
                  <i class="flow" @click="handleDel(scope.row)" style="background: url(./../../../src/assets/images/commonIcon/icon-matter-delete.png) no-repeat;background-size: 20px 20px"></i>
                </el-tooltip> -->
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
  name: 'MY_SUBSCRIBE',
  data() {
    return {
      wSubscribe: {
        bLoading: false,
        unlinkPanels: true
      },
      formInline: {
        date: '',
        subscribeName: null,
        subscribeDescription: null
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      tableData: []
    }
  },
  methods: {
    handleSizeChange(val) {
      this.page.size = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getData();
    },
    onSubmit() {
      this.page.current = 1;
      this.getData();
    },
    // onCancel() {
    //   this.formInline = {
    //     date: null,
    //     subscribeName: null,
    //     subscribeDescription: null
    //   }
    //   this.getData();
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
    goToChangeSub(item) {
      this.$router.push({ name: 'changeSub', params: {
        id: item.id, _title: item.name
      }})
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
        this.$router.push({ name: 'amendSub', params: {
          subId: item.id
        }})
      }
    },
    getData() {
      let params = {
        subName: this.formInline.subscribeName,
        subDesc: this.formInline.subscribeDescription,
        startDate: this.formInline.date ? this.formInline.date[0] : null,
        endDate: this.formInline.date ? this.formInline.date[1] : null,
        pageSize: this.page.size,
        pageCurrent: this.page.current
      }
      get('/home/subscribe/listMySubscribe', params).then(res => {
        if (res.code && res.success) {
          this.tableData = res.data.records;
          this.page.total = res.data.total;
        }
      })
    }
  },
  created() {
    this.getData();
  },
  activated() {
    this.getData();
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
 @import "../../../styles/variables";
  @import "../../../styles/treeIcon";
  @import './../../../styles/dq/main-card-table.scss';
.subscription-container{
  .search-card{
    .el-card__body{
      padding:18px 10px;
      .el-form{
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
        padding-bottom: 10px;
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
          .preview,.deleteRed,.editor{
            width:22px;
            height:22px;
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
