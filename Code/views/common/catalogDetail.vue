<template>
    <div class="right-basic">
        <div class="box">
            <div slot="header" class="clearfix card-title">
                <el-button class="back-btn" @click="handleBack" size="small"><&nbsp;返回</el-button>
            </div>
             <div style="height: 100%;">
                <div class="basic-content">
                    <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item title="基本信息" name="1">
                        <div>
                            <p>目录代码：{{dataList.basic.fixed?dataList.basic.fixed.code:'-'}}</p>
                            <p>目录名称：{{dataList.basic.fixed?dataList.basic.fixed.name:'-'}}</p>
                            <p v-for="(v,k) in dataList.basic.traversal" :key="k">{{v.name+'：'}}{{v.value&&v.attrCode!=='Is_Entity'?v.value:v.value==='T'?'是':v.value?'否':'-'}}</p>
                            <p>上下文路径：{{dataList.basic.fixed?dataList.basic.fixed.path:'-'}}</p>
                        </div>
                        </el-collapse-item>
                        <el-collapse-item title="认责信息" name="2">
                          <div>
                            <p>归口责任部门：
                              <svg-icon icon-class="groupduty" class="dutyGroup"></svg-icon>{{dataList.duty.group?dataList.duty.group:'无'}}
                            </p>
                            <p>归口责任人：<svg-icon icon-class="userduty" class="dutyUser"></svg-icon>{{dataList.duty.user?dataList.duty.user:'无'}}</p>
                        </div>
                        </el-collapse-item>
                        <el-collapse-item class="usageCollapse" title="子目录信息" name="3">
                          <div style="text-align:center">
                            <el-table :header-cell-style="{background:'#f8f8f9',color:'#606266'}" border
                              :data="messList" tooltip-effect="dark" style="width: 100%;margin-top:10px;" size="small">
                              <el-table-column sortable show-overflow-tooltip align="center" prop="name" label="目录名称" >
                                </el-table-column>
                              <el-table-column sortable show-overflow-tooltip align="center" prop="path" label="上下文路径" >
                                </el-table-column>
                              <el-table-column  label="是否实体目录" align="center">
                                <template slot-scope="scope">
                                  <div>{{scope.row.attributes[0].value&&scope.row.attributes[0].attrCode!=='Is_Entity'?scope.row.attributes[0].value:scope.row.attributes[0].value==='T'?'是':scope.row.attributes[0].value?'否':'-'}}</div>
                                </template>
                              </el-table-column>
                              <el-table-column  label="操作" align="center">
                                <template slot-scope="scope">
                                  <el-button  type="text" size="small" @click="goToSeeDetail(scope.row)">查看信息项</el-button>
                                </template>
                              </el-table-column>
                            </el-table>
                            <el-pagination
                              @size-change="handleSizeChange"
                              @current-change="handleCurrentChange"
                              :current-page="page.current"
                              :page-sizes="[5, 10, 15, 20]"
                              :page-size="page.size"
                              background
                              layout="total, sizes, prev, pager, next, jumper"
                              :total="page.total"
                              style="margin-top:20px;">
                            </el-pagination>
                          </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
        </div>     
    </div>
</template>
<script>
import { get } from "@/utils/request";
export default {
  data() {
    return {
      messList: [],
      titleList: [
        { prop: 'name', label: '目录名称' },
        { prop: 'path', label: '上下文路径' },
        { prop: 'decide', label: '是否实体目录' }
      ],
      activeNames: ['1', '2', '3'],
      page: {
        size: 5,
        current: 1,
        total: null
      },
      dataList: {
        basic: {
          fixed: null,
          traversal: null
        },
        duty: {
          group: null,
          user: null
        }
      },
      instanceId: null
    }
  },
  watch: {
    dataList: {
      handler(newValue, oldValue) {
        // console.log(newValue, 'newValue')
      },
      deep: true // 只要当obj中的值改变就会触发这个函数且,newValue,oldValue两个参数值相同;/
    },
    instanceId: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.getData(newValue)
        }
      },
      deep: true // 只要当obj中的值改变就会触发这个函数且,newValue,oldValue两个参数值相同;/
    }
  },
  methods: {
    handleBack() {
      this.$emit('showmain', 'card')
    },
    handleChange(val) {
      console.log(val)
    },
    goToSeeDetail(val) {
      this.$emit('showmain', 'cardMain')
      this.$emit('colData', val)
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getData(this.instanceId)
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.getData(this.instanceId)
    },
    getData(val) {
      get('/ds/listCatalogueAllChild', {
        current: this.page.current,
        instanceId: val,
        size: this.page.size
      }).then(res => {
        if (res.code === 10000) {
          this.messList = res.data.records;
          this.page.total = res.data.total;
          this.page.size = res.data.size;
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.right-basic{
  height: calc(100vh - 115px);
  background:#fff;
  border-radius: 4px;
  padding:15px 8px;
  .box{
      height: 100%;
      padding:15px 30px;
      overflow: auto;
  }
  .box::-webkit-scrollbar{
    width:5px;
    height:10px;
  }
  .box::-webkit-scrollbar-track{
    background: none;
    border-radius:2px;
  }
  .box::-webkit-scrollbar-thumb{
    background: rgb(239, 239, 239);
    border-radius:10px;
  }
  .box::-webkit-scrollbar-thumb:hover{
    background:#bfbfbf;
  }
  .card-title {
    height: 55px;
    padding: 5px 50px;
    border-bottom: 1px solid rgba(228, 228, 228, 1);
    padding-left: 10px;
    }
    .basic-content {
  height: calc(100% - 80px);
  // width: calc(100% - 80px);
  // overflow: auto;
  // position: absolute;
  /deep/ .el-collapse {
    border: unset;
    margin-top: 20px;
  }
  /deep/ .el-collapse-item__header {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: 18px;
    color: #666666;
    padding: 0 20px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  /deep/ .el-collapse-item__wrap {
    border-bottom: unset;
  }
  /deep/ .el-collapse-item__content {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #666666;
    padding: 8px 55px;
  }
  .basic-content_button {
    height: 34px;
    width: 85px;
    padding: 0;
    position: relative;
  }
}
.dutyGroup{
  width: 22px;
  height: 22px;
  position: relative;
  margin-right:5px;
  top:5px;
}
.dutyUser{
  width: 16px;
  height: 16px;
  position: relative;
  margin-right:5px;
  // top:1px;
}
}
</style>