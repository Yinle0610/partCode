<template>
    <div class="process-container">
        <el-container>
            <el-aside width="240px" class="card-box">
                <el-card shadow="hover">
                    <div class="top">
                        <span class="title">流程详情</span>
                        <el-tag size="mini" >
                            {{wData.process.doing}}
                        </el-tag>
                    </div>
                    <div class="content">
                        <p>活动名称： {{wData.process.name}}</p>
                        <p>开始日期： {{wData.process.date}}</p>
                        <p>流程类型： {{wData.process.type}}</p>
                        <p>发起人： {{wData.process.createUser.username}}</p>
                        <p v-if="wData.process.type!=='数据标准发布'">
                            问题编号：{{wData.process.id}}
                        </p>
                    </div>
                </el-card>
            </el-aside>
            <el-main>
                <div :class="key+1==wData.processesData.length&&val.action!=='办结'?'main-box  last-div':' main-box'" v-for="(val,key) in wData.processesData" :key="key">
                    <i class="circle-check ios-more" v-if="key+1==wData.processesData.length&&val.action!=='办结'"></i>
                    <i class="el-icon-circle-check" v-else></i>
                    <el-card shadow="hover">
                        <div class="item">
                            <div class="top">
                                <span class="circle">{{val.taskName?(val.taskName).substr(0,1):'发'}}</span>
                                <span class="title">{{val.taskName?val.taskName:'发起工单'}}</span>
                               <el-tag size="mini" type="success" v-if="val.action&&(val.action==='审批通过'||val.action==='经办人通过')">
                                    {{val.action}}
                                </el-tag>
                               <el-tag size="mini" type="danger" v-if="val.action&&(val.action==='退回'||val.action==='审批驳回')">
                                    {{val.action}}
                                </el-tag>
                            </div>
                            <div class="content">
                                <div class="text" v-if="val.actionUser">
                                    <el-tooltip  effect="dark" content="操作人" placement="bottom">
                                        <i class="el-icon-user-solid" ></i>
                                    </el-tooltip>
                                    {{val.actionUser.username}}
                                </div>
                                <div class="text" v-if="val.startTime">
                                    <el-tooltip  effect="dark" content="开始时间" placement="bottom">
                                        <i class="start-time" ></i>
                                    </el-tooltip>
                                    {{val.startTime}}
                                </div>
                                <div class="text" v-if="val.actionTime">
                                    <el-tooltip  effect="dark" content="办理时间" placement="bottom">
                                        <i class="el-icon-time" ></i>
                                    </el-tooltip>
                                    {{val.actionTime}}
                                </div>
                                <div class="text" v-if="val.duration">
                                    <el-tooltip  effect="dark" content="历经时长" placement="bottom">
                                        <i class="yongshi" ></i>
                                    </el-tooltip>
                                      {{val.duration}}
                                </div>
                                <div class="text" v-if="val.checkUser">
                                    <el-tooltip  effect="dark" content="审核人" placement="bottom">
                                        <i class="shenghe" ></i>
                                    </el-tooltip>
                                        {{val.checkUser.username}}
                                </div>
                                <div class="text" v-if="val.supportUser">
                                    <el-tooltip  effect="dark" content="协办人" placement="bottom">
                                        <i class="support" ></i>
                                    </el-tooltip>
                                        {{val.supportUser.username}}
                                </div>
                                <div class="text" v-if="val.consultUser">
                                    <el-tooltip  effect="dark" content="参阅人" placement="bottom">
                                        <i class="consult" ></i>
                                    </el-tooltip>
                                        {{val.consultUser.username}}
                                </div>
                                <div class="text" v-if="val.mainUser">
                                    <el-tooltip  effect="dark" content="主办人" placement="bottom">
                                        <i class="sponsor" ></i>
                                    </el-tooltip>
                                        {{val.mainUser.username}}
                                </div>
                                <div class="text" v-if="val.message">
                                    <el-tooltip  effect="dark" content="处理意见" placement="bottom">
                                        <i class="detail" ></i>
                                    </el-tooltip>
                                        {{val.message}}
                                </div>
                                <div class="text" v-if="val.attach&&val.attach.attachName">
                                    <el-tooltip  effect="dark" content="附件" placement="bottom">
                                        <i class="el-icon-link" ></i>
                                    </el-tooltip>
                                        <a  :href="api+'/kno/doc/downloadAttachFile.do?attachId='+val.attach.attachId+'&token='+ token" style="color: #2d8cf0;">{{val.attach.attachName}}</a>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import { get } from '@/utils/request'
