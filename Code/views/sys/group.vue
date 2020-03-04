<template>
  <div class="group-box" style="background-color:#fff">
    <div class="top-box">
      <div class="btn-box">
        <el-button type="danger"  size="small" @click="delGroup(tableChecked)" class="buttoncss"><i class="btn-box-icon del"></i>批量删除</el-button>
        <el-button type="primary"  size="small" @click="addGroupDioShow" class="buttoncss"><i class="btn-box-icon add"></i>新增部门</el-button>
        <el-button type="primary" icon="el-icon-user" size="small" @click="assignDioShow">分配用户</el-button>
      </div>
      <div class="topright-form" style="float:right;">
        <el-form :model="searchForm" label-width="90" inline size="small">
					<el-form-item prop="groupName" label="部门名称：">
						<el-input v-model.trim="searchForm.groupName" placeholder="请输入..."  style="width:150px" size="small" clearable></el-input>
					</el-form-item>
          <el-form-item prop="groupLevel" label="部门层级：">
            <el-select  v-model.trim="searchForm.groupLevel" placeholder="请选择..." size="small" clearable>
              <el-option v-for="(item,index) in groupLevelList" :key="index" :value="item"
                :label="item">
              </el-option>
            </el-select>
					</el-form-item>
					<el-button type="primary" icon="el-icon-search" size="small" @click="getGroupDataList">查询</el-button>
				</el-form>
      </div>
    </div>
    <div class="table-div" style="clear:both;padding:10px">
      <el-table
        ref="table"
        :data="tableData"
        border
        show-header
        size="mini"
        style="width: 100%"
        :header-cell-style="{background:'#f8f8f9',color:'#606266',height:'45px'}"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="60">
        </el-table-column>
        <el-table-column
          label="部门名称" sortable
          prop="groupName">
        </el-table-column>
        <el-table-column
          label="部门英文名" sortable
          prop="groupEname">
        </el-table-column>
        <el-table-column
          label="部门层级" sortable
          prop="groupLevel">
        </el-table-column>
        <el-table-column
          label="上级部门名称" sortable
          prop="parentGroupName">
        </el-table-column>
        <el-table-column
            label="部门人员" sortable
            prop="number">
        </el-table-column>
        <el-table-column
          label="是否虚拟部门" sortable :sort-method="isVirtualSort">
          <template slot-scope="scope">
            {{scope.row.isVirtual =='1' ? '是':'否'}}
          </template>
        </el-table-column>
        <el-table-column
          width='200px'
          label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
              <el-button @click="detailShow(scope.row)" type="text" size="small" >
                <svg-icon icon-class="preview" class="preview"></svg-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <el-button   @click="editDialogShow(scope.row)" type="text" size="small" >
                <svg-icon icon-class="editor" class="editor"></svg-icon>
              </el-button>
            </el-tooltip>
              <!-- <el-button @click="detailShow(scope.row)" type="primary" size="mini" class="table-btcss"><i class="view-info"></i>查看</el-button> -->
              <!-- <el-button @click="editDialogShow(scope.row)" type="warning" size="mini" class="table-btcss"><i class="bt-edit"></i>修改</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="paganation" style="text-align:right">
      <pagination  :total="total" :page.sync="icurrentPage"  :limit.sync="ipageSize" @pagination="getGroupDataList" />
    </div>
    <div class="dialog">
      <div id="add-group">
        <el-dialog :visible.sync="isformVisible" title="新增部门" width="520px">
          <el-row  :gutter="20">
            <el-col :span="22">
              <el-form :model="addGroupForm" label-width="100px" :rules="addRules"    ref="addgroupform">
                <el-form-item label="部门名称：" prop="groupName">
                  <el-input v-model="addGroupForm.groupName"  size="mini"/>
                </el-form-item>
                <el-form-item label="部门英文名：">
                  <el-input v-model="addGroupForm.groupEname" size="mini"/>
                </el-form-item>
                <el-form-item label="备注：">
                  <el-input type="textarea" v-model="addGroupForm.description" size="mini"/>
                </el-form-item>
                <el-form-item label="虚拟部门：">
                  <el-select v-model="addGroupForm.isVirtual" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in virtualList" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="上级部门：">
                  <el-select size="mini"
                      style="width: 100%;"
                      v-model="addGroupForm.treeSelectGroupName"
                      placeholder="请选择"
                      clearable
                      @clear="treeSelectGroupClear()"
                  >
                    <el-option value="" label="请选择"></el-option>
                    <el-option value="" style="height: auto" class="onlyOption">
                      <el-tree
                          accordion
                          style="margin: 0 -20px;"
                          :data="treeData"
                          node-key="groupId"
                          @node-click="handleNodeClick"
                          :props="defaultProps"
                          :highlight-current="true"
                          :render-content="renderContent"
                          ref="groupTreeEdit"
                      ></el-tree>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
