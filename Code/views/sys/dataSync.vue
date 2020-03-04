<template>
  <div class="data-sync">
    <el-card class="box-card">
      <div class="metadata-box">
        <div class="metadata-box-top">
          <span>元数据同步</span>
          <el-tooltip class="item" effect="dark" content="手动触发元数据全量同步" placement="right">
            <svg-icon icon-class="tips-sys"></svg-icon>
          </el-tooltip>
        </div>
        <div class="metadata-box-contain">
          <el-button  type="primary" class="start-btn" size="small" @click="doFullSyncMetadata"><svg-icon icon-class="start-play"></svg-icon>开始</el-button>
          <span class="contain-text">最近全量同步时间:{{lastMetaDataSynTime}}</span>
          <el-button class="contain-text" type="text" @click="mDSynDetailShow">详情</el-button>
        </div>
      </div>
      <div class="metadata-box">
        <div class="metadata-box-top">
          <span>数据标准同步</span>
          <el-tooltip class="item" effect="dark" content="手动触发数据标准全量同步" placement="right">
            <svg-icon icon-class="tips-sys"></svg-icon>
          </el-tooltip>
        </div>
        <div class="metadata-box-contain">
          <el-button  type="primary" class="start-btn" size="small" @click="doFullSyncDataStandard"><svg-icon icon-class="start-play"></svg-icon>开始</el-button>
          <span class="contain-text">最近全量同步时间:{{lastdataStandardSynTime}}</span>
          <el-button class="contain-text" type="text" @click="dSSynDetailShow">详情</el-button>
        </div>
      </div>
      <div class="metadata-box">
        <div class="metadata-box-top">
          <span>ASG元数据同步</span>
          <el-tooltip class="item" effect="dark" content="手动触发元数据全量同步" placement="right">
            <svg-icon icon-class="tips-sys"></svg-icon>
          </el-tooltip>
        </div>
        <div class="metadata-box-contain">
          <el-form class="mount-point">
            <el-form-item label="挂载点: " >
              <el-select v-model="mountPointAsg" placeholder="请选择" size='small'
               @visible-change="handleSelectChange" >
                  <el-option :value="optionValue" style="height: auto;font-weight:500!important;">
                    <el-tree :props="defaultProps"
                             style="margin:0px -20px"
                             accordion
                              :load="loadNode"
                              node-key="id"
                              ref="tree"
                              lazy
                              :highlight-current="true"
                              empty-text="暂无数据"
                              @node-click="handleNodeClick">
                    </el-tree>
                  </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button  type="primary" class="start-btn" size="small" @click="doFullySyncAsgMetadata" :disabled="buttonOfAsgIsDis"><svg-icon icon-class="start-play"></svg-icon>开始</el-button>
          <span class="contain-text">最近全量同步时间:{{asgMetadataSynTime}}</span>
          <el-button class="contain-text" type="text" @click="synASGDetailShow">详情</el-button>
        </div>
      </div>
    </el-card>
    <div class="detail">
       <el-dialog :visible.sync="isDetailDialogShow"  width="400px" close="closeDialog">
          <div slot="title" class="dialog-top">
            <span class="dialog-topspan">同步详情</span>
            <el-button type="text" icon="el-icon-refresh" @click.native="refreshDetail"  :loading="isDialogload" size="mini" style="color:#D9D9D9;font-size:20px;margin-left:5px"></el-button>
          </div>
          <div class="content" v-for="(item,index) in detailList" :key="item.key">
            <el-row :gutter="10">
              <el-col :span="10" style="text-align:right">{{ item.label + '：' }}</el-col>
              <el-col :span="14" style="color:#67C23A" v-if="item.label==='同步状态'&&item.prop==='已完成'">{{ item.prop }}</el-col>
              <el-col :span="14" style="color:#F56C6C" v-else-if="item.label==='同步状态'&&item.prop==='有错误'||item.label==='同步错误描述'">{{ item.prop }}</el-col>
              <el-col :span="14" v-else >{{ item.prop }}</el-col>
            </el-row>
            <br>
          </div>
          <div slot="footer" class="dialog-footer" style="text-align:center">
            <el-button type="primary" @click.native="closeDialog" size="mini">确定</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>