import { getToken } from "@/utils/auth";
export default {
  name: 'process',
  data() {
    return {
      wData: {
        process: {
          name: '',
          date: '',
          type: '',
          createUser: {},
          id: '',
          doning: ''
        },
        processesData: []
      },
      api: '',
      token: ''
    }
  },
  methods: {
    getData(id) {
      get('/home/matter/queryTaskProcesses', {
        processId: id
      }).then(res => {
        console.log(res)
        if (res.code === 10000) {
          let data = res.data
          this.wData.process = {
            name: data.caseName,
            date: data.createTime,
            type: data.categoryName,
            createUser: data.createUser,
            id: data.businessId,
            doing: data.caseType
          }
          this.wData.processesData = data.processes
          console.log(this.wData.processesData)
        }
      })
    }
  },
  created() {
    this.getData(this.$route.query.id)
    this.api = process.env.BASE_API;
    this.token = getToken()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import "../../styles/variables";
@import "../../styles/treeIcon";
@import "./../../styles/dq/main-card-table.scss";
.process-container{
    padding:20px;
    .el-container{
        .el-main{
            padding:0;
            position: relative;
            .main-box{
                position: relative;
                width:100%;
                padding-left:100px;
                margin-bottom: 10px;
                .circle-check{
                    position: absolute;
                    margin-top:-17px;
                    top: 50%;
                    left: 33px;
                    background: url(../../assets/images/ddd.png) no-repeat;
                    background-size: 34px 34px;
                    width: 34px;
                    height: 34px;
                    display: inline-block;
                }
                .el-icon-circle-check{
                position: absolute;
                top: 50%;
                left: 33px;
                margin-top:-17px;
                font-size: 34px;
                z-index:1;
                color:#2d8cf0
                }
                .item{
                    position: relative;
                    width: 100%;
                    .top{
                        .circle{
                            display:inline-block;
                            width:30px;
                            height:30px;
                            border-radius: 50%;
                            background: #2d8cf0;
                            color:#fff;
                            font-size:16px;
                            margin-right: 10px;
                            text-align: center;
                            line-height: 30px;
                        }
                        .title{
                            display:inline-block;
                            font-size:14px;
                            font-weight: 600;
                        }
                    }
                    .content{
                        position: relative;
                        padding-left: 20px;
                        margin-top: 8px;
                        .text{
                        font-size:12px;
                        color:#666;
                        line-height: 22px;
                        i{
                            color:#666;
                            font-size:16px;
                            position: relative;
                            top: -1px;
                        }
                        .start-time,.yongshi,.detail,.sponsor,.shenghe,.consult{
                            width: 16px;
                            height: 16px;
                            position: relative;
                            top:2px;
                            display: inline-block;
                            background-size: 17.5px 17.5px;
                            cursor: pointer;
                        }
                        .start-time{
                            background: url(../../assets/images/stratTime.png) no-repeat;
                            background-size: 17.5px 17.5px;

                        }
                        .yongshi{
                            background: url(../../assets/images/yongshi.png) no-repeat;
                            background-size: 17.5px 17.5px
                        }
                        .detail{
                            background: url(../../assets/images/write.png) no-repeat;
                            background-size: 17.5px 17.5px
                        }
                        .sponsor{
                            background: url(../../assets/images/peple.png) no-repeat;
                            background-size: 17.5px 17.5px
                        }
                        .consult{
                            background: url(../../assets/images/people3.png) no-repeat;
                            background-size: 17.5px 17.5px
                        }
                        .shenghe{
                            background: url(../../assets/images/people1.png) no-repeat;
                            background-size: 17.5px 17.5px
                        }
                        .support{
                            background: url(../../assets/images/people4.png) no-repeat;
                            background-size: 17.5px 17.5px;
                            width: 16px;
                            height: 16px;
                            position: relative;
                            top:2px;
                            display: inline-block;
                            background-size: 17.5px 16px;
                            cursor: pointer;
                        }
                        }
                    }
                }
            }
            .main-box:before{
                content: "";
                position: absolute;
                width:2px;
                height:calc(50% - 20px);
                background: #2d8cf0;
                top:0;
                left: 49px;
                z-index:0;
            }
            .main-box:after{
                content: "";
                position: absolute;
                width: 2px;
                height: 50%;
                background: #2d8cf0;
                top: calc(50% + 20px);
                left: 49px;
                z-index: 0;
            }
            .main-box:first-child:before,.main-box:last-child:after{
                background: none;
                width:0;
                height:0;
            }
            .last-div:after {
                content: "";
                position: absolute;
                width: 1px!important;
                height: 25%!important;
                background: rgb(158,158,158)!important;
                top: calc(50% + 20px);
                left: 49px;
                z-index: 0;
            }
            .el-icon-circle-check{
                position: absolute;
                top: 50%;
                left: 33px;
                margin-top:-17px;
                font-size: 34px;
                z-index:1;
            }

        }
        .card-box{
            .top{
            margin-bottom: 6px;
            .title{
                margin-right: 10px;
                font-size: 14px;
                font-weight: 600;
                position: relative;
            }
            }
        .content{
            font-size:12px;
            line-height: 26px;
            p{
            margin:10px 0;
            }
        }
        }
    }
}
</style>
