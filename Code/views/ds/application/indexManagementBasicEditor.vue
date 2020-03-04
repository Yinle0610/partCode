<!--indexManagementAdd-->
<!--指标管理 编辑页面-->
<template>
  <div class="index-management-add dashboard-editor-container">
    <!-- <el-card shadow="hover"> -->
      <!-- <div slot="header" class="clearfix">
        <el-button size="small" style="float: right;" @click="toCancel">关闭</el-button> -->
        <!--<el-button  size="small" type="primary" style="float: right;margin-right:8px;"  @click="toSave">保存</el-button>-->
      <!-- </div> -->
      <div class="card-body">
        <el-collapse v-model="aBaseInfoActiveNames">
          <el-collapse-item class="title terms BaseInfo" name="1">
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
            <el-form
              v-loading="inputDataIsloading"
              :model="baseInfoRuleForm"
              :rules="baseInfoRules"
              ref="baseInfoRuleForm"
              label-width="110px"
              style="width:60%;margin-top:20px;"
            >
              <opinion-input-type
                v-for=" (val,index) in inputData"
                :key="val.columnName+index"
                :item="inputData[index]"
                :ref="'input_'+val.columnName"
                v-show="val.hidden!==true"
                @comboboxChange="comboboxIndexChange"
                @dropDown="dropDownIndex"
                :aTreeData="treeData"
              ></opinion-input-type>
            </el-form>
          </el-collapse-item>
          <el-collapse-item class="title"  name="2">
            <template slot="title">
                <i class="line"></i>技术属性
            </template>
            <el-form
              v-loading="inputData2Isloading"
              :model="baseTechForm"
              :rules="baseInfoRules2"
              ref="baseTechForm"
              label-width="110px"
              style="width:60%;margin-top:20px;"
            >
              <opinion-input-type
                v-for=" (val,index) in inputData2"
                :key="val.columnName+index"
                :item="inputData2[index]"
                :ref="'input_'+val.columnName"
                v-show="val.hidden!==true"
              ></opinion-input-type>
            </el-form>
          </el-collapse-item>
          <!-- <el-divider></el-divider> -->
          <!--基本信息保存按钮-->
          <!-- <el-form align="center">
            <el-button size="small" type="primary" @click="toSave" :disabled="bIsCanSave">保存</el-button>
          </el-form> -->
        </el-collapse>
      </div>
      <div class="checkSame">
        <el-dialog title="提示" :visible.sync="showSames" width="30%" append-to-body>
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
            <el-button type="primary" @click="sureAdd">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    <!-- </el-card> -->

    <!--业务术语-->
    <termsDialog :bIsVisible="bIsTermsVisible" @toSaveTerms="toSaveTerms" @close="close" ></termsDialog>
  </div>
</template>
<script>
// import opinionInputType from "@/views/common/opinionInputType";
import opinionInputType from "./../../common/opinionInputType";
import termsDialog from "../../common/termsDialog";
import bus from "@/utils/bus";
import { get, postByJson, parseAjaxResponse } from "../../../utils/request";

