<!--主数据新增页面-->
<template>
  <div class="master-data-add">
    <!-- <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <el-button size="small" style="float: right;" @click="toCancel">关闭</el-button>
        <!--<el-button  size="small" type="primary" style="float: right;margin-right:8px;" @click="toSave">保存</el-button>-->
      <!-- </div> -->
      <div class="card-body">
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
            <el-form
              v-loading="inputDataIsloading"
              :model="baseInfoRuleForm"
              ref="baseInfoRuleForm"
              label-width="130px"
              style="width:60%;margin-top:10px;"
              :rules="rules"
            >
              <opinion-input-type
                v-for=" (val,index) in inputData"
                :key="val.columnName"
                :item="inputData[index]"
                :ref="'input_'+val.columnName"
                v-show="val.hidden!==true"
              ></opinion-input-type>
            </el-form>
          </el-collapse-item>
          <el-collapse-item class="title" name="2">
            <template slot="title">
              <i class="line"></i>技术属性
            </template>
            <el-form
              v-loading="inputData2Isloading"
              :model="baseTechForm"
              ref="baseTechForm"
              label-width="130px"
              style="width:60%;margin-top:10px;"
              :rules="rules2"
            >
              <opinion-input-type
                v-for=" (val,index) in inputData2"
                :key="val.columnName"
                :item="inputData2[index]"
                :ref="'input_'+val.columnName"
                v-show="val.hidden!==true"
              ></opinion-input-type>
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
            <el-button size="small" type="primary" @click="toSave" :disabled="bIsCanSave">保存</el-button>
          </el-form> -->
        </el-collapse>
      </div>
    <!-- </el-card> -->

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
import opinionInputType from "../../../common/opinionInputType";
import termsDialog from "../../../common/termsDialog";
import bus from "@/utils/bus";
import { get, postByJson, parseAjaxResponse } from "../../../../utils/request";
export default {
  name: "masterDataAdd",
  components: {
    opinionInputType,
    termsDialog
  },
  data() {
    const checkInstanceName = (rule, value, callback) => {
      if (this.baseInfoRuleForm.INSTANCE_NAME === "") {
        callback(new Error("请输入标准名称"));
      } else {
        let params = {
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
      sameList: [],
      aBaseInfoActiveNames: ["1", "2"],
      // 认责默认折叠
      confessActiveNames: ["1", "2", "3", "4"],

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
        STRING_9: "", // 英文缩写
        STRING_10: "", // 取值范围
        STRING_6: "", // 定义依据
        STRING_1: "" // 备注
      },
      // 基本信息-技术属性
      baseTechForm: {
        STRING_11: "", // 数据长度
        STRING_12: "", // 数据精度
        STRING_13: "", // 数据展示格式
        STRING_14: "", // ID及代码编码规则
        STRING_15: "" // 数据单位
      },
      rules: {
        INSTANCE_NAME: [{ validator: checkInstanceName, trigger: "blur" }]
      },
      rules2: {},
      bIsShowCatalogTree: false,
      instanceId: '',
      users: "", // array[string]
      prncipals: "", // string
      params: {},
      inputData: [], // 业务属性
      inputData2: [], // 技术属性
      inputDataIsloading: false,
      inputData2Isloading: false,

      // 业务术语id
      buzTermId: "",
      // 业务术语 对话框是否可见
      bIsTermsVisible: false,

      eIndex: null, // 记录英文名称对应下标
      eIndex2: null,
      // 主数据信息项的 classifierId 初始化为 MasterDataInfoItem
      classifierId: "MasterDataInfoItem",
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
      bIsCanSave: false
    };
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
      get("/dsm/getEnNameStoreColumn", {
        classifierId: this.classifierId // 数据标准类型
      }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.sEnName = res.data;
            this.getMasterDataAttr();
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
              } else if (item.attStore === "STRING_5") {
                this.oBizTerm.sBusinessDef = item.attStore;
              } else if (item.attStore === "STRING_8") {
                this.oBizTerm.sDataType = item.attStore;
              } else if (item.attStore === "STRING_9") {
                this.oBizTerm.acronym = item.attStore;
              }
            });
          }
        });
      });
    },

    // 获取主数据基本信息属性 /masterData/getMasterDataAttr
    getMasterDataAttr() {
      console.log(this.params, 'ddddd')
      console.log("2233");
      this.inputDataIsloading = true;
      this.inputData2Isloading = true;
      get("/masterData/getMasterDataAttr").then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000 && res.success) {
            res.data.basicInfo.forEach((item, index) => {
              if (
                item.belongs === "基本属性" ||
                item.belongs === "业务属性" ||
                item.belongs === "管理属性"
              ) {
                this.inputData.push(item);
                this.inputDataIsloading = false;
              } else if (item.belongs === "技术属性") {
                this.inputData2.push(item);
                this.inputData2Isloading = false;
              }
            });

            // 必填项验证
            this.inputData.map((val, index) => {
              console.log(val)
              if (val.columnName === 'NAMESPACE') {
                console.log(this.params, 'params')
                let msg = this.params.msg
                // that.ruleForm2[val.columnName] = msg.namespace
                this.$set(this.inputData[index], 'attrValuName', msg.namespaceCN)
                this.$set(this.inputData[index], 'attrValuNamespace', msg.namespace)
                this.$set(this.inputData[index], 'nodeList', this.params.nodeList)
              }
              if (val.columnName === this.sEnName) {
                // 英文名称
                this.eIndex = index;
              } else if (val.columnName === this.oBizTerm.acronym) {
                this.eIndex2 = index;
              }
              if (val.nullable === false && val.columnName !== 'INSTANCE_NAME') {
                this.$set(this.rules, val.columnName, [{ required: true, message: '请输入' + val.attrName, trigger: 'blur' }])
              }
            });
            console.log(this.rules, 'this.rules')
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
                get('/ds/bizTerm/queryHomologousEnVocabularies', { cnTerm: e.val }).then(res => {
                  if (res.code === 10000 && res.success) {
                    this.$set(this.inputData[this.eIndex], 'attrValue', res.data[0])
                    this.$set(this.inputData[this.eIndex2], 'attrValue', res.data[1])
                  }
                })
              }
              // console.log(e)
            })
            this.inputData2.map(val => {
              console.log(val)
              if (val.nullable === false && val.columnName !== 'INSTANCE_NAME') {
                this.$set(this.rules2, val.columnName, [{ required: true, message: '请输入' + val.attrName, trigger: 'blur' }])
              }
            });
            if (this.params.msg) {
              this.inputData.map((val, index) => {
                if (val.columnName === "NAMESPACE") {
                  this.$set(
                    this.inputData[index],
                    "attrValuName",
                    this.params.msg.namespaceCN
                  );
                  this.$set(
                    this.inputData[index],
                    "attrValuNamespace",
                    this.params.msg.namespace
                  );
                }
              });
            }
          }
        });
      });
    },
    // 保存主数据基本信息 /masterData/saveBasicInfo
    saveBasicInfo() {
      // console.log(this.$refs.baseInfoRuleForm)
      this.$refs.baseInfoRuleForm.validate(valid => {
        this.$refs.baseTechForm.validate(valid2 => {
          if (valid && valid2) {
            this.bIsToSaveInfoItem = true
            if (this.sameList.length > 0) {
              this.showSames = true;
            } else {
              this.showSames = false
              this.isToSaveInfoItem()
            }
          } else {
            return false;
          }
        });
      });
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
      let params = [];
      this.inputData.map(val => {
        let aObj = {};
        if (val.columnName === "NAMESPACE") {
          console.log(this.params.msg.namespace)
          aObj = {
            key: val.columnName,
            // value: this.params.msg.namespace
            value: this.$refs["input_" + val.columnName][0].inputData
          };
        } else {
          aObj = {
            key: val.columnName,
            value: this.$refs["input_" + val.columnName][0].inputData
          };
        }
        params.push(aObj);
      });
      this.inputData2.map(val => {
        let bObj = {
          key: val.columnName,
          value: this.$refs["input_" + val.columnName][0].inputData
        };
        params.push(bObj);
      });
      // 增加 - 业务术语 键值对
      params.push({
        key: "BIZTERM_ID",
        value: this.buzTermId
      });
      // console.log(params);
      this.bIsCanSave = true // 保存按钮 不可点击
      postByJson("/masterData/saveBasicInfo", params).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.bIsCanSave = false // 新增成功后，保存按钮 可点击
            this.$message.success(res.message);
            // 关闭新增页面
            // this.closeSelectedTag(this.$route);
            // 跳转到主数据入口页面
            let params = {
              nodeList: this.nodeList,
              addNode: this.addNode
            }
            this.$emit('sendAddInfo', params)
            // this.$router.push({
            //   name: "masterData",
            //   params: {
            //     nodeList: this.nodeList,
            //     addNode: this.addNode
            //   }
            // });
          }
        });
      });
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

    // 保存
    toSave() {
      this.saveBasicInfo();
    },
    // 取消
    toCancel() {
      // 关闭页面
      this.closeSelectedTag(this.$route);
      // 跳转到主数据入口页面
      this.$router.push({ name: "masterData" });
    },

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
            // 标准中文名称
            // item.attrValue = tagData.name
            this.$set(this.inputData[index], "attrValue", tagData.name);
          } else if (item.columnName === this.sEnName) {
            // 英文名称
            // item.attrValue = tagData.code
            this.$set(this.inputData[index], "attrValue", tagData.code);
          } else if (item.columnName === this.oBizTerm.sBusinessDef) {
            // 业务定义
            // 这种方式赋值，不会触发opinionInputType组件中watch的item的变化，要使用下面$set的赋值方式
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
            console.log(key)
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
          /* else if (item.columnName === 'STRING_10') { // 取值范围 （不回显了）
              // item.attrValue = tagData.attributes[3].value
              this.$set(this.inputData[index], 'attrValue', tagData.attributes[3].value);
            }*/
        });
        // console.log(this.inputData)
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
      console.log(val)
      // this.getEnNameStoreColumn();
      // this.getListBizTermInfoItemAttrStoreColumn();
      // 新增后 - tree节点定位部分代码
      let msg = val.msg;
      this.params = val
      this.instanceId = val.id
      console.log(msg, "mg");
      if (msg) {
        this.parentId = msg.node.id;
        this.namespace = msg.namespace;
        this.baseInfoRuleForm.NAMESPACE = msg.namespaceCN;
        // this.nodeList = msg.node
        this.nodeList = val.nodeList;
        console.log(val);
        this.selectClear = true;

        if (this.nodeList && this.nodeList.length > 1) {
          this.parentId = this.nodeList[this.nodeList.length - 1].id;
        } else if (msg.data) {
          this.parentId = msg.data.data.id;
        } else {
          this.parentId = msg.node.id;
        }
      }
    }
  },
  mounted() {
    bus.$on('getNodeArr', (msg) => {
      console.log(msg)
      console.log(msg === this.params.nodeList, '===')
      if (msg === this.params.nodeList) {
        this.addNode = false
      } else {
        this.addNode = true
      }
      this.nodeList = msg

      console.log(this.nodeList && this.nodeList.length > 1 && this.nodeList[this.nodeList.length - 1].data)
      if (this.nodeList && this.nodeList.length > 1 && this.nodeList[this.nodeList.length - 1].data) {
        this.parentId = this.nodeList[this.nodeList.length - 1].data.id;
        console.log(this.nodeList[this.nodeList.length - 1].data)
        console.log(this.parentId)
      }
    })
  },
  created() {
    // this.getMasterDataAttr();
    this.getEnNameStoreColumn();
    this.getListBizTermInfoItemAttrStoreColumn();

    // 新增后 - tree节点定位部分代码
    // let msg = this.params.msg;
    // console.log(msg, "mg");
    // if (msg) {
    //   this.parentId = msg.node.id;
    //   this.namespace = msg.namespace;
    //   this.baseInfoRuleForm.NAMESPACE = msg.namespaceCN;
    //   // this.nodeList = msg.node
    //   this.nodeList = this.params.nodeList;
    //   console.log(this.params);
    //   this.selectClear = true;

    //   if (this.nodeList && this.nodeList.length > 1) {
    //     this.parentId = this.nodeList[this.nodeList.length - 1].id;
    //   } else {
    //     this.parentId = msg.node.id;
    //   }
    // }
  },
  beforeDestroy() {
    bus.$off('columnName')
    bus.$off('getNodeArr')
  }
};
</script>
<style lang="scss" scoped>
//外层card容器样式
@import "../../../../styles/dq/main-card-table";
$color-grey-light: #e0e0e0;
$collapse-font-size: 18px;
$color-font: #c0c4cc;
$collapse-header-size: 14px;
.master-data-add {
  padding: 12px;
  /deep/ .el-collapse-item__header {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    height: 30px;
    font-style: normal;
    font-size: $collapse-header-size;
    color: #666666;
    // padding: 0 20px;
    margin-bottom: 10px;
    border-bottom: unset;
  }
  // .el-card {
  //   padding: 25px 60px;
  //   /deep/ .el-card__header {
  //     padding: 20px 20px 12px 20px;
  //   }
  //   /deep/ .el-card__body {
  //     .card-body {
        .el-collapse {
          border: unset;
          // margin-top: 20px;
          //业务术语
          .el-collapse-item.terms {
            position: relative;
            //业务术语图标
            .professional-terms {
              i {
                background: url("../../../../assets/images/commonIcon/terms.png")
                  no-repeat;
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

          .el-collapse-item__header {
            font-size: $collapse-font-size;
            color: #666666;
            padding: 0 20px;
            margin-bottom: 10px;
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
            padding: 10px 20px;
          }
        }
        // .el-form /deep/ .el-form-item {
        //   margin-bottom: 15px;
        // }

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
      }
    // }
  // }
// }

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
.line {
  height: 100%;
  width: 4px;
  background: #579ef3;
  margin-right: 15px;
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