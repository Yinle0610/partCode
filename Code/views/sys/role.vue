<template>
  <div class="role-box" style="background-color:#fff">
    <div class="top-box">
      <div class="btn-box">
        <el-button type="danger" size="small" @click="delGroup()" class="buttoncss"><i class="btn-box-icon del"></i>批量删除</el-button>
        <el-button type="primary"  size="small"  @click="addRoleDioShow" class="buttoncss"> <i class="btn-box-icon add"></i>新增角色</el-button>
      </div>
      <div class="topright-form">
        <el-form :model="searchForm" label-width="90" inline size="small">
					<el-form-item prop="userName" label="角色名称：">
						<el-input v-model.trim="searchForm.roleName" placeholder="请输入..."  style="width:200px"></el-input>
					</el-form-item>
					<el-button type="primary"  icon="el-icon-search" size="small" @click="queryTableListByName()">查询</el-button>
				</el-form>
      </div>
    </div>
    <div class="table-div" style="clear:both;padding:10px">
      <el-table
        ref="roleTable"
        :data="tableData"
        border
        show-header
        size="small"
        style="width: 100%"
        :header-cell-style="{background:'#f8f8f9',color:'#606266',height:'45px'}">
        <el-table-column
          type="selection"
          width="45">
        </el-table-column>
        <el-table-column
          label="序号"
          type="index"
          align="center"
          :index="indexMethod"
          width="50">
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          width="300">
        </el-table-column>
        <el-table-column
          label="角色描述"
          prop="description">
        </el-table-column>
        <el-table-column
          label="是否内置"
          prop="builtIn"
          width="80"
          align="center"
          :formatter="(row) => { return row['builtIn'] === '1' ? '是' : '否' }">
        </el-table-column>
        <el-table-column
          label="操作"
          width="220" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="bottom">
              <el-button @click="detailShow(scope.row)" type="text" size="small" >
                <svg-icon icon-class="preview" class="preview"></svg-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配用户" placement="bottom">
              <el-button @click="assignUser(scope.row.roleId)" type="text" size="small" >
                <svg-icon icon-class="people3" class="people3"></svg-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配菜单" placement="bottom">
              <el-button  @click='assignMenu(scope.row)' type="text" size="small" >
                <svg-icon icon-class="menu" class="menu"></svg-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
              <el-button  @click="editDialogShow(scope.row)" type="text" size="small" >
                <svg-icon icon-class="editor" class="editor"></svg-icon>
              </el-button>
            </el-tooltip>
            <!-- <el-button @click="detailShow(scope.row)" type="primary" size="mini" class="table-btcss"><i class="view-info"></i>查看</el-button>
            <el-button type="primary" icon="el-icon-user" size="mini" @click="assignUser(scope.row.roleId)">分配用户</el-button>
            <el-button type="primary" icon="el-icon-s-fold" size="mini" @click="assignMenu(scope.row)">分配菜单</el-button>
            <el-button @click="editDialogShow(scope.row)" type="warning" size="mini" class="table-btcss"><i class="bt-edit"></i>修改</el-button> --> 
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="paganation" style="text-align:right">
      <pagination  :total="total" :page.sync="icurrentPage"  :limit.sync="ipageSize" @pagination="queryTableList" />
    </div>
    <div class="dialog-role">
      <div id="add-role">
        <el-dialog :visible.sync="isformVisible" title="新增角色" width="520px">
          <el-form :model="addRoleForm" label-width="100px" :rules="rules" ref="addroleform">
            <el-form-item label="角色名称：" prop="roleName">
              <el-input v-model="addRoleForm.roleName"  size="mini"/>
            </el-form-item>
            <el-form-item label="描述：">
              <el-input v-model="addRoleForm.desc" size="mini"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click.native="isformVisible = false" size="mini">取消</el-button>
            <el-button type="primary" @click.native="saveAdd" size="mini">提交</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="edit-role">
        <el-dialog :visible.sync="isEditVisible" title="修改角色信息" width="520px">
          <el-form :model="editRoleForm" label-width="100px" :rules="editRules" ref="editform">
            <el-form-item label="角色名称：" prop="roleName">
              <el-input v-model="editRoleForm.roleName" size="mini"/>
            </el-form-item>
            <el-form-item label="描述:">
              <el-input v-model="editRoleForm.description" size="mini"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click.native="isEditVisible = false" size="mini">取消</el-button>
            <el-button type="primary" @click.native="editSubmit" size="mini">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="detail">
        <el-dialog :visible.sync="isDetailVisible" title="详细信息" width="520px">
          <el-row>
            <el-col :span="4"><span>角色名称：</span></el-col>
            <el-col :span="20">{{ detailData.roleName }}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4"><span>角色描述：</span></el-col>
            <el-col :span="20">{{ detailData.description }}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4"><span>内置角色：</span></el-col>
            <el-col :span="20">{{ detailData.builtIn == '1' ? '是' : '否' }}</el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="isDetailVisible = false" size="mini">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="assign">
        <el-dialog :visible.sync="isAssignVisible" title="分配用户" width="540px">
          <div id="transfer" style="text-align: center">
            <el-transfer
              style="text-align: left;"
              size="mini"
              v-model="targetKeys"
              filterable
              :left-default-checked="[1]"
              :right-default-checked="[]"
              :titles="['未分配用户', '已分配用户']"
              :button-texts="['加入左侧', '加入右侧']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              :data="originData">
            </el-transfer>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click.native="isAssignVisible = false" size="mini">取消</el-button>
            <el-button type="primary" @click.native="assignSubmit" size="mini">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="assignMenu">
        <el-dialog :visible.sync="isAssignMenuVisible" :title="sAssignMenuDialogTitle" width="540px">
          <el-tree
            :data="menuData"
            show-checkbox
            check-strictly
            @check="handleTreeNodeCheck"
            node-key="menuId"
            ref="menuTree"
            :default-checked-keys='originCheckedKey'
            :render-content="renderContent"
            :props="treeProps">
          </el-tree>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click.native="isAssignMenuVisible = false" size="mini">取消</el-button>
            <el-button type="primary" @click.native="AssignMenuSave" size="mini">确定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { post, get } from '@/utils/request'
