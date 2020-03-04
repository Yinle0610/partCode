<template>
  <!--业务术语 对话框 -->
  <el-dialog append-to-body :visible.sync="bMyIsVisible" id="relationTip" @close="close">
    <div slot="title">请选择业务术语</div>
      <el-form inline align="left" style="font-size: 12px;">
        <!--目录树tree-->
        <el-form-item label="目录：">
          <el-select size="mini"
                     style="width: 100%;"
                     v-model="treeSelectName"
                     placeholder="请选择"
          >
            <el-option value="" style="height: auto">
              <el-tree
                  accordion
                  style="margin: 0 -20px;"
                  :load="loadNode"
                  node-key="id"
                  ref="tree"
                  lazy
                  :props="defaultProps"
                  empty-text="暂无数据"
                  @node-click="handleNodeClick"
                  :highlight-current="true"
                  :render-content="renderContent"
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 7px;" label="关键字：" label-width="70px" class="input">
          <el-input v-model="termsSource.keyWord"
                    placeholder="请输入标准名称..." size="mini" clearable
                    @keyup.enter.native="handleCurrentChangeTerms(1)"
          ><i slot="suffix" style="cursor: pointer" class="el-input__icon el-icon-search" @click="handleCurrentChangeTerms(1)"></i>
          </el-input>
        </el-form-item>
      </el-form>
    <el-table :data="termsSource.tableData" border size="small" :header-cell-style="{background:'#f8f8f9',textAlign:'left'}" :highlight-current-row="currentRowFlag" @row-click="clickTermsTable">
      <el-table-column property="name" label="名称" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="businessDef" label="业务定义" width="" show-overflow-tooltip></el-table-column>
      <el-table-column property="path" label="上下文路径" width="" show-overflow-tooltip></el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:30px;" v-if="termsSource.tableData.length>0">
      <el-pagination
          @size-change="handleSizeChangeTerms"
          @current-change="handleCurrentChangeTerms"
          :current-page="termsSource.oPage.pageCurrent"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="termsSource.oPage.pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :total="termsSource.oPage.total">
      </el-pagination>
    </div>
    <div style="margin-top:50px;">
      <span style="font-size:13px;">已选择：</span>
      <div style="display: inline-block;" v-show="termsSource.referTag.length > 0">
        <el-tag style="margin-left: 5px;margin-top: 5px;"
                v-for="(item, index) in termsSource.referTag"
                :key="index"
                v-show="termsSource.referTag.length > 0"
                @close="closeTermsTag(item, index)"
                closable
                effect="plain"
                size="mini"
        >{{item.name}}</el-tag>
      </div>
    </div>
    <div slot="footer" style="text-align:center;">
      <el-button type="primary" size="small" @click="toSaveTerms">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { get } from '../../utils/request'

  export default {
    name: "termsDialog",
    props: ['bIsVisible'],
    data () {
      return {
        bMyIsVisible: this.bIsVisible,
        termsSource: {
          keyWord: "",
          tableData: [],
          bLoading: false,
          referTag: [],
          oPage: {
            pageCurrent: 1,
            pageSize: 10,
            total: 0
          }
        },
        currentRowFlag: true,
        // 业务术语id
        buzTermId: '',

        treeSelectName: '',
        defaultProps: {
          label: "name",
          children: "children",
          isLeaf: "leaf"
        },
        instanceId: "" // 点击时的nodeId
      }
    },
    watch: {
      bIsVisible(val) {
        console.log(val, '22')
        this.bMyIsVisible = val;
        if (val === false) {
          // 清空tag
          this.termsSource.referTag = []
          // 清除高亮
          this.currentRowFlag = false
        }
      }
    },
    methods: {
      loadNode(node, resolve) {
        if (node.level === 0) {
          get("/ds/bizTerm/listBuzTermTree", {
            // 初始化页面的tree时，id和nodeType都为空
            nodeId: null,
            nodeType: null
          }).then(res => {
            if (res.code === 10000 && res.success === true) {
              res.data.map(item => {
                item.isLeaf = item.leaf;
                return item;
              });
              return resolve(res.data);
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          let params = {
            nodeId: node.data.id,
            nodeType: node.data.notetype
          };
          get("/ds/bizTerm/listBuzTermTree", params).then(res => {
            if (res.code === 10000 && res.success === true) {
              res.data.map(item => {
                item.isLeaf = item.leaf;
                return item;
              });
              return resolve(res.data);
            } else {
              this.$message.error(res.message);
            }
          });
        }
      },
      renderContent(h, params) {
        // console.log("renderContent:params", params)
        let sText = params.data.name;
        let iconType = "";
        if (params.data.notetype === "metadata") {
          iconType = "icon icon-" + params.data.classifierId;
        } else {
          iconType = "icon icon-" + params.data.notetype;
        }
        if (params.data.notetype === "class") {
          iconType = "icon icon-" + params.data.classifierId;
        }
        if (params.data.isEntity === "是" || params.data.isEntity === "T") {
          iconType = "icon icon-Entity";
        }
        return h(
          "span",
          {
            class: "tree-node"
          },
          [
            h(
              "div",
              {
                class: iconType,
                style: {
                  marginRight: "4px",
                  display: "inline-block",
                  backgroundSize: "16px 16px",
                  width: "16px",
                  height: "16px",
                  float: 'unset',
                  fontWeight: 'unset'
                }
              }),
            h("span", sText)
          ]
        );
      },
      // 点击Tree节点
      handleNodeClick(data, node, component) {
        // console.log(data, "data")
        // console.log(data.notetype, "data.notetype")
        this.treeSelectName = data.name
        if (data.notetype === "metadata") {
          // 元数据类型为metadata时，查询信息项列表
          this.instanceId = data.id;
          this.termsSource.oPage.pageCurrent = 1
          this.queryBuzTerms()
        }
      },
      // 获取业务术语信息项
      queryBuzTerms() {
        get('/ds/bizTerm/queryBuzTerms', {
          nodeId: this.instanceId,
          pageCurrent: this.termsSource.oPage.pageCurrent,
          pageSize: this.termsSource.oPage.pageSize,
          keyword: this.termsSource.keyWord,
          status: ''
        }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.termsSource.tableData = res.data.records
            this.termsSource.oPage.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 点击 业务术语 每一行 (业务术语 - 单选)
      clickTermsTable(row) {
        // console.log(row)
        this.currentRowFlag = true
        if (!this.termsSource.referTag.includes(row)) {
          this.termsSource.referTag.splice(0, 1, row);
        }
      },
      // 业务术语 -分页
      handleSizeChangeTerms(val) {
        this.termsSource.oPage.pageSize = val
        this.queryBuzTerms()
      },
      handleCurrentChangeTerms(val) {
        this.termsSource.oPage.pageCurrent = val
        this.queryBuzTerms()
      },
      // 业务术语 - 删除选中tag
      closeTermsTag(item, index) {
        this.currentRowFlag = false
        this.termsSource.referTag.splice(index, 1);
      },
      toSaveTerms() {
        this.$emit('toSaveTerms', this.termsSource.referTag[0])
      },
      close() {
        this.$emit('close')
      }

    },
    created() {
      this.queryBuzTerms()
    }
  }
</script>

<style lang="scss">
  @import "../../styles/treeIcon";
   .app-main #relationTip.el-dialog__wrapper{
     .el-dialog{
       width: 660px!important;
       .el-form--inline .el-form-item__label{
         font-size: 12px;
         font-weight: normal;
       }
     }
   }
  #relationTip /deep/ .el-dialog__header {
    border-bottom: 1px solid #e8ebed;
  }
  .el-tree-node__content{
    font-weight: normal;
  }

</style>