<!--            <el-col :span="10">-->
<!--              <div>上级部门</div>-->
<!--              <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" ref="groupTree"></el-tree>-->
<!--            </el-col>-->
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click.native="isformVisible = false" size="mini">取消</el-button>
            <el-button type="primary" @click.native="saveAdd" size="mini">提交</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="edit-group">
        <el-dialog :visible.sync="isEditVisible" title="修改部门" width="520px">
          <el-row  :gutter="20">
            <el-col :span="22">
              <el-form :model="editGroupForm" label-width="100px" :rules="editRules" ref="editform">
                <el-form-item label="部门名称：" prop="groupName">
                  <el-input v-model="editGroupForm.groupName"  size="mini"/>
                </el-form-item>
                <el-form-item label="部门英文名：">
                  <el-input v-model="editGroupForm.groupEname" size="mini"/>
                </el-form-item>
                <el-form-item label="备注：">
                  <el-input type="textarea" v-model="editGroupForm.description" size="mini"/>
                </el-form-item>
                <el-form-item label="虚拟部门：">
                  <el-select v-model="editGroupForm.isVirtual" placeholder="请选择">
                    <el-option v-for="(item,index) in virtualList" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="上级部门：">
                  <el-select size="mini"
                             style="width: 100%;"
                             v-model="addGroupForm.treeSelectGroupName"
                             placeholder="请选择"
                              clearable
                             @clear="treeSelectGroupClear()"
                  >
                    <el-option value="" label="请选择"></el-option>
                    <el-option value="" style="height: auto" class="onlyOption">
                      <el-tree
                          accordion
                          style="margin: 0 -20px;"
                          :data="treeData"
                          node-key="groupId"
                          @node-click="handleNodeClick"
                          :props="defaultProps"
                          :highlight-current="true"
                          :render-content="renderContent"
                          ref="groupTreeEdit"
                      ></el-tree>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
