<template>
    <div class="releaseObjContainer">
        <el-container style="position: relative;">
            <el-aside width="20%" class="leftdiv">
                <el-card>
                <div class="header">
                    <p class="title">请选择发布对象</p>
                </div>
                <div class="tree" v-loading="treeLoading">
                    <el-tree
                    :props="props"
                    accordion
                    :load="loadNode"
                    ref="tree"
                    lazy
                    node-key="id"
                    :highlight-current="true"
                    empty-text="暂无数据"
                    @node-click="handleNodeClick"
                    @node-expand="handleNodeClick"
                    :render-content="renderContent"
                    :default-expanded-keys="treeDown"
                    :default-checked-keys="treeDown"
                    style="font-size:14px"
                    ></el-tree>
                </div>
                <div class="footer">
                    <p class="title">视图切换</p>
                    <el-select v-model="viewVal" placeholder="请选择" size="mini" @change="getNewView">
                    <el-option
                        v-for="item in viewChange"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                    </el-select>
                </div>
                </el-card>
            </el-aside>
            <el-aside style="background-color:#000;height: calc(100vh - 115px);width: 4px;position: relative;right:5px;opacity:0;"
             @mousedown.native.prevent="dragControllerDiv($event)">
            </el-aside>
            <el-main>
                <el-card shadow="hover">
                  <div class="shadow" v-if="showShadow"></div>
                  <div class="card-data" v-if="tableData.length>0">
                    <div class="card-header">
                        <el-form :model="acceptorForm" ref="acceptorForm"  :inline="true">
                            <el-form-item label="受理人：" prop="affirmData"
                                :rules="[{ required: true, message: '受理人不能为空'},]" class="tagForm">
                                <el-button @click="addAcceptor" size="mini" icon="el-icon-plus" class="add" v-if="acceptorForm.affirmData===null||acceptorForm.affirmData.title===undefined">增加</el-button>
                                <div  class="tree-slot" style="display:inline-block" v-else>
                                  <el-tooltip placement="right">
                                    <div slot="content">
                                      <p>部门：{{acceptorForm.affirmData.group}}</p>
                                      <p>工作电话：{{acceptorForm.affirmData.workPhone}}</p>
                                      <p>邮箱:{{acceptorForm.affirmData.email}}</p>
                                      <p>手机号:{{acceptorForm.affirmData.mobilePhone}}</p>
                                    </div>
                                    <el-tag  type="info" closable @close="acceptorForm.affirmData =null; wData.filterSponsorData=null;" size="small" style="margin-right:6px">
                                        {{acceptorForm.affirmData.title}}
                                    </el-tag>
                                  </el-tooltip>
                                </div>
                            </el-form-item>
                            <el-form-item class="formBtn">
                                <el-button @click="saveForm('acceptorForm')" size="mini" v-if="$route.params.type!=='back'">保存</el-button>
                                <el-button type="primary" @click="submitForm('acceptorForm')" size="mini">提交</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="card-table">
                    <el-table :data="tableData" border style="width: 100%" size="mini" v-loading="loading" :header-cell-style="{background:'#f8f8f9',color:'#666'}">
                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          v-for="item in tableHeader"
                          :key="item.prop"
                          show-overflow-tooltip
                          sortable
                          :width="item.prop==='code'?'100':item.prop==='name'?'130':item.prop==='path'?null:tableHeader.length>8?'120':'140'"
                          :min-width="item.prop==='path'?'160':null"
                        ></el-table-column>
                        <el-table-column  label="操作" align="center" width="120" fixed="right">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                                <el-button  type="text" size="small" @click="goToSeeDetail(scope.$index)">
                                    <svg-icon icon-class="preview" class="preview"></svg-icon>
                                </el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="全链分析" placement="bottom">
                                    <el-button type="text" @click="handleBlood('full',scope.$index)">
                                    <svg-icon icon-class="multilink" class="multilink"></svg-icon>
                                    </el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                    <div style="text-align:center;margin-top:20px;">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.current"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="page.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total"
                    ></el-pagination>
                    </div>
                  </div>
                  <!-- <div class="no-data" v-loading="noDataLoading"></div> -->
                  <svg-icon v-loading="noDataLoading" icon-class="nodata" class="nodata"></svg-icon>
                </el-card>
            </el-main>
        </el-container>
        <el-dialog title="请选择受理人" :visible.sync="wData.dialogTableVisible" width="520px" class="people-dialog"> 
          <div slot="" v-if="wData.filterSponsorData" class="tree-slot">
              已选择： <el-tag  type="info" closable @close="handleClose1()" size="small" style="margin-right:5px;">
                      {{wData.filterSponsorData.title}}
                      </el-tag>
          </div>
          <el-input placeholder="请输入内容" v-model="wData.wKeyword" @input="toSearch" clearable>
            <i slot="suffix" class="el-input__icon el-icon-search" ></i>
          </el-input>
          <el-tree
            class="filter-tree"
            :data="wData.problemTakerData"
            :props="wData.defaultProps"
            ref="tree" 
            v-loading="wData.treeLoading"
            v-if="wData.treeSelect.length==0"
            node-key="userId"
            @node-click="selectTreeValue"
            style="height: 200px;overflow:auto;">
          </el-tree>
          <div class="tree-select-div people" v-if="wData.treeSelect.length>0">
              <div v-for="select in wData.treeSelect" :key="select.userId" class="item">
                  <p   @click="selectTreeValue(select)" v-if="select.hasAuthority" style="cursor: pointer;">
                      {{select.title}}  （ {{ select.parent }} )
                  </p>
                  <p   @click="selectTreeValue(select)" v-else-if="!select.hasAuthority" style="color:red;cursor: pointer;">
                      {{select.title2}}  （ {{ select.parent }} )
                  </p>
                  <!-- <Icon type="ios-checkmark" color="#1890ff"></Icon> -->
              </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="wData.dialogTableVisible = false;wData.filterSponsorData = acceptorForm.affirmData;">取 消</el-button>
            <el-button type="primary" @click="sure">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, parseAjaxResponse, post } from "@/utils/request";
