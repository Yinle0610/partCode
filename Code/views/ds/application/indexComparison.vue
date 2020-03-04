<template>
  <div class="indexComparision-box">
    <div class="content-box">
      <div class="top-box">
        <span class="span-font">指标选择</span>
        <div class="tag-box">
          <el-tag closable @close="closeTag1()" v-if="JSON.stringify(indexTagList1) !== '{}'"  @click="goIndexDetail(indexTagList1)">
              {{indexTagList1.name}}
          </el-tag>
          <el-button
            v-else
            size="mini"
            icon="el-icon-plus"
            class="add-class"
            @click="toAddFirstIndex">
            增加
          </el-button>
        </div>       
        <span class="vs-style">VS</span>
        <div class="tag-box">
          <el-tag closable @close="closeTag2()" v-if="JSON.stringify(indexTagList2) !== '{}'"  @click="goIndexDetail(indexTagList2)">
            {{indexTagList2.name}}
          </el-tag>
          <el-button
            v-else
            size="mini"
            icon="el-icon-plus"
            class="add-class"
            @click="toAddSecondIndex">
            增加
          </el-button>
        </div>       
        <el-button type="primary" size="mini" @click="compareTwoIndex()" class="bidui"><svg-icon icon-class="indexcompare"></svg-icon> 比对</el-button>
        <el-button type="primary" size="mini" @click="refreshInfo()" class="shuaxin"><svg-icon icon-class="refresh"></svg-icon> 重置</el-button>
      </div>
      <div class="center-box">
        <div class="table-box">
          <div class="tablebaseinfo-box">
            <el-table
              ref="tablebaseinfo"
              border
              size="mini"
              align="center"
              :data="baseInfoData">
              <el-table-column
                prop="name"
                label="基本信息"
                width="100px"
                align="center"
                :show-overflow-tooltip='showToolTip'
              ></el-table-column>
              <el-table-column
                prop="value1"
                label=""
                align="center"
                :show-overflow-tooltip='showToolTip'
              ></el-table-column>
              <el-table-column
                prop="value2"
                label=""
                align="center"
                :show-overflow-tooltip='showToolTip'
              ></el-table-column>
              <el-table-column
                label=""
                align="center"
                width="60px"
              >
                <template slot-scope="scope">
                  <span class="dengyu" v-if="scope.row.value1===scope.row.value2">
                    <svg-icon icon-class="dengyu"></svg-icon>
                  </span>
                   <span class="dengyu" v-else>
                    <svg-icon icon-class="budengyu"></svg-icon>
                  </span>
                </template>
              </el-table-column>             
            </el-table>
          </div>
          <div class="tableattrinfo-box" style="margin-top:10px">
            <el-table
              ref="tablebaseinfo"
              border
              size="mini"
              align="center"
              :data="attrInfoData">
              <el-table-column
                prop="name"
                label="属性信息"
                :show-overflow-tooltip='showToolTip'
                align="center"
                 width="100px"
              ></el-table-column>
              <el-table-column
                prop="value1"
                label=""
                align="center"
                :show-overflow-tooltip='showToolTip'
              ></el-table-column>
              <el-table-column
                prop="value2"
                label=""
                align="center"
                :show-overflow-tooltip='showToolTip'
              ></el-table-column>
              <el-table-column
                label=""
                align="center"
                width="60px"
              >
                <template slot-scope="scope">
                  <span class="dengyu" v-if="scope.row.value1===scope.row.value2">
                    <svg-icon icon-class="dengyu"></svg-icon>
                  </span>
                   <span class="dengyu" v-else>
                    <svg-icon icon-class="budengyu"></svg-icon>
                  </span>
                </template>
              </el-table-column>     
            </el-table>
          </div>
        </div>       
      </div> 
    </div>
    <div class="dialog-box">
      <el-dialog :visible.sync="isIndexSelectShow" width="700px" @close="closeDialog">
        <div slot="title">请选择指标</div>
        <div style="float:right;">
          <el-form inline>
            <el-form-item label="指标类型:" >
              <el-select v-model="indexSerch.indexType" placeholder="请选择指标类型" size="mini" class="indextype-search" @change="selectChange">
                <el-option label="请选择" value=""></el-option>
                <el-option
                  v-for="item in indexTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-right: 7px;" label="指标名称：" >
              <el-input v-model="indexSerch.indexName"
                        placeholder="请输入指标名称..." size="mini" clearable
                        @keyup.enter.native="getIndexInfo"
              ><i slot="suffix" style="cursor: pointer" class="el-input__icon el-icon-search" @click="getIndexInfo"></i>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="indexSelect.tableData" border size="mini" :header-cell-style="{background:'#f8f8f9'}" :highlight-current-row="currentRowFlag" @row-click="clickIndexTable">
          <el-table-column prop="name" label="指标名称" width="100px" :show-overflow-tooltip='showToolTip'>
          </el-table-column>
          <el-table-column prop="businessDef" label="业务定义"  :show-overflow-tooltip='showToolTip'>
          </el-table-column>
          <el-table-column prop="path" label="上下文路径" :show-overflow-tooltip='showToolTip'>
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin-top:30px;" v-if="indexSelect.tableData.length>0">
          <el-pagination
              @size-change="handleSizeChangeIndex"
              @current-change="handleCurrentChangeIndex"
              :current-page="indexSelect.oPage.pageCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="indexSelect.oPage.pageSize"
              background
              layout="total, sizes, prev, pager, next"
              :total="indexSelect.oPage.total">
          </el-pagination>
        </div>
        <div style="margin-top:50px;">
          <span style="font-size:13px;">已选择：</span>
          <div style="display: inline-block;" v-show="indexSelect.tagList.length > 0">
            <el-tag style="margin-left: 5px;margin-top: 5px;"
                    v-for="(item, index) in indexSelect.tagList"
                    :key="index"
                    v-show="indexSelect.tagList.length > 0"
                    @close="closeIndexTag(item, index)"
                    closable
                    effect="plain"
                    size="mini"
                    @click="goIndexDetail(item)"
            >{{item.name}}</el-tag>
          </div>
        </div>
        <div slot="footer" style="text-align:center;">
          <el-button type="primary" size="small" @click="toSave">确定</el-button>
        </div>
      </el-dialog>
    </div>   
  </div>
