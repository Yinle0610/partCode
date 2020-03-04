<!--主数据编辑页面 masterDataEdit-->
<template>
  <div class="editor-container">
    <!-- <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <el-button  size="small" style="float: right;" @click="toCancel">关闭</el-button>
        <!--        <el-button  size="small" type="primary" style="float: right;margin-right:8px;" @click="toSave">保存</el-button>-->
      <!-- </div> -->
      <div class="card-body">
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick"> -->
          <!-- <el-tab-pane label="基本信息" name="first"> -->
            <el-collapse v-model="aBaseInfoActiveNames">
              <el-collapse-item class="title terms" name="1">
                <template slot="title">
                  <i class="line"></i>业务属性
                </template>
                <!--引用业务术语-->
                <div class="professional-terms">
                  <el-tooltip placement="right">
                    <div slot="content">引用业务术语</div>
                    <i class="trems" @click="toTerms"></i>
                  </el-tooltip>
                </div>
                <el-form :model="baseInfoRuleForm" :rules="rules" ref="baseInfoRuleForm" label-width="130px" style="width:60%;margin-top:10px;">
                  <opinion-input-type v-for=" (val,index) in inputData" :key="val.columnName" :item="inputData[index]" :ref="'input_'+val.columnName" v-show="val.hidden!==true"></opinion-input-type>

                  <!--                  <el-form-item label="标准名称：" prop="cnName">-->
                  <!--                    <el-input size="small" v-model="baseInfoRuleForm.cnName" placeholder="请输入标准中文名称..."></el-input>-->
                  <!--                  </el-form-item>-->
                  <!--                  <el-form-item label="标准英文名称：" prop="enName">-->
                  <!--                    <el-input size="small" v-model="baseInfoRuleForm.enName" placeholder="请输入标准英文名称..."></el-input>-->
                  <!--                  </el-form-item>-->
                  <!--                  &lt;!&ndash;选择目录 tree&ndash;&gt;-->
                  <!--                  <el-form-item label=" 选择目录：" prop="catalog" class="choice-catalog-item">-->
                  <!--                    <el-button @click="toShowCatalogTree" size="small" v-model="baseInfoRuleForm.catalog" class="choice-catalog"> {{baseInfoRuleForm.catalog}} <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i> </el-button>-->
                  <!--                    <el-tree v-if="bIsShowCatalogTree" :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>-->
                  <!--                  </el-form-item>-->
                  <!--                  <el-form-item label=" 取值范围：" prop="type1">-->
                  <!--                    <el-input size="small" v-model="baseInfoRuleForm.type1" placeholder="请输入..."></el-input>-->
                  <!--                  </el-form-item>-->
                  <!--                  <el-form-item label="制定依据：" prop="format">-->
                  <!--                    <el-input size="small" v-model="baseInfoRuleForm.format" placeholder="请输入制定依据..."></el-input>-->
                  <!--                  </el-form-item>-->
                  <!--                  <el-form-item label="业务定义：" prop="type3">-->
                  <!--                    <el-input size="small" type="textarea" :rows="5" v-model="baseInfoRuleForm.type3" placeholder="请输入业务定义..."></el-input>-->
                  <!--                  </el-form-item>-->
                  <!--                  <el-form-item label="备注：" prop="format">-->
                  <!--                    <el-input size="small" v-model="baseInfoRuleForm.format" placeholder="请输入..."></el-input>-->
                  <!--                  </el-form-item>-->
                </el-form>
              </el-collapse-item>
              <el-collapse-item class="title" name="2">
                <template slot="title">
                  <i class="line"></i>技术属性
                </template>
                <el-form :model="baseInfoRuleForm2" :rules="rules2" ref="baseInfoRuleForm2" label-width="130px" style="width:60%;margin-top:10px;">
                  <opinion-input-type v-for=" (val,index) in inputData2" :key="val.columnName" :item="inputData2[index]" :ref="'input_'+val.columnName" v-show="val.hidden!==true"></opinion-input-type>
                  <!--                  <el-form-item label="数据长度：" prop="cnName1">-->
                  <!--                    <el-input size="small" v-model="baseTechForm.cnName1" placeholder="请输入..."></el-input>-->
                  <!--                  </el-form-item>-->
                  <!--                  <el-form-item label="数据精度：" prop="cnName2">-->
                  <!--                    <el-input size="small" v-model="baseTechForm.cnName2" placeholder="请输入..."></el-input>-->
                  <!--                  </el-form-item>-->
                  <!--                  <el-form-item label="数据展示格式：" prop="cnName3">-->
                  <!--                    <el-input size="small" v-model="baseTechForm.cnName3" placeholder="请输入..."></el-input>-->
                  <!--                  </el-form-item>-->
                  <!--                  <el-form-item label="数据单位：" prop="cnName4">-->
                  <!--                    <el-input size="small" v-model="baseTechForm.cnName4" placeholder="请输入..."></el-input>-->
                  <!--                  </el-form-item>-->
                  <!--                  <el-form-item label="ID及代码编码规则：" prop="cnName5">-->
                  <!--                    <el-input size="small" v-model="baseTechForm.type5" placeholder="请输入..."></el-input>-->
                  <!--                  </el-form-item>-->
                </el-form>
              </el-collapse-item>
              <!-- <el-divider></el-divider> -->
              <!--基本信息保存按钮-->
              <!-- <el-form align="center">
                <el-button  size="small" type="primary" @click="toSave">保存</el-button>
              </el-form> -->
            </el-collapse>
          <!-- </el-tab-pane> -->
          <!-- <el-tab-pane label="关系信息" name="second">
            <div class="relationship">
              <div class="title">参考(Reference)</div>
              <div class="button">
                <el-button type="primary" size="small" class="zengjia" @click="toAddReference"><svg-icon icon-class="zengjia"></svg-icon>  新增</el-button>
                <el-button type="danger" size="small" class="shanchu" @click="delReference"><svg-icon icon-class="shanchu"></svg-icon> 删除</el-button>
              </div>
              <div class="table">
                <el-table :data="relationData.tableData" border style="width: 100%" size="small" :header-cell-style="{background:'#f8f8f9',textAlign:'center'}" :cell-style="isClass" :header-cell-class-name="isClass2"
                          @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="50">
                  </el-table-column>
                  <el-table-column prop="name" label="标准名称" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="classifierName" label="标准类型" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="code" label="标准代码" show-overflow-tooltip>
                    <template slot-scope="scope"><a class="a-color" @click="toDetails(scope.row)"> {{scope.row.code}} </a> </template>
                  </el-table-column>
                  <el-table-column prop="context" label="上下文路径" align="center" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="relationshipName" label="关系类型" show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
              <div style="text-align:center;margin-top:30px;" v-if="relationData.oPage.total>0">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="relationData.oPage.pageCurrent"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="relationData.oPage.pageSize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="relationData.oPage.total">
                </el-pagination>
              </div>
            </div>
          </el-tab-pane> -->
          <!-- <el-tab-pane label="认责信息" name="third">
            <el-collapse class="confess-account" v-model="confessActiveNames">
              <el-collapse-item title="创建人" name="1"> -->
                <!--引用名片组件-->
                <!-- <businessCard v-if="creator.length>0" :cardList="creator"></businessCard>
                <div v-else> 暂无数据 </div>
              </el-collapse-item>
              <el-collapse-item title="发布人" name="2">
                <businessCard v-if="publisher.length>0" :cardList="publisher"></businessCard>
                <div v-else> 暂无数据 </div>
              </el-collapse-item>
              <el-collapse-item title="使用人" name="3"> -->
                <!--名片组件 删除和增加-->
                <!-- <businessCardEdit :cardList="user" :oneOrMore="'more'"  @toDelCard="toDelCard(arguments)" @toAddCard="toAddCard('user')"></businessCardEdit>
              </el-collapse-item>
              <el-collapse-item title="归口责任人" name="4">
                <businessCardEdit  :cardList="prncipal" :oneOrMore="'one'" :isParentNode="isParentNode" @toDelCard="toDelCard(arguments)" @toAddCard="toAddCard('prncipal')" v-if="isParentNode"></businessCardEdit>
                <businessCard v-else :cardList="prncipal"></businessCard> -->
                <!-- <div v-else> 暂无数据 </div> -->
                <!--                <businessCardEdit :cardList="prncipal" @toAddCard="toAddCard('prncipal')"></businessCardEdit>-->
              <!-- </el-collapse-item> -->
            <!-- </el-collapse> -->
          <!-- </el-tab-pane> -->
        <!-- </el-tabs> -->
      </div>
    <!-- </el-card> -->
    <!-- 关系信息弹窗 -->
    <el-dialog append-to-body :visible.sync="bReferenceIsVisible" class="relationTip" @close="closeReFer">
      <div slot="title">
        请选择参考来源
      </div>
      <div>
        <el-form :inline="true" >
          <el-col :span="11">
            <el-form-item label="关系类型：" label-width="60px">
              <el-select @change="selectRelationType" v-model="referSource.fromClassifierId" placeholder="请选择" size="mini" clearable>
                <el-option v-for="(item, index) in relationList" :key="index"
                           :value="item.fromClassifierId" :label="item.relationshipName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-left:15px;">
            <el-form-item label="关键字：" label-width="50px" class="input">
              <el-input v-model="referSource.keyWord"
                        placeholder="请输入标准代码/名称" size="mini" clearable
                        @keyup.enter.native="handleCurrentChangeRefer(1)"
              > <i slot="suffix" style="cursor: pointer"  class="el-input__icon el-icon-search" @click="handleCurrentChangeRefer(1)"></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <el-table v-loading="referSource.bLoading" :data="referSource.tableData" border size="small" :header-cell-style="{background:'#f8f8f9',textAlign:'center'}" :cell-style="referClass"
                @row-click="clickReferTable"
      >
        <el-table-column property="code" label="标准代码" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="name" label="标准名称" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column property="classifierName" label="标准类型" show-overflow-tooltip></el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:30px;" v-if="referSource.tableData.length>0">
        <el-pagination
            @size-change="handleSizeChangeRefer"
            @current-change="handleCurrentChangeRefer"
            :current-page="referSource.oPage.pageCurrent"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="referSource.oPage.pageSize"
            background
            layout="total, sizes, prev, pager, next"
            :total="referSource.oPage.total">
        </el-pagination>
      </div>
      <div style="margin-top:50px;">
        <span style="font-size:13px;">已选择：</span>
        <!--        <el-tag closable effect="plain" size="small">复用维度1</el-tag>-->
        <div v-show="referSource.referTag.length > 0">
          <el-tag style="margin-left: 5px;margin-top: 5px;"
                  v-for="(item, index) in referSource.referTag"
                  :key="index"
                  v-show="referSource.referTag.length > 0"
                  @close="closeReferTag(item, index)"
                  closable
                  effect="plain"
                  size="mini"
          >{{item.name}}</el-tag>
        </div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" size="small" @click="toSaveReference">确定</el-button>
      </div>
    </el-dialog>

    <!-- 认责信息  新增弹窗 -->
    <el-dialog append-to-body :visible.sync="bIsUserVisible" class="duty-dialog">
      <div slot="title">请选择用户</div>
      <div>
        <!-- <div class="tag-box" style>
          <span>已选择：</span>
          <el-tag size="small" @close="closeTag(item)" closable type="info"
                  v-for="item in oUser.aChoiceTag"
                  :key="item.userId"
          > {{ item.title }}</el-tag>
        </div> -->
        <div class="tag-box" v-if="oUser.aChoiceTag.length>0&&!whichAccount">
          <span>已选择：</span><el-tag size="small" @close="closeTag(item)" closable type="info" v-for="item in oUser.aChoiceTag" :key="item.userId">
            {{ item.title }}
          </el-tag>
        </div>
        <div class="tag-box" v-if="oUser.filterSponsorData&&whichAccount">
          <span>已选择：</span><el-tag size="small" @close="closeTag(item)" closable type="info">
            {{ oUser.filterSponsorData.title }}
          </el-tag>
        </div>
        <div class="tree-box">
          <el-input @input="toSearch" v-model="oUser.sKeyword" size="small" class="tree-box_input" placeholder="请输入姓名..." suffix-icon="el-icon-search" clearable></el-input>
          <!--使用人-->
          <el-tree
              v-if="oUser.treeSelect.length === 0"
              :props="userProps"
              :data="userData"
              ref="tree"
              node-key="userId"
              @node-click="handleTreeNodeClick"
              style="height: 200px;overflow:auto;"
          ></el-tree>
          <!-- 责任人
          <el-tree
              v-if="oUser.treeSelect.length === 0&&!userFlag"
              :props="userProps"
              :data="prncipalData"
              ref="tree"
              node-key="userId"
              @node-click="handleTreeNodeClick"
          ></el-tree> -->
          <!--通过input搜索后，展示的div结构-->
          <div class="tree-select-div people" v-if="oUser.treeSelect.length>0">
            <div v-for="select in oUser.treeSelect" :key="select.userId" class="item">
              <p @click="handleTreeNodeClick(select)">
                {{select.title}}  （ {{ select.parent }} )
              </p>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" size="mini" @click="toSaveUser">确定</el-button>
      </div>
    </el-dialog>

    <!--业务术语-->
    <termsDialog :bIsVisible="bIsTermsVisible" @toSaveTerms="toSaveTerms" @close="close"></termsDialog>

    <!--相同标准名称 提示框-->
    <div class="check-instance-name">
      <el-dialog append-to-body title="提示" :visible.sync="showSames">
        <template slot="title">
          <i class="el-icon-info" style="color: rgb(92,182,255); margin-right: 5px;"></i>提示
        </template>
        <p>在以下目录下发现相同标准名称：</p>
        <ul class="dialog-ul">
          <li v-for="(item, index) in sameList" :key="index">
            {{item.path}}
            <el-button @click="toSeeDetail(item)" type="text">查看</el-button>
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showSames = false">取 消</el-button>
          <el-button type="primary" @click="isToSaveInfoItem">确 定</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import businessCardEdit from "../../../common/businessCardEdit";
  import businessCard from "../../../common/businessCard";
  import opinionInputType from "../../../common/opinionInputType";
  // import opinionInputType from "@/views/common/opinionInputType";
  import termsDialog from "../../../common/termsDialog";
  import bus from '@/utils/bus'
  import { get, post, postByJson, parseAjaxResponse } from '../../../../utils/request'
  import pinyin from 'pinyin'

  export default {
    name: "masterDataEdit",
    components: {
      businessCardEdit,
      businessCard,
      opinionInputType,
      termsDialog
    },
    data() {
      const checkInstanceName = (rule, value, callback) => {
        if (this.baseInfoRuleForm.INSTANCE_NAME === "") {
          callback(new Error("请输入标准名称"));
        } else {
          let params = {
            instanceId: this.instanceId,
            instanceName: this.baseInfoRuleForm.INSTANCE_NAME,
            parentId: this.parentId
          };
          // 判断某一目录下或者不同目录下信息项的名字是否重复 /masterData/checkStandardNameIsExist
          get("/masterData/checkStandardNameIsExist", params).then(
            res => {
              console.log(res);
              if (res.code === 10000 && res.success) {
                if (res.data.length > 0) {
                  // 不同目录下有重名的
                  this.showSames = true;
                  this.sameList = res.data;
                  callback();
                } else {
                  // 无重复 清空sameList，showSames不显示
                  this.showSames = false;
                  this.sameList = []
                  callback();
                }
              } else {
                // 相同目录下有重名的
                this.showSames = false;
                this.sameList = []
                callback(new Error(res.message));
              }
            }
          );
        }
      };
      return {
        bIsToSaveInfoItem: false,
        showSames: false, // 是否显示 相同标准名称 的提示框
        parentId: "",
        isParentNode: false,
        whichAccount: false,
        sameList: [],
        lockObj: {
          lock: false,
          first: true
        },
        eIndex: null, // 记录英文名称对应下标

        // 选择用户对话框是否可见
        bIsUserVisible: false,
        props: {
          label: "name",
          children: "zones",
          isLeaf: "leaf"
        },

        userProps: {
          children: 'children',
          label: 'title'
          // isLeaf: 'leaf',
        },
        userData: [], // 使用人数据
        userFlag: false,
        prncipalData: [], // 归口责任人数据
        prncipalFlag: false,

        // 使用人数据
        oUser: {
          sKeyword: '', // 使用人input搜索变量
          aChoiceTag: [],
          aChoiceTagId: [],
          filterSponsorData: null,
          pfilterSponsorData: null,
          treeSelect: []
        },

        activeName: 'first',
        aBaseInfoActiveNames: ['1', '2'],
        // 认责默认折叠
        confessActiveNames: ["1", "2", "3", "4"],
        bReferenceIsVisible: false, // 新增参考来源
        dialogTableVisible3: false,
        // 基本信息-业务属性
        baseInfoRuleForm: {
          INSTANCE_NAME: "", // 标准名称
          STRING_3: "", // 英文名称
          NAMESPACE: "", // 目录
          STRING_2: "", // 发布状态
          STRING_4: "", // 是否必填
          STRING_5: "", // 业务定义
          STRING_7: "", // 关键属性
          STRING_8: "", // 数据类型
          STRING_9: "", // 缩写
          STRING_10: ""// 取值范围
        },
        // 基本信息-技术属性
        baseInfoRuleForm2: {
          STRING_11: '', // 数据长度
          STRING_12: '', // 数据精度
          STRING_13: '', // 数据展示格式
          STRING_14: '', // ID及代码编码规则
          STRING_15: '' // 数据单位
        },
        rules: {
          INSTANCE_NAME: [{ validator: checkInstanceName, trigger: "blur" }]
        },
        rules2: {},
        relationData: {
          tableData: [],
          oPage: {
            pageCurrent: 1,
            pageSize: 10,
            total: 10
          }
        },

        // 参考来源弹窗数据
        referSource: {
          fromClassifierId: '',
          relationshipId: "",
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
        aMaster: [], // 参考来源 - 主数据与主数据
        aBizTerm: [], // 参考来源 - 主数据与业务术语

        relationList: [],
        selectReferenceList: [],

        selectUser: {
          select: [],
          wKeyword: '',
          problemTakerData: [],
          treeSelect: []

        },
        // 创建人列表 （单选，编辑时不可操作此项）
        creator: [
          // {
          //   userName: "林老师",
          //   mobilePhone: "1222233",
          //   email: "100@2222.com"
          // }
        ],
        // 发布人列表 （单选，编辑时不可操作此项）
        publisher: [],
        // 使用人列表 （多选）
        user: [],
        // 责任人列表 （单选，编辑时不可操作此项）
        prncipal: [],
        bIsShowCatalogTree: false,
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        instanceId: '',
        classifierId: '',
        params: {},
        titleName: '',
        users: '', // array[string]
        prncipals: '', // string

        inputData: [], // 业务属性
        inputData2: [], // 技术属性
        fullPath: {
          name: '',
          id: ''
        },
        // 业务术语id
        buzTermId: '',
        // 业务术语 对话框是否可见
        bIsTermsVisible: false,

        // 标准的英文名属性存放的列名
        sEnName: '',
        // 业务术语影响的属性
        oBizTerm: {
          sCnName: '', // 标准名称
          sEnName: '', // 英文名称
          sBusinessDef: '', // 业务定义
          sDataType: '', // 数据类型
          acronym: ''// 缩写
        },

        // 跳转常量
        toDetailsConst: {
          toBizTerm: 'BizTermInfoItem', // 业务术语
          toMasterData: 'MasterDataInfoItem', // 主数据
          toIndex: '', // 指标管理
          toDimensionality: 'DimentsionInfoItem', // 维度管理
          toPublicCode: 'PublicCodeInfoItem' // 公共代码

        },
        eIndex2: null
      }
    },
    watch: {
      // 监听 选择用户对话框可见变量
      bIsUserVisible(val) {
        if (!val) { // 清空选择用户的 搜索框和搜索后的数组
          this.oUser.treeSelect = [];
          this.oUser.sKeyword = '';
        }
      }
      // 'baseInfoRuleForm.INSTANCE_NAME': {
      //   handler: function (val, oldVal) {
      //     if (!this.lockObj.first) {
      //       get('/ds/bizTerm/queryHomologousEnVocabularies', { cnTerm: val }).then(res => {
      //         if (res.code === 10000) {
      //           this.$set(this.inputData[this.eIndex], 'attrValue', res.data[0])
      //           // console.log(this.inputData[this.eIndex], ' index')
      //         }
      //       })
      //     } else {
      //       this.lockObj.first = false;
      //     }
      //   },
      //   deep: true
      // }
    },
    methods: {
      toSeeDetail(row) {
        this.showSames = false
        this.$emit('hiddenDialog')
        this.$router.push({
          name: "masterDataDetails",
          params: {
            id: row.id,
            classifierId: row.classifierId,
            _title: row.name,
            headerTitle: row.name
          }
        });
      },
      // 获取标准的英文名属性存放的列名 /dsm/getEnNameStoreColumn
      getEnNameStoreColumn() {
        get('/dsm/getEnNameStoreColumn', {
          classifierId: this.classifierId // 数据标准类型
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.sEnName = res.data
            }
          })
        })
      },
      // 获取业务术语影响的属性 /dsm/listBizTermInfoItemAttrStoreColumn
      getListBizTermInfoItemAttrStoreColumn() {
        get('/dsm/listBizTermInfoItemAttrStoreColumn', {
          classifierId: this.classifierId // 数据标准类型
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              res.data.forEach((item, index) => {
                if (item.attStore === "INSTANCE_NAME") {
                  this.oBizTerm.sCnName = item.attStore;
                } else if (item.attStore === "STRING_3") {
                  this.oBizTerm.sEnName = item.attStore;
                } else if (item.attStore === "STRING_5") {
                  this.oBizTerm.sBusinessDef = item.attStore;
                } else if (item.attStore === "STRING_8") {
                  this.oBizTerm.sDataType = item.attStore;
                } else if (item.attStore === "STRING_9") {
                  this.oBizTerm.acronym = item.attStore;
                }
              })
            }
          })
        })
      },

      // 获取主数据详情信息 /masterData/getMasterDataDetail
      getMasterDataDetail() {
        get('/masterData/getMasterDataDetail', {
          id: this.instanceId
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000 && res.success) {
              let key1 = '';
              let key2 = '';
              res.data.basicInfo.forEach((item, index) => {
                if (item.attrName === '全路径Ids' || item.belongs === '基本属性' || item.belongs === '业务属性' || item.belongs === '管理属性') {
                  this.inputData.push(item)
                } else if (item.belongs === '技术属性') {
                  this.inputData2.push(item)
                }
                if (item.attrName === '全路径Ids') {
                  key1 = index
                } else if (item.attrName === '上下文路径') {
                  key2 = index
                }
              })
              // 上下文路径的值 （初始化进入页面时，是全路径ids的值）
              if (key1 && key2) {
                this.inputData[key2].namespace = this.inputData[key1].attrValue.substring(0, this.inputData[key1].attrValue.lastIndexOf('/'));
                // console.log(this.inputData)
                this.fullPath.name = this.inputData[key1].columnName
                this.fullPath.id = this.inputData[key2].namespace
              }

              // let delIndex = ""
              // this.inputData.map((item, index) => {
              //   if (item.attrName === '上下文路径') {
              //     console.log(this.inputData, '123123')
              //     // item.columnName = this.fullPath.name
              //     this.$set(this.inputData[index], 'columnName', this.fullPath.name)
              //   } else if (item.attrName === '全路径Ids') {
              //     delIndex = index
              //   }
              // })
              // this.inputData.splice(delIndex, 1)

              // 必填项验证
              this.inputData.map((val, index) => {
                if (val.columnName) {
                  this.baseInfoRuleForm[val.columnName] = val.attrValue;
                  // bus.$on(val.columnName, (e) => {
                  //   this.baseInfoRuleForm[val.columnName] = e;
                  // })
                }
                if (val.columnName === this.sEnName) { // 英文名称
                  this.eIndex = index;
                } else if (val.columnName === this.oBizTerm.acronym) {
                  this.eIndex2 = index;
                }
                if (val.nullable === false && val.columnName !== 'INSTANCE_NAME') {
                  console.log(val.columnName, 'val.columnName')
                  this.$set(this.rules, val.columnName, [{ required: true, message: '请输入' + val.attrName, trigger: 'blur' }])
                }
                // else if (val.nullable === false && val.columnName === 'INSTANCE_NAME') {
                //   this.$set(this.rules, val.columnName, [{ required: true }])
                //   console.log(val.columnName, 'val.columnName')
                // }
                this.lockObj.first = true
              })
              // 必填项验证 - 提示
              this.inputData2.map(val => {
                console.log(val)
                if (val.nullable === false && val.columnName !== 'INSTANCE_NAME') {
                  this.$set(this.rules2, val.columnName, [{ required: true, message: '请输入' + val.attrName, trigger: 'blur' }])
                }
              });
              this.parentId = res.data.parentId;

              bus.$on('columnName', (e) => {
                let key;
                let key2;
                for (key in this.baseInfoRuleForm) {
                  if (key === e.name) {
                    this.baseInfoRuleForm[e.name] = e.val;
                  }
                }
                for (key2 in this.baseInfoRuleForm2) {
                  if (key2 === e.name) {
                    this.baseInfoRuleForm2[e.name] = e.val;
                  }
                }
                if (e.name === this.oBizTerm.sCnName) {
                  if (!this.lockObj.first) {
                    get('/ds/bizTerm/queryHomologousEnVocabularies', { cnTerm: e.val }).then(res => {
                      if (res.code === 10000 && res.success) {
                        this.$set(this.inputData[this.eIndex], 'attrValue', res.data[0]);
                        this.$set(this.inputData[this.eIndex2], 'attrValue', res.data[1])
                      }
                    })
                  } else {
                    this.lockObj.first = false;
                  }
                }
                // console.log(e)
              })

              /* 关关系信息 - 参考*/
              this.relationData.tableData = res.data.relationship.referenceInfos.records
              this.relationData.oPage.pageCurrent = res.data.relationship.referenceInfos.current
              this.relationData.oPage.total = res.data.relationship.referenceInfos.total
              this.isParentNode = res.data.accusationInfos.supIsParentIndex;
            }
            console.log(this.inputData, 'inputData')
          })
        })
      },
      // 保存主数据基本信息 /masterData/saveBasicInfo
      saveBasicInfo() {
        // 必填项验证
        console.log(this.baseInfoRuleForm2, this.baseInfoRuleForm)
        console.log(this.rules)
        this.$refs.baseInfoRuleForm.validate((valid) => {
          this.$refs.baseInfoRuleForm2.validate((valid2) => {
            if (valid && valid2) {
              this.bIsToSaveInfoItem = true
              if (this.sameList.length > 0) {
                this.showSames = true;
              } else {
                this.showSames = false
                this.isToSaveInfoItem()
              }
            } else {
              return false
            }
          })
        })
      },
      // 相同标准名称 提示框 - 确定
      isToSaveInfoItem() {
        if (this.bIsToSaveInfoItem) {
          this.postBasicInfos();
        }
        this.showSames = false;
        this.bIsToSaveInfoItem = false
      },
      postBasicInfos() {
        let params = []
        this.inputData.map(val => {
          let aObj = {}
          if (val.attrName === '上下文路径') {
            if (this.$refs['input_' + val.columnName][0].inputData) {
              aObj = {
                key: this.fullPath.name,
                value: this.$refs['input_' + val.columnName][0].inputData
              }
            } else {
              aObj = {
                key: this.fullPath.name,
                value: this.fullPath.id
              }
            }
          } else if (val.attrName !== '全路径Ids') {
            aObj = {
              key: val.columnName,
              value: this.$refs['input_' + val.columnName][0].inputData
            }
          }
          params.push(aObj);
        })
        params.forEach((item, index) => {
          if (item.key === undefined) {
            params.splice(index, 1)
          }
        })
        this.inputData2.map(val => {
          let bObj = {
            key: val.columnName,
            value: this.$refs['input_' + val.columnName][0].inputData
          }
          params.push(bObj);
        })
        // 增加 - 业务术语 键值对
        params.push({
          key: 'BIZTERM_ID',
          value: this.buzTermId
        })
        console.log(params)
        postByJson('/masterData/saveBasicInfo', params).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.$message.success(res.message)
              // 关闭编辑页面
              // this.closeSelectedTag(this.$route)
              // 跳转到主数据入口页面
              // this.$router.push({ name: "masterData" });
              this.$emit('getEditInfo')
            }
          })
        })
      },

      /* 关闭tag*/
      isActive(route) {
        return route.path === this.$route.path
      },
      closeSelectedTag(view) {
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          if (this.isActive(view)) {
            const latestView = views.slice(-1)[0]
            if (latestView) {
              this.$router.push(latestView)
            } else {
              this.$router.push(this.$route.path)
            }
          }
        })
      },

      // 获取参考信息 /masterData/listReference
      getListReferenceInfos() { // 参考
        get('/masterData/listReference', {
          id: this.instanceId,
          current: this.relationData.oPage.pageCurrent,
          size: this.relationData.oPage.pageSize
        }).then((res) => {
          parseAjaxResponse(res, () => {
            // 参考
            this.relationData.tableData = res.data.records
            this.relationData.oPage.pageCurrent = res.data.current
            this.relationData.oPage.total = res.data.total
          })
        })
      },
      // 参考来源-关系类型下拉框  /ds/listUsageRelationshipByToCId 根据目标元模型id获取标准规则可用的关系 供下拉框使用
      getRelationList() {
        get("/ds/listUsageRelationshipByToCId", {
          toClassifierId: this.classifierId
        }).then(res => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.relationList = res.data;
            }
          })
        })
      },
      // 参考来源 列表数据
      getReferSource() {
        this.referSource.bLoading = true
        get("/ds/listReferenceInfo", {
          toInstanceId: this.instanceId,
          keyword: this.referSource.keyWord,
          fromClassifierId: this.referSource.fromClassifierId,
          pageCurrent: this.referSource.oPage.pageCurrent,
          pageSize: this.referSource.oPage.pageSize
        }).then(res => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000 && res.success) {
              this.referSource.tableData = res.data.records.map(item => {
                item.click = false;
                // 每一个item数据 增加关系类型字段
                item.relationship = this.referSource.relationshipId
                return item;
              });
              this.referSource.oPage.total = res.data.total;
              this.referSource.bLoading = false
            }
          })
        });
      },

      // 获取标准认责信息 /ds/listAccountability
      getListAccountability() {
        post('/ds/listAccountability', {
          instanceId: this.instanceId
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.creator = res.data.creator
              this.publisher = res.data.publisher
              this.user = res.data.user
              this.prncipal = res.data.prncipal;
              this.oUser.aChoiceTag = [];
              this.oUser.aChoiceTagId = [];
              this.user.map(val => {
                let obj = {
                  title: val.username,
                  userId: val.userId
                }
                this.oUser.aChoiceTag.push(obj)
                this.oUser.aChoiceTagId.push(val.userId)
              })
              this.oUser.filterSponsorData = null;
              this.oUser.pfilterSponsorData = null;
              this.prncipal.map(val => {
                let obj = {
                  title: val.username,
                  userId: val.userId
                }
                this.oUser.filterSponsorData = obj;
                this.oUser.pfilterSponsorData = obj.userId;
              })
            }
          })
        })
      },
      // 修改标准认责信息 /ds/editAccountability
      getEditAccountability() {
        let users = []
        this.user.forEach((item) => {
          if (item.userId) {
            users.push(item.userId)
          }
        })
        post('/ds/editAccountability', {
          instanceId: this.instanceId,
          users: users.join(',')
          // prncipals: this.prncipal[0].userId //责任人不让修改了
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.$message.success(res.message)
              this.getListAccountability()
            }
          })
        })
      },
      // 获取用户按机构分组 /sys/user/listUserByGroup
      getListUserByGroup() {
        get('/sys/user/listUserByGroup').then((res) => {
          parseAjaxResponse(res, () => {
            // console.log('listUserByGroup')
            // console.log(res)
            let resData = res.data;
            // 使用人
            this.userData = resData.map(child => {
              // if(child.users[0].userId !== undefined) {
              return {
                title: child.groupName,
                expand: false,
                // leaf: false,
                children: child.users.map(function (child2) {
                  return {
                    title: child2.userName,
                    userId: child2.userId
                  }
                })
              }
              // }else{
              //   return {
              //     title: child.groupName,
              //     // leaf: true, //部门下面没有数据，当前部门是叶子节点
              //   }
              // }
            });
            // 责任人
            this.prncipalData = resData.map(child => {
              return {
                title: child.groupName,
                expand: false,
                children: child.users.map(function (child2) {
                  return {
                    title: child2.userName,
                    userId: child2.userId
                  }
                })
              }
            });
          })
        })
      },

      // 保存
      toSave() {
        // console.log(this.activeName)
        // if (this.activeName === 'first') { // 修改基本信息
        this.saveBasicInfo()
        // } else if (this.activeName === 'second') { // 修改关系信息

        // }
        // else if (this.activeName === 'third') { // 修改认责信息
        //   // console.log(this.user)
        //   this.getEditAccountability()
        // }
      },

      // 取消
      toCancel() {
        // 关闭编辑页面
        this.closeSelectedTag(this.$route)
        // 跳转到主数据入口页面
        this.$router.push({ name: "masterData" });
      },

      handleNodeClick(data) {
        // console.log(data);
        this.baseInfoRuleForm.catalog = data.label
      },

      // 删除用户
      toDelCard(item) {
        // console.log(item)
        let data = item[0];
        let which = item[1];
        if (which === 'one') {
          this.oUser.filterSponsorData = null;
          this.oUser.pfilterSponsorData = null;
        } else if (which === 'more') {
          this.oUser.aChoiceTag.splice(this.oUser.aChoiceTagId.indexOf(data.userId), 1);
          this.oUser.aChoiceTagId.splice(this.oUser.aChoiceTagId.indexOf(data.userId), 1);
          // this.accusationData.userList.map((val, index) => {
          //   if (tag.userId === val.userId) {
          //     this.accusationData.userList.splice(index, 1);
          //     return
          //   }
          // })
        }
        this.toSaveUser();
        // this.getEditAccountability()
      },
      toAddCard(str) {
        if (str === "user") {
          // this.userFlag = true
          // this.prncipalFlag = false
          this.whichAccount = false;
        } else if (str === 'prncipal') {
          // if (this.prncipal.length === 1) {
          //   this.$message.warning('责任人单选，请删除当前责任人再增加')
          //   return
          // }
          // this.userFlag = false
          // this.prncipalFlag = true
          this.whichAccount = true;
        }
        this.bIsUserVisible = true
        // this.oUser.aChoiceTag = []
        // this.oUser.aChoiceTagId = []
        // 根据使用人列表，填充选择用户对话框的tag
        // if (this.user.length > 0) {
        //   this.user.forEach((item, index) => {
        //     this.oUser.aChoiceTag.push({
        //       title: item.username,
        //       userId: item.userId
        //     })
        //     this.oUser.aChoiceTagId.push(item.userId)
        //   })
        // }
        // 获取用户
        this.getListUserByGroup()
      },

      // 关闭tags
      closeTag(item) {
        // console.log(item);
        let index = this.oUser.aChoiceTag.indexOf(item)
        this.oUser.aChoiceTag.splice(index, 1)
        this.oUser.aChoiceTagId.splice(index, 1)
      },
      // tree树节点，点击事件
      handleTreeNodeClick(data) {
        // console.log(data)
        const that = this;
        // console.log(data)
        if (data) {
          if (data.userId !== undefined && !this.whichAccount) { // 点击parent层，不添加数据
          // 使用人 多选
            if (that.oUser.aChoiceTagId.indexOf(data.userId) === -1) {
              that.oUser.aChoiceTag.push(data);
              that.oUser.aChoiceTagId.push(data.userId);
            }
            // let isAddToTag = true
            // this.oUser.aChoiceTag.forEach((item, index) => {
            //   if (item.userId === data.userId) {
            //     isAddToTag = false
            //   }
            // })
            // if (isAddToTag) {
            //   this.oUser.aChoiceTag.push(data)
            // // this.oUser.aChoiceTagId.push(data.userId)
            // }
          } else if (data.userId !== undefined && this.whichAccount) {
            this.oUser.filterSponsorData = data;
            this.oUser.pfilterSponsorData = data.userId;
          }
        }
      },
      // 选择用户 - 确定
      toSaveUser() {
        let params = {
          instanceId: this.instanceId,
          users: this.oUser.aChoiceTagId.join(','),
          prncipals: this.oUser.pfilterSponsorData
        }
        post('/ds/editAccountability', params).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.bIsUserVisible = false;
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.getListAccountability()
          } else {
            this.$message.error(res.message);
          }
        })
        // this.oUser.aChoiceTag.forEach((item) => {
        //   item.username = item.title
        // })
        // if (this.userFlag) {
        //   let toAddArr = []
        //   if (this.user.length > 0) {
        //     this.oUser.aChoiceTag.forEach((item, index) => {
        //       if (this.oUser.aChoiceTagId.indexOf(item.userId) === -1) {
        //         toAddArr.push(item)
        //       }
        //     })
        //     this.user = this.user.concat(toAddArr)
        //     if (this.oUser.aChoiceTag.length < this.user.length) {
        //       this.user = this.oUser.aChoiceTag
        //     }
        //   } else {
        //     this.user = this.user.concat(this.oUser.aChoiceTag)
        //   }
        //   // 保存修改 调用接口
        //   this.getEditAccountability()
        // } else if (this.prncipalFlag) {
        //   if (this.oUser.aChoiceTag.length > 1) {
        //     this.$message.warning('责任人单选，请仅选择一个')
        //     return
        //   }
        //   this.prncipal = this.oUser.aChoiceTag
        // }
        // this.bIsUserVisible = false
      },

      // 显示选择目录的tree
      toShowCatalogTree() {
        this.bIsShowCatalogTree = !this.bIsShowCatalogTree
      },

      toAddReference() {
        this.bReferenceIsVisible = true
        this.getRelationList()
      },
      // 删除
      delReference() {
        let list = [];
        if (this.selectReferenceList.length > 0) {
          this.$confirm("确定删除选中数据吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.selectReferenceList.map(item => {
                list.push(item.id);
              });
              let msg = {
                fromIds: list.join(","),
                toId: this.instanceId
              };
              // 删除参考信息 /ds/removeReferenceInfo
              post("/ds/removeReferenceInfo", msg).then(res => {
                parseAjaxResponse(res, () => {
                  if (res.code === 10000 && res.success) {
                    this.$message.success(res.message);
                    this.getListReferenceInfos();
                  }
                })
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        } else {
          this.$message.warning('请勾选需要删除的数据')
        }
      },

      toSaveReference() {
        let msg = [];
        this.referSource.referTag.map(item => {
          // console.log(item);
          msg.push({
            fromInstanceClassifierId: item.classifierId, // 源规则类型
            fromInstanceId: item.id, // 源规则id
            relationship: item.relationship, // 关系类型
            toInstanceClassifierId: this.classifierId, // 目标规则类型
            toInstanceId: this.instanceId
          });
        });
        // console.log(msg)
        postByJson("/ds/createReferenceInfo", msg).then(res => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000 && res.success) {
              this.$message.success(res.message);
              this.bReferenceIsVisible = false
              // 清空
              this.referSource.referTag = []
              this.referSource.tableData.forEach(i => {
                i.click = false;
              });
              // 刷新参考列表
              this.getListReferenceInfos();
            }
          })
        })
      },
      toSearch() {
        // console.log(this.oUser.sKeyword)
        var str
        var pattern = new RegExp("[\u4E00-\u9FA5]+");
        var pattern2 = new RegExp("[A-Za-z]+");
        if (pattern.test(this.oUser.sKeyword)) {
          str = '中文'
        } else if (pattern2.test(this.oUser.sKeyword)) {
          str = '英文'
        }
        if (str === '英文') {
          this.enSearch()
        } else if (str === '中文') {
          this.cnSearch();
        }
      },
      // 英文搜索
      enSearch() {
        this.oUser.sKeyword = this.oUser.sKeyword.toLowerCase();
        let res = this.userData;
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
        // console.log(res)
        res.map(val => {
          if (this.oUser.sKeyword) {
            if (val.spname.indexOf(this.oUser.sKeyword) !== -1) {
              if (val.children.length > 0 && val.children[0].title !== undefined) {
                for (let i = 0; i < val.children.length; i++) {
                  let n = val.children[i];
                  n.parent = val.title;
                  selectArr.push(n)
                }
              }
            } else if (val.pname.indexOf(this.oUser.sKeyword) !== -1) {
              let bool = false;
              for (let m = 0; m < val.spname.length; m++) {
                if (this.oUser.sKeyword[0] === val.spname[m]) {
                  bool = true
                }
              }
              // console.log(bool)
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
                  if (item.pname.indexOf(this.oUser.sKeyword) !== -1) {
                    let bool = false;
                    for (let m = 0; m < item.spname.length; m++) {
                      if (this.oUser.sKeyword[0] === item.spname[m]) {
                        bool = true
                      }
                    }

                    if (bool) {
                      let n = item;
                      n.parent = val.title;
                      selectArr.push(n)
                    }
                  } else if (item.spname.indexOf(this.oUser.sKeyword) !== -1) {
                    let n = item;
                    n.parent = val.title;
                    selectArr.push(n)
                  }
                })
              }
            }
          }
        })
        // console.log(selectArr)
        this.oUser.treeSelect = selectArr;
      },
      // 中文搜索
      cnSearch() {
        let selectArr = [];
        let res = this.userData;
        // console.log(res)
        res.map(val => {
          if (this.oUser.sKeyword) {
            if (val.title.indexOf(this.oUser.sKeyword) > -1) {
              for (let i = 0; i < val.children.length; i++) {
                if (val.children[i].title) {
                  selectArr.push({
                    title: val.children[i].title,
                    userId: val.children[i].userId,
                    parent: val.title,
                    hasAuthority: val.children[i].hasAuthority
                  });
                }
              }
            } else {
              let child = val.children;
              child.map(item => {
                if (item.title && item.title.indexOf(this.oUser.sKeyword) > -1) {
                  selectArr.push({
                    title: item['title'],
                    userId: item['userId'],
                    parent: val['title'],
                    hasAuthority: item.hasAuthority
                  });
                }
              })
            }
          }
        })
        // console.log(selectArr);
        this.oUser.treeSelect = selectArr;
      },

      sure() {},
      handleClick(tab, event) {
        if (tab.name === 'second') { // 关系信息

        } else if (tab.name === 'third') { // 认责信息
          this.getListAccountability()
        }
      },

      handleSelectionChange(val) {
        this.selectReferenceList = val
      },
      handleClose(tag) {

      },
      closeReFer() {
        // 清空
        this.referSource.referTag = []
        this.referSource.tableData.forEach(i => {
          i.click = false;
        });
      },
      // 选择  关系类型
      selectRelationType(val) {
        console.log(val);
        this.relationList.forEach((item) => {
          if (val === item.fromClassifierId) {
            this.referSource.relationshipId = item.relationshipId
          }
        })
        // 当前页设置为 1
        this.referSource.oPage.pageCurrent = 1
        this.getReferSource();
      },
      // 跳转到详情页
      toDetails (row) {
        // console.log(row)
        if (row.classifierId === this.toDetailsConst.toBizTerm) { // 业务术语
          // 跳转到 业务术语详情
          this.$router.push({
            name: 'professionalDetail',
            params: {
              id: row.id,
              _title: row.name,
              name: row.name
            }
          })
        } else if (row.classifierId === this.toDetailsConst.toMasterData) { // 主数据
          // 跳转到 主数据详情
          this.$router.push({
            name: 'masterDataDetails',
            params: {
              id: row.id,
              classifierId: row.classifierId,
              _title: row.name,
              headerTitle: row.name
            }
          })
        } else if (row.classifierId === this.toDetailsConst.toPublicCode) { // 公共代码
          // 跳转到 主数据详情
          this.$router.push({
            name: 'commonCode',
            params: {
              id: row.id,
              classifierId: row.classifierId,
              _title: row.name,
              headerTitle: row.name
            }
          })
        }
      },

      handleSizeChange(val) {
        this.relationData.oPage.pageSize = val
        this.getListReferenceInfos()
      },
      handleCurrentChange(val) {
        this.relationData.oPage.pageCurrent = val
        this.getListReferenceInfos()
      },

      // 点击参考来源 每一行
      clickReferTable(row, column, event) {
        // 主数据与主数据、主数据与业务术语 单选
        if (this.referSource.fromClassifierId === 'MasterDataInfoItem') {
          this.referSource.tableData.map(item => {
            if (item.id === row.id) {
              item.click = true;
            } else {
              item.click = false;
            }
            return item;
          });
          if (!this.aMaster.includes(row)) {
            this.aMaster.splice(0, 1, row);
          }
          let sIndex = null
          this.referSource.referTag.find((item, index) => {
            if (item.classifierId === "MasterDataInfoItem") {
              sIndex = index
              return sIndex
            }
          })
          if (sIndex !== null) {
            this.referSource.referTag.splice(sIndex, 1, this.aMaster[0])
          } else {
            this.referSource.referTag.push(this.aMaster[0])
          }
        }
        // 主数据与业务术语 单选
        if (this.referSource.fromClassifierId === 'BizTermInfoItem') {
          this.referSource.tableData.map(item => {
            if (item.id === row.id) {
              item.click = true;
            } else {
              item.click = false;
            }
            return item;
          });
          if (!this.aBizTerm.includes(row)) {
            this.aBizTerm.splice(0, 1, row);
          }
          let sIndex = null
          this.referSource.referTag.find((item, index) => {
            if (item.classifierId === "BizTermInfoItem") {
              sIndex = index
              return sIndex
            }
          })
          if (sIndex !== null) {
            this.referSource.referTag.splice(sIndex, 1, this.aBizTerm[0])
          } else {
            this.referSource.referTag.push(this.aBizTerm[0])
          }
        }
        // 主数据与公共代码 多选
        if (this.referSource.fromClassifierId === 'PublicCodeInfoItem') {
          this.referSource.tableData.map(item => {
            if (item.id === row.id) {
              item.click = true;
            }
            return item;
          });
          let isHas = false
          this.referSource.referTag.find((item, index) => {
            if (item.id === row.id) {
              isHas = true
            }
          })
          if (!isHas) {
            this.referSource.referTag.push(row);
          }
        }
      },
      // 参考来源选中，改变背景颜色
      referClass({ row, column, rowIndex, columnIndex }) {
        // console.log(row);
        if (row.click) {
          return "background: #ecf5ff;";
        } else {
          return "";
        }
      },
      // 参考来源 - 删除选中tag
      closeReferTag(item, index) {
        this.referSource.tableData.map(i => {
          if (i.id === item.id) {
            i.click = false;
          }
          return i;
        });
        this.referSource.referTag.splice(index, 1);
      },
      // 参考来源 分页
      handleSizeChangeRefer(val) {
        this.referSource.oPage.pageSize = val
        this.getReferSource()
      },
      handleCurrentChangeRefer(val) {
        this.referSource.oPage.pageCurrent = val
        this.getReferSource()
      },

      // 弹出业务术语框
      toTerms() {
        this.bIsTermsVisible = true
      },
      // 业务术语 - 确定
      toSaveTerms(tagData) {
        console.log(tagData)
        console.log(this.inputData)
        if (tagData !== undefined) {
          this.buzTermId = tagData.id // 业务术语id
          // INSTANCE_NAME 中文名称
          // STRING_3 英文名称
          // STRING_5 业务定义
          // STRING_8 数据类型
          // STRING_10 取值范围

          // 填充页面数据
          this.inputData.forEach((item, index) => {
            if (item.columnName === this.oBizTerm.sCnName) { // 标准中文名称
              item.attrValue = tagData.name
            } else if (item.columnName === this.sEnName) { // 英文名称
              item.attrValue = tagData.code
            } else if (item.columnName === this.oBizTerm.sBusinessDef) { // 业务定义
              item.attrValue = tagData.businessDef
            } else if (item.columnName === this.oBizTerm.sDataType) { // 数据类型
              let key = null;
              tagData.attributes.map((val, k) => {
                if (val.attrStore === 'string4') {
                  key = k
                }
              })
              item.attrValue = tagData.attributes[key].value
            } else if (item.columnName === this.oBizTerm.acronym) {
              let key = null;
              tagData.attributes.map((val, k) => {
                if (val.attrStore === 'string3') {
                  key = k
                }
              })
              // console.log(key);
              this.$set(
                this.inputData[index],
                "attrValue",
                tagData.attributes[key].value
              );
              // item.attrValue = tagData.attributes[key].value
            } /* else if (item.columnName === 'STRING_10') { // 取值范围 （不回显了）
              item.attrValue = tagData.attributes[3].value
            }*/
          })
          this.bIsTermsVisible = false
        } else {
          this.$message.warning('请选择业务术语')
        }
      },
      close() {
        this.bIsTermsVisible = false
      },

      isClass({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          return 'text-align:center;border-right:none;'
        } else {
          return 'text-align:center;'
        }
      },
      isClass2({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          return 'tableClass'
        }
      },
      getParMsg(val) {
        this.params = val
        this.instanceId = val.id
        this.classifierId = val.classifierId
        this.titleName = val.name
        this.getMasterDataDetail()
        this.getEnNameStoreColumn()
        this.getListBizTermInfoItemAttrStoreColumn()
      }
    },
    mounted() {
      bus.$on('getNodeArr', (msg) => {
        console.log(msg === this.params.nodeList)
        if (msg === this.params.nodeList) {
          this.addNode = false
        } else {
          this.addNode = true
        }
        this.nodeList = msg
        if (this.nodeList && this.nodeList.length > 1 && this.nodeList[this.nodeList.length - 1].data) {
          this.parentId = this.nodeList[this.nodeList.length - 1].data.id;
          console.log(this.parentId)
        }
      })
    },
    beforeDestroy() {
      bus.$off('columnName')
      bus.$off('getNodeArr')
    },
    created() {
      // 基本信息-业务属性
      // let arr1 = [
      //   'INSTANCE_ID', // 标准ID
      //   'INSTANCE_NAME', // 标准名称
      //   'STRING_3', // 英文名称
      //   'NAMESPACE', // 目录
      //   'STRING_2', // 发布状态
      //   'STRING_4', // 是否必填
      //   'STRING_5', // 业务定义
      //   'STRING_7', // 关键属性
      //   'STRING_8', // 数据类型
      //   'STRING_9', // 缩写
      //   'STRING_10' // 取值范围
      // ]
      // arr1.map(val => {
      //   this.$set(this.baseInfoRuleForm, val, null)
      // })
      // // 基本信息-技术属性
      // let arr2 = [
      //   'STRING_11', // 数据长度
      //   'STRING_12', // 数据精度
      //   'STRING_13', // 数据展示格式
      //   'STRING_14', // ID及代码编码规则
      //   'STRING_15' // 数据单位
      // ]
      // arr2.map(val => {
      //   this.$set(this.baseInfoRuleForm2, val, null)
      // });

      // this.getMasterDataDetail()
      // this.getEnNameStoreColumn()
      // this.getListBizTermInfoItemAttrStoreColumn()
    }
  }
