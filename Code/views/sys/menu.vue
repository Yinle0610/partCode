<template>
  <div class="menu-box" style="background-color:#fff">
    <div id="top-div" style="padding:10px">
      <div id="button-box" style="float:left;margin-bottom:10px" class="test">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addMenuDioShow">新增模块</el-button>
      </div>
    </div>
    <div id="table-div" style="clear:both;padding:10px">
      <el-table
        height="570"
        ref="menuTable"
        :data="tableData"
        show-header
        size="mini"
        style="width: 100%"
        row-key="menuId"
        border
        lazy
        :load="load"
        @row-click="clickTableRow"
        :header-cell-style="{background:'#f8f8f9',color:'#606266',height:'45px'}"
        :tree-props="{children: 'children', hasChildren: 'isModule'}">
        <el-table-column
          fixed
          label="菜单名称"
           width="200">
          <template slot-scope="scope">
            {{scope.row.menuName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="menuCode"
          label="菜单代码"
          width="200">
        </el-table-column>
        <el-table-column
          prop="parentMenuName"
          label="父级菜单"
          width="200"
          :formatter="(row, column, cellValue) => { return cellValue ? cellValue : '根'}">
        </el-table-column>
        <el-table-column
          prop="menuOrder"
          label="排序"
          align="center"
          width="60">
        </el-table-column>
        <el-table-column
          prop="menuIcon"
          label="图标"
          width="200">
        </el-table-column>
        <el-table-column
          prop="menuUri"
          label="路由"
          width="200">
        </el-table-column>
        <el-table-column
          prop="menuRedirect"
          label="重定向"
          width="200">
        </el-table-column>
        <el-table-column
          prop="needCached"
          label="缓存"
          align="center"
          width="80">
          <template slot-scope="scope">
            {{scope.row.needCached === 1 ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column
          label="是否可见"
          align="center"
           width="80">
          <template slot-scope="scope">
            {{scope.row.visible === 1 ? '是':'否'}}
          </template>
        </el-table-column>
        <el-table-column
          label="模式"
          align="center"
           width="80">
          <template slot-scope="scope">
            {{scope.row.modeType ==1 ? '用户模式':'管理模式'}}
          </template>
        </el-table-column>
        <el-table-column
          label="菜单类型"
          align="center"
           width="80">
          <template slot-scope="scope">
            {{scope.row.menuType ==1 ? '菜单':'模块'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          label="操作"
           width="350">
          <template slot-scope="scope">
            <div style="text-align: left">
            <el-button  v-if="scope.row.menuType!=1" type="primary" plain icon="el-icon-plus" @click="addMenuShow(scope.row,scope.$index)"  size="mini">新增子菜单</el-button>
            <el-button  type="primary" plain icon="el-icon-edit" @click="editMenuShow(scope.row)" size="mini">编辑菜单</el-button>
            <el-button  type="danger" plain icon="el-icon-delete" @click="delMenuShow(scope.row)" size="mini">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog">
      <div id="add-menu">
        <el-dialog :visible.sync="isformVisible" :title="title" width="700px" @close='cancel'>
          <el-form :model="addMenuForm" label-width="100px" :rules="addRules" ref="addRules">
            <el-form-item v-if="isAddMenuChild  ||  isEditMenu" label="父菜单：">
              <!-- <el-select v-if="isEditMenu" v-model="addMenuForm.parentMenuId" placeholder="请选择" size="mini" @change="change">
                <el-option v-for="(item,index) in parentMenuNameList" :key="index" :value="item.menuId"
                 :label="item.menuName+'('+item.menuCode+')'">
                </el-option>
              </el-select> -->
               <el-select
               class="ruleClassifying"
                v-if="isEditMenu"
                clearable
                style="width: 100%;"
                v-model="parentMenuTreeName"
                placeholder="请选择"
              >
                <el-option :value="optionValue" style="height: auto" class="onlyOption">
                  <el-tree
                    accordion
                    style="margin: 0 -20px;"
                    :data="parentMenuNameList"
                    node-key="menuId"
                    @node-click="handleNodeClick"
                    :props="defaultProps"
                    :highlight-current="true"
                    :default-checked-keys="[addMenuForm.parentMenuId]"
                  ></el-tree>
                </el-option>
              </el-select>
              <span v-else style="font-size:12px">{{addMenuForm.parentMenuName}}</span>
            </el-form-item>
            <el-form-item label="菜单名：" prop="menuName">
              <el-input v-model="addMenuForm.menuName"  size="mini"/>
            </el-form-item>
            <el-form-item label="菜单代码：" prop="menuCode">
              <el-input v-model="addMenuForm.menuCode" size="mini"/>
            </el-form-item>
            <el-form-item label="排序：" prop="menuOrder">
              <el-input  v-model="addMenuForm.menuOrder" size="mini"/>
            </el-form-item>
            <el-form-item label="图标：">
              <el-input v-model="addMenuForm.menuIcon" size="mini"/>
            </el-form-item>
            <el-form-item label="路由：">
              <el-input v-model="addMenuForm.menuUri" size="mini"/>
            </el-form-item>
            <el-form-item label="重定向：">
              <el-input v-model="addMenuForm.menuRedirect" size="mini"/>
            </el-form-item>
            <el-form-item label="是否可见：">
              <el-select v-model="addMenuForm.visible" placeholder="请选择" size="mini">
                <el-option v-for="(item,index) in isVisitableList" :key="index" :label="item.lable" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否缓存：">
              <el-select v-model="addMenuForm.needCached" placeholder="请选择" size="mini" >
                <el-option  label="是" :value="1"></el-option>
                <el-option  label="否" :value="0" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模式：">
              <el-select v-model="addMenuForm.modeType" placeholder="请选择" size="mini">
                <el-option v-for="(item,index) in modePattenList" :key="index" :label="item.lable" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单类型：">
              <el-select v-model="addMenuForm.menuType" placeholder="请选择" size="mini" >
                <el-option  label="菜单" :value="1"  :disabled="isDisabledMenu"></el-option>
                <el-option  label="模块" :value="0" ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div v-if="addMenuForm.menuType===1">
            <div style="margin-bottom:10px">
              <el-button  type="primary"  @click="addBtRow()"  size="mini">增加按钮</el-button>
            </div>
            <el-form :model="addMenuForm" :rules="addRules"  ref="addBtRules"  class="bt-form">
              <el-table :data="addMenuForm.menuFuncs"  border style="width: 100%" size="mini">
                <el-table-column  type="index" label="序号" min-width="20" align="center"></el-table-column>
                <el-table-column label="按钮名" min-width="30" align="center">
                  <template slot-scope="scope" >
                    <el-form-item>
                      <el-input v-if="scope.row.isEnable" v-model="scope.row.funcName" size="mini" :maxlength="30"></el-input>
                      <span v-else>{{scope.row.funcName}}</span>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="按钮代码" min-width="30" align="center">
                  <template slot-scope="scope" >
                    <el-form-item :prop="'menuFuncs.' + scope.$index + '.funcCode'"
            	          :rules="addRules.funcCode">
                      <el-input v-if="scope.row.isEnable" v-model="scope.row.funcCode" size="mini" :maxlength="30"></el-input>
                      <span v-else>{{scope.row.funcCode}}</span>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" min-width="40">
                  <template slot-scope="scope">
                    <div style="text-align: center">
                    <el-button  type="text"  @click="addBtRow()"  size="mini">增加</el-button>
                    <el-button v-if="scope.row.isEnable" type="text"  @click="editBtRow(scope.row)" size="mini">ok</el-button>
                    <el-button  v-else  type="text"  @click="editBtRow(scope.row)" size="mini">修改</el-button>
                    <el-button  type="danger"  @click="delBtRow(scope.row)" size="mini">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click.native="cancel" size="mini">取消</el-button>
            <el-button type="primary" @click.native="saveAddOrEdit('addRules')" size="mini" :disabled="isSaveEditBtDisabled">提交</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { get, post } from '@/utils/request'
export default{
  name: 'menu',
  data() {
    return {
      optionValue: '',
      parentMenuTreeName: '',
      // 新增
      isformVisible: false, // 是否显示新增对话框
      isAddMenuChild: false, // 是否是新增子菜单
      isEditMenu: false, // 是否是编辑菜单
      title: "菜单新增", // 动态定义对话框标题
      isDisabledMenu: false, // 新增模式时禁用父菜单选项
      addMenuForm: {
        parentMenuName: '',
        menuName: '',
        menuCode: '',
        menuOrder: '',
        menuIcon: '',
        menuUri: '',
        menuRedirect: '',
        visible: '',
        needCached: 0,
        modeType: '',
        menuType: '',
        parentMenuId: '',
        menuFuncs: []
      },
      addRules: {
        menuName: [
          { required: true, message: '请填写菜单名', trigger: 'blur' }
        ],
        menuCode: [
          { required: true, message: '请填写菜单代码', trigger: 'blur' }
        ],
        menuOrder: [
          { required: true, message: '请填写菜单排序', trigger: 'blur' }
        ],
        funcCode: [
          { required: true, message: '请填写按钮代码', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'next',
        label: 'menuName'
      },
      parentMenuNameList: [], // parentMenuNameList存储所有除本模式外其他所有模式
      isVisitableList: [
        {
          lable: '是',
          value: 1
        },
        {
          lable: '否',
          value: 0
        }
      ],
      menuTypeList: [
        {
          lable: '模块',
          value: 0
        },
        {
          lable: '菜单',
          value: 1
        }
      ],
      modePattenList: [
        {
          lable: '管理模式',
          value: 0
        },
        {
          lable: '用户模式',
          value: 1
        }
      ],
      // Menu Table数据
      tableData: [],
      node: [],
      resolve: [],
      row: [],
      rowTemp: [],
      LoadNodeList: [],
      menuId: '', // 编辑菜单时用来暂存菜单Id
      isSaveEditBtDisabled: false,
      isAddMenuChildForLoad: false
      // isResDataNull: false
      // maps: new Map()
    }
  },
  methods: {
    // 打开新增模块dialog
    addMenuDioShow() {
      this.addMenuForm = {
        parentMenuName: '',
        menuName: '',
        menuCode: '',
        menuOrder: '',
        menuIcon: '',
        menuUri: '',
        menuRedirect: '',
        visible: '',
        needCached: 0,
        modeType: '',
        menuType: '',
        menuFuncs: []
      }
      this.title = "模块新增"
      this.isformVisible = true
      this.isDisabledMenu = true
    },
    // dialog的取消
    cancel() {
      this.isformVisible = false // 是否显示新增对话框
      this.isAddMenuChild = false // 是否是新增子菜单
      this.isEditMenu = false // 是否是编辑菜单
      this.title = ''
      this.isSaveEditBtDisabled = false
      this.isDisabledMenu = false
      this.addMenuForm = {
        parentMenuName: '',
        menuName: '',
        menuCode: '',
        menuOrder: '',
        menuIcon: '',
        menuUri: '',
        menuRedirect: '',
        visible: '',
        needCached: '',
        modeType: '',
        menuType: '',
        menuFuncs: []
      }
    },
    // dialog保存
    saveAddOrEdit() {
      if (this.isEditMenu) {
        this.saveEdit();
      } else {
        this.saveadd();
      }
    },
    // 保存新增
    saveadd() {
      this.$refs.addRules.validate(valid => {
        if (valid) {
          let params = {
            menuCode: this.addMenuForm.menuCode,
            menuFuncs: JSON.stringify(this.addMenuForm.menuFuncs),
            menuIcon: this.addMenuForm.menuIcon,
            menuName: this.addMenuForm.menuName,
            menuOrder: this.addMenuForm.menuOrder,
            menuType: this.addMenuForm.menuType,
            menuUri: this.addMenuForm.menuUri,
            menuRedirect: this.addMenuForm.menuRedirect,
            modeType: this.addMenuForm.modeType,
            parentMenuId: this.addMenuForm.parentMenuId,
            visible: this.addMenuForm.visible,
            needCached: this.addMenuForm.needCached
          }
          if (this.addMenuForm.menuFuncs.length > 0) {
            this.$refs.addBtRules.validate(valid => {
              if (valid) {
                post('/sys/menu/create', params).then(res => {
                  if (res.code === 10000 && res.success === true) {
                    this.isformVisible = false // 是否显示新增对话框
                    this.isAddMenuChild = false // 是否是新增子菜单
                    this.$message.success(res.message)
                    this.loadtableData()
                    if (this.isAddMenuChildForLoad) {
                      this.LoadNodeList.find((item) => {
                        if (item.row.menuId === this.rowTemp.menuId) {
                          this.row = item.row
                          this.node = item.node
                          this.resolve = item.resolve
                          return
                        }
                      })
                      this.loadNode(this.row, this.node, this.resolve)
                      this.isAddMenuChildForLoad = false
                    }
                  } else {
                    this.$message.error(res.message)
                  }
                })
              } else {
                this.$message.error('请填写按钮code信息')
              }
            })
          } else {
            post('/sys/menu/create', params).then(res => {
              if (res.code === 10000 && res.success === true) {
                this.isformVisible = false // 是否显示新增对话框
                this.isAddMenuChild = false // 是否是新增子菜单
                this.$message.success(res.message)
                this.loadtableData()
                if (this.isAddMenuChildForLoad) {
                  this.LoadNodeList.find((item) => {
                    if (item.row.menuId === this.rowTemp.menuId) {
                      this.row = item.row
                      this.node = item.node
                      this.resolve = item.resolve
                      return
                    }
                  })
                  this.loadNode(this.row, this.node, this.resolve)
                  this.isAddMenuChildForLoad = false
                }
              } else {
                this.$message.error(res.message)
              }
            })
          }
        } else {
          this.$message.error('请按以下规则填写信息')
        }
      })
    },
    // 保存编辑
    saveEdit() {
      this.$refs.addRules.validate(valid => {
        if (valid) {
          let params = {
            menuCode: this.addMenuForm.menuCode,
            menuFuncs: JSON.stringify(this.addMenuForm.menuFuncs),
            menuIcon: this.addMenuForm.menuIcon,
            menuId: this.menuId,
            menuName: this.addMenuForm.menuName,
            menuOrder: this.addMenuForm.menuOrder,
            menuType: this.addMenuForm.menuType,
            menuUri: this.addMenuForm.menuUri,
            menuRedirect: this.addMenuForm.menuRedirect,
            modeType: this.addMenuForm.modeType,
            parentMenuId: this.addMenuForm.parentMenuId,
            visible: this.addMenuForm.visible,
            needCached: this.addMenuForm.needCached
          }
          if (this.addMenuForm.menuFuncs.length > 0) {
            this.$refs.addBtRules.validate(valid => {
              if (valid) {
                post('/sys/menu/edit', params).then(res => {
                  if (res.code === 10000 && res.success === true) {
                    this.$message.success(res.message)
                    this.isformVisible = false // 是否显示新增对话框
                    this.isEditMenu = false // 是否是编辑菜单
                    this.loadtableData()
                    if (this.rowTemp.parentMenuId !== "0") {
                      this.LoadNodeList.find((item) => {
                        if (item.row.menuId === this.rowTemp.parentMenuId) {
                          this.row = item.row
                          this.node = item.node
                          this.resolve = item.resolve
                          return
                        }
                      })
                      this.$set(this.$refs.menuTable.store.states.lazyTreeNodeMap, this.row.menuId, [])
                      this.loadNode(this.row, this.node, this.resolve)
                    }
                    if (this.addMenuForm.parentMenuId !== this.rowTemp.parentMenuId && this.addMenuForm.parentMenuId !== "0") {
                      this.LoadNodeList.find((item) => {
                        if (item.row.menuId === this.addMenuForm.parentMenuId) {
                          this.row = item.row
                          this.node = item.node
                          this.resolve = item.resolve
                          return
                        }
                      })
                      this.$set(this.$refs.menuTable.store.states.lazyTreeNodeMap, this.row.menuId, [])
                      this.loadNode(this.row, this.node, this.resolve)
                    }
                  } else {
                    this.$message.error(res.message)
                  }
                })
              } else {
                this.$message.error('请填写按钮code信息')
              }
            })
          } else {
            post('/sys/menu/edit', params).then(res => {
              if (res.code === 10000 && res.success === true) {
                this.$message.success(res.message)
                this.isformVisible = false // 是否显示新增对话框
                this.isEditMenu = false // 是否是编辑菜单
                this.loadtableData()
                if (this.rowTemp.parentMenuId !== "0") {
                  this.LoadNodeList.find((item) => {
                    if (item.row.menuId === this.rowTemp.parentMenuId) {
                      this.row = item.row
                      this.node = item.node
                      this.resolve = item.resolve
                      return
                    }
                  })
                  this.$set(this.$refs.menuTable.store.states.lazyTreeNodeMap, this.row.menuId, [])
                  this.loadNode(this.row, this.node, this.resolve)
                }
                if (this.addMenuForm.parentMenuId !== this.rowTemp.parentMenuId && this.addMenuForm.parentMenuId !== "0") {
                  this.LoadNodeList.find((item) => {
                    if (item.row.menuId === this.addMenuForm.parentMenuId) {
                      this.row = item.row
                      this.node = item.node
                      this.resolve = item.resolve
                      return
                    }
                  })
                  this.$set(this.$refs.menuTable.store.states.lazyTreeNodeMap, this.row.menuId, [])
                  this.loadNode(this.row, this.node, this.resolve)
                }
              } else {
                this.$message.error(res.message)
              }
            })
          }
        } else {
          this.$message.error('请按规则填写信息')
        }
      })
    },
    // 打开新增子菜单dialog
    addMenuShow(row) {
      this.addMenuForm = {
        parentMenuName: '',
        menuName: '',
        menuCode: '',
        menuOrder: '',
        menuIcon: '',
        menuUri: '',
        menuRedirect: '',
        visible: '',
        needCached: '',
        modeType: '',
        menuType: '',
        menuFuncs: []
      }
      this.isEditMenu = false // 是否是编辑菜单
      this.isSaveEditBtDisabled = false
      this.isDisabledMenu = false
      this.addMenuForm.parentMenuName = row.menuName + '(' + row.menuCode + ')'
      this.addMenuForm.parentMenuId = row.menuId
      this.rowTemp = row
      this.isAddMenuChild = true
      this.isAddMenuChildForLoad = true
      this.isformVisible = true
      this.title = '新增子菜单'
    },
    // 编辑时获取某一菜单的详细信息
    getMenuDetail(row) {
      get('sys/menu/get/' + row.menuId).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.addMenuForm.menuName = res.data.menuName
          this.addMenuForm.menuCode = res.data.menuCode
          this.addMenuForm.menuOrder = res.data.menuOrder
          this.addMenuForm.menuIcon = res.data.menuIcon
          this.addMenuForm.menuUri = res.data.menuUri
          this.addMenuForm.menuRedirect = res.data.menuRedirect
          this.addMenuForm.visible = res.data.visible
          this.addMenuForm.needCached = res.data.needCached
          this.addMenuForm.modeType = res.data.modeType
          this.addMenuForm.menuType = res.data.menuType
          this.addMenuForm.parentMenuId = res.data.parentMenuId
          this.parentMenuTreeName = res.data.parentMenuName

          this.addMenuForm.menuFuncs = res.data.menuFuncList
          if (res.data.menuFuncList === undefined) {
            var arr = []
            this.addMenuForm.menuFuncs = arr
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 编辑时获取父菜单的列表树
    getparentMenuNameList(row) {
      get('/sys/menu/listModule', {
        menuId: row.menuId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.parentMenuNameList = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 编辑时列表树节点的点击事件
    handleNodeClick(data, node) {
      this.addMenuForm.parentMenuId = data.menuId
      this.parentMenuTreeName = data.menuName
      // console.log(data, node)
    },
    // 打开编辑菜单dialog
    editMenuShow(row) {
      this.addMenuForm = {
        parentMenuName: '',
        menuName: '',
        menuCode: '',
        menuOrder: '',
        menuIcon: '',
        menuUri: '',
        menuRedirect: '',
        visible: '',
        needCached: '',
        modeType: '',
        menuType: '',
        menuFuncs: []
      }
      this.isAddMenuChild = false // 是否是新增子菜单
      this.isSaveEditBtDisabled = false
      this.isDisabledMenu = false
      this.getparentMenuNameList(row)
      this.getMenuDetail(row);
      this.title = '编辑菜单'
      this.isEditMenu = true
      this.isformVisible = true
      this.menuId = row.menuId
      this.parentMenuIdLoad = row.parentMenuId
      this.rowTemp = row
    },
    // 删除菜单
    delMenuShow(rows) {
      this.rowTemp = rows
      this.$confirm('是否确认删除' + rows.menuName + '?', '删除菜单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {}
        params.menuId = rows.menuId
        console.log(" params.menuId--", params.menuId)
        post('sys/menu/remove/' + params.menuId).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.loadtableData()
            if (rows.parentMenuId !== "0") {
              this.LoadNodeList.find((item) => {
                if (item.row.menuId === this.rowTemp.parentMenuId) {
                  this.row = item.row
                  this.node = item.node
                  this.resolve = item.resolve
                  return
                }
              })
              this.$set(this.$refs.menuTable.store.states.lazyTreeNodeMap, this.row.menuId, [])
              this.loadNode(this.row, this.node, this.resolve)
            }
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '您取消了该操作'
        });
      });
    },
    // 新增button
    addBtRow() {
      for (let i of this.addMenuForm.menuFuncs) {
        if (i.isEnable) return this.$message.warning("请先保存当前编辑项");
      }
      let j = {
        funcName: "",
        funcCode: "",
        isEnable: true
      };
      this.addMenuForm.menuFuncs.push(j);
      // this.addMenuForm.sel = JSON.parse(JSON.stringify(j));
    },
    // 编辑button
    editBtRow(rows) {
      rows.isEnable = !rows.isEnable
    },
    // 删除button
    delBtRow(rows) {
      this.$confirm('是否确认此操作?', '删除按钮？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isSaveEditBtDisabled = true
        let params = {}
        params.menuId = this.menuId
        params.funcCode = rows.funcCode
        console.log(" params is--", params)
        post('/sys/menu/removeBtn', params).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message.success(res.message)
            this.isSaveEditBtDisabled = false
            this.removeByValue(this.addMenuForm.menuFuncs, 'funcCode', rows.funcCode)
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '您取消了该操作'
        });
      });
    },
    // 获取一级模块列表
    loadtableData() {
      get('/sys/menu/listMenu', {
        menuId: '0'
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.tableData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // load加载模块的子菜单
    load(row, node, resolve) {
      // console.log(row, node, resolve)
      let obj = {}
      obj.row = row
      obj.node = node
      obj.resolve = resolve
      this.LoadNodeList.push(obj)
      this.loadNode(row, node, resolve)
    },
    loadNode (row, node, resolve) {
      get('/sys/menu/listMenu', {
        menuId: row.menuId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          if (res.data.length === 0) {
            this.isResDataNull = true
          }
          // setTimeout(() => {
          //   resolve(res.data);
          // }, 1000);
          resolve(res.data);
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 根据数组对象的某个value值来移除该项
    removeByValue(arr, attr, value) { // 数组，属性，属性值
      var index = 0;
      for (var i in arr) {
        if (arr[i][attr] === value) {
          index = i;
          break;
        }
      }
      arr.splice(index, 1);
    },
    // 修正select
    change() {
      this.parentMenuNameList = this.parentMenuNameList.slice(0)
    },
    // 点击某一行时收起或展开该行
    clickTableRow(row, event, column) {
      this.expandChild(row)
    },
    expandChild (row) {
      let list = document.getElementsByClassName("el-table__row")
      for (let i = 0; i < list.length; i++) {
        if (list[i].cells[0].innerText.trim() === row.menuName) {
          let els = list[i].getElementsByClassName("el-table__expand-icon")
          for (let i = 0; i < els.length; i++) {
            els[0].click()
          }
        }
      }
    }
  },
  created() {
    this.loadtableData();
  }
}
</script>

<style>
  .ruleClassifying .el-select-dropdown__item {
          padding: 0;
        }
  .onlyOption{
    font-weight: 500!important;
  }
  .dialog .el-dialog__header{
    border-bottom: 1px solid #DCDFE6
  }
  .dialog .el-dialog__footer{
    border-top: 1px solid #DCDFE6
  }
  .dialog .el-dialog__title{
    font-size:14px;
    color:#17233d;
    line-height:20px
  }
  .dialog .el-form-item__label{
    font-size:12px;
    color:#515a6e;
    line-height:1;
    padding:10px 12px 10px 0
  }
  .dialog .el-form-item__content{
    font-size:12px;
 }
 .bt-form .el-form-item{
   margin-bottom:10px
 }
 .bt-form .el-form-item__error{
   position:absolute;
   top:32px;
   left:3px
 }
</style>