<script>
import { get, parseAjaxResponse, post } from '@/utils/request'
export default {
  name: 'data-sync',
  data() {
    return {
      mountPointAsg: "", // 选中的挂载点名称
      mountPointAsgId: "", // 选中的挂载点Id
      optionValue: '',
      defaultProps: {
        label: 'text',
        children: 'children',
        isLeaf: 'isLeaf'
      },
      // mountPointTreeData: [],
      isDetailDialogShow: false,
      detailList: [],
      edgsMetadataSyn: [],
      lastMetaDataSynTime: '',
      dataStandardSyn: [],
      lastdataStandardSynTime: '',
      asgMetadataSyn: [],
      asgMetadataSynTime: '',
      isFold: false,
      lastMountPointAsg: "",
      lastMountPointAsgId: "",
      buttonOfAsgIsDis: false,
      whichDetail: '',
      isDialogload: false
    }
  },
  methods: {
    doFullSyncMetadata() {
      // post('/md/fullySyncMetadataToElastic').then(res => {
      //   parseAjaxResponse(res)
      // })
      post("/md/fullySyncMetadataToElastic").then(res => {
        if (res.code === 10000 && res.success === true) {
          this.$message.success(res.message);
          this.getMetadataDetail()
        } else {
          this.$message.error(res.message);
          this.getMetadataDetail()
        }
      });
    },
    doFullSyncDataStandard() {
      // post('/ds/fullySyncDataStandardToElastic').then(res => {
      //   parseAjaxResponse(res)
      // })
      post("/ds/fullySyncDataStandardToElastic").then(res => {
        if (res.code === 10000 && res.success === true) {
          this.$message.success(res.message);
          this.getDataStandarDetail()
        } else {
          this.$message.error(res.message);
          this.getDataStandarDetail()
        }
      });
    },
    doFullySyncAsgMetadata() {
      // post('/md/asg/fullySyncMetadata').then(res => {
      //   parseAjaxResponse(res)
      // })
      post("/md/asg/fullySyncMetadata").then(res => {
        if (res.code === 10000 && res.success === true) {
          this.$message.success(res.message);
          this.getASGMetadataDetail()
        } else {
          this.$message.error(res.message);
          this.getASGMetadataDetail()
        }
      });
    },
    // 详情
    synASGDetailShow() {
      this.whichDetail = 'ASG'
      this.getASGMetadataDetail()
      this.isDetailDialogShow = true
      // this.detailList = this.asgMetadataSyn
    },
    mDSynDetailShow() {
      this.whichDetail = 'MD'
      this.getMetadataDetail()
      this.isDetailDialogShow = true
      // this.detailList = this.edgsMetadataSyn
    },
    dSSynDetailShow() {
      this.whichDetail = 'DS'
      this.getDataStandarDetail()
      this.isDetailDialogShow = true
      // this.detailList = this.dataStandardSyn
    },
    refreshDetail() {
      if (this.whichDetail === 'ASG') {
        this.getASGMetadataDetail()
        // this.detailList = this.asgMetadataSyn
      } else if (this.whichDetail === 'DS') {
        this.getDataStandarDetail()
        // this.detailList = this.dataStandardSyn
      } else {
        this.getMetadataDetail()
        // this.detailList = this.edgsMetadataSyn
      }
    },
    // 挂载点Tree懒加载
    loadNode (node, resolve) {
      console.log("loadNode (node, resolve) ", node, resolve)
      if (node.level === 0) {
        get('/sys/dataSync/getASGMetadataTree', { instanceId: '0' }).then(res => {
          if (res.code === 10000 && res.success === true) {
            return resolve(res.data)
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        let params = {
          instanceId: node.data.id
        }
        get('/sys/dataSync/getASGMetadataTree', params).then(res => {
          if (res.code === 10000 && res.success === true) {
            return resolve(res.data)
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    handleSelectChange() {
      if (this.isFold) {
        this.buttonOfAsgIsDis = false
      } else {
        this.buttonOfAsgIsDis = true
      }
      if (this.isFold && this.lastMountPointAsgId !== this.mountPointAsgId) {
        this.$confirm('您当前所选挂载点与上次同步时的挂载点不一致，是否确定?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post('/sys/dataSync/saveASGMountPoint', { instanceId: this.mountPointAsgId }).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.$message.success(res.message)
              this.getLastASGMountPoint()
            } else {
              this.$message.error(res.message)
            }
          })
        }).catch(() => {
          this.mountPointAsgId = this.lastMountPointAsgId
          this.mountPointAsg = this.lastMountPointAsg
        });
      }
      this.isFold = !this.isFold
    },
    // 清空选中的挂载点Id
    mountPointAsgClear() {
      this.mountPointAsgId = ""
    },
    // 点击树节点
    handleNodeClick(data, node, resolve) {
      // console.log("handleNodeClick (data, node, resolve)", data, node, resolve)
      this.mountPointAsg = node.data.text
      this.mountPointAsgId = node.data.id
    },
    closeDialog() {
      this.isDetailDialogShow = false
    },
    // 初始化时获取最近同步时间，并把详细信息存储
    getMetadataDetail() { // 元数据详情
      let params = {
        syncType: 1
      }
      this.isDialogload = true
      get("/sys/dataSync/getRecentSyncDetail", params).then(res => {
        if (res.code === 10000) {
          this.isDialogload = false
          this.edgsMetadataSyn = res.data
          this.detailList = res.data
          res.data.map(item => {
            if (item.label === "同步开始时间") {
              this.lastMetaDataSynTime = item.prop
            }
          })
        } else {
          this.$message.error(res.message);
          this.isDialogload = false
        }
      });
    },
    getDataStandarDetail() { // 数据标准详情
      this.isDialogload = true
      get("/sys/dataSync/getRecentSyncDetail", {
        syncType: 2
      }).then(res => {
        if (res.code === 10000) {
          this.isDialogload = false
          this.dataStandardSyn = res.data
          this.detailList = res.data
          res.data.map(item => {
            if (item.label === "同步开始时间") {
              this.lastdataStandardSynTime = item.prop
            }
          })
        } else {
          this.$message.error(res.message);
          this.isDialogload = false
        }
      });
    },
    getASGMetadataDetail() { // ASG元数据同步详情
      this.isDialogload = true
      get("/sys/dataSync/getRecentSyncDetail", {
        syncType: 4
      }).then(res => {
        if (res.code === 10000) {
          this.isDialogload = false
          this.asgMetadataSyn = res.data
          this.detailList = res.data
          res.data.map(item => {
            if (item.label === "同步开始时间") {
              this.asgMetadataSynTime = item.prop
            }
          })
        } else {
          this.$message.error(res.message);
          this.isDialogload = false
        }
      });
    },
    getDetails() {
      this.getMetadataDetail()
      this.getDataStandarDetail()
      this.getASGMetadataDetail()
    },
    // 初始化时查询上一次的挂载点
    getLastASGMountPoint() {
      get("/sys/dataSync/queryASGMountPoint").then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            let data = res.data
            if (data) {
              this.mountPointAsg = data.mountMdName
              this.mountPointAsgId = data.mountMdId
              this.lastMountPointAsg = data.mountMdName
              this.lastMountPointAsgId = data.mountMdId
            }
          }
        })
      });
    }
  },
  created() {
    this.getDetails()
    this.getLastASGMountPoint()
  }
}
</script>
<style lang="scss">
.data-sync {
  .box-card{
    margin:10px 10px 0 10px;
    padding:20px 50px;
    height: 700px;
   .metadata-box{
     margin-top:10px;
     .metadata-box-top{
      border-left:5px solid #409EFF;
      padding: 10px 20px;
     }
     .metadata-box-contain{
       margin-top:10px;
       border-top: 1px solid #e8eaec;
       padding: 20px 20px;
       .start-btn{
         font-size:13px;
         padding:2px 10px 8px 10px;
         .svg-icon{
                  width:20px;
                  height:20px;
                  position: relative;
                  top: 3px;
                  right:3px;
          }
       }
       .contain-text{
         font-size:14px;
         margin-left:20px
       }
       .mount-point{
         /deep/ .el-form-item__label{
           font-size:13px;
         }
       }
     }

    }
  }
    .detail{
      .dialog-top{
        height:35px;
        line-height: 35px;
        // /deep/ .el-button{
        //   border:0px solid #DCDFE6
        // }
        /deep/ .el-button--mini, .el-button--mini.is-round{
          padding:3px 6px
        }
        .dialog-topspan{
          line-height: 35px;
          font-size: 16px;
          color: #7B7B7B;
          font-weight: 700;
          overflow: hidden;
        }
      }
      /deep/ .el-dialog__wrapper {
      .el-dialog {
        border-radius: 5px;
        .el-dialog__header {
          border-bottom: 1px solid #e8ebed;
          .el-dialog__title{
            height: 20px;
            line-height: 22px;
            font-size: 14px;
            color: #7B7B7B;
            font-weight: 700;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
      /deep/ .el-dialog__wrapper {
      .el-dialog {
        .el-dialog__footer {
          border-top: 1px solid #e8ebed;
        }
      }
    }
  }
}
</style>