import { generateLineageTitle } from "@/utils";
import pinyin from 'pinyin'
export default {
  name: 'releaseObject',
  data() {
    return {
      saveLocking: true,
      showShadow: false,
      treeLoading: false, // tree loading
      loading: false,
      noDataLoading: false,
      viewVal: null, // 视图model值
      viewId: null,
      viewChange: [], // 视觉切换列表
      acceptorForm: {
        affirmData: {}
      }, // 受理人model值
      props: {
        label: "name",
        children: "classifierName",
        isLeaf: "leaf"
      },
      node: null,
      nodeFirst: null,
      isFirst: false,
      resolve: null,
      nodeId: null, // 点击当前节点id
      treePassVal: {
        id: null,
        nodeType: null
      },
      treeButtom: false, // 按钮禁用lock
      wData: {
        filterSponsorData: null,
        affirmData: null,
        treeLoading: false,
        dialogTableVisible: false,
        wKeyword: null,
        problemTakerData: null,
        defaultProps: {
          children: 'children',
          label: 'title',
          isLeaf: 'isLeaf'
        },
        treeSelect: []
      },
      allData: [],
      tableData: [],
      tableHeader: [],
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      caseId: null,
      treeDown: [],
      count: 0

    }
  },
  methods: {
    // 左侧树结构宽度调整方法
    dragControllerDiv(e) {
      let width = document.getElementsByClassName("el-container")[0]
        .clientWidth;
      let left = document.getElementsByClassName("leftdiv");
      let c = e.clientX - left[0].clientWidth;
      let newWidth = null;
      document.onmousemove = ev => {
        ev.preventDefault();
        console.log(ev);
        let ex = ev.clientX - c;
        newWidth = (ex / width) * 100;
        console.log(newWidth);
        newWidth = newWidth > 45 ? 45 : newWidth < 15 ? 15 : newWidth;
        left[0].style.width = newWidth.toFixed(2) + "%";
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        // resize.releaseCapture && resize.releaseCapture()
      };
    },
    // 树懒加载
    loadNode(node, resolve) {
      this.node = node;
      console.log(node, resolve, this.node);
      if (node.level === 0 || this.isFirst) {
        this.nodeFirst = node;
        this.resolve = resolve;
        get("/ds/dsAllTree", this.treePassVal).then(res => {
          this.treeButtom = false;
          if (res.code === 10000 && res.success === true) {
            console.log(this.node.childNodes.length, this.node.childNodes)
            this.isFirst = false;
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
          console.log(this.isFirst)
        });
      } else {
        let params = {
          id: node.data.id,
          nodeType: node.data.notetype
        };
        get("/ds/dsAllTree", params).then(res => {
          this.treeButtom = false;
          if (res.code === 10000 && res.success === true) {
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    renderContent(h, params) {
      // console.log(h, params)
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
          h("div", {
            class: iconType,
            style: {
              marginRight: "4px",
              display: "inline-block",
              backgroundSize: "15px 15px",
              width: "15px",
              height: "15px"
            }
          }),
          h("span", sText)
        ]
      );
    },
    handleNodeClick(data, node, item) {
      var count = ++this.count;
      console.log(data, item)
      if (this.tableData.length === 0) {
        this.noDataLoading = true;
      }
      if (data.notetype !== 'view') {
        this.nodeId = data.id;
        this.getTableData(count)
      }
    },
    // 视图切换方法
    getNewView(val) {
      this.viewChange.map(item => {
        if (parseInt(item.id) === val) {
          this.viewVal = item.id;
        }
      });
      this.viewId = val
      this.treePassVal.id = val;
      this.treePassVal.nodeType = "view";
      this.isFirst = true;
      this.nodeFirst.childNodes = [];
      this.treeDown = [];
      this.loadNode(this.nodeFirst, this.resolve);
    },
    // 获取视图
    getView() {
      get("/ds/listAllViews").then(res => {
        if (res.code === 10000 && res.success) {
          this.viewChange = res.data;
          let str = JSON.stringify(res.data);
          if (str.includes("true")) {
            res.data.map(item => {
              if (item.defultShow) {
                this.viewVal = item.id;
                this.viewId = item.id;
                this.treeLocation()
              }
            });
          } else {
            res.data.map(item => {
              if (item.id === '0') {
                this.viewVal = item.id;
                this.viewId = item.id;
                if (this.viewId === '0') {
                  console.log(555)
                  this.treeLocation('view')
                }
              }
            });
          }
        }
      });
    },
    // 受理人树点击事件
    selectTreeValue(data) {
      if (data) {
        console.log(data)
        if (data.hasOwnProperty("children")) {
          data.selected = false;
        } else {
          if (data.userId !== undefined && data.hasAuthority) {
            this.wData.filterSponsorData = data;
          } else if (!data.hasAuthority) {
            this.$message.error('该用户无受理权限！')
          }
        }
      } else {
        this.wData.wKeyword = "";
      }
    },
    sure() {
      this.acceptorForm.affirmData = this.wData.filterSponsorData;
      console.log(this.acceptorForm.affirmData, this.wData.filterSponsorData)
      this.wData.dialogTableVisible = false;
    },
    addAcceptor() {
      this.wData.dialogTableVisible = true;
      this.getUserList();
    },
    // 获取受理人选择tree
    getUserList() {
      this.wData.treeLoading = true;
      get('/home/matter/queryUserAndAutOfCase', { caseType: 'STANDARD_RELEASE' }).then(res => {
        const that = this;
        if (res.code === 10000 && res.success) {
          let resData = res.data;
          that.wData.problemTakerData = resData.map(child => {
            if (child.users.length > 0 && child.users[0].userId !== undefined) {
              return {
                title: child.groupName,
                isLeaf: false,
                children: child.users.map(function (child2) {
                  return {
                    title2: child2.userName,
                    title: child2.hasAuthority ? child2.userName : child2.userName + ' (该用户没有受理权限)',
                    userId: child2.userId,
                    email: child2.email,
                    mobilePhone: child2.mobilePhone,
                    workPhone: child2.workPhone,
                    group: child.groupName,
                    hasAuthority: child2.hasAuthority ? child2.hasAuthority : false
                  }
                })
              }
            } else {
              return {
                title: child.groupName,
                isLeaf: true,
                children: []
              }
            }
          });
          console.log(this.wData.problemTakerData)
          this.wData.treeLoading = false;
        } else {
          this.$message.error(res.message);
          this.wData.treeLoading = false;
        }
      })
    },
    toSearch() {
      var str
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      var pattern2 = new RegExp("[A-Za-z]+");
      if (pattern.test(this.wData.wKeyword)) {
        str = '中文'
      } else if (pattern2.test(this.wData.wKeyword)) {
        str = '英文'
      } else {
        this.wData.treeSelect = [];
      }
      // console.log(str)
      if (str === '英文') {
        this.eSearch()
      } else if (str === '中文') {
        this.showTree();
      }
    },
    showTree() {
      let selectArr = [];
      let res = this.wData.problemTakerData;
      res.map(val => {
        console.log(val)
        if (this.wData.wKeyword) {
          if (val.title.indexOf(this.wData.wKeyword) > -1) {
            for (let i = 0; i < val.children.length; i++) {
              if (val.children[i].title2) {
                let n = val.children[i];
                n.parent = val.title
                selectArr.push(n);
              }
            }
          } else {
            let child = val.children;
            child.map(item => {
              if (item.title2 && item.title2.indexOf(this.wData.wKeyword) > -1) {
                let n = item;
                n.parent = val.title
                selectArr.push(n);
              }
            })
          }
        }
      })
      this.wData.treeSelect = selectArr;
      // this.problemTakerData = selectArr;
    },
    eSearch() {
      this.wData.wKeyword = this.wData.wKeyword.toLowerCase();
      let res = this.wData.problemTakerData;
      let selectArr = [];
      res.map(val => {
        let pname = pinyin(val.title, {
          style: pinyin.STYLE_NORMAL, // 设置拼音风格
          heteronym: true
        })
        let newpname = ''
        pname.map(val2 => {
          if (val2.length > 1) {
            newpname += val2[0]
          } else {
            newpname += val2
          }
        })
        val.pname = newpname;
        let spname = pinyin(val.title, {
          style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
          heteronym: true
        })
        let newspname = ''
        spname.map(val3 => {
          if (val3.length > 1) {
            newspname += val3[0]
          } else {
            newspname += val3
          }
        })
        val.spname = newspname;
        for (let i = 0; i < val.children.length; i++) {
          if (val.children[i]) {
            let pname = pinyin(val.children[i].title, {
              style: pinyin.STYLE_NORMAL, // 设置拼音风格
              heteronym: true
            })
            let newpname = ''
            pname.map(val2 => {
              if (val2.length > 1) {
                newpname += val2[0]
              } else {
                newpname += val2
              }
            })
            val.children[i].pname = newpname;
            let spname = pinyin(val.children[i].title, {
              style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
              heteronym: true
            })
            let newspname = ''
            spname.map(val3 => {
              if (val3.length > 1) {
                newspname += val3[0]
              } else {
                newspname += val3
              }
            })
            val.children[i].spname = newspname;
          }
        }
      })
      res.map(val => {
        if (this.wData.wKeyword) {
          if (val.spname.indexOf(this.wData.wKeyword) !== -1) {
            if (val.children.length > 0 && val.children[0].title !== undefined) {
              for (let i = 0; i < val.children.length; i++) {
                let n = val.children[i];
                n.parent = val.title;
                selectArr.push(n)
              }
            }
          } else if (val.pname.indexOf(this.wData.wKeyword) !== -1) {
            let bool = false;
            for (let m = 0; m < val.spname.length; m++) {
              if (this.wData.wKeyword[0] === val.spname[m]) {
                bool = true
              }
            }
            if (val.children.length > 0 && val.children[0].title !== undefined && bool) {
              for (let i = 0; i < val.children.length; i++) {
                let n = val.children[i];
                n.parent = val.title;
                selectArr.push(n)
              }
            }
          } else {
            if (val.children.length > 0 && val.children[0].title !== undefined) {
              val.children.map(item => {
                if (item.pname.indexOf(this.wData.wKeyword) !== -1) {
                  let bool = false;
                  for (let m = 0; m < item.spname.length; m++) {
                    if (this.wData.wKeyword[0] === item.spname[m]) {
                      bool = true
                    }
                  }

                  if (bool) {
                    let n = item;
                    n.parent = val.title;
                    selectArr.push(n)
                  }
                } else if (item.spname.indexOf(this.wData.wKeyword) !== -1) {
                  let n = item;
                  n.parent = val.title;
                  selectArr.push(n)
                }
              })
            }
          }
        }
      })
      this.wData.treeSelect = selectArr;
    },
    getTableData(count) {
      this.loading = true;
      let params = {
        id: this.nodeId,
        pageCurrent: this.page.current,
        pageSize: this.page.size
      }
      get('/home/matter/stdrelease/listUnpublishStds', params).then(res => {
        parseAjaxResponse(res, () => {
          this.loading = false;
          if (res.code === 10000) {
            if (count === this.count || count === true) {
              this.allData = res.data.records;
              if (this.tableData.length === 0) {
                this.noDataLoading = false;
              }
              this.tableData = [];
              this.tableHeader = [
                { prop: 'code',
                  label: '标准编号' },
                {
                  prop: 'name',
                  label: '标准名称'
                }, {
                  prop: 'path',
                  label: '上下文路径'
                }
              ];
              if (res.data.records.length > 0) {
                res.data.records[0].attributes.map(item => {
                  let obj2 = {
                    prop: item.attrCode,
                    label: item.name
                  }
                  this.tableHeader.push(obj2)
                })
              }
              res.data.records.map(val => {
                let obj = {
                  code: val.code,
                  path: val.path,
                  name: val.name
                }
                val.attributes.map(val2 => {
                  obj[val2.attrCode] = val2.value;
                })
                this.tableData.push(obj)
              })
              this.page.total = res.data.total;
            }
          }
        });
      })
    },
    goToSeeDetail(index) {
      let item = this.allData[index]
      this.showShadow = true;
      console.log(item)
      if (item.classifierId === 'BaseIndexInfoItem' || item.classifierId === 'RuleIndexInfoItem' || item.classifierId === 'CalculateIndexInfoItem' || item.classifierId === 'DeriveIndexInfoItem') {
        this.$router.push({// 指标详情跳转
          name: "indexManagementDetails",
          params: {
            id: item.id,
            classifierId: item.classifierId,
            _title: item.name
          }
        });
      } else if (item.classifierId === 'PublicCodeInfoItem') { // 公共代码
        this.$router.push({
          name: "commonCode",
          params: {
            id: item.id,
            classifierId: item.classifierId,
            _title: item.name,
            headerTitle: item.name
          }
        });
      } else if (item.classifierId === "RuleInfoItem") { // 规则
        this.$router.push({
          name: "ruleDetail",
          params: {
            id: item.id,
            _title: item.name,
            row: {
              instanceId: item.id,
              instanceName: item.name
            }}
        });
      } else if (item.classifierId === "DimentsionInfoItem") { // 维度
        this.$router.push({
          name: "dimensionDetails",
          params: { id: item.id,
            _title: item.name,
            detailId: item.id,
            row: {
              instanceId: item.id,
              instanceName: item.name
            }}
        });
      } else if (item.classifierId === "BizTermInfoItem") { // 业务术语
        this.$router.push({
          name: "professionalDetail",
          params: {
            id: item.id,
            _title: item.name,
            name: item.name
          }
        });
      } else if (item.classifierId === "MasterDataInfoItem") { // 主数据
        this.$router.push({
          name: "masterDataDetails",
          params: {
            id: item.id,
            classifierId: item.classifierId,
            _title: item.name,
            headerTitle: item.name
          }
        });
      }
    },
    handleBlood(command, index) {
      this.showShadow = true;
      let item = this.allData[index]
      this.$router.push({
        name: "dsLineageAnalysisCanvas",
        params: {
          dataFlowType: command,
          id: item.id,
          _title: generateLineageTitle(
            command,
            item.name
          )
        }
      });
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          let latestView = null
          views.map(val => {
            if (val.name === 'MY_MATTER') {
              latestView = val
            }
          })
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/portal/matter')
          }
        }
      })
    },
    submitForm(form) {
      // this.$router.push({ name: 'approve' })
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.saveLocking) {
            this.saveLocking = false;
            if (this.$route.params.type === 'back') {
              this.submitFormIsBack();
            } else {
              this.submitFormNoBack();
            }
          }
        } else {
          return false;
        }
      });
    },
    submitFormNoBack() {
      post('/home/matter/stdrelease/submit', {
        caseId: this.caseId,
        checkUserId: this.acceptorForm.affirmData.userId,
        stdContextId: this.nodeId
      }).then(res => {
        this.saveLocking = true;
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.$message.success(res.message)
            this.closeSelectedTag(this.$route)
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    submitFormIsBack() {
      post('/home/matter/stdrelease/processModCase', {
        caseId: this.caseId,
        checkUserId: this.acceptorForm.affirmData.userId,
        isRepeat: true,
        stdContextId: this.nodeId,
        taskId: this.$route.params.tid
      }).then(res => {
        this.saveLocking = true;
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.$message.success(res.message)
            this.closeSelectedTag(this.$route)
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    saveForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.saveLocking) {
            this.saveLocking = false;
            console.log(this.acceptorForm.affirmData, this.node)
            post('/home/matter/stdrelease/save', {
              caseId: this.caseId,
              checkUserId: this.acceptorForm.affirmData.userId,
              stdContextId: this.nodeId
            }).then(res => {
              this.saveLocking = true;
              parseAjaxResponse(res, () => {
                if (res.code === 10000) {
                  this.$message.success(res.message)
                  this.closeSelectedTag(this.$route)
                } else {
                  this.$message.error(res.message)
                }
              })
            })
          }
        } else {
          return false;
        }
      });
      // this.$router.push({ name: 'detailsInformation' })
    },
    handleClose1() {
      this.wData.filterSponsorData = null;
    },
    resetTable(val) {
      this.nodeId = val;
      this.page.size = 20;
      this.page.current = 1;
      this.getTableData(true);
    },
    treeLocation(type) {
      console.log(this.$route.params.cid)
      if (this.$route.params.cid) {
        this.caseId = this.$route.params.cid;
        if (this.$route.params.tid && this.$route.params.type === 'back') {
          this.getDetail('/home/matter/stdrelease/getModCasePageInfo', type)
        } else {
          this.getDetail('/home/matter/stdrelease/getWatiReleaseInfo', type)
        }
      }
    },
    getDetail(url, type) {
      let path = null;
      get(url, {
        caseId: this.caseId
      }).then(res => {
        let user = res.data.checkUser;
        this.$set(this.acceptorForm['affirmData'], 'title', user.username)
        this.$set(this.acceptorForm['affirmData'], 'userId', user.userId)
        this.$set(this.acceptorForm['affirmData'], 'email', user.mail)
        this.$set(this.acceptorForm['affirmData'], 'mobilePhone', user.mobilephone)
        this.$set(this.acceptorForm['affirmData'], 'workPhone', user.workphone)
        this.$set(this.acceptorForm['affirmData'], 'group', user.groupname)
        // console.log(this.acceptorForm.affirmData, 'hgjhgh')
        this.nodeId = res.data.stdId;
        path = res.data.stdContext;
        let arr = path.split("/");
        arr.splice(0, 1);
        console.log(arr);
        if (type === 'view') {
          const that = this;
          console.log(this.node, 'lllooololo')
          if (this.node.childNodes.length === 0) {
            var timer2 = setInterval(function() {
              if (that.node.childNodes && that.node.childNodes.length > 0) {
                console.log('success')
                //
                that.node.childNodes.map(val => {
                  if (arr[0].includes(val.data.name)) {
                    console.log(22255)
                    val.expanded = false;
                    that.treeDown = [];
                    that.treeDown.push(val.data.id);
                    that.getActiveNode(val, arr);
                  }
                })
                clearInterval(timer2);
              }
            }, 50);
          } else {
            this.node.childNodes.map(val => {
              if (arr[0].includes(val.data.name)) {
                console.log(22255)
                val.expanded = false;
                this.treeDown = [];
                this.treeDown.push(val.data.id);
                this.getActiveNode(val, arr);
              }
            })
          }
        } else {
          this.getActiveNode(this.node, arr)
        }
      })
    },
    getActiveNode(node, arr) {
      console.log(node.childNodes.length, arr, 333);
      if (node.childNodes.length > 0) {
        console.log(node, 'uuuu')
        node.childNodes.map((val, index) => {
          if (val.data.name === arr[0]) {
            val.expanded = false;
            this.treeDown = [];
            this.treeDown.push(val.data.id);
            this.$refs.tree.setCurrentKey(val.data.id);
            console.log(val, val.data.name, arr);
            val.data.level = val.level;
            arr.splice(0, 1);
            console.log(arr);
            if (arr.length > 0) {
              this.getActiveNode(val, arr);
            } else {
              this.resetTable(this.nodeId);
            }
            // get(`/ds/details/${val.data.id}`).then(res => {
            //   if (res.code === 10000 && res.success) {
            //     res.data.attributes.map(i => {
            //       if (i.attrCode === "Tag") {
            //         val.data.tipValue = i.value;
            //         val.data.isDisabled = false;
            //         if (!this.Breadcrumb.includes(val)) {
            //           this.Breadcrumb.push(val.data);
            //         }
            //       }
            //     });
            //   }
            // });
          }
        });
      } else if (node.data === undefined) {
        const that = this;
        var timer = setInterval(function() {
          if (node.childNodes.length > 0) {
            console.log('success')
            that.getActiveNode(node, arr);
            clearInterval(timer);
          }
        }, 50);
      } else {
        if (!node.isLeaf) {
          console.log(node.data, 'oopop')
          this.treeDown.push(node.data.id);
          this.$refs.tree.setCurrentKey(node.data.id);
          const that = this;
          var timer2 = setInterval(function() {
            if (node.childNodes.length > 0) {
              that.getActiveNode(node, arr);
              clearInterval(timer2);
            }
          }, 50);
        }
      }
    }
  },
  created() {
    this.getView();
    // this.treeLocation();
    // this.getTableData();
  },
  activated() {
    this.showShadow = false;
  }
}
</script>
<style lang="scss" scoped>
@import "./../../../styles/dq/main-card-table.scss";
@import "../../../styles/treeIconScoped";
$color-grey-light: #e0e0e0;
.releaseObjContainer{
    padding: 15px;
    height: 100%;
    .resize:hover {
        cursor: e-resize;
    }
    .nodata {
      width: 200px;
      height: 200px;
      margin: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
    }
    .el-aside {
        height: 100%;
        position: relative;
        .el-card {
        height: calc(100vh - 115px);
            /deep/ .el-card__body {
                padding: 25px 10px !important;
                position: relative;
                height: 100%;
            }
        }
    .header {
        border-bottom: 1px solid $color-grey-light;
        display: flex;
        position: relative;
        .title {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
            color: rgb(126, 123, 123);
            padding-bottom: 8px;
            padding-left: 10px;
        }
        .el-button {
            position: absolute;
            right: 0;
            bottom: 6px;
            padding: 3px 8px;
            /deep/ .el-icon-refresh {
                font-size: 18px !important;
            }
        }
    }
    .tree {
        margin-top: 15px;
        height: calc(100% - 80px);
        overflow-y: auto;
    }
    .tree::-webkit-scrollbar {
        width: 5px;
        height: 10px;
    }
    .tree::-webkit-scrollbar-track {
        background: none;
        border-radius: 2px;
    }
    .tree::-webkit-scrollbar-thumb {
        background: rgb(239, 239, 239);
        border-radius: 10px;
    }
    .tree::-webkit-scrollbar-thumb:hover {
        background: #bfbfbf;
    }
    .footer {
        position: absolute;
        bottom: 15px;
        border-top: 1px solid $color-grey-light;
        display: flex;
        width: calc(100% - 20px);
        padding-top: 10px;
        .title {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
            color: rgb(126, 123, 123);
            padding-left: 10px;
        }
        .el-select {
            position: absolute;
            right: 10px;
            top: 6px;
            width: 55%;
        }
    }
  }
    .el-main {
        padding: 0;
        margin-left: 10px;
        height: calc(100vh - 115px);
        .el-card {
            height: calc(100vh - 115px);
            /deep/ .el-card__body {
            height: calc(100vh - 115px);
            padding-right: 10px;
            padding-top: 0;
            position: relative;
            .card-data{
              height:100%;
               width: 100%;
            }
            .no-data{
              width: 500px;
              height: 457px;
              background: url("./../../../assets/images/commonIcon/no-data.png")
                no-repeat;
              background-size: 500px 457px;
              margin: 30px auto;
            }
                .card-header {
                    display: flex;
                    border-bottom: 1px solid $color-grey-light;
                    padding: 6px 0;
                    .el-form{
                        width:100%;
                    }
                    .el-form-item {
                        margin-bottom: 0;
                        .el-button.add {
                            border: 1px dashed #DCDFE6;
                            padding: 6px 8px;
                        }
                    }
                    .tagForm{
                      width:50%;
                      .el-form-item__content{
                        width:50%;
                        .el-form-item__error{
                          top:88%;
                        }
                      }
                    }
                    .formBtn{
                        float: right;
                    }
                }
                .card-button {
                    margin-left: 20px;
                    margin-top: 15px;
                }
                .card-table {
                    overflow-y: auto;
                    width: 100%;
                    height: calc(100% - 130px);
                    margin-top: 20px;
                    .preview,.deleteRed,.editor,.multilink{
                        width:22px;
                        height:22px;
                    }
                    .el-table__row{
                        td{
                            padding:0 
                        }
                        
                    }
                    .el-button+.el-button{
                        margin-left: 5px;
                    }
                    /deep/ .tableClass {
                        border-right: none !important;
                    }
                    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
                        width: 5px;
                        height: 7px;
                    }
                    /deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
                        background: none;
                        border-radius: 2px;
                    }
                    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
                        background: rgb(239, 239, 239);
                        border-radius: 10px;
                    }
                    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
                        background: #bfbfbf;
                    }
                    /deep/ .el-table__fixed-right{
                      height:100%!important;
                    }
                }
                .card-table::-webkit-scrollbar {
                    width: 5px;
                    height: 10px;
                }
                .card-table::-webkit-scrollbar-track {
                    background: none;
                    border-radius: 2px;
                }
                .card-table::-webkit-scrollbar-thumb {
                    background: rgb(239, 239, 239);
                    border-radius: 10px;
                }
                .card-table::-webkit-scrollbar-thumb:hover {
                    background: #bfbfbf;
                }
            }
        }
  }
  .people-dialog{
      .el-tree{
          margin-top:15px;
      }
      /deep/ .el-dialog__body{
          padding:20px;
      }
      .tree-slot{
          margin-bottom:10px;
      }
  }
  
}
</style>