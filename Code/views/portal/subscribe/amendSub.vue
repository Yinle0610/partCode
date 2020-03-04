<template>
    <div class="amendSub">
        <el-card shadow="hover">
            <div class="card-title1">订阅内容</div>
            <div class="card-body1">
                <div class="button-box">
                    <el-button type="primary" icon="el-icon-circle-plus" size="small" @click.native="dialogTreeVisible=true">增加</el-button>
                    <el-form class="bt-form">
                      <el-table :data="tableData.data"  style="width: 100%;margin-top:20px;" :header-cell-style="{background:'#f8f8f9'}"
                        v-loading="tableData.bLoading" size="mini" v-show="tableData.data.length>0">
                        <el-table-column prop="instanceCode" label="分支代码"  width="190" :show-overflow-tooltip='showToolTip'>
                        </el-table-column>
                        <el-table-column prop="instanceName" label="分支名称"  width="190" :show-overflow-tooltip='showToolTip'>
                        </el-table-column>
                        <el-table-column prop="classifierId" label="分支所属元数据类型"  width="170" align="center">
                        </el-table-column>
                        <el-table-column prop="nameContext" label="分支上下文路径"  :show-overflow-tooltip='showToolTip'>
                        </el-table-column>
                        <el-table-column label="订阅元数据类型"  align="center">
                          <template slot-scope="scope">
                            <el-form-item style="margin-bottom:0;">
                              <el-select v-model="type[scope.$index]" placeholder="全部" size="small" @change="getType(scope.$index)" multiple style="width:240px;">
                                <el-option v-for="item in scope.row.classifierList" :key="item.classifierId" :label="item.classifierName" :value="item.classifierId"></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作"  width="160" align="center">
                          <template slot-scope="scope">
                            <i class="el-icon-delete" style="font-size:22px;color:#2d8cf0;" @click="delSubOne(scope.$index)"></i>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form>
                </div>
            </div>
            <div class="card-title2">订阅配置</div>
            <div class="card-body2">
                <div class="ao-order-config">
                    <div class="aoc-explain" style="margin-top: 20px;">
                        <div class="aoc-title"><i class="el-icon-info"></i>配置说明</div>
                        <div class="aoc-text">
                            1.请您给当前的订阅配置起个恰当的名称，并输入相关描述以便后续检索；<br/>
                            2.添加您关心的元数据作为订阅内容，如果它们发生变化我们会及时通知您；<br/>
                            3.提醒方式当前默认邮件，后续会逐步添加其他方式如短信；<br/>
                            4.请及时保存订阅，以免数据丢失；
                        </div>
                    </div>
                    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                        <el-form-item label="订阅名称：" prop="name">
                            <el-input v-model="form.name"  placeholder="请输入订阅名称" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="订阅描述：" prop="description">
                            <el-input v-model="form.description"  placeholder="请输入订阅描述" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="提醒方式：">
                            <el-checkbox label="邮件" name="type" v-model="form.istip" size="small"></el-checkbox>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
             <div class="card-title1">订阅人列表</div>
            <div class="card-body1">
                <div class="button-box">
                    <el-button type="primary" icon="el-icon-circle-plus" size="small" @click.native="getUserList">增加</el-button>
                    <el-form class="bt-form">
                      <el-table :data="peopleTableData.data"  style="width: 100%;margin-top:20px;" :header-cell-style="{background:'#f8f8f9'}"
                        v-loading="peopleTableData.bLoading" size="mini" >
                        <el-table-column prop="title" label="用户名称"  :show-overflow-tooltip='showToolTip'>
                        </el-table-column>
                        <el-table-column prop="parent" label="所属部门" :show-overflow-tooltip='showToolTip'>
                          <template slot-scope="scope">
                            <p>{{scope.row.parent!=='无部门人员'?scope.row.parent:'--'}}</p>
                          </template>
                        </el-table-column>
                        <el-table-column prop="email" label="Email地址" >
                        </el-table-column>
                        <el-table-column label="操作"  width="160" align="center">
                          <template slot-scope="scope">
                            <i class="el-icon-delete" style="font-size:22px;color:#2d8cf0;" @click="delPeopleOne(scope.$index)"></i>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-form-item class="button-box3">
                            <el-button @click="onBackSubmit('form')" size="small" type="primary">保存</el-button>
                            <el-button @click="closeSelectedTag($route)" size="small">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-card>
        <el-dialog  :visible.sync="dialogTreeVisible" @close="closeEvent" class="subData">
            <div slot="title" class="dialog-title">
                <div>请选择元数据分支</div>
            </div>
            <el-container>
                <el-aside >
                    <div class="tree">
                        <el-tree :props="props"
                            :load="loadNode"
                            ref="tree"
                            lazy
                            :highlight-current="true"                            
                            empty-text="暂无数据"
                            @node-click="handleNodeClick"
                            @node-expand="handleNodeClick"
                            @node-collapse="handleNodeClick"
                            :render-content="renderContent"
                            style="font-size:14px">
                        </el-tree>
                    </div>
                </el-aside>
                <el-main >
                    <el-form :inline="true" :model="formList" class="form-content" size="small">
                        <el-form-item>
                            <el-select v-model="classifierId" placeholder="请选择" :disabled="ifDisabled" @change="getNewClassifer" clearable>
                                <el-option :label="item.classifierName" :value="item.classifierId" v-for="item in classifierList" :key="item.classifierId" ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                          <el-input v-model="keyword" placeholder="请输入关键字..." style="width:240px;" clearable @keyup.enter.native="getNewClassifer">
                            <i slot="suffix" class="el-icon-search" @click="getNewClassifer"></i>
                          </el-input>
                        </el-form-item>
                    </el-form>
                    <sub-data-list :oList="toSubscribeList"
                             @size-change="handleSizeChange"
                             @current-change="handleCurrentChange"
                             @instanceId="getSelectId"
                             @close="dialogTreeVisible=false"
                              v-loading="loadingBool"></sub-data-list>
                </el-main>
            </el-container>    
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveSubOne" size="small">保存</el-button>
                <el-button @click="dialogTreeVisible = false" size="small">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 选择订阅人 -->
        <el-dialog title="请选择用户" :visible.sync="dialogVisible" width="30%" class="people-dialog">
          <div slot="" v-if="wData.filterSponsorArr.length > 0" class="tree-slot">
              已选择： <el-tag v-for="tag in wData.filterSponsorArr" :key="tag.userId" type="info" closable @close="handleClose(tag)">
                      {{tag.title}}
                      </el-tag>
          </div>
          <el-input placeholder="请输入内容" v-model="wData.wKeyword" @input="toSearch" clearable >
            <i slot="suffix" class="el-input__icon el-icon-search" ></i>
          </el-input>
          <el-tree
            class="filter-tree"
            :data="wData.problemTakerData"
            :props="wData.defaultProps"
            ref="tree" v-if="wData.treeSelect.length==0"
            node-key="userId"
            :highlight-current="true"
            @node-click="selectTreeValue"
            style="height: 260px;overflow:auto;">
          </el-tree>
          <div class="tree-select-div people" v-if="wData.treeSelect.length>0">
              <div v-for="select in wData.treeSelect" :key="select.userId" class="item">
                  <p  @click="selectTreeValue(select)">
                      {{select.title}}  （ {{ select.parent }} )
                  </p>
                  <!-- <Icon type="ios-checkmark" color="#1890ff"></Icon> -->
              </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sure">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, postByJson } from "@/utils/request";