</template>
<script>
// import Pagination from '@/components/Pagination'
import { get } from '@/utils/request'
export default{
  // components: { Pagination },
  name: 'indexComparision',
  data() {
    return {
      flagtag: 1, // 判断点击的是哪一个按钮
      indexTagList1: {}, // 第一个指标tag列表

      indexTagList2: {}, // 第二个指标tag列表
      firstIndexDetail: [],
      secondIndexDetail: [],
      flag: true,
      // dialog
      isIndexSelectShow: false,
      indexSerch: {
        indexName: '',
        indexType: ''
      },
      indexTypeList: [
        { "label": "基础指标", "value": "BaseIndexInfoItem" },
        { "label": "计算指标", "value": "CalculateIndexInfoItem" },
        { "label": "衍生指标", "value": "DeriveIndexInfoItem" },
        { "label": "规则指标", "value": "RuleIndexInfoItem" }
      ],
      indexSelect: {
        tableData: [],
        oPage: {
          pageCurrent: 1,
          pageSize: 10,
          total: 10
        },
        tagList: []
      },
      currentRowFlag: true,
      // table
      baseInfoData: [],
      attrInfoData: [],
      showToolTip: true
    }
  },
  methods: {
    // 第一个tag
    // 关闭第一个tag
    closeTag1() {
      this.indexTagList1 = {};
    },
    toAddFirstIndex() {
      this.flagtag = 1
      this.isIndexSelectShow = true
      this.getIndexInfo()
    }, // 点击button添加指标
    // 第二个tag
    closeTag2() {
      this.indexTagList2 = {};
    }, // 关闭
    toAddSecondIndex() {
      this.flagtag = 2
      this.isIndexSelectShow = true
      this.getIndexInfo()
    },
    compareTwoIndex() {
      if (JSON.stringify(this.indexTagList1) === '{}' || JSON.stringify(this.indexTagList2) === '{}') {
        this.$message.error("请选择指标");
      } else {
        let params1 = {
          indexId: this.indexTagList1.id
        }
        get("/ds/application/index/getIndexDetails", params1).then(res => {
          if (res.code === 10000 && res.success) {
            this.firstIndexDetail = res.data
            this.baseInfoData = [
              {
                "name": "指标编号",
                "value1": this.firstIndexDetail.code,
                "value2": ""
              },
              {
                "name": "指标名称",
                "value1": this.firstIndexDetail.name,
                "value2": ""
              },
              {
                "name": "指标类型",
                "value1": this.firstIndexDetail.classifierName,
                "value2": ""
              },
              {
                "name": "上下文路径",
                "value1": this.firstIndexDetail.path,
                "value2": ""
              }
            ]
            this.attrInfoData = []
            this.firstIndexDetail.attributes.map((item, index) => {
              this.attrInfoData.push({
                "name": item.name,
                "value1": item.value,
                "value2": ""
              })
            })
            this.getSecondIndexInfo()
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    getSecondIndexInfo() {
      let params2 = {
        indexId: this.indexTagList2.id
      }
      get("/ds/application/index/getIndexDetails", params2).then(res => {
        if (res.code === 10000 && res.success) {
          this.secondIndexDetail = res.data
          this.$set(this.baseInfoData[0], "value2", this.secondIndexDetail.code)
          this.$set(this.baseInfoData[1], "value2", this.secondIndexDetail.name)
          this.$set(this.baseInfoData[2], "value2", this.secondIndexDetail.classifierName)
          this.$set(this.baseInfoData[3], "value2", this.secondIndexDetail.path)
          this.secondIndexDetail.attributes.map((item1, index1) => {
            this.attrInfoData.map((item2, index2) => {
              if (item2.name === item1.name) {
                this.attrInfoData[index2].value2 = item1.value
                this.flag = false
              }
            })
            if (this.flag) {
              this.attrInfoData.push({
                "name": item1.name,
                "value1": "",
                "value2": item1.value
              })
            }
          })
        } else {
          this.$message.error(res.message);
        }
      });
    },

    refreshInfo() {
      this.indexTagList1 = {};
      this.indexTagList2 = {};
      this.baseInfoData = []
      this.attrInfoData = []
    }, // 重置
    // dialog
    // 点击选中Index table的某一行（单选）
    clickIndexTable(row) {
      this.currentRowFlag = true
      if (!this.indexSelect.tagList.includes(row)) {
        this.indexSelect.tagList.splice(0, 1, row);
      }
    },
    closeIndexTag(item, index) {
      this.currentRowFlag = false
      this.indexSelect.tagList.splice(index, 1);
    },
    toSave() {
      if (this.indexSelect.tagList.length > 0) {
        if (this.flagtag === 1) {
          this.indexTagList1 = this.indexSelect.tagList[0]
        } else {
          this.indexTagList2 = this.indexSelect.tagList[0]
        }
      }
      this.indexSelect.tagList = []
      this.isIndexSelectShow = false
      this.indexSerch = {
        indexName: '',
        indexType: ''
      }
      this.indexSelect.oPage.pageCurrent = 1
      this.indexSelect.oPage.pageSize = 10
    },
    closeDialog() {
      this.indexSelect.tagList = []
      this.isIndexSelectShow = false
      this.indexSelect.oPage.pageCurrent = 1
      this.indexSelect.oPage.pageSize = 10
      this.indexSerch = {
        indexName: '',
        indexType: ''
      }
    },
    goIndexDetail(item) {
      // console.log("item, index", item, index)
      this.isIndexSelectShow = false
      this.$router.push({
        name: "indexManagementDetails",
        params: {
          id: item.id,
          classifierId: item.classifierId,
          _title: item.name
        }
      });
    },
    getIndexInfo() {
      let params = {
        classifierId: this.indexSerch.indexType,
        keyword: this.indexSerch.indexName,
        pageCurrent: this.indexSelect.oPage.pageCurrent,
        pageSize: this.indexSelect.oPage.pageSize
      }
      get("/ds/application/index/listIndexInfosByClassifierId", params).then(res => {
        if (res.code === 10000 && res.success) {
          this.indexSelect.oPage.total = res.data.total
          this.indexSelect.tableData = res.data.records
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // dialog table 分页
    handleSizeChangeIndex(val) {
      this.indexSelect.oPage.pageSize = val
      this.getIndexInfo()
    },
    handleCurrentChangeIndex(val) {
      this.indexSelect.oPage.pageCurrent = val
      this.getIndexInfo()
    },
    // dialog 指标类型下拉框切换
    selectChange(val) {
      this.indexSerch.indexType = val
      this.getIndexInfo()
    }
  },
  created() {

  },
  activated() {
    this.showToolTip = true
  },
  deactivated() {
    this.showToolTip = false
  }
}
</script>

<style lang="scss">
@import "../../../styles/dq/main-card-table.scss";
.indexComparision-box{
  background-color:#fff;
  margin:10px;
  //content的样式
  .content-box{
    padding:10px 200px 10px 200px;
     //表格表头背景颜色
      .el-table thead tr th {
      background-color: #f8f8f9;
      border-right:none;
      height:35px;
      text-align:left;
      font-weight:600;
      font-size:16px;
      // color:rgba(51, 51, 51, 0.3);
      div.cell {
        color: #4f3d3d82;
      }
    } 
     .top-box{      
      width:100%;
      margin-bottom:20px;
      padding:15px;
      border-bottom: 1px solid #e8ebed;
      .shuaxin{
            padding:2px 9px 6px 8px;
            .svg-icon{
                width:18px;
                height:18px;                       
                top:3px;
                position: relative;
            }           
        }
        .bidui{
            padding:2px 9px 6px 8px;
            .svg-icon{
                width:18px;
                height:18px;                       
                top:3px;
                position: relative;
            }           
        }
        
        .span-font{
          font-weight:600;
          font-size:16px;
          color:rgba(51, 51, 51, 0.647059);
          margin-right:30px
        }
        .vs-style{
          font-weight:600;
          font-size:16px;
          color:rgba(51, 51, 51, 0.647059);
          margin-right:10px;
        }
        .tag-box{
          display: inline-block;
          margin-right:10px
        }
    }
    .dengyu{
            .svg-icon{
                width:20px;
                height:20px;                       
                top:3px;
                position: relative;
            }           
        }
  }
  .el-dialog__header {
    border-bottom: 1px solid #e8ebed;
    .el-dialog__title{
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #17233d;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .el-dialog__footer {
    border-top: 1px solid #e8ebed;
  }
  .indextype-search .el-input__inner{
    width:110px
  }
}
</style>
