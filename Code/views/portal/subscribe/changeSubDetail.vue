<template>
    <div class="changeSubDetail-container">
        <el-card shadow="hover" class="card-body">
            <div class="button-box">
                变更详情
            </div>
            <div class="input-box clearfix">
              <el-input v-model="keyword" placeholder="请输入关键字..." style="width:240px;" clearable @keyup.enter.native="getData('current')" size="small">
                <i slot="suffix" class="el-icon-search" @click="getData('current')"></i>
              </el-input>
            </div>
            <div class="table-box">
                <el-table :data="tableData"  style="width: 100%" :header-cell-style="{background:'#f8f8f9'}"
                            v-loading="wSubscribe.bLoading" size="small">
                <el-table-column label="变更类型"  width="150" align="center">
                    <template slot-scope="scope">
                    <div v-if="scope.row.alterationType==='2' " style="color:#2d8cf0;cursor: pointer;" @click="getSubDiff(scope.row)">{{scope.row.alterationType==='2'?'修改':'-'}}</div>
                    <div v-else>{{scope.row.alterationType==='0'?'新增':scope.row.alterationType==='1'?'删除':scope.row.alterationType==='2'?'修改':'-'}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="classifierType" label="元数据类型"  width="180" align="center">
                </el-table-column>
                <el-table-column prop="classifierName" label="变更元数据">
                  <template slot-scope="scope">
                    <div><span style="color:#2d8cf0;padding-right:5px;cursor: pointer;" @click="goDetail(scope.row)">{{scope.row.instanceCode}}</span><span>({{scope.row.instanceName?scope.row.instanceName:scope.row.instanceCode}})</span></div>
                    </template>
                </el-table-column>
                <el-table-column prop="alterationDate" label="变更时间" align="center">
                </el-table-column>
                <el-table-column prop="userName" label="变更人/采集人"  width="170" align="center">
                </el-table-column>
                <el-table-column prop="changeType" label="变更方式" align="center">
                </el-table-column>
                <el-table-column prop="datasourceName" label="数据源" align="center">
                </el-table-column>
                <el-table-column prop="nameContext" label="上下文路径"  show-overflow-tooltip>
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
        <el-dialog  :visible.sync="dialogTreeVisible" @close="closeEvent">
            <div slot="title" class="dialog-title">
                <div>元数据差异</div>
            </div>
            <div class="dialog-body">
                <el-table :data="dialogData"  style="width: 100%;border:1px solid #e8eaec;" :header-cell-style="{background:'#f8f8f9'}"
                            v-loading="wSubscribe.bLoading" size="small">
                  <el-table-column prop="attName" label="属性"   align="center">
                  </el-table-column>
                  <el-table-column prop="oldValue" label="修改前" align="center">
                  </el-table-column>
                  <el-table-column prop="newValue" label="修改后"  align="center">
                  </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { get } from '@/utils/request'
export default {
  name: 'changeSubDetail',
  data() {
    return {
      dialogTreeVisible: false,
      wSubscribe: {
        bLoading: false
      },
      tableData: [],
      dialogData: [],
      keyword: null,
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      date: null
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
    getSubDiff(item) {
      this.dialogTreeVisible = true;
      // console.log(item)
      let params = {
        instanceId: item.instanceId,
        oldStartTime: item.oldStartTime,
        startTime: item.startTime
      }
      get('/home/subscribe/getSubDataDiffInfo', params).then(res => {
        if (res.code && res.success) {
          this.dialogData = res.data;
        }
      })
    },
    goDetail(item) {
      console.log(item)
      if (item.alterationType === "1") {
        this.$router.push({
          name: 'historicalDetail',
          params: {
            id: item.instanceId,
            _title: item.instanceName,
            classifierId: item.classifierId, // 元数据类型ID
            startTime: item.startTime
          }
        })
      } else {
        this.$router.push({
          name: 'impactAndLineageDetail',
          params: {
            id: item.instanceId,
            _title: item.instanceName,
            classifierId: item.classifierId // 元数据类型ID
          }
        })
      }

      this.$emit('close')
    },
    closeEvent() {},
    getData(type) {
      this.wSubscribe.bLoading = true;
      if (type === 'current') {
        this.page.current = 1;
      }
      let params = {
        changeType: this.$route.params.type,
        classifierId: this.$route.params.classifierId,
        keyword: this.keyword,
        pageCurrent: this.page.current,
        pageSize: this.page.size,
        subId: this.$route.params.id,
        startDate: this.date ? this.date[0] : null,
        endDate: this.date ? this.date[1] : null,
        scope: this.$route.params.scope ? this.$route.params.scope : null
      }
      get('/home/subscribe/listMdChangeDetailInfo', params).then(res => {
        if (res.code && res.success) {
          this.tableData = res.data.records;
          this.page.total = res.data.total;
        }
        this.wSubscribe.bLoading = false;
      })
    },
    getNewClassifer() {}
  },
  created() {
    if (this.$route.params.date) {
      this.date = this.$route.params.date;
    }
    this.getData();
  }
}
</script>
<style lang="scss" scoped>
.changeSubDetail-container{
  padding:10px;
  .card-body{
    .button-box{
      padding:0 12px 15px 8px;
      font-size: 14px;
      font-weight: 600;
      border-bottom:1px solid #e8eaec;
    }
    .input-box{
      margin-top: 15px;
      overflow: hidden;
      .el-input{
        float: right;
      }
    }
    .table-box{
      margin-top: 15px;
      border:1px solid #e8eaec;
    }
  }
  .clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
  }
  .clearfix{
    *zoom: 1;/*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
  }
}
/deep/ .el-dialog__wrapper{
  .el-dialog{
    border-radius: 5px;
    width:600px;
    /deep/ .el-dialog__header{
      border-bottom:1px solid #e8eaec;
    }
    .dialog-title{
      font-weight: 600;
      color:#666;
      padding-bottom:10px; 
      
    }
  }
}

</style>