import subDataList from './subDataList.vue'
import pinyin from 'pinyin'
export default {
  name: 'amendSub',
  components: { subDataList },
  data() {
    return {
      dialogTreeVisible: false,
      dialogVisible: false,
      locking: false,
      nodeFirst: null,
      resolve: null,
      parentId: null,
      ifDisabled: true,
      checkData: {
        data: null,
        seleectClassiferId: null
      },
      formList: null,
      classifierList: [],
      toSubscribeList: {
        aList: [],
        iTotal: 0,
        iCurrentPage: 1,
        iCurrentSize: 10
      },
      keyword: null,
      classifierId: null,
      loadingBool: false,
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      props: {
        label: "instanceName",
        children: "classifierName",
        isLeaf: "leaf"
      },
      tableData: {
        bLoading: '',
        data: []
      },
      peopleTableData: {
        bLoading: '',
        data: [],
        currentUser: null
      },
      wData: {
        filterSponsorArr: [],
        pfilterSponsorArr: [],
        subArr: [],
        wKeyword: null,
        treeSelect: [],
        bLoading: false,
        problemTakerData: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        }
      },
      form: {
        name: null,
        description: null,
        istip: null
      },
      formInline: null,
      rules: {
        name: [
          { required: true, message: '请输入订阅名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入订阅描述', trigger: 'blur' }
        ]
      },
      type: [],
      showToolTip: true
    }
  },
  methods: {
    onBackSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.locking) {
            this.locking = true;
            let arr = [];
            let peopleArr = [];
            for (let i = 0; i < this.tableData.data.length; i++) {
              let obj = {
                instanceId: this.tableData.data[i].instanceId,
                namespace: this.tableData.data[i].namespace,
                subTypes: this.type[i].join(',')
              };
              arr.push(obj);
            }
            for (let i = 0; i < this.peopleTableData.data.length; i++) {
              let obj = {
                depId: this.peopleTableData.data[i].parentId === '--' ? null : this.peopleTableData.data[i].parentId,
                depName: this.peopleTableData.data[i].parentId === '--' ? null : this.peopleTableData.data[i].parent,
                email: this.peopleTableData.data[i].email,
                userId: this.peopleTableData.data[i].userId,
                username: this.peopleTableData.data[i].title
              };
              peopleArr.push(obj);
            }
            let params = {
              subId: this.form.subId,
              subName: this.form.name,
              subDesc: this.form.description,
              isMail: this.form.istip ? 1 : 0,
              subInfos: arr,
              subscribers: peopleArr
            }
            console.log(params)
            postByJson('/home/subscribe/editMySubscribe', params).then(res => {
              if (res.code === 10000 && res.success) {
                this.$message.success(res.message);
                this.closeSelectedTag(this.$route)
              } else {
                this.locking = false;
                this.$message.error(res.message);
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.toSubscribeList.iCurrentSize = val;
      this.getClassifierData(this.checkData.seleectClassiferId)
    },
    handleCurrentChange(val) {
      this.toSubscribeList.iCurrentPage = val;
      this.getClassifierData(this.checkData.seleectClassiferId)
    },
    saveSubOne() {
      let bool = null;
      if (this.tableData.data.length > 0) {
        bool = true
      } else {
        bool = false
      }
      this.tableData.data.length > 0
      console.log(this.checkData.data)
      this.tableData.data.push(this.checkData.data);
      this.type.push(null);
      if (!this.form.name || !bool) {
        this.form.name = '订阅_' + this.checkData.data.instanceName
        this.checkData.isFirst = false;
      } else {
        this.form.name += '_' + this.checkData.data.instanceName
      }
      if (!this.form.description || !bool) {
        this.form.description = '订阅_' + this.checkData.data.instanceName
        this.checkData.isFirst2 = false;
      } else {
        this.form.description += '_' + this.checkData.data.instanceName
      }
      // console.log(this.tableData.data, 'this.tableData.data')
      this.dialogTreeVisible = false;
    },
    delSubOne(index) {
      this.tableData.data.splice(index, 1)
      this.type.splice(index, 1)
    },
    delPeopleOne(index) {
      if (this.wData.filterSponsorArr.length > 1) {
        this.wData.filterSponsorArr.splice(index, 1);
        this.wData.pfilterSponsorArr.splice(index, 1);
        this.peopleTableData.data.splice(index, 1);
      } else {
        this.$message.warning('订阅人列表不能为空！')
      }
    },
    selectTreeValue(data) {
      console.log(data)
      const that = this;
      if (data) {
        if (data.hasOwnProperty("children")) {
          data.selected = false;
        } else {
          if (data.userId !== undefined) { // 多选
            // 问题发起人
            if (that.wData.pfilterSponsorArr.indexOf(data.userId) === -1) {
              that.wData.filterSponsorArr.push(data);
              that.wData.pfilterSponsorArr.push(data.userId);
            }
          }
        }
      } else {
        this.wData.wKeyword = '';
      }
    },
    handleClose(tag) {
      this.wData.filterSponsorArr.splice(this.wData.pfilterSponsorArr.indexOf(tag.userId), 1);
      this.wData.pfilterSponsorArr.splice(this.wData.pfilterSponsorArr.indexOf(tag.userId), 1);
    },
    sure() {
      if (this.wData.filterSponsorArr.length > 0) {
        this.peopleTableData.data = JSON.parse(JSON.stringify(this.wData.filterSponsorArr));
        this.dialogVisible = false;
      } else {
        this.$message.warning('请至少选择一位订阅人！')
      }
    },
    getType(index) {
      console.log(index, this.type)
    },
    closeEvent() {
      this.checkData.data = null;
    },
    // 获取订阅人
    getUserList() {
      this.dialogVisible = true
      this.wData.bLoading = true;
      get('/sys/user/listUserByGroupSubscribe').then(res => {
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
                    title: child2.userName,
                    userId: child2.userId,
                    parent: child.groupName,
                    parentId: child.groupId,
                    email: child2.email
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
          this.wData.bLoading = false;
          console.log(that.wData.problemTakerData)
        } else {
          this.$message.error(res.message);
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
      }
      console.log(str)
      if (str === '英文') {
        this.eSearch()
      } else if (str === '中文') {
        this.showTree();
      } else {
        this.wData.treeSelect = [];
      }
    },
    showTree() {
      let selectArr = [];
      let res = this.wData.problemTakerData;
      res.map(val => {
        if (this.wData.wKeyword) {
          if (val.title.indexOf(this.wData.wKeyword) > -1) {
            for (let i = 0; i < val.children.length; i++) {
              if (val.children[i].title) {
                selectArr.push({
                  title: val.children[i].title,
                  userId: val.children[i].userId,
                  parent: val.title
                });
              }
            }
          } else {
            let child = val.children;
            child.map(item => {
              if (item.title && item.title.indexOf(this.wData.wKeyword) > -1) {
                selectArr.push({
                  title: item['title'],
                  userId: item['userId'],
                  parent: val['title']
                });
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
      console.log(selectArr)
    },
    // 树加载接口
    loadNode(node, resolve) {
      console.log(node, resolve);
      if (node.level === 0) {
        this.nodeFirst = node;
        this.resolve = resolve;
        get("/home/subscribe/listSubDataTreeInfo", { parentId: 0, resource: 'root' }).then(res => {
          if (res.code === 10000 && res.success === true) {
            res.data.map(val => {
              if (val.childCount > 0) {
                val.leaf = false;
              } else {
                val.leaf = true;
              }
            })
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        let params = {
          parentId: node.data.instanceId,
          resource: 'metadata'
        };
        get("/home/subscribe/listSubDataTreeInfo", params).then(res => {
          this.treeButtom = false;
          if (res.code === 10000 && res.success === true) {
            res.data.map(val => {
              val.leaf = true;
            })
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    getNewClassifer() {
      this.toSubscribeList.iCurrentPage = 1;
      this.getClassifierData(this.checkData.seleectClassiferId)
    },
    handleNodeClick(data, node, item) {
      console.log(data, node)
      this.getSelectId(data);
      if (node.level === 2) {
        this.ifDisabled = false;
        this.checkData.seleectClassiferId = data.instanceId;
        this.toSubscribeList.iCurrentPage = 1;
        this.keyword = null;
        this.classifierId = null;
        this.getClassifier(data.instanceId)
        this.getClassifierData(data.instanceId)
      }
    },
    renderContent(h, params) {
    //   console.log(h, params)
      let sText = params.data.instanceName;
      let iconType = "";
      if (params.data.resource === "metadata") {
        iconType = "icon icon-" + params.data.classifierId;
      } else {
        iconType = "icon icon-" + params.data.resource;
      }
      if (params.data.resource === "class") {
        iconType = "icon icon-" + params.data.classifierId;
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
    getSelectId(item) {
      get('/home/subscribe/listClassifierTypesByInstanceId', {
        instanceId: item.instanceId
      }).then(res => {
        if (res.code === 10000) {
          item.classifierList = res.data;
          console.log(item, 'item')
          this.checkData.data = item;
        }
      })
    },
    goDetail() {},
    getClassifier(id) {
      get('/home/subscribe/listClassifierTypesByInstanceId', {
        instanceId: id
      }).then(res => {
        if (res.code === 10000) {
          this.classifierList = res.data
        }
      })
    },
    getClassifierData(id) {
      this.loadingBool = true;
      let params = {
        parentId: id,
        pageCurrent: this.toSubscribeList.iCurrentPage,
        pageSize: this.toSubscribeList.iCurrentSize,
        keyword: this.keyword,
        classifierId: this.classifierId
      }
      get('/home/subscribe/listToBuSubedInstance', params).then(res => {
        if (res.code === 10000) {
          this.toSubscribeList.aList = res.data.records
          this.toSubscribeList.iTotal = res.data.total;
          this.toSubscribeList.iTotal = res.data.total;
        }
        this.loadingBool = false;
      })
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag(view) {
      console.log(view)
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          let latestView = null
          views.map(val => {
            if (val.name === 'MY_SUBSCRIBE') {
              latestView = val
            }
          })
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/subscribe/subscribe')
          }
        }
      })
    },
    getData() {
      this.tableData.bLoading = true;
      get('/home/subscribe/getMySubDetailInfo', { subId: this.$route.params.subId }).then(res => {
        if (res.code === 10000) {
          this.tableData.data = [];
          let table = res.data.subInfos;
          let peopleArr = res.data.subscribers;
          table.map((val, index) => {
            get('/home/subscribe/listClassifierTypesByInstanceId', {
              instanceId: val.instanceId
            }).then(res => {
              if (res.code === 10000) {
                val.classifierList = res.data;
                this.checkData.data = val;
                let arr = val.subClassifiers.split(',');
                console.log(arr, arr.indexOf("ALL_"))
                if (arr.indexOf("ALL_") > -1) {
                  arr.splice(arr.indexOf("ALL_"), 1)
                }
                this.type[index] = arr;
                console.log(this.type[index], 'this.type[index]')
                // this.tableData.data[index] = val;
                this.$set(this.tableData.data, index, val)
              }
            })
            if (index === table.length - 1) {
              this.tableData.bLoading = false;
            }
          })
          peopleArr.map(val => {
            let obj = {
              title: val.username,
              userId: val.userId,
              parent: val.depName,
              parentId: val.depId,
              email: val.email
            }
            this.peopleTableData.data.push(obj)
            this.wData.filterSponsorArr.push(obj)
            this.wData.pfilterSponsorArr.push(val.userId)
          })
          this.form = {
            name: res.data.name,
            description: res.data.description,
            istip: res.data.sendEmail === '1' ? true : null,
            subId: res.data.subId
          }

          // console.log(this.tableData.data, this.type, this.form)
        }
      })
    }
  },
  created() {
    this.showToolTip = true
    // if (this.$route.params.isMail && this.$route.params.name && this.$route.params.desc) {
    //   this.form = {
    //     name: this.$route.params.name,
    //     description: this.$route.params.desc,
    //     istip: this.$route.params.isMail === '1' ? true : null,
    //     subId: this.$route.params.subId
    //   }
    //   console.log(this.form)
    // }
    this.getData();
  },
  activated() {
    this.showToolTip = true
  },
  deactivated() {
    this.showToolTip = true
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
 @import "../../../styles/variables";
  @import "../../../styles/treeIcon";
  @import '../../../styles/dq/main-card-table.scss';
  .amendSub{
      padding:13px;
      .subData{
      .el-dialog{
          margin-top: 10vh!important;
          border-radius: 6px;
          height:85%;
          width:65%;
      }
      .el-dialog__header{
        border-bottom: 1px solid #e8eaec;
      }
      .dialog-title{
        color:#999;
        font-weight: 600;
      }
      .el-dialog__body{
        height:calc(100% - 112px);
        padding:0;
        .el-container{
            height:100%;
        }
        .el-aside{
            width:260px!important;
            padding:10px;
            border-right: 1px solid #e8eaec;
        }
      }
      .el-dialog__footer{
        border-top: 1px solid #e8eaec;
      }
      .dialog-footer{
        text-align: center;
      }
    }
      .el-card__body{
        padding:12px;
        .card-title1,.card-title2{
            position: relative;
            padding: 0 0 15px 20px;
            border-bottom: 1px solid #e8eaec;
            font-size: 14px;
            font-weight: bold;
        }
        .card-title1:before,.card-title2:before{
            content: "";
            width: 3px;
            height: 16px;
            background: #2b85e4;
            position: absolute;
            top: 3px;
            left: 1px;
        }
    .card-title2{
        margin-top: 50px;
    }
    .card-body1{
        .button-box{
            margin-top: 15px;
            margin-left: 15px;
            .el-button--small{
            padding: 6px 10px;
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
        .button-box3{
            text-align: center;
            margin-top: 10px;
            .el-button--default{
                margin-left: 16px;
            }
            .el-button--small{
              padding:9px 13px 5px 13px;
            }
        }
    }
    .card-body2{
        .ao-order-config{
            position: relative;
            width:800px;
            margin:16px auto;
            .aoc-explain{
            position: relative;
            width:100%;
            border:1px solid #bde2fb;
            background: #e9f7fe;
            padding:10px 20px;
            font-size:12px;
            border-radius: 4px;
            margin-bottom: 30px;
            .aoc-title{
                position: relative;
                font-size:14px;
                font-weight: bold;
                margin-bottom: 4px;
                i{
                    color:#2b85e4;
                    font-size:24px;
                    margin-right: 10px;
                }
            }
            .aoc-text{
                font-size:12px;
                line-height: 24px;
                color: #666;
                padding-left: 34px;
            }
        }
        }
        .button-box{
            text-align: center;
            margin-top: 10px;
            .el-button--default{
                margin-left: 16px;
            }
        }

    }
      }
      .people-dialog{
      .el-dialog__header{
        padding:15px 0;
        border-bottom:1px solid #e8eaec ;
        .el-dialog__title{
          margin-left:15px;
          font-size: 16px;
          font-weight: 700;
        }
      }
      .el-dialog__body{
        padding: 10px 20px;
        .tree-slot{
          margin-bottom: 8px;
          .el-tag{
            height: 24px;
            padding: 0 5px;
            line-height: 24px;
            margin-right: 4px;
            .el-tag__close.el-icon-close{
              right: -3px;
            }
          }
        }
        .el-tree.filter-tree{
          margin-top:8px;
        }
        .tree-select-div{
          position: relative;
          width:100%;
          padding:10px 0px;
          .item{
            position: relative;
            width:100%;
            // line-height: 24px;
            padding:0px 10px;
            cursor: pointer;
            p{
              margin:5px 0;
            }
          }
      }
      .people{
        max-height:280px;
        font-size:14px;
        overflow-y: auto;
        .item{
          // line-height: 26px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      }

    }
  }
</style>
