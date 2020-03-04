<!--物理表详情-->
<template>
  <div class="detail-physical-model dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <el-button type="primary" size="small" class="save" @click="toDDLPage"> < />生成DDL</el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-form ref="form" :model="form" label-width="120px" style="width: 500px">
            <el-form-item label="数据库：">
              <el-select disabled style="width: 234px" size="small" v-model="form.sourceId" placeholder="请选择">
                <el-option
                      v-for="item in aSchemaLists"
                      :key="item.sourceId"
                      :label="item.sourceName"
                      :value="item.sourceId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="层次：">
              <el-select disabled style="width: 234px" size="small" v-model="form.levelId" placeholder="请选择">
                 <el-option
                      v-for="item in aLevelLists"
                      :key="item.levelId"
                      :label="item.levelName"
                      :value="item.levelId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主题：">
              <el-select disabled style="width: 234px" size="small" v-model="form.subjectId" placeholder="请选择">
                <el-option
                      v-for="item in aSubjectLists"
                      :key="item.subjectId"
                      :label="item.subjectName"
                      :value="item.subjectId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物理表英文名：">
              <el-input readonly size="small" v-model.trim="form.tableEnName"></el-input>
            </el-form-item>
            <el-form-item label="物理表中文名：">
              <el-input readonly size="small" v-model.trim="form.tableCnName"></el-input>
            </el-form-item>
            <!-- 可变部分 -->
            <div v-if="dataBaseType">
              <el-form-item label="存储格式：">
                <el-select style="width: 234px" size="small" v-model="form.storageFormat" placeholder="请选择" disabled>
                  <el-option
                      v-for="item in aStorageFormatLists"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否压缩：">
                <el-select style="width: 234px" size="small" v-model="form.isCompress" placeholder="请选择" disabled>
                  <el-option
                      v-for="item in aIsCompressLists"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分桶字段：">
                <el-input size="small" v-model="form.bucketsColumn" readonly></el-input>
              </el-form-item>
              <el-form-item label="分桶数：">
                <el-input-number style="width: 80px" size="small" v-model="form.bucketsNum" controls-position="right" :min="0" disabled>
                </el-input-number>
              </el-form-item>
              <el-form-item label="分区字段：">
                <el-input size="small" v-model="form.partitionColumn" readonly></el-input>
              </el-form-item>
              <el-form-item label="分区范围：">
                <el-input size="small" v-model.trim="form.partitionRange" readonly></el-input>
              </el-form-item>
            </div>

            <el-form-item label="说明：">
              <el-input readonly size="small" type="textarea" :rows="5" v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select disabled style="width: 234px" size="small" v-model="form.status ==='0'?'未发布':'已发布'" placeholder="请选择">
                <!-- <el-option label="区域一" value="shanghai"></el-option> -->
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="字段信息" name="second" :disabled="bIsDisabled">
          <el-col :span="6" :offset="18">
            <el-input size="small" placeholder="请输入字段中文或英文名..."
                      v-model.trim="keyword" @keyup.enter.native="searchDataLists"
            ><i slot="suffix" class="el-input__icon el-icon-search" @click="searchDataLists"></i></el-input>
          </el-col>
          <div class="clearFloat"></div>
          <el-card class="card-table">
            <el-table
                :data="columnInfos"
                style="width: 100%">
              <el-table-column
                  align="center"
                  type="index"
                  label="序号"
                  width="60">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="columnCnName"
                  :show-overflow-tooltip="showToolTip"
                  label="字段中文名">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="refStandardCode"
                  :show-overflow-tooltip="showToolTip"
                  label="参考标准">
                <template slot-scope="scope">
                  <a class="a-color" @click="clickToStandardDetails(scope.row)">
                    {{scope.row.refStandardCode}} </a>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="columnEnName"
                  :show-overflow-tooltip="showToolTip"
                  label="字段英文名">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="typeCode"
                  :show-overflow-tooltip="showToolTip"
                  label="字段类型">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="length"
                  label="长度">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="precision"
                  label="精度">
              </el-table-column>
              <el-table-column
                  align="center"
                  label="是否主键">
                <template slot-scope="scope">
                  <span> {{scope.row.isPk === '1' ? '是' : '否'}} </span>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="是否可空">
                <template slot-scope="scope">
                  <span> {{scope.row.isNull === '1' ? '是' : '否'}} </span>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  :show-overflow-tooltip="showToolTip"
                  prop="defaultValue"
                  label="默认值">
              </el-table-column>
              <el-table-column
                  align="center"
                  :show-overflow-tooltip="showToolTip"
                  prop="description"
                  label="描述">
              </el-table-column>
            </el-table>
            <div style="text-align: center; padding: 10px 0" v-if="total>0">
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="iCurrentPage"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="iPagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
              </el-pagination>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--DDL对话框-->
    <el-dialog  title="DDL" :visible.sync="bDDLIsVisible">
      <div class="ddl-content">
        <!-- <span v-highlight > 
          <pre><code class='lang-SQL hljs' id="copy_text" >
             {{this.DDLData}}
         </code></pre>
        </span> -->
        <el-input id="copy_text" readonly type="textarea" :autosize="{minRows: 7,maxRows: 10}" size="small" v-model="DDLData" autocomplete="off" placeholder="请输入层次代码" >          
        </el-input>
      </div>   
      <div slot="footer" class="dialog-footer" align="center">
        <!-- <el-button data-clipboard-action="copy" data-clipboard-target="#copy_text" class="coy-btn" size="small" type="primary" @click="copyDDL" >复制到剪贴板</el-button> -->
        <el-button  class="coy-btn" size="small" type="primary" @click="copyDDL" >复制到剪贴板</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { get, parseAjaxResponse } from '../../utils/request'
  export default {
    name: 'detailPhysicalModel',
    data() {
      return {
        activeName: 'first',
        addDataSrcActiveName: 'first', // 新增数据库对话框，显示哪一个tabs标签
        bDDLIsVisible: false, // DDL对话框是否可见
        DDLData: '',
        form: {
          sourceId: '',
          subjectId: '',
          levelId: '',
          tableEnName: '',
          tableCnName: '',
          description: '',
          status: '',
          // 可变部分（后面加入）
          storageFormat: '',
          isCompress: '',
          bucketsColumn: '',
          bucketsNum: '',
          partitionColumn: '',
          partitionRange: ''
        },
        // 加入部分
        aStorageFormatLists: [],
        aIsCompressLists: [
          {
            "label": "是",
            "value": "1"
          },
          {
            "label": "否",
            "value": "0"
          }
        ],
        dataBaseType: false,
        aSchemaLists: [], // 数据库
        aLevelLists: [], // 层次
        aSubjectLists: [], // 主题
        baseTypes: [], // 数据库类型
        bIsDisabled: false,
        modelId: this.$route.params.id, // 模型ID
        columnInfos: [],
        keyword: '',
        iCurrentPage: 1,
        iPagesize: 10,
        total: 0,
        showToolTip: true
      }
    },
    methods: {
  
      // 获取模型详情
      getModelDetails() {
        get('/mod/model/getModelDetailInfo', {
          modelId: this.modelId // 模型ID
        }).then((res) => {
          // console.log(res)
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.form.sourceId = res.data.sourceId
              this.form.subjectId = res.data.subjectId
              this.form.levelId = res.data.levelId
              this.form.tableEnName = res.data.tableEnName
              this.form.tableCnName = res.data.tableCnName
              this.form.description = res.data.description
              this.form.status = res.data.status
              this.columnInfos = res.data.columnInfos.records
              this.total = res.data.columnInfos.total
              // this.aSchemaLists.map(item => {
              //   if (item.sourceId === res.data.sourceId) {
              //     this.dataBaseType = item.dbType
              //   }
              // })
              // if (this.columnInfos.length > 0) {
              //   this.total = this.columnInfos.length
              // }
              if (res.data.exts.length > 0) {
                this.dataBaseType = true
                res.data.exts.map((item, index) => {
                  if (item.extKey === "BUCKET_COLUMN") {
                    this.form.bucketsColumn = item.extValue
                  }
                  if (item.extKey === "STORAGE_FORMAT") {
                    this.form.storageFormat = item.extValue
                  }
                  if (item.extKey === "IS_COMPRESS") {
                    this.form.isCompress = item.extValue
                  }
                  if (item.extKey === "BUCKET_NUMBER") {
                    this.form.bucketsNum = item.extValue
                  }
                  if (item.extKey === "PARTITION_COLUMN") {
                    this.form.partitionColumn = item.extValue
                  }
                  if (item.extKey === "PARTITION_SCOPE") {
                    this.form.partitionRange = item.extValue
                  }
                })
              } else {
                this.dataBaseType = false
              }
            }
          })
        })
      },
      // 获取模型DDL /mod/model/getModelDDL
      getModelDDLDatas() {
        get('/mod/model/getModelDDL', {
          modelId: this.modelId // 模型ID
        }).then((res) => {
          console.log(res)
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.bDDLIsVisible = true // 打开DDL对话框
              console.log("111", res.data, "1111")
              // let arr = res.data.split(/\n/g)
              // console.log("111111arr", arr)
              this.DDLData = res.data
            }
          })
        })
      },

      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 搜索
      searchDataLists() {
        let pamars = {
          keyword: this.keyword,
          modelId: this.modelId, // 模型ID
          pageCurrent: this.iCurrentPage,
          pageSize: this.iPagesize
        }
        get('/mod/model/listModelColumnInfos', pamars).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.columnInfos = res.data.records
              this.total = res.data.total
            }
          })
        })
      },
      // 跳转到标准详情页面
      clickToStandardDetails(row) {
        let params = {
          id: row.refStandardId,
          _title: row.refStandardName,
          name: row.refStandardName
        }
        if (row.refStandardClassifierId.includes("BizTermInfoItem")) {
          this.$router.push({
            name: "professionalDetail",
            params: params
          })
        }
        if (row.refStandardClassifierId.includes("CalculateIndexInfoItem") || row.refStandardClassifierId.includes("Parent_RuleIndex") || row.refStandardClassifierId.includes("BaseIndexInfoItem") || row.refStandardClassifierId.includes("DeriveIndexInfoItem")) {
          this.$router.push({
            name: "indexManagementDetails",
            params: {
              id: row.refStandardId,
              classifierId: row.refStandardClassifierId,
              _title: row.refStandardName
            }
          })
        }
        if (row.refStandardClassifierId.includes("RuleInfoItem")) {
          this.$router.push({
            name: "ruleDetail",
            params: {
              id: row.refStandardId,
              _title: row.refStandardName,
              row: ''
            }
          });
        }
        if (row.refStandardClassifierId.includes("DimentsionItem")) {
          this.$router.push({
            name: "dimensionDetails",
            params: {
              id: row.refStandardName,
              _title: row.refStandardName,
              detailId: row.refStandardId,
              row: ""
            }
          });
        }
        if (row.refStandardClassifierId.includes("MasterDataInfoItem")) {
          this.$router.push({
            name: "masterDataDetails",
            params: {
              id: row.refStandardId,
              classifierId: row.refStandardClassifierId,
              _title: row.refStandardName,
              headerTitle: row.refStandardName
            }
          });
        }
      },
      // 打开DDL对话框
      toDDLPage() {
        this.getModelDDLDatas()
      },
      // 复制到剪贴板
      copyDDL() {
        let input = document.getElementById("copy_text")
        input.select();
        document.execCommand("Copy");
        this.$message.success("复制成功")
        // let clipboard = new ClipboardJS('#copy_text');
        // const input = document.createElement('input');
        // document.body.appendChild(input);
        // debugger
        // input.setAttribute('value', this.DDLData);
        // input.select();
        // if (document.execCommand('copy')) {
        //   document.execCommand('copy');
        //   console.log('复制成功', this.DDLData);
        // }
        // document.body.removeChild(input);
      },
      handleSizeChange(val) {
        this.iPagesize = val
        this.searchDataLists()
      },
      handleCurrentChange(val) {
        this.iCurrentPage = val
        this.searchDataLists()
      },
      // 获取数据库下拉列表信息  /mod/model/listAllDatasource todo 数据库、层次、主题，其他页面也在使用，可以使用vuex状态管理
      getListAllDatasource() {
        get('/mod/model/listAllDatasource', {}).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.aSchemaLists = res.data
            }
          })
        })
      },
      // 获取层次下拉列表信息 /mod/model/listAllLevel
      getListAllLevel() {
        get('/mod/model/listAllLevel', {}).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.aLevelLists = res.data
            }
          })
        })
      },
      // 获取主题下拉列表信息 /mod/model/listAllSubject
      getListAllSubject() {
        get('/mod/model/listAllSubject', {}).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.aSubjectLists = res.data
            }
          })
        })
      },
      // 获取数据库类型  /sys/datasource/listDataSourceTypes
      getListDataSourceTypes() {
        get('/sys/datasource/listDataSourceTypes').then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.baseTypes = res.data
            }
          })
        })
      },
      // 获取Hive数据库的存储格式
      getListHiveStorageFormats() {
        get('/mod/model/listHiveStorageFormats').then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.aStorageFormatLists = res.data
            }
          })
        })
      }
    },
    created() {
      this.showToolTip = true
      this.getModelDetails()
      this.getListAllDatasource()
      this.getListAllLevel()
      this.getListAllSubject()
      this.getListDataSourceTypes()
      this.getListHiveStorageFormats()
    },
    deactivated() {
      this.showToolTip = false
    },
    mounted() {

    }
  }
</script>


<style lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';

  .detail-physical-model{
    //右上角按钮-位置
    .save{
      position: absolute;
      top: 25px;
      right: 28px;
      z-index: 10; //不加的话，hover时按钮没有颜色变化
    }
    //form表单label标签的字体大小
    .el-form /deep/ .el-form-item{
      .el-form-item__label{
        font-size: 12px;
      }
    }

    //清楚浮动
    .clearFloat{
      clear: both;
    }

  }

</style>