</script>
<style lang="scss" scoped>
  //外层card容器样式
  @import "./../../../../styles/dq/main-card-table.scss";
  $color-grey-light: #E0E0E0;
  $collapse-font-size: 18px;
  $color-font:#C0C4CC;
  $collapse-header-size: 14px;
  .editor-container{
    padding:12px;
    /deep/ .el-collapse-item__header {
      font-family: "PingFangSC-Regular", "PingFang SC";
      font-weight: 400;
      height: 30px;
      font-style: normal;
      font-size: $collapse-header-size;
      color: #666666;
      // padding: 0 20px;
      border-bottom: unset;
      margin-bottom: 10px;
    }
    /deep/ .el-collapse{
      border: unset;
    }
    /deep/ .el-collapse-item__wrap{
      border: unset;
    }
    // .el-card{
    //   padding: 25px 60px;
    //   /deep/ .el-card__header{
    //     padding:20px 20px 12px 20px;
    //   }
    //   /deep/ .el-card__body{
        .card-body{
          .el-tabs{
            .el-tabs__header{
              /*margin-left:15px;*/
              .el-tabs__nav-wrap::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 0!important;
                z-index: 1;
              }
              .el-tabs__item {
                /*height: 46px;*/
                /*width: 106px;*/
                /*line-height: 46px;*/
                /*text-align: center;*/
                /*padding: 0px;*/
              }
            }
            // .el-tabs__content{
              /*padding: 0 5px;*/
              .el-collapse{
                border: unset;
                // margin-top: 20px;
                .el-collapse-item .terms{
                  position: relative;
                  //业务术语图标
                  .professional-terms{
                    i{
                      background: url("../../../../assets/images/commonIcon/terms.png") no-repeat;
                      background-size: 18px 18px;
                      display: inline-block;
                      width: 18px;
                      height: 18px;
                      top: 7px;
                      left: 103px;
                      position: absolute;
                      cursor: pointer;
                    }
                  }
                }
                .el-collapse-item__header{
                  font-size: $collapse-font-size;
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
                  // padding: 20px 60px;
                  overflow: hidden;
                  padding: 20px;
                }
              }
              .el-form /deep/ .el-form-item{
                margin-bottom: 15px;
              }
              .relationship{
                .title{
                  border-bottom:1px solid $color-grey-light;
                  font-size: $collapse-font-size;
                  padding:20px 10px;
                }
                .title2{
                  border-bottom:1px solid $color-grey-light;
                  font-size: 14px;
                  padding:12px 10px;
                }
                .button{
                  padding:10px 10px;
                  .el-button--small{
                    font-size: 13px;
                    .svg-icon{
                      position:relative;
                    }
                  }
                  .zengjia{
                    padding:4px 10px 5.5px 10px;
                    .svg-icon{
                      width:15px;
                      height:15px;
                      top:1px;
                    }
                  }
                  .shanchu{
                    padding:4px 10px 6.5px 9px;
                    .svg-icon{
                      width:16px;
                      height:16px;
                      top:1px;
                    }
                  }
                }
                .table{
                  padding:0 8px;
                  /deep/ .tableClass{
                    border-right:none!important;
                  }
                }
              }
              .confess-account{
                .title{
                  border-bottom:1px solid $color-grey-light;
                  font-size: 16px;
                  padding:20px 15px;
                }
              }
            // }
          }
          //选择目录
          .selectButton:focus{
            border-color: #409EFF;
            background-color: unset;
          }
          .selectButton:hover{
            // color: #409EFF;
            border-color: $color-font;
            background-color: unset;
          }
          .tree{
            border:1px solid $color-font;
            border-top:none;
          }
          .el-dropdown{
            width:100%;
            position: relative;

          }
          .selectButton{
            width:100%;
            padding:20px;
            position: relative;
            span{
              position: absolute;
              width:100%;
              text-align: left;
              left:10px;
              top:50%;
              transform: translateY(-50%);
              color:$color-font;
              i{
                position: absolute;
                right:20px;
              }
            }
          }

        // }
      // }
    // }
    .relationTip{
      /deep/ .el-dialog{
        width: 660px;
      }
      .el-dialog__header{
        padding: 20px 25px 10px;
        div{
          font-weight: 600;
          color:#666;
        }
      }
      /deep/ .el-dialog__body{
        padding:30px 20px 15px!important;
        .el-form-item{
          margin-right:0px;
          margin-bottom:15px;
          .el-form-item__label{
            padding-right:0px;
          }
          .el-form-item__content{
            width: 72%;
          }
        }
        .el-form-item.input{
          .el-form-item__content{
            width: 78%;
          }
        }
      }
    }

    .duty-dialog {
      /deep/ .el-dialog__body {
        padding: 30px 20px 10px;
      }
      .tag-box {
        font-size: 16px;
        padding: 0 15px;
        margin-bottom: 10px;
        .el-tag{
          margin-right: 5px;
        }
      }
      .tree-box {
        border: 1px solid rgba(233, 233, 233, 1);
        padding: 15px 40px;
        .tree-box_input {
          margin-bottom: 10px;
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

    .check-instance-name /deep/ {
      .el-dialog__wrapper .el-dialog .el-dialog__header {
        border: unset !important;
      }
      .el-dialog__wrapper .el-dialog .el-dialog__footer {
        text-align: center;
        padding: 20px;
        border: unset !important;
      }
      .el-dialog__body {
        padding: 0 20px;
      }
    }
  }
  }
  .editor-container {
    .el-collapse-item {
      position: relative;
    }
    .professional-terms{
      i{
        background: url("../../../../assets/images/commonIcon/terms.png") no-repeat;
        background-size: 18px 18px;
        display: inline-block;
        width: 18px;
        height: 18px;
        top: 7px;
        left: 103px;
        position: absolute;
        cursor: pointer;
      }
    }
  }
  .editor{
    .el-tooltip__popper{
      max-width:360px;
    }
  }
.line {
  height: 100%;
  width: 4px;
  background: #579ef3;
  margin-right: 15px;
}
.dialog-ul {
  padding: 0;
  margin: 0;
  li {
    list-style-type: none;
  }
  .el-button {
    margin-left: 10px;
  }
}
.master-data /deep/ {
  .el-dialog__wrapper .el-dialog .el-dialog__header {
    border: unset !important;
  }
  .el-dialog__wrapper .el-dialog .el-dialog__body {
    padding: 10px;
  }
  .el-dialog__wrapper .el-dialog .el-dialog__footer {
    text-align: center;
    padding: 20px;
    border: unset !important;
  }
  .el-dialog__body {
    padding: 0 20px;
  }
}
</style>