import { loading } from '@/utils/layer'
export default{
  name: 'role',
  components: { Pagination },
  data() {
    return {
      searchForm: {
        roleName: ''
      },
      tableChecked: [], // 存储所选中的row
      ids: [], // 删除时存储所选中的row的id(这里的id是表的标志字段)
      tableData: [],
      // 新增
      isformVisible: false, // 是否显示新增对话框
      addRoleForm: {
        roleName: '',
        desc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' }
        ]
      },
      // 修改
      isEditVisible: false, // 是否显示新增对话框
      editIndex: '', // 临时保存新增的行index
      editRoleForm: {},
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 详细信息
      isDetailVisible: false,
      detailData: {},
      // 分配角色
      isAssignVisible: false,
      originData: [],
      targetKeys: [],
      roleIdAssUser: '', // 打开分配用户对话框时用来暂存roleId
      // 分配菜单
      isAssignMenuVisible: false,
      sAssignMenuDialogTitle: '分配菜单',
      menuData: [],
      treeProps: {
        children: 'children',
        label: 'title'
      },
      originCheckedKey: [],
      roleIdAssMenu: '', // 打开分配菜单对话框时用来暂存roleId
      // paganation数据
      icurrentPage: 1,
      ipageSize: 10,
      total: 10
    }
  },
  methods: {
    delGroup() {
      let _this = this;
      let selectRow = _this.$refs.roleTable.selection
      let len = selectRow.length
      if (len === 0) {
        _this.$message.info("请选中要删除的角色")
        return
      }
      _this.tableChecked.length = 0
      for (let i = 0; i < len; i++) {
        let row = selectRow[i]
        if (row.builtIn === '1') {
          _this.$message.error("内置角色不能删除")
          return
        }
        _this.tableChecked.push(row.roleId)
      }

      this.$confirm('是否确认删除选中角色？', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let roleIds = _this.tableChecked.join(',')
        post('/sys/role/remove', { roleIds }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message.success(res.message)
            this.queryTableList();
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // 新增相关函数
    addRoleDioShow() {
      this.addRoleForm = {
        roleName: '',
        desc: ''
      }
      this.isformVisible = true
    },
    // 新增保存
    saveAdd() {
      this.$refs.addroleform.validate(valid => {
        if (valid) {
          post('/sys/role/create', {
            description: this.addRoleForm.desc,
            roleName: this.addRoleForm.roleName
          }).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.isformVisible = false
              this.queryTableList()
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('请按以下规则填写信息')
        }
      })
    },
    // 修改相关函数editRoleForm
    editDialogShow(row) {
      this.editIndex = row.roleId
      get('/sys/role/getRoleById', {
        roleId: row.roleId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.isEditVisible = true
          this.editRoleForm = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    editSubmit() { // 修改保存
      this.$refs.editform.validate(valid => {
        if (valid) {
          post('/sys/role/edit', {
            description: this.editRoleForm.description,
            roleName: this.editRoleForm.roleName,
            roleId: this.editIndex
          }).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.isEditVisible = false
              this.queryTableList()
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('请按以下规则填写信息')
        }
      })
    },
    // 获取详细信息
    getDetailInfo(row) {
      get('/sys/role/getRoleById', {
        roleId: row.roleId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.detailData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 显示详细信息
    detailShow(row) {
      this.isDetailVisible = true
      this.getDetailInfo(row)
    },
    // 用户分配
    // 获取所有用户信息
    getAllUserInfo() {
      get('/sys/role/listAllUser').then(res => {
        if (res.code === 10000 && res.success === true) {
          let dataList = res.data
          let tempData = []
          for (let index in dataList) {
            tempData.push({
              key: dataList[index].userId,
              label: dataList[index].userName
            });
          }
          this.originData = tempData
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 查询该角色已经分配的用户id
    getUserOfRoleById(roleId) {
      get('/sys/role/listUserByRoleId', { roleId }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.targetKeys = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 角色分配
    assignUser(roleId) {
      this.getUserOfRoleById(roleId)
      this.getAllUserInfo()
      this.isAssignVisible = true
      this.roleIdAssUser = roleId
    },
    // 用户分配提交
    assignSubmit() {
      if (!this.targetKeys) {
        this.targetKeys = [];
      }
      let roleId = this.roleIdAssUser
      let userIds = this.targetKeys.join(',');
      post('/sys/role/createUsersForRole', {
        roleId: roleId,
        userIds: userIds
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.$message.success(res.message);
          this.isAssignVisible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 分配菜单
    assignMenu({ roleId, roleName }) {
      get('/sys/role/getRoleMenuTree', { roleId }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.menuData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
      get('/sys/role/listMenuIdIsCheckTrue', { roleId }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.originCheckedKey = res.data
        } else {
          this.$message.error(res.message)
        }
      })
      this.isAssignMenuVisible = true
      this.sAssignMenuDialogTitle = `给【${roleName}】分配菜单`
      this.roleIdAssMenu = roleId
    },
    AssignMenuSave() {
      let nodes = this.$refs.menuTree.getCheckedNodes()
      nodes = nodes.filter(n => n.parentMenuId !== 'root')
      let roleId = this.roleIdAssMenu
      let userModeMenus = []
      let dmacModeMenus = []
      let dsmsModeMenus = []
      let dqmsModeMenus = []

      let resId
      nodes.forEach(item => {
        resId = item.menuType === 'menu' ? item.menuId + item.menuCode : item.menuId
        if (item.modeCode === 'EDGS') {
          userModeMenus.push({
            resId: resId,
            resType: item.menuType
          })
        } else if (item.modeCode === 'DMAC') {
          dmacModeMenus.push({
            resId: resId,
            resType: item.menuType
          })
        } else if (item.modeCode === 'DSMS') {
          dsmsModeMenus.push({
            resId: resId,
            resType: item.menuType
          })
        } else if (item.modeCode === 'DQMS') {
          dqmsModeMenus.push({
            resId: resId,
            resType: item.menuType
          })
        }
      })
      const load = loading('正在保存分配给角色的菜单...')
      post('/sys/role/createLink', {
        roleId,
        userModeMenus: JSON.stringify(userModeMenus),
        dmacModeMenus: JSON.stringify(dmacModeMenus),
        dsmsModeMenus: JSON.stringify(dsmsModeMenus),
        dqmsModeMenus: JSON.stringify(dqmsModeMenus)
      }).then(res => {
        load.close()
        if (res.code === 10000 && res.success === true) {
          this.$message.success(res.message)
          this.isAssignMenuVisible = false
        } else {
          this.$message.error(res.message)
        }
      }).catch((res) => {
        load.close()
      })
    },
    // 角色列表
    queryTableList() {
      post('/sys/role/list', {
        current: this.icurrentPage,
        size: this.ipageSize
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 角色查询(根据角色名称)
    queryTableListByName() {
      post('/sys/role/listRolesByRoleName', {
        current: this.icurrentPage,
        size: this.ipageSize,
        keyword: this.searchForm.roleName
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    indexMethod(index) {
      return index + 1
    },
    handleTreeNodeCheck(node, { checkedKeys }) {
      let isChecked = checkedKeys.includes(node.menuId)
      if (isChecked) {
        // 勾选所有直接父结点
        let parentNodeKeys = []
        let parentNode = null
        let nodeKey = node.menuId
        do {
          parentNode = this.findParentNode(nodeKey, this.menuData)
          if (parentNode) {
            nodeKey = parentNode.menuId
            parentNodeKeys.push(parentNode.menuId)
          }
        } while (parentNode)
        this.$refs.menuTree.setCheckedKeys(checkedKeys.concat(parentNodeKeys))
      } else {
        // 取消所有子结点
        let childrenIds = this.findAllChildrenIds(node.children)
        this.$refs.menuTree.setCheckedKeys(checkedKeys.filter(key => !childrenIds.includes(key)))
      }
    },
    findAllChildrenIds(childrenArray) {
      let childrenIds = []
      if (childrenArray) {
        childrenArray.forEach(item => {
          childrenIds.push(item.menuId)
          if (item.children && item.children.length > 0) {
            childrenIds.push(...this.findAllChildrenIds(item.children))
          }
        })
      }
      return childrenIds
    },
    findParentNode(nodeKey, nodeArray) {
      let len = nodeArray.length
      let item
      for (let i = 0; i < len; i++) {
        item = nodeArray[i]
        if (item.children && item.children.length > 0) {
          let temp = item.children.map(item => item.menuId)
          let contains = temp.includes(nodeKey)
          if (contains) {
            return item
          }
          let parentNode = this.findParentNode(nodeKey, item.children)
          if (parentNode) {
            return parentNode
          }
        }
      }
      return null
    },
    renderContent(h, { data }) {
      let iconType = data.menuType === 'menu' ? 'icon icon-menu' : 'icon icon-btn'
      return h('span',
        {
          class: 'tree-node'
        },
        [
          h('span', {
            class: iconType,
            style: {
              marginRight: '4px'
            }
          }),
          h('span', data.title)
        ]
      );
    }
  },
  created() {
    this.queryTableList();
  }
}
</script>

<style lang="scss" scoped>
    //box的样式
  .top-box{
      display: inline-block;
      border-bottom: 1px solid #e8eaec;
      width:100%;
      padding:15px;
    .btn-box {
      padding-bottom: 10px;
      display: inline-block;
    }
    .btn-box .buttoncss {
      position: relative;
      padding-left: 30px;
      margin-right: 8px;
    }
    .btn-box .btn-box-icon {
      position: absolute;
      display: inline-block;
      width: 15px;
      height: 15px;
      left: 10px;
      top: 7px;
    }
    .btn-box .add {
      background: url(../../../src/assets/images/commonIcon/add.png) no-repeat;
      background-size: 100%;
    }
    .btn-box .del {
      background: url(../../../src/assets/images/commonIcon/del.png) no-repeat;
      background-size: 100%;
    }
    .topright-form{
      position: absolute;
      right:15px;
      padding-bottom: 10px;
      display: inline-block;
    }
  }
  // table内button的样式
  .table-div{
    .preview,.editor,.people3,.menu{
      width:22px;
      height:22px;
    }
    .table-btcss{
      position: relative;
      padding-left: 25px;
      margin-right: 1px;
    }
    .view-info, .bt-edit{
      position: absolute;
      display: inline-block;
      width: 15px;
      height: 15px;
      left: 5px;
      top: 5px;
    }
    .view-info {
      background: url(../../../src/assets/images/commonIcon/preview.png) no-repeat;
      background-size: 100%;
    }
    .bt-edit {
      background: url(../../../src/assets/images/commonIcon/edit.png) no-repeat;
      background-size: 100%;
    }
  }
</style>

<style lang="scss">
/* 修改element的样式 */
  .topright-form .el-form-item__label{
    font-size: 12px;
    color:#515a6e
  }
  .table-div .el-table--border td{
    border-right:none
  }
  .table-div .el-table--border th{
    border-right:none
  }
  .table-div .el-table{
    font-size:12px
  }
  .dialog-role .el-dialog__header{
    border-bottom: 1px solid #DCDFE6
  }
  .dialog-role .el-dialog__footer{
    border-top: 1px solid #DCDFE6
  }
  .dialog-role .el-dialog__title{
    font-size:14px;
    color:#17233d;
    line-height:20px
  }
  .dialog-role .el-form-item__label{
    font-size:12px;
    color:#515a6e;
    line-height:1;
    padding:10px 12px 10px 0
  }
  .role-box .pagination-container{
   margin-top:0px
 }
 #assign .el-transfer-panel{
   width:180px;
 }
#assign .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label{
  font-size:12px;
}
#assign .el-transfer-panel__filter .el-input__inner{
  height:24px
}
#assign .el-checkbox__label{
  font-size:12px
}
#assign .el-transfer__button{
  padding:6px 7px 6px 7px;
  display:block;
  font-size:12px
}
#assign .el-button{
 font-size:12px
}
#assign .el-transfer__button i, .el-transfer__button span{
  font-size:12px
}
#transfer .el-checkbox{
  display:block
}



#assignMenu {
  .el-tree-node__content {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
  .tree-node .icon {
    display: inline-block;
    position: relative;
    top: 4px;
    margin-right: 4px;
  }
  .tree-node {
    position: relative;
    left: 1px;
    top: -1px;
    .icon.icon-menu {
      width: 20px;
      height: 20px;
      background: url(./../../assets/images/menu.png) no-repeat;
      background-size: 20px 20px;
    }
    .icon.icon-btn {
      width: 20px;
      height: 20px;
      background: url(./../../assets/images/button.png) no-repeat;
      background-size: 20px 20px;
    }
  }
}
</style>
