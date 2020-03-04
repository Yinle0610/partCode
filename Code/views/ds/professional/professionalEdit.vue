<template>
    <div class="new-editor-container" ref="editorContainer">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <el-button  size="small" style="float: right;" @click="closeSelectedTag($route)">取消</el-button>
                <el-button  size="small" type="primary" style="float: right;margin-right:8px;" @click="getInputData('ruleForm')" :disabled="isSaveBtdis">保存</el-button>
            </div>
            <div class="card-body">
                <el-form :model="ruleForm2"  ref="ruleForm" label-width="130px" style="width:60%;margin-top:20px;">
                  <opinion-input-type v-for=" (val,index) in inputData" :key="val.columnName" :inputItem="inputData[index]" :ref="'input_'+val.columnName" v-show="val.hidden!==true" :oldName=oldCnName @childSaveSure="saveSure" @childCancelSure="childCancelSure"  @hasNoRepeat="hasNoRepeatFc"></opinion-input-type>                    
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
import { get, post } from '@/utils/request'
import opinionInputType from "@/views/ds/professional/opinionInputType";
import bus from '@/utils/bus'
export default {
  components: { opinionInputType },
  data() {
    return {
      ifShow: {
        classify: false
      },
      ruleForm: [],
      ruleForm2: {
        INSTANCE_NAME: "",
        INSTANCE_CODE: "",
        PARENT_ID: "",
        STRING_1: "",
        STRING_3: "",
        STRING_4: "",
        STRING_5: "",
        STRING_2: ""
      },
      inputData: [],
      id: this.$route.params.id,
      oldCnName: '',
      addItem: false,
      isSaveBtdis: false,
      parentId: '',
      hasNoRepeat: false,
      addNode: false,
      nodeList: []
    }
  },
  methods: {
    hasNoRepeatFc(val) {
      this.hasNoRepeat = val
    },
    isActive(route) {
      // console.log("route.path", route, "this.$route.path", this.$route)
      return route.path === this.$route.path
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          let latestView = null
          views.map(val => {
            if (val.name === 'professionalTerms') {
              latestView = val
            }
          })
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/ds/professionalTerms')
          }
        }
      })
    },
    // Event(e) {
    //   // console.log(e)
    //   if (e.target.id === 'pane-first') {
    //     this.ifShow.classify = false
    //   }
    // },
    getAddType() {
      get('/ds/bizTerm/getBuzTermAttrInfos', {
        buzTermId: this.$route.params.id
      }).then(res => {
        this.inputData = res.data;
        // console.log("this.ruleForm2[val.columnName]---res.data", res.data)
        this.inputData.map((val, index) => {
          if (val.columnName) {
            this.ruleForm2[val.columnName] = val.attrValue;
            this.oldCnName = this.ruleForm2["INSTANCE_NAME"]
            if (val.columnName === "SUP_ID") { // 获取parentId
              this.parentId = val.attrValue
            }
            // bus.$emit("oldCnName", this.oldCnName)
            bus.$on(val.columnName, (e) => {
            // console.log("eeeeeeeee", val.columnName, e)
              this.ruleForm2[val.columnName] = e
            // console.log("that.ruleForm2[val.columnName]", that.ruleForm2[val.columnName])
            })
          }
        })
        this.inputData.map((val, index) => {
          if (val.columnName === "PARENT_ID") { // 获取parentId(PARENT_ID或INSTANCE_NAME)
            this.$set(this.inputData[index], 'attrValueId', this.parentId)
            this.$set(this.inputData[index], 'instanceId', this.$route.params.id)
          }
        })
        // console.log("this.inputData---", this.inputData)
      })
    },
    getInputData(formName) {
      this.isSaveBtdis = true

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addItem = true
          if (this.hasNoRepeat) {
            this.addItem = true
            this.saveSure()
          }
        } else {
          this.$message.error("请按照提示输入");
          this.addItem = false
          this.isSaveBtdis = false
          return false;
        }
      });
    },
    saveSure() {
      if (this.addItem) {
        let params = { instanceId: this.$route.params.id }
        this.inputData.map(val => {
          let columnName = this.underlineToHump(val.columnName)
          params[columnName] = this.$refs['input_' + val.columnName][0].inputData
        })
        post('/ds/bizTerm/updateBuzTerm', params).then(val => {
          if (val.code === 10000 & val.success) {
            this.isSaveBtdis = false
            this.addItem = false
            this.$message({
              message: val.message,
              type: 'success'
            });
            this.closeSelectedTag(this.$route)
            this.$router.push({
              name: "professionalTerms",
              params: {
                nodeList: this.nodeList,
                addNode: this.addNode
              }
            });
          } else {
            this.isSaveBtdis = false
            this.addItem = false
            this.$message.error(val.message);
          }
        })
      }
      // this.isSaveBtdis = false
    },
    childCancelSure() {
      this.addItem = false
      this.isSaveBtdis = false
    },
    underlineToHump(str) {
      // 先转小写
      let strs = str.toLowerCase();
      // 以下滑线分割字符串
      strs = strs.split("_");
      // 将第二个字符开始后面的字符首字母都大写
      for (var i = 1; i < strs.length; i++) {
        if (strs[i] !== undefined) { strs[i] = strs[i].substr(0, 1).toUpperCase() + strs[i].substr(1); }
      }
      // 组装字符串
      let res = "";
      for (var j = 0; j < strs.length; j++) { res += strs[j]; }
      return res;
    }
  },
  created() {
    this.getAddType(this.id)
    this.nodeList = this.$route.params.nodeList;
  },
  mounted() {
    bus.$on('getNodeArr', (msg) => {
      // console.log(msg === this.$route.params.nodeList)
      // console.log("msgmsgmsgmsgwww", msg)
      if (msg === this.$route.params.nodeList) {
        this.addNode = false
      } else {
        this.addNode = true
        this.nodeList = msg
      }
    })
  }
}
</script>
<style lang="scss" scoped>
//外层card容器样式
@import "./../../../styles/dq/main-card-table.scss";
$color-grey-light: #E0E0E0;
$color-border:#DCDFE6;
$color-font:#C0C4CC;
.new-editor-container{
    padding:12px;
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
</style>