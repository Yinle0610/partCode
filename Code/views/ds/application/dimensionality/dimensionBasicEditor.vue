<template>
  <!-- 详情 -->
  <div class="detailPage">
    <div class="editor-container" ref="editorContainer">
            <div class="card-body">
                <el-form :model="inputForm"  :rules="rules" ref="ruleForm" label-width="110px" style="width:60%;margin-top:20px;">
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
  </div>
</template>

<script>
import { get, postByJson } from "@/utils/request";
// import { generateLineageTitle } from "@/utils"
import opinionInputType from "./opinionInputType";
// import { loading } from "@/utils/layer";
import bus from '@/utils/bus'
export default {
  name: "dimensionDetails",
  components: {
    opinionInputType
  },
  data() {
    const checkInstanceName = (rule, value, callback) => {
      if (this.inputForm.INSTANCE_NAME === "") {
        callback(new Error("请输入维度名称"));
      } else {
        let params = {
          instanceId: this.selectId,
          instanceName: this.inputForm.INSTANCE_NAME,
          parentId: this.parentId
        };
        get("/ds/application/dimension/checkStandardNameIsExist", params).then(
          res => {
            // console.log(res);
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
      lockObj: {
        lock: false,
        first: true
      },
      inputForm: {},
      rules: {
        INSTANCE_NAME: [{ validator: checkInstanceName, trigger: "blur" }]
      },
      inputData: [],
      ruleForm: {},
      selectId: null,
      basicMsg: null,
      selectClear: false,
      nodeList: null,
      addNode: false,
      routeNodeList: null,
      fullPath: {// 全路径暂存
        name: '',
        id: ''
      },
      parentId: null,
      showSames: false,
      addItem: false,
      sameList: []
    };
  },
  methods: {
    getData() {
      get('/ds/application/dimension/getDimensionDetailInfos', {
        dimensionId: this.selectId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          let data = res.data;
          this.inputData = data.basicInfo;
          let key
          let key2
          let arr = [];
          // console.log(this.inputData)
          this.inputData.map((val, index) => {
            if (val.attrName === '全路径Ids' || val.columnName === 'NAMESPACE') {
              key = index
            } else if (val.attrName === '维度分类') {
              key2 = index
            }
            if (val.columnName) {
              this.inputForm[val.columnName] = val.attrValue;
            }
            if (val.columnName === 'STRING_6') {
              this.eIndex = index;
            }
            if (!val.hidden && val.columnName) {
              arr.push(val.columnName)
            }
            if (val.nullable === false && val.columnName && val.columnName !== 'INSTANCE_NAME') {
              this.$set(this.rules, val.columnName, [{ required: true, message: '请输入' + val.attrName, trigger: 'blur' }])
            }
          })

          arr.map(val => {
            this.$set(this.inputForm, val, null)
          })
          console.log(this.rules, this.inputForm, 'this.rules')
          bus.$on('columnName', (e) => {
            this.inputForm[e.name] = e.val;
            if (e.name === 'INSTANCE_NAME') {
              if (!this.lockObj.first) {
                get('/ds/bizTerm/queryHomologousEnVocabularies', { cnTerm: e.val }).then(res => {
                  if (res.code === 10000) {
                    this.$set(this.inputData[this.eIndex], 'attrValue', res.data[0])
                    // console.log(this.inputData[this.eIndex], ' index')
                  }
                })
              } else {
                this.lockObj.first = false;
              }
            }

            // console.log(e)
          })
          if (key && key2) {
            this.fullPath.name = this.inputData[key].columnName;
            this.fullPath.id = this.inputData[key].attrValue;
            // this.inputData[key2].namespace = this.inputData[key].attrValue.substring(0, this.inputData[key].attrValue.lastIndexOf('/'));
          }
          this.parentId = data.parentId;
        } else {
          this.$message.error(res.message);
        }
      })
    },
    createdMess(val) {
      console.log(val)
      let arr = ['INSTANCE_ID',
        'INSTANCE_NAME',
        'INSTANCE_CODE',
        'NAMESPACE',
        'STRING_1',
        'STRING_2',
        'STRING_3',
        'STRING_4',
        'STRING_5',
        'STRING_6']
      arr.map(val => {
        this.$set(this.inputForm, val, null)
      })
      if (val.detailId) {
        this.selectId = val.detailId;
      }
      this.basicMsg = val.msg;
      if (val.nodeList1) {
        this.selectClear = true;
        this.nodeList = val.nodeList1;
        console.log(this.nodeList, 'this.nodeList')
      }
      this.routeNodeList = val.nodeList1;
      this.getData();
      // console.log(val, 'this.lockObj.first')
      bus.$on('getNodeArr', (msg) => {
        console.log(msg === this.routeNodeList)
        if (msg === this.routeNodeList) {
          this.addNode = false
        } else {
          this.addNode = true
        }
        this.nodeList = msg
        if (this.nodeList) {
          if (this.nodeList.length > 0 && this.nodeList[this.nodeList.length - 1].data) {
            this.parentId = this.nodeList[this.nodeList.length - 1].data.id;
            console.log(this.parentId, 'id')
          }
        }
      })
    },
    // toSave() {
    //   console.log(this.ruleForm)
    //   if (this.ruleForm) {
    //     this.getInputData();
    //   }
    // },
    getInputData() {
      this.$refs['ruleForm'].validate((valid) => {
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
    sureAdd() {
      if (this.addItem) {
        this.sendSaveMsg();
      }
      this.showSames = false;
      this.addItem = false;
    },
    sendSaveMsg() {
      this.ruleForm = []
      console.log(this.inputData, this.inputForm, 'this.inputData')
      this.inputData.map(val => {
        let a
        if (val.attrName === '维度分类') {
          console.log(this.$refs['input_' + val.columnName][0].inputData)
          if (this.$refs['input_' + val.columnName][0].inputData) {
            a = {
              key: this.fullPath.name,
              value: this.$refs['input_' + val.columnName][0].inputData
            }
          } else {
            a = {
              key: this.fullPath.name,
              value: this.fullPath.id
            }
          }
        } else if (val.attrName !== '全路径Ids') {
          a = {
            key: val.columnName,
            value: this.$refs['input_' + val.columnName][0].inputData
          }
        }

        this.ruleForm.push(a);
        if (val.attrName === '维度分类') {
          // console.log(this.ruleForm, a, this.$refs['input_' + val.columnName][0].inputData)
        }
      })

      this.ruleForm.splice(this.ruleForm.indexOf(undefined), 1);
      postByJson('/ds/application/dimension/saveDimensionBasicInfos', this.ruleForm).then(val => {
        if (val.code === 10000 & val.success) {
          this.$message({
            message: val.message,
            type: 'success'
          });
          let a = {
            keyword: null,
            nodeList: this.nodeList,
            addNode: this.addNode
          }
          this.$parent.$parent.setTreePosition(a);
          console.log(this.$parent.$parent)
          if (this.$parent.$parent.showComponent === 'editorDetail') {
            this.$parent.$parent.$refs.detailModsule.getData();
          }
          // this.closeSelectedTag(this.$route)
          // this.$router.push({
          //   name: "dimensionality",
          //   params: a
          // });
        } else {
          this.$message.error(val.message);
        }
      })
    }
  },
  beforeDestroy() {
    bus.$off('columnName')
    bus.$off('getNodeArr')
  },
  activated() {
    // this.selectId = this.$route.params.detailId;
    // console.log(7777)
    // this.getData();
    // this.getCollect()
  },
  created() {
    console.log(2222)
    // this.getCollect()
    // console.log(this.$route.params);
    // this.selectId = this.$route.params.detailId;
    // this.getData();
    // this.wGetData();
    // this.gGetData();
  }
};
</script>
<style>
th {
  font-weight: 100;
}
</style>
<style lang="scss" scoped>
@import "./../../../../styles/dq/main-card-table.scss";
$color-grey-light: #E0E0E0;
$color-border:#DCDFE6;
$color-font:#C0C4CC;
.editor-container{
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