<!--            <el-col :span="10">-->
<!--              <div>上级部门</div>-->
<!--              <el-tree :data="treeDataEdit" :props="defaultProps" @node-click="handleNodeClick" ref="groupTreeEdit"-->
<!--                       node-key="groupId"-->
<!--                       :highlight-current="true"-->
<!--              ></el-tree>-->
<!--            </el-col>-->
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click.native="isEditVisible = false" size="mini">取消</el-button>
            <el-button type="primary" @click.native="editSubmit" size="mini">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="detail">
        <el-dialog :visible.sync="isDetailVisible" title="部门详情" width="520px">
          <el-row>
            <el-col :span="4"><span>部门名称:</span></el-col>
            <el-col :span="20">{{ detailData.groupName }}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4"><span>部门英文名:</span></el-col>
            <el-col :span="20">{{ detailData.groupEname }}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4"><span>上级部门：</span></el-col>
            <el-col :span="20">{{ detailData.parentGroupName}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4"><span>虚拟部门:</span></el-col>
            <el-col :span="20">{{ detailData.isVirtual== '1' ? '是' : '否'  }}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4"><span>部门人员：</span></el-col>
            <el-col :span="20">{{ detailData.number}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4"><span>备注:</span></el-col>
            <el-col :span="20">{{ detailData.description }}</el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="isDetailVisible = false" size="mini">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="assign">
        <el-dialog :visible.sync="isAssignVisible"  title="分配用户" width="540px">
          <div id="transfer" style="text-align: center">
            <el-transfer
              style="text-align: left;"
              size="mini"
              v-model="targetKeys"
              filterable
              :titles="['非部门用户', '部门用户']"
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
            <el-button type="primary" @click.native="assignUserSubmit" size="mini">确定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { post, get } from '@/utils/request'
export default{
  name: 'group',
  components: { Pagination },
  data() {
    return {
      searchForm: {
        groupName: '',
        groupLevel: ''
      },
      groupLevelList: [],
      tableChecked: [], // 存储所选中的row
      ids: [], // 存储所选中的row的id(这里的id是表的标志字段)
      tableData: [],
      // 新增
      isformVisible: false, // 是否显示新增对话框
      addGroupForm: {
        groupName: '',
        groupEname: '',
        description: '',
        isVirtual: '',
        groupLevel: '',
        parentGroupId: '',
        treeSelectGroupName: null // 上级部门 选择后显示的部门名称
      },
      addRules: {
        groupName: [
          { required: true, message: '请填写部门名称', trigger: 'blur' }
        ]
      },
      virtualList: [{
        value: '1',
        label: '是'
      }, {
        value: '0' || undefined,
        label: '否'
      }],
      treeData: [],
      defaultProps: {
        children: 'child',
        label: 'groupName'
      },
      selectGroup: {
        groupId: '',
        level: ''
      },
      // 修改
      isEditVisible: false, // 是否显示新增对话框
      editGroupForm: {
        groupName: '',
        groupEname: '',
        description: '',
        isVirtual: '',
        groupLevel: '',
        parentGroupId: ''
      },
      editRules: {
        groupName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      treeDataEdit: [],
      editRowGroupId: '',
      // 详细信息
      isDetailVisible: false,
      detailData: {},
      // 分配角色
      isAssignVisible: false,
      originData: [],
      targetKeys: [1],
      // 分配菜单
      isAssignMenuVisible: false,
      // paganation数据
      icurrentPage: 1,
      ipageSize: 10,
      total: 10,

      selectGroupName: []
    }
  },
  methods: {
    // 选择上级部门 当清除时清除对应的name 和id
    treeSelectGroupClear() {
      this.selectGroup.groupId = ""
      this.addGroupForm.treeSelectGroupName = null
    },
    // 批量删除相关函数
    handleSelectionChange(val) { // val是所选中的每一个row,包括row中的所有字段
      console.log("handleSelectionChange--", val)
      this.tableChecked = val
    },
    delGroup(rows) {
      this.$confirm('是否确认删除选中部门?', '删除部门', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableChecked.forEach(element => {
          this.ids.push(element.groupId)
        })
        this.ids = this.ids.join(",")
        console.log("handleSelectionChange--", this.ids)
        let params = {
          groupIds: this.ids
        }
        this.ids = []
        get('/sys/group/removeGroupsByIds', params).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message.success(res.message)
            this.getGroupDataList();
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
    // 新增相关函数
    addGroupDioShow() {
      this.addGroupForm = {
        groupName: '',
        groupEname: '',
        description: '',
        isVirtual: '',
        groupLevel: '',
        parentGroupId: '',
        treeSelectGroupName: null // 上级部门 选择后显示的部门名称
      }
      this.selectGroup = {
        groupId: '',
        level: ''
      }
      get('/sys/group/listGroupTree').then(res => {
        if (res.code === 10000 && res.success === true) {
          this.treeData = res.data
          // this.treeData = []
          // this.treeData.push(res.data)
        } else {
          this.$message.error(res.message)
        }
      })
      this.isformVisible = true
    },
    handleNodeClick(data, node) {
      // console.log(data)
      // console.log(node)
      console.log(node.level, 'node.level')
      console.log(data.groupLevel, 'data.groupLevel')
      // console.log(data.groupName)
      // this.selectGroup.groupId = data.groupId
      // this.selectGroup.level = node.level

      let dataG = {
        groupLevel: '',
        groupName: '',
        groupId: ''
      }
      dataG.groupName = data.groupName
      if (data.groupLevel === undefined) { // 总部 没有groupLevel
        // tree点击节点 - 选择的节点数据
        this.selectGroup.groupId = data.groupId
        this.selectGroup.level = 0

        dataG.groupLevel = 0
        dataG.groupId = 0
        this.selectGroupName = [] // 点击总部时清空selectGroupName数组
        this.selectGroupName.push(dataG)
        this.$refs.groupTreeEdit.setCurrentKey(data.groupId)
      } else {
        dataG.groupLevel = data.groupLevel
        dataG.groupId = data.groupId
        this.selectGroupName.map((item, index) => {
          if (item.groupLevel === data.groupLevel) {
            this.selectGroupName = this.selectGroupName.slice(0, index)
            return
          }
        })
        if (data.groupId !== this.editRowGroupId) {
          // tree点击节点 - 选择的节点数据
          this.selectGroup.groupId = data.groupId
          this.selectGroup.level = data.groupLevel

          this.selectGroupName.push(dataG)
          this.$refs.groupTreeEdit.setCurrentKey(data.groupId)
        } else {
          this.$message.warning("当前部门不能是自己的上级部门")
          this.selectGroupName.forEach((item, index) => {
            if (index === this.selectGroupName.length - 1) {
              this.$refs.groupTreeEdit.setCurrentKey(item.groupId)
            }
          })
        }
      }
      // console.log(this.selectGroupName)
      let selectArr = []
      this.selectGroupName.forEach((item, index) => {
        selectArr.push(item.groupName)
      })
      // 上级部门 - 上下文路径
      this.addGroupForm.treeSelectGroupName = `/${selectArr.join('/')}`
    },
    // 自定义tree 图标 文字
    renderContent(h, params) {
      // console.log(params);
      let sText = params.data.groupName;
      let iconType = "icon icon-department"; // 部门图标
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
              height: "15px",
              float: 'unset',
              fontWeight: 'unset'
            }
          }),
          h("span", sText)
        ]
      );
    },
    saveAdd() { // 保存新增
      this.$refs.addgroupform.validate(valid => {
        if (valid) {
          if (this.selectGroup.groupId !== "") {
            this.addGroupForm.parentGroupId = this.selectGroup.groupId
            this.addGroupForm.groupLevel = this.selectGroup.level + 1
          } else {
            this.addGroupForm.parentGroupId = '0'
            this.addGroupForm.groupLevel = 1
          }
          let params = {
            description: this.addGroupForm.description,
            groupEname: this.addGroupForm.groupEname,
            groupLevel: this.addGroupForm.groupLevel,
            groupName: this.addGroupForm.groupName,
            isVirtual: this.addGroupForm.isVirtual === undefined ? 0 : this.addGroupForm.isVirtual, // 默认不选时，传值 0
            parentGroupId: this.addGroupForm.parentGroupId
          }
          post('/sys/group/createGroup', params).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.$message.success(res.message)
              this.getGroupDataList();
              this.isformVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('请按以下规则填写信息')
        }
      })
    },
    // 修改相关函数
    editDialogShow(row) {
      this.addGroupForm = {
        groupName: '',
        groupEname: '',
        description: '',
        isVirtual: '',
        groupLevel: '',
        parentGroupId: '',
        treeSelectGroupName: null // 上级部门 选择后显示的部门名称
      }
      this.selectGroup = {
        groupId: '',
        level: ''
      }
      this.editRowGroupId = row.groupId
      get('/sys/group/getGroup', {
        groupId: row.groupId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.editGroupForm.groupName = res.data.groupName
          this.editGroupForm.groupEname = res.data.groupEname
          this.editGroupForm.description = res.data.description
          this.editGroupForm.isVirtual = res.data.isVirtual
          this.editGroupForm.parentGroupId = res.data.parentGroupId
          this.editGroupForm.groupLevel = res.data.groupLevel

          // this.addGroupForm.treeSelectGroupName = res.data.parentGroupName
          // 上级部门 - 上下文路径
          this.addGroupForm.treeSelectGroupName = res.data.groupPath

          get('/sys/group/listGroupTree').then(res => {
            if (res.code === 10000 && res.success === true) {
              this.treeData = res.data
              // this.treeData = []
              // this.treeData.push(res.data)
              // console.log(this.editGroupForm.parentGroupId)
              if (this.editGroupForm.parentGroupId !== "0") {
                // 设置节点高亮
                this.$nextTick(() => {
                  this.$refs.groupTreeEdit.setCurrentKey(this.editGroupForm.parentGroupId);
                })
              }
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error(res.message)
        }
      })

      this.isEditVisible = true
    },
    editSubmit() { // 修改保存
      this.$refs.editform.validate(valid => {
        if (valid) {
          if (this.selectGroup.groupId !== "") {
            this.editGroupForm.parentGroupId = this.selectGroup.groupId
            this.editGroupForm.groupLevel = this.selectGroup.level + 1
          }
          let params = {
            description: this.editGroupForm.description,
            groupEname: this.editGroupForm.groupEname,
            groupLevel: this.editGroupForm.groupLevel,
            groupName: this.editGroupForm.groupName,
            isVirtual: this.editGroupForm.isVirtual,
            parentGroupId: this.editGroupForm.parentGroupId,
            groupId: this.editRowGroupId
          }
          post('/sys/group/editGroup', params).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.$message.success(res.message)
              this.getGroupDataList();
              this.isEditVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('请按以下规则填写信息')
        }
      })
    },
    // 是否虚拟部门 排序
    isVirtualSort(obj1, obj2) {
      // console.log(obj1)
      // console.log(obj2)
      let val1 = obj1.isVirtual === undefined ? 1 : obj1.isVirtual
      let val2 = obj2.isVirtual
      return parseFloat(val1) - parseFloat(val2)
    },

    // 显示详细信息
    detailShow(row) {
      get('/sys/group/getGroup', {
        groupId: row.groupId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.detailData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
      this.isDetailVisible = true
    },
    // 获取没有分组的用户和该机构已经分组的用户
    getUserNotGroup(arr) {
      let params = {}
      params.groupId = arr[0].groupId
      get('/sys/group/listUserNotGroup', params).then(res => {
        if (res.code === 10000 && res.success === true) {
          let dataList = res.data
          let tempData = []
          for (let index in dataList) {
            tempData.push({
              key: dataList[index].userId,
              label: dataList[index].userName
            })
          }
          this.originData = tempData
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 查询该机构已经分配的用户id
    getUserOfGroupById(arr) {
      post('/sys/group/listUserIdByGroupId', {
        groupId: arr[0].groupId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.targetKeys = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 分配用户dialog
    assignDioShow() {
      let arr = this.tableChecked
      if (!(arr.length === 1)) {
        this.$message.error('请选择一个部门')
        return;
      }
      this.getUserNotGroup(arr)
      this.getUserOfGroupById(arr)
      this.isAssignVisible = true
    },
    // 为部门分配用户
    assignUserSubmit() {
      if (!this.targetKeys) {
        this.targetKeys = [];
      }
      let arr = this.tableChecked
      let groupId = arr[0].groupId
      let userIds = this.targetKeys.join(',');
      post('/sys/group/createUsers', {
        groupId: groupId,
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
    // 获取部门列表
    getGroupDataList(row) {
      post('/sys/group/listGroup', {
        current: this.icurrentPage,
        size: this.ipageSize,
        groupLevel: this.searchForm.groupLevel,
        groupName: this.searchForm.groupName
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 查询表中所有部门
    searchLevelsList(row) {
      get('/sys/group/listLevels').then(res => {
        if (res.code === 10000 && res.success === true) {
          this.groupLevelList = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  created() {
    this.getGroupDataList();
    this.searchLevelsList();
  }
}
</script>
<style lang="scss" scoped>
  @import "../../styles/treeIconScoped";
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
      padding-left: 32px;
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
    .preview,.editor{
      width:22px;
      height:22px;
    }
    .table-btcss{
      position: relative;
      padding-left: 25px;
      margin-right: 10px;
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
<style>
  .topright-form .el-form-item__label{
    font-size: 12px
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
  .group-box .pagination-container{
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
</style>