export default {
  name: "indexManagementBasicEditor",
  components: {
    opinionInputType,
    termsDialog
  },
  data() {
    const checkInstanceName = (rule, value, callback) => {
      if (this.baseInfoRuleForm.INSTANCE_NAME === "") {
        callback(new Error("请输入指标名称"));
      } else {
        let params = {
          classifierId: this.sIndexType,
          instanceName: this.baseInfoRuleForm.INSTANCE_NAME,
          parentId: this.parentId
        };
        get("/ds/application/index/checkStandardNameIsExist", params).then(
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
      lockObj: {
        lock: false,
        first: true
      },
      eIndex: null, // 记录英文名称对应下标
      aBaseInfoActiveNames: ["1", "2"],
      // 认责默认折叠
      confessActiveNames: ["1", "2", "3", "4"],
      // 基本信息-业务属性
      baseInfoRuleForm: {
        INSTANCE_NAME: "", // 指标名称
        STRING_3: "", // 英文名称
        INDEX_TYPE: "", // 指标类型
        NAMESPACE: "", // 目录
        STRING_5: "", // 数据粒度
        STRING_6: "", // 业务定义
        STRING_7: "", // 业务口径
        STRING_2: "", // 发布状态
        STRING_8: "", // 数据类型
        STRING_9: "", // 制定依据
        STRING_16: "", // 英文缩写
        STRING_1: "" // 发布状态
      },
      // 基本信息-技术属性
      baseTechForm: {
        STRING_10: "", // 指标格式
        STRING_11: "", // 常用单位
        STRING_12: "", // 取值范围
        STRING_13: "", // 数据展示格式
        STRING_14: "", // ID及代码编码规则
        STRING_15: "", // 数据单位
        STRING_4: "" // 技术口径
      },
      baseInfoRules: {
        INSTANCE_NAME: [{ validator: checkInstanceName, trigger: "blur" }]
      },
      baseInfoRules2: {
      },
      parentId: null,
      showSames: false,
      sameList: [],
      addItem: false,
      bIsShowCatalogTree: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      inputData: [], // 业务属性
      inputData2: [], // 技术属性
      inputDataIsloading: false,
      inputData2Isloading: false,

      sIndexType: "",
      treeData: [],

      // 业务术语id
      buzTermId: "",
      // 业务术语 对话框是否可见
      bIsTermsVisible: false,

      // 指标管理-信息项的 classifierId 初始化为 BaseIndexInfoItem
      classifierId: "BaseIndexInfoItem",
      // classifierId: this.$route.params.msg.indexInfoItem,
      // 标准的英文名属性存放的列名
      sEnName: "",
      // 业务术语影响的属性
      oBizTerm: {
        sCnName: "", // 标准名称
        sEnName: "", // 英文名称
        sBusinessDef: "", // 业务定义
        sDataType: "", // 数据类型
        acronym: ""
      },
      addNode: false,
      // 新增 - 保存按钮 是否可点击
      bIsCanSave: false,
      nodeList: [],
      fullPath: {
        name: '',
        id: ''
      },
      eIndex2: null,
      routeData: null,
      firstNodeList: [],
      instanceId: null, // 信息id
      attrNameCatalog: '业务领域'
    };
  },
  methods: {
    // 获取标准的英文名属性存放的列名 /dsm/getEnNameStoreColumn
    getEnNameStoreColumn() {
      get("/dsm/getEnNameStoreColumn", {
        classifierId: this.classifierId // 数据标准类型
      }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.sEnName = res.data;
            // 英文名称接口成功后，再调用属性接口
            this.getListBizTermInfoItemAttrStoreColumn();
            this.getIndexBasicAttrInfos();
          }
        });
      });
    },
    // 获取业务术语影响的属性 /dsm/listBizTermInfoItemAttrStoreColumn
    getListBizTermInfoItemAttrStoreColumn() {
      get("/dsm/listBizTermInfoItemAttrStoreColumn", {
        classifierId: this.classifierId // 数据标准类型
      }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            res.data.forEach((item, index) => {
              if (item.attStore === "INSTANCE_NAME") {
                this.oBizTerm.sCnName = item.attStore;
              } else if (item.attStore === "STRING_3") {
                this.oBizTerm.sEnName = item.attStore;
              } else if (item.attStore === "STRING_6") {
                this.oBizTerm.sBusinessDef = item.attStore;
              } else if (item.attStore === "STRING_8") {
                this.oBizTerm.sDataType = item.attStore;
              } else if (item.attStore === "STRING_16") {
                this.oBizTerm.acronym = item.attStore;
              }
            });
          }
        });
      });
    },

    // 获取指标标准基本信息页展示属性 /ds/application/index/getBasicAttrInfos
    getIndexBasicAttrInfos() {
      get('/ds/application/index/getDetailInfos', {
        indexId: this.instanceId
      }).then((res) => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            let key1 = '';
            let key2 = ''
            res.data.basicInfo.forEach((item, index) => {
              if (item.attrName === '全路径Ids' || item.belongs === '基本属性' || item.belongs === '业务属性' || item.belongs === '管理属性') {
                this.inputData.push(item)
              } else if (item.belongs === '技术属性') {
                this.inputData2.push(item)
              }
              if (item.attrName === '全路径Ids') {
                key1 = index
              } else if (item.attrName === this.attrNameCatalog) {
                key2 = index
              }
            })
            console.log(this.inputData)
            // 初始化 指标类型赋值
            this.parentId = res.data.parentId;
            this.inputData.forEach((val, index) => {
              if (val.columnTypeValue === 'IndexType') {
                this.sIndexType = val.attrValue
              }
              if (val.columnName) {
                this.baseInfoRuleForm[val.columnName] = val.attrValue;
                // bus.$on(val.columnName, (e) => {
                //   this.baseInfoRuleForm[val.columnName] = e;
                // })
              }
              if (val.columnName === this.sEnName) {
                this.eIndex = index;
              } else if (val.columnName === this.oBizTerm.acronym) {
                this.eIndex2 = index;
              }
              if (val.nullable === false && val.columnName !== 'INSTANCE_NAME') {
                this.$set(this.baseInfoRules, val.columnName, [{ required: true, message: '请输入' + val.attrName, trigger: 'blur' }])
              }
            })

            this.inputData2.map(val => {
              if (val.nullable === false && val.columnName !== 'INSTANCE_NAME') {
                this.$set(this.baseInfoRules2, val.columnName, [{ required: true, message: '请输入' + val.attrName, trigger: 'blur' }])
              }
            })
            bus.$on('columnName', (e) => {
              let key;
              let key2;
              for (key in this.baseInfoRuleForm) {
                if (key === e.name) {
                  this.baseInfoRuleForm[e.name] = e.val;
                }
              }
              for (key2 in this.baseTechForm) {
                if (key2 === e.name) {
                  this.baseTechForm[e.name] = e.val;
                }
              }
              if (e.name === this.oBizTerm.sCnName) {
                if (!this.lockObj.first) {
                  get('/ds/bizTerm/queryHomologousEnVocabularies', { cnTerm: e.val }).then(res => {
                    if (res.code === 10000) {
                      this.$set(this.inputData[this.eIndex], 'attrValue', res.data[0])
                      this.$set(this.inputData[this.eIndex2], 'attrValue', res.data[1])
                    }
                  })
                } else {
                  this.lockObj.first = false;
                }
              }
              console.log(e)
            })
            // 上下文路径的值 （初始化进入页面时，是全路径ids的值）
            if (key1 && key2) {
              this.inputData[key2].namespace = this.inputData[key1].attrValue.substring(0, this.inputData[key1].attrValue.lastIndexOf('/'));
              this.fullPath.name = this.inputData[key1].columnName
              this.fullPath.id = this.inputData[key2].namespace
            }
            this.isParentNode = res.data.accusationInfos.supIsParentIndex;
          }
        })
      })
    },
    toSeeDetail(item) {
      let row = item;
      console.log(item)
      row.instanceName = item.name;
      row.instanceId = item.id;
      this.$router.push({
        name: "indexManagementDetails",
        params: {
          id: item.id,
          _title: item.name,
          classifierId: item.classifierId
        }
      });
    },
    // 保存指标基本信息 /ds/application/index/saveBasicInfos
    saveBasicInfo() {
      // let params = [];
      // this.inputData.map(val => {
      //   let aObj = {
      //     key: val.columnName,
      //     value: this.$refs["input_" + val.columnName][0].inputData
      //   };
      //   params.push(aObj);
      // });
      // console.log(params);
      // console.log(this.baseInfoRuleForm, this.baseTechForm, this.baseInfoRules, this.baseInfoRules2)
      this.$refs.baseInfoRuleForm.validate(valid => {
        // console.log(valid, 'valid')
        this.$refs.baseTechForm.validate(valid2 => {
          // console.log(valid2, 'valid2')
          if (valid && valid2) {
            this.addItem = true;
            if (this.sameList.length > 0) {
              this.showSames = true;
            } else {
              this.showSames = false
              this.sureAdd()
            }
          } else {
            return false;
          }
        });
      });
    },
    sureAdd() {
      if (this.addItem) {
        this.sendSaveMsg();
      }
      this.showSames = false;
      this.addItem = false;
    },
    sendSaveMsg() {
      let params = []
      this.inputData.map(val => {
        let aObj = {}
        if (val.attrName === this.attrNameCatalog) {
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
      console.log(params, this.inputData, this.attrNameCatalog)
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
      postByJson('/ds/application/index/saveBasicInfos', params).then((res) => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.$message.success(res.message)
            // 关闭编辑页面
            let a = {
              nodeList: this.nodeList,
              addNode: this.addNode
            }
            this.$parent.$parent.setTreePosition(a);
            if (this.$parent.$parent.showComponent === 'editorDetail') {
              this.$parent.$parent.$refs.detailModsule.getIndexDetailInfos();
            }
            // this.closeSelectedTag(this.$route)
            // 跳转到指标入口页面

            // this.$router.push({ name: "indexManagement", params: a });
          }
        })
      })
    },
    toSave() {
      this.saveBasicInfo();
    },
    // 取消
    toCancel() {
      // 关闭页面
      this.closeSelectedTag(this.$route);
      // 跳转到指标入口页面
      this.$router.push({ name: "indexManagement" });
    },

    /* 关闭tag*/
    isActive(route) {
      return route.path === this.$route.path;
    },
    closeSelectedTag(view) {
      this.$store.dispatch("delVisitedViews", view).then(views => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push(this.$route.path);
          }
        }
      });
    },

    // 监听指标类型 change事件
    comboboxIndexChange(sIndexType) {
      // console.log(sIndexType)
      this.sIndexType = sIndexType;
    },
    // 选择目录 显示事件
    dropDownIndex(columnTypeValue) {
      // console.log(columnTypeValue, this.sIndexType, 'ooo')
      if (this.sIndexType !== "") {
        get(columnTypeValue, {
          indexType: this.sIndexType // 指标类型
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.treeData = res.data;
            console.log(this.treeData, res.data, '下拉')
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        this.$message.warning("请先选择指标类型");
      }
    },

    // 显示选择目录的tree
    // toShowCatalogTree() {
    //   this.bIsShowCatalogTree = !this.bIsShowCatalogTree
    // },
    // handleNodeClick(data) {
    //   console.log(data);
    //   this.baseInfoRuleForm.catalog = data.label
    // },

    // 弹出业务术语框
    toTerms() {
      this.bIsTermsVisible = true;
    },
    // 业务术语 - 确定
    toSaveTerms(tagData) {
      // console.log(tagData)
      if (tagData !== undefined) {
        this.buzTermId = tagData.id; // 业务术语id
        // 填充页面数据
        this.inputData.forEach((item, index) => {
          if (item.columnName === this.oBizTerm.sCnName) {
            // 指标名称
            // item.attrValue = tagData.name
            this.$set(this.inputData[index], "attrValue", tagData.name);
          } else if (item.columnName === this.sEnName) {
            // 英文名称
            // item.attrValue = tagData.code
            this.$set(this.inputData[index], "attrValue", tagData.code);
          } else if (item.columnName === this.oBizTerm.sBusinessDef) {
            // 业务定义
            // item.attrValue = tagData.businessDef
            this.$set(this.inputData[index], "attrValue", tagData.businessDef);
          } else if (item.columnName === this.oBizTerm.sDataType) {
            // 数据类型
            // item.attrValue = tagData.attributes[2].value
            let key = null;
            tagData.attributes.map((val, k) => {
              if (val.attrStore === 'string4') {
                key = k
              }
            })
            this.$set(
              this.inputData[index],
              "attrValue",
              tagData.attributes[key].value
            );
          } else if (item.columnName === this.oBizTerm.acronym) {
            let key = null;
            tagData.attributes.map((val, k) => {
              if (val.attrStore === 'string3') {
                key = k
              }
            })
            console.log(key)
            this.$set(
              this.inputData[index],
              "attrValue",
              tagData.attributes[key].value
            );
          }
        });
        // console.log(this.inputData)
        /* this.inputData2.forEach((item, index) => {
            if (item.columnName === 'STRING_12') { // 取值范围 （不回显了）
              // item.attrValue = tagData.attributes[3].value
              this.$set(this.inputData2[index], 'attrValue', tagData.attributes[3].value);
            }
          })*/
        this.bIsTermsVisible = false;
      } else {
        this.$message.warning("请选择业务术语");
      }
    },
    close() {
      this.bIsTermsVisible = false;
    },

    isClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "text-align:center;border-right:none;";
      } else {
        return "text-align:center;";
      }
    },
    isClass2({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "tableClass";
      }
    },
    getParMsg(val) {
      this.route = val;
      this.instanceId = val.id;
      //   this.getIndexBasicAttrInfos()
      this.getEnNameStoreColumn()
    //   this.getListBizTermInfoItemAttrStoreColumn()
    },
    mounted() {
      // bus.$on('getNodeArr', (msg) => {
      //   console.log(msg === this.$route.params.nodeList, 'ddddd')
      //   if (msg === this.$route.params.nodeList) {
      //     this.addNode = false
      //   } else {
      //     this.addNode = true
      //   }
      //   this.nodeList = msg
      //   console.log(this.nodeList, msg, this.parentId)
      //   if (this.nodeList) {
      //     if (this.nodeList.length > 0 && this.nodeList[this.nodeList.length - 1].data) {
      //       this.parentId = this.nodeList[this.nodeList.length - 1].data.id;
      //       console.log(this.parentId, 'id')
      //     }
      //   }
      // })
    },
    created() {
      // this.getIndexBasicAttrInfos();
      // this.getEnNameStoreColumn();
      // this.getListBizTermInfoItemAttrStoreColumn();

      // 新增后 - tree节点定位部分代码

      // if (this.$route.params.nodeList) {
      //   this.nodeList = this.$route.params.nodeList;
      // }

      // if (this.nodeList && this.nodeList.length > 1) {
      //   this.parentId = this.nodeList[this.nodeList.length - 1].id;
      // } else {
      //   this.parentId = msg.node.id;
      // }
    }
  },
  beforeDestroy() {
    bus.$off('columnName')
    bus.$off('getNodeArr')
  }
};
</script>
<style lang="scss" scoped>
//外层card容器样式
@import "./../../../styles/dq/main-card-table.scss";
$color-grey-light: #e0e0e0;
$collapse-font-size: 18px;
$color-font: #c0c4cc;
.index-management-add {
  padding: 12px;
  .checkSame /deep/ {
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
  }
  // .el-card {
  //   padding: 25px 60px;
    // /deep/ .el-card__header {
    //   padding: 20px 20px 12px 20px;
    // }
    // /deep/ .el-card__body {
    //   .card-body {
        .el-collapse {
          border: unset;
          margin-top: 20px;
          /deep/ .terms{
            margin-bottom:15px;
          }
          // 业务术语
          .el-collapse-item.terms {
            position: relative;
            //业务术语图标
            .professional-terms {
              i {
                background: url("../../../assets/images/commonIcon/terms.png")
                  no-repeat;
                background-size: 18px 18px;
                display: inline-block;
                width: 18px;
                height: 18px;
                top: 5px;
                left: 103px;
                position: absolute;
                cursor: pointer;
              }
            }
          }

          .el-collapse-item__header {
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
            font-size: 16px;
            color: #666666;
            // padding: 20px 60px;
            overflow: hidden;
            padding: 20px;
            //选择目录
            .choice-catalog-item {
              .choice-catalog {
                position: relative;
                border: 1px solid #dcdfe6;
                height: 32px;
                width: 100%;
                line-height: 32px;
                padding: 0px 5px;
                border-radius: 5px;
                margin-top: 4px;
                span {
                  float: left;
                  i {
                    float: right;
                    position: absolute;
                    top: 9px;
                    right: 10px;
                  }
                }
              }
              .el-tree {
                top: -15px;
                border: 1px solid #dcdfe6;
                border-radius: 5px;
                padding: 10px;
              }
            }
          }
        }

        //选择目录
        .selectButton:focus {
          border-color: #409eff;
          background-color: unset;
        }
        .selectButton:hover {
          // color: #409EFF;
          border-color: $color-font;
          background-color: unset;
        }
        .tree {
          border: 1px solid $color-font;
          border-top: none;
        }
        .el-dropdown {
          width: 100%;
          position: relative;
        }
        .selectButton {
          width: 100%;
          padding: 20px;
          position: relative;
          span {
            position: absolute;
            width: 100%;
            text-align: left;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: $color-font;
            i {
              position: absolute;
              right: 20px;
            }
          }
        }

        .el-form /deep/ .el-form-item {
          margin-bottom: 15px;
        }
      // }
    // }
  // }
  .line {
    height: 100%;
    width: 4px;
    background: #579ef3;
    margin-right: 15px;
  }
  /deep/ .el-collapse{
    border-top: none;
    border-bottom:none;
  }
  /deep/ .el-collapse-item__wrap{
    border-bottom:none;
  }
  /deep/ .el-collapse-item__header{
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
  .BaseInfo /deep/ .el-collapse-item__header{
    border: unset;
  }
}

</style>