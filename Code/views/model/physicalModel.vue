<!--物理模型-->
<template>
  <div class="physical-model dashboard-editor-container">
    <!--filter过滤区-->
    <el-card shadow="hover" class="card-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline height-class">
        <el-form-item label="数据库：">
          <el-select style="width: 98px" v-model="formInline.sourceId" size="small" placeholder="请选择" clearable>
            <el-option
                v-for="item in aSchemaLists"
                :key="item.sourceId"
                :label="item.sourceName"
                :value="item.sourceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="层次：">
          <el-select style="width: 98px" v-model="formInline.levelId" size="small" placeholder="请选择" clearable>
            <el-option
                v-for="item in aLevelLists"
                :key="item.levelId"
                :label="item.levelName"
                :value="item.levelId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题：">
          <el-select style="width: 98px" v-model="formInline.subjectId" size="small" placeholder="请选择" clearable>
            <el-option
                v-for="item in aSubjectLists"
                :key="item.subjectId"
                :label="item.subjectName"
                :value="item.subjectId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select style="width: 98px" v-model="formInline.status" size="small" placeholder="请选择" clearable>
            <el-option
                v-for="item in aStatusLists"
                :key="item.value"
                :label="item.name"
                :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物理表名称：">
          <el-input size="small" placeholder="请输入中文或英文名称..." v-model.trim="formInline.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" class="height-class" icon="el-icon-search" @click="getListModelInfos">查询</el-button>
          <!-- <el-button size="small" class="height-class" @click="resetTable">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
    <!--表格数据区域-->
    <el-card shadow="hover" class="card-container card-table" v-loading="bIsLoading">
      <!--box组-->
      <div class="btn-box">
        <el-button size="small" v-permission="'MODEL_CREATE'" type="primary" @click="addPhysicalModel"> <i class="btn-box-icon add"></i> 新增物理表</el-button>
        <el-button size="small" v-permission="'MODEL_PUBLISH'" type="primary" @click="toPublish"><i class="btn-box-icon publish"></i> 立即发布</el-button>
        <el-button size="small" v-permission="'MODEL_REMOVE'" type="danger" @click="delAll"><i class="btn-box-icon del"></i> 批量删除</el-button>
      </div>
      <el-card class="card-table">
        <el-table class="tablePadding"
            border
            :data="tableData"
            style="width: 100%"
            ref="multipleTable"
            @selection-change="handleSelectionChange">
          <!--表格多选 增加type -->
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              prop="tableEnName"
              label="表英文名称"
              align="center"
              >
          </el-table-column>
          <el-table-column
              prop="tableCnName"
              label="表中文名称"
              align="center"
              >
          </el-table-column>
          <el-table-column
              prop="datasourceName"
              label="数据库"
              align="center"
              >
          </el-table-column>
          <el-table-column
              prop="subjectName"
              label="主题"
              align="center"
              >
          </el-table-column>
          <el-table-column
              prop="levelName"
              label="层次"
              align="center"
              >
          </el-table-column>
          <el-table-column
              label="状态"
              align="center">
            <template slot-scope="scope"> <span> {{ scope.row.state === '0' ? '未发布': '已发布' }} </span> </template>
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="创建时间"
              align="center">
          </el-table-column>
          <el-table-column
              prop="updateTime"
              label="最后修改时间"
              align="center">
          </el-table-column>
          <el-table-column
              label="操作"
              align="center"
              width="160">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-button @click="detailPhysicalModel(scope.row)" type="text" size="small" >
                  <svg-icon icon-class="preview" class="preview"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
                <el-button v-permission="'MODEL_EDIT'"  @click="editPhysicalModel(scope.row)" type="text" size="small" >
                  <svg-icon icon-class="editor" class="editor"></svg-icon>
                </el-button>
              </el-tooltip>
                <!-- <el-button type="primary" size="small" class="icon-btn" @click="detailPhysicalModel(scope.row)"> <i class="preview"></i>  详情</el-button>
                <el-button type="warning" v-permission="'MODEL_EDIT'" size="small" class="icon-btn" @click="editPhysicalModel(scope.row)"> <i class="edit"></i>  修改</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--分页-->
      <div style="text-align: center; padding: 10px 0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="ipageCurrent"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="ipageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!--立即发布 bIsPublishVisible -->
    <el-dialog title="请选择发布对象" :visible.sync="bIsPublishVisible">
      <el-tree
          ref="tree"
          :data="aToPublishTreeData"
          :props="publishTreeProps"
          node-key="menuId"
          show-checkbox
          @check-change="handleCheckChange"
          :render-content="renderContent">
      </el-tree>

      <div slot="footer" class="dialog-footer" align="center">
        <el-button size="small" type="primary" @click="getPublishModel">确 定</el-button>
        <el-button size="small" @click="bIsPublishVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { get, parseAjaxResponse } from '../../utils/request'
  // import { mapActions } from 'vuex'

  export default {
    name: 'physicalModel',
    data() {
      return {
        bIsLoading: true,
        // 树tree 的参数
        publishTreeProps: {
          label: 'menuName',
          children: 'childs',
          isLeaf: 'leaf'
        },
        aToPublishTreeData: [],

        aModelIds: [], // 批量删除 模型ID

        formInline: {
          sourceId: '',
          subjectId: '',
          levelId: '',
          status: '',
          name: ''
        },
        aSchemaLists: [],
        aLevelLists: [],
        aSubjectLists: [],
        aStatusLists: [
          {
            value: '1',
            name: '已发布'
          }, {
            value: '0',
            name: '未发布'
          }
        ],
        bIsPublishVisible: false, // 立即发布对话框是否可见
        tableData: [],
        ipageCurrent: 1,
        ipageSize: 10,
        total: 10
      }
    },
    // computed: {
    //   ...mapGetters([
    //     'aSchemaLists',
    //     'aLevelLists',
    //     'aSubjectLists'
    //   ])
    // },
    methods: {
      // 分页获取物理模型列表
      getListModelInfos() {
        get('/mod/model/listModelInfos', {
          datasourceId: this.formInline.sourceId, // 数据库ID
          levelId: this.formInline.levelId, // 层次ID
          status: this.formInline.status, // 状态（0：未发布，1：已发布）
          subjectId: this.formInline.subjectId, // 主题ID
          tableNameKeyword: this.formInline.name, // 物理表名称
          pageCurrent: this.ipageCurrent, // 查询当前页
          pageSize: this.ipageSize // 查询分页量
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.bIsLoading = false
              this.tableData = res.data.records
              this.total = res.data.total
            }
          })
        })
      },
      resetTable() {
        this.formInline = {
          sourceId: '',
          subjectId: '',
          levelId: '',
          status: '',
          name: ''
        }
        this.getListModelInfos()
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
      // 获取待发布信息 /mod/model/getModelToPublishInfos
      getModelToPublish() {
        get('/mod/model/getModelToPublishInfos').then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.aToPublishTreeData = res.data
            }
          })
        })
      },

      // 立即发布 /mod/model/publishModel
      getPublishModel() {
        let modelIds = this.$refs.tree.getCheckedKeys().join(",")
        get('/mod/model/publishModel', {
          modelIds: modelIds // 模型ID array[string]
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.$message.success(res.message)
              this.getListModelInfos()
              this.bIsPublishVisible = false
            }
          })
        })
      },
      // 批量删除  /mod/model/batchRemoveModel
      getBatchRemoveModel() {
        get('/mod/model/batchRemoveModel', {
          modelIds: this.aModelIds // 模型ID array[string]
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.$message.success(res.message)
              // 再次获取列表数据
              this.getListModelInfos()
            }
          })
        })
      },

      renderContent(h, params) {
        console.log(params)
        let sText = params.data.menuName;
        let iconType = "";
        iconType = "icon icon-folder";
        return h(
          "span",
          {
            class: "tree-node"
          },
          [
            h("div", {
              class: iconType,
              style: {
                marginRight: "4px"
              }
            }),
            h("span", sText)
          ]
        );
      },
      // 立即发布 tree checkbox点击
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
        console.log(this.$refs.tree.getCheckedKeys());
        // let aModelIds = []
        // let obj = {}
        // if (checked === true) {
        //
        // }
      },
      // 点击树节点
      handleNodeClick(data) {
        console.log(data);
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region' }]);
        }
        if (node.level > 1) return resolve([]);

        setTimeout(() => {
          const data = [{
            name: 'leaf',
            leaf: true
          }, {
            name: 'zone'
          }];

          resolve(data);
        }, 500);
      },

      // 新增物理表
      addPhysicalModel() {
        this.$router.push({
          name: 'newPhysicalModel',
          params: {
            id: 0,
            _title: "新增"
          }
        })
      },
      // 立即发布
      toPublish() {
        this.bIsPublishVisible = true
        this.getModelToPublish()
      },
      // 批量删除按钮
      delAll() {
        let _this = this;
        let selectRow = _this.$refs.multipleTable.selection
        let len = selectRow.length
        if (len === 0) {
          _this.$message.info("请选中要删除的数据")
          return
        }
        this.$confirm('是否确认删除选中数据？', '删除数据', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getBatchRemoveModel()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 修改物理表
      editPhysicalModel(row) {
        this.$router.push({
          name: 'newPhysicalModel',
          params: {
            id: row.modelId,
            isEditNum: 1, // 修改页面（显示状态字段）
            _title: "修改"
          }
        })
      },
      // 跳转到物理表详情页面
      detailPhysicalModel(row) {
        this.$router.push({
          name: 'detailPhysicalModel',
          params: {
            id: row.modelId,
            _title: row.name
          }
        })
      },
      // 表格多选
      handleSelectionChange(val) {
        console.log(val)
        let aIds = []
        val.forEach((item) => {
          aIds.push(item.modelId)
        })
        this.aModelIds = aIds.join(",")
      },

      handleSizeChange(val) {
        this.ipageSize = val
        this.getListModelInfos()
      },
      handleCurrentChange(val) {
        this.ipageCurrent = val
        this.getListModelInfos()
      }
    },
    created() {
      this.getListModelInfos()
      this.getListAllDatasource()
      this.getListAllLevel()
      this.getListAllSubject()
      // ...mapActions([
      //   'GetListAllDatasource',
      //   'GetListAllLevel',
      //   'GetListAllSubject'
      // ])

      // this.$store.dispatch('GetListAllDatasource')
      // this.$store.dispatch('GetListAllLevel')
      // this.$store.dispatch('GetListAllSubject')
    },
    activated() {
      this.resetTable()
    }
  }
