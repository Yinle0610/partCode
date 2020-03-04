<template>
    <div class="new-editor-container" ref="editorContainer">
        <!-- <el-card shadow="hover"> -->
            <!-- <div slot="header" class="clearfix">
                <el-button  size="small" style="float: right;" @click="closeSelectedTag($route)">取消</el-button>
                <el-button  size="small" type="primary" style="float: right;margin-right:8px;" @click="getInputData('ruleForm')">保存</el-button>
            </div> -->
            <div class="card-body">
                <el-form :model="ruleForm2"  :rules="rules" ref="ruleForm" label-width="110px" style="width:60%;margin-top:20px;">
                  <opinion-input-type v-for=" (val,index) in inputData" :key="val.columnName" :item="inputData[index]" :ref="'input_'+val.columnName" v-show="val.hidden!==true"></opinion-input-type>                       
                </el-form>
            </div>
            <div class="checkSame">
            <el-dialog title="提示" :visible.sync="showSames" append-to-body>
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
    </div>
</template>
<script>
import { get, postByJson } from '@/utils/request'
import opinionInputType from "./opinionInputType";
import bus from '@/utils/bus'
export default {
  name: 'addDimension',
  components: { opinionInputType },
  data() {
    const checkInstanceName = (rule, value, callback) => {
      if (this.ruleForm2.INSTANCE_NAME === "") {
        callback(new Error("请输入维度名称"));
      } else {
        let params = {
          instanceName: this.ruleForm2.INSTANCE_NAME,
          parentId: this.parentId
        };
        get("/ds/application/dimension/checkStandardNameIsExist", params).then(
          res => {
            console.log(res);
            if (res.code === 10000 && res.success) {
              if (res.data.length > 0) {
                // 不同目录下有重名的
                this.showSames = true;
                this.sameList = res.data;
                callback();
              } else {
                // 无重复
                this.showSames = false;
                this.sameList = []
                callback();
              }
            } else {
              // 相同目录下有重名的
              callback(new Error(res.message));
            }
          }
        );
      }
    };
    return {
      locking: false,
      activeName: 'first',
      dialogTableVisible: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      ifShow: {
        classify: false
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ruleForm: [],
      parentId: null,
      showSames: false,
      addItem: false,
      sameList: [],
      routeNodeList: null,
      ruleForm2: {
        INSTANCE_NAME: "",
        NAMESPACE: "",
        STRING_1: "",
        STRING_2: "",
        STRING_3: "",
        STRING_4: "",
        STRING_5: "",
        STRING_6: ""
      },
      rules: {
        INSTANCE_NAME: [{ validator: checkInstanceName, trigger: "blur" }],
        NAMESPACE: "",
        STRING_1: "",
        STRING_2: "",
        STRING_3: "",
        STRING_4: "",
        STRING_5: "",
        STRING_6: ""
      },
      selectUser: {
        select: [],
        wKeyword: '',
        problemTakerData: [],
        treeSelect: []

      },
      inputData: [],
      eIndex: null, // 记录英文名称对应下标
      addNode: false,
      routeData: null
    }
  },
  methods: {
    handleClick() {},
    handleSelectionChange(val) {
      console.log(val)
    },
    handleClose(tag) {

    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          let latestView = null
          views.map(val => {
            if (val.name === 'dimensionality') {
              latestView = val
            }
          })
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/ds/applicationStandard/dimensionality/dimensionality')
          }
        }
      })
    },
    toSeeDetail(item) {
      this.showSames = false
      this.$emit('hiddenDialog')
      let row = item;
      row.instanceName = item.name;
      row.instanceId = item.id;
      this.$router.push({
        name: "dimensionDetails",
        params: { id: item.id, _title: item.name, detailId: item.id, row: item }
      });
    },
    getAddType() {
      get('/ds/application/dimension/getDimensionBasicAttrInfos').then(res => {
        this.inputData = res.data.basicInfo;
        // const that = this
        this.inputData.map((val, index) => {
          console.log(val)
          if (val.columnName === 'NAMESPACE') {
            let msg = this.routeData.msg
            // that.ruleForm2[val.columnName] = msg.namespace
            this.$set(this.inputData[index], 'attrValuName', msg.namespaceCN)
            this.$set(this.inputData[index], 'attrValuNamespace', msg.namespace)
            this.$set(this.inputData[index], 'nodeList', this.routeData.nodeList)
          }
          if (val.columnName === 'STRING_6') {
            this.eIndex = index;
          }
          if (val.nullable === false && val.columnName !== 'INSTANCE_NAME') {
            this.$set(this.rules, val.columnName, [{ required: true, message: '请输入' + val.attrName, trigger: 'blur' }])
          }
        })
        console.log(this.rules)
        bus.$on('columnName', (e) => {
          this.ruleForm2[e.name] = e.val;
          if (e.name === 'INSTANCE_NAME') {
            get('/ds/bizTerm/queryHomologousEnVocabularies', { cnTerm: e.val }).then(res => {
              if (res.code === 10000) {
                this.$set(this.inputData[this.eIndex], 'attrValue', res.data[0])
              }
            })
          }
          // console.log(e)
        })
        // console.log(this.eIndex, eName, this.inputData)
        // console.log(this.ruleForm2)
        // console.log(this.inputData, '666')
        // if (this.$route.params.namespace && this.$route.params.name) {
        //   this.inputData.map((val, index) => {
        //     if (val.columnName === 'NAMESPACE') {
        //       this.$set(this.inputData[index], 'attrValuName', this.$route.params.name)
        //       this.$set(this.inputData[index], 'attrValuNamespace', this.$route.params.namespace)
        //     }
        //   })
        // }
      })
    },
    getInputData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
    },
    sureAdd() {
      if (this.addItem) {
        this.sendSaveMsg();
      }
      this.showSames = false;
      this.addItem = false;
    },
    sendSaveMsg() {
      this.ruleForm = []
      // console.log(this.ruleForm)
      if (this.locking === false) {
        this.locking = true;
        this.inputData.map(val => {
          console.log(val, 'val')
          console.log(this.$refs['input_' + val.columnName])
          let a = {
            key: val.columnName,
            value: this.$refs['input_' + val.columnName][0].inputData === null ? null : this.$refs['input_' + val.columnName][0].inputData.trim()
          }
          this.ruleForm.push(a);
        })
        postByJson('/ds/application/dimension/saveDimensionBasicInfos', this.ruleForm).then(val => {
          if (val.code === 10000 & val.success) {
            this.$message({
              message: val.message,
              type: 'success'
            });
            let obj = {
              namespace: this.$refs['input_NAMESPACE'][0].inputData
            }
            console.log(obj, 'obj')
            bus.$emit('namespace', obj)
            let params = {
              nodeList: this.nodeList,
              addNode: this.addNode,
              keyword: null
            }
            this.$parent.$parent.setTreePosition(params)
            // this.$routet.push('')
            // this.closeSelectedTag(this.$route)
            // this.$router.push({
            //   name: "dimensionality",
            //   params: {
            //     nodeList: this.nodeList,
            //     addNode: this.addNode,
            //     keyword: null
            //   }
            // });
          } else {
            this.$message.error(val.message);
            this.locking = false;
          }
        })
        console.log(this.ruleForm, 'sendMsg')
        console.log(this.inputData, 'input')
      }
    },
    getParMsg(val) {
      this.routeData = val;
      let msg = val.msg;
      // console.log(msg, "mg");
      if (msg) {
        this.namespace = msg.namespace;
        this.ruleForm2.NAMESPACE = msg.namespaceCN;
        this.parentId = msg.node.id;
        this.routeNodeList = val.nodeList;
        // this.nodeList = msg.node
        this.nodeList = val.nodeList;
        // console.log(val);
        this.selectClear = true;
        if (this.nodeList.length > 1) {
          this.parentId = this.nodeList[this.nodeList.length - 1].id;
        } else {
          this.parentId = msg.node.id;
        }
      }
      this.getAddType();
      bus.$on('getNodeArr', (msg) => {
        console.log(msg === this.nodeList)
        if (msg === this.routeNodeList) {
          this.addNode = false
        } else {
          this.addNode = true
        }
        this.nodeList = msg
        if (this.nodeList) {
          if (this.nodeList.length > 1 && this.nodeList[this.nodeList.length - 1].data) {
            this.parentId = this.nodeList[this.nodeList.length - 1].data.id;
            // console.log(this.parentId)
          }
        }
      })
    },
    mounted() {
    // bus.$on('getNodeArr', (msg) => {
    //   console.log(msg === this.nodeList)
    //   if (msg === this.nodeList) {
    //     this.addNode = false
    //   } else {
    //     this.addNode = true
    //   }
    //   this.nodeList = msg
    //   if (this.nodeList) {
    //     if (this.nodeList.length > 1 && this.nodeList[this.nodeList.length - 1].data) {
    //       this.parentId = this.nodeList[this.nodeList.length - 1].data.id;
    //       console.log(this.parentId)
    //     }
    //   }
    // })
    },
    created() {
    // consoler.log(32222)
    // this.getAddType();
    }
  },
  beforeDestroy() {
    bus.$off('columnName')
    bus.$off('getNodeArr')
  }

}
</script>
<style lang="scss" scoped>
//外层card容器样式
@import "./../../../../styles/dq/main-card-table.scss";
$color-grey-light: #E0E0E0;
$color-border:#DCDFE6;
$color-font:#C0C4CC;
.new-editor-container{
    padding:12px;
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
  }
    .el-card{
        padding: 25px 60px;
        /deep/ .el-card__header{
            padding:20px 20px 12px 20px;
            }
       /deep/ .el-card__body{
        .card-body{
          .relationship{
                .title{
                  border-bottom:1px solid $color-grey-light;
                  font-size: 17px;
                  padding:20px 10px;
                }
                .title2{
                  border-bottom:1px solid $color-grey-light;
                  font-size: 14px;
                  padding:12px 10px;
                }
                .button{
                  padding:10px 10px;
                  .el-button--mini{
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
                .found{
                  .button{
                    padding:20px 20px;
                    .el-button{
                      border:1px solid #333;
                      border-radius: 0;
                      padding: 8px 15px;
                      .see-user{
                        width:22px;
                        height:22px;
                        margin-right: 10px;
                      }
                      span{
                        color:#409EFF;
                        span{
                          position: relative;
                          bottom: 3px;
                          margin-right: 8px;
                        }
                      }
                      .close{
                        width:12px;
                        height:12px;
                        position: relative;
                        bottom:4px;
                      }
                      .add{
                        width:22px;
                        height:22px;
                        margin-right: 20px;
                      }
                    }
                  }
                }
                .found:nth-of-type(2),.found:nth-of-type(3),.found:nth-of-type(4){
                  margin-top:20px;
                }
              }
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
        }
            }
        
    }
  .relationTip{
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
}
.editor{
    .el-tooltip__popper{
        max-width:360px;
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
</style>