</script>


<style lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';

  .physical-model{

    .el-form-item {
      margin-bottom: 10px;
      margin-top: 10px;
    }

    //box组的样式
    .btn-box {
      border-bottom: 1px solid #e8eaec;
      padding-bottom: 20px;
    }
    .btn-box button {
      position: relative;
      padding-left: 35px;
      margin-right: 8px;
    }
    .btn-box .btn-box-icon {
      position: absolute;
      display: inline-block;
      width: 20px;
      height: 20px;
      left: 10px;
      top: 6px;
    }
    .btn-box .add {
      background: url(../../../src/assets/images/commonIcon/add.png) no-repeat;
      background-size: 100%;
    }
    .btn-box .publish {
      background: url(../../../src/assets/images/commonIcon/publish.png) no-repeat;
      background-size: 100%;
    }
    .btn-box .del {
      background: url(../../../src/assets/images/commonIcon/del.png) no-repeat;
      background-size: 100%;
    }

    /*表格中操作列按钮组样式*/
    // .icon-btn {
    //   position: relative;
    //   padding-left: 35px;
    //   padding-right: 10px;
    // }
    // .preview, .edit {
    //   position: absolute;
    //   display: inline-block;
    //   width: 20px;
    //   height: 20px;
    //   left: 10px;
    //   top: 5px;
    // }
    // .preview {
    //   background: url(../../../src/assets/images/commonIcon/preview.png) no-repeat;
    //   background-size: 100%;
    // }
    // .edit {
    //   background: url(../../../src/assets/images/commonIcon/edit.png) no-repeat;
    //   background-size: 100%;
    // }
  .tablePadding {
    /deep/ td{
      padding:0;
    }
  }
    //立即发布 tree
    /deep/ .tree-node .icon {
      display: inline-block;
      position: relative;
      top: 0px;
      margin-right: 4px;
    }
    /deep/ .tree-node .icon-folder {
      position: relative;
      display: block;
      float: left;
      width: 16px;
      height: 16px;
      background: url("./../../assets/images/commonIcon/icon-file.png") no-repeat;
      background-size: 100% 100%;
    }
    .item{
      .preview,.editor{
        width:22px;
        height:22px;
      }
    }
  }
</style>
