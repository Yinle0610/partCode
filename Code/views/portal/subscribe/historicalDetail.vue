<!-- 影响分析详情 -->
<template>
  <div class="impactAndLineageDetail">
    <el-card shadow="hover" class="card-container">
            <div class="metadata-info">
                <p style="font-size:18px;font-weight:600;">历史详情</p>
                <metadataInfo :oBaseInfo="oBaseInfoData" :oAttsinfo="oAttsinfoData"></metadataInfo>
            </div>
    </el-card>
  </div>
</template>
<script>
import metadataInfo from '@/components/Metadata/MetadataInfo.vue'
import { get, parseAjaxResponse } from '@/utils/request'
export default {
  name: 'historicalDetail',
  components: { metadataInfo },
  data() {
    return {
      oBaseInfoData: {
        aTableData: [
        ],
        bLoading: false
      },
      oAttsinfoData: {
        aTableData: [
        ],
        bLoading: false
      },
      code: ''
    }
  },
  methods: {
    getDelMetadataInfoList() {
      const that = this;
      let params = {
        instanceId: this.$route.params.id,
        startTime: this.$route.params.startTime
      }
      get('/home/subscribe/getInstanceHistoryDetail', params).then(res => {
        parseAjaxResponse(res, () => {
          console.log(res)
          that.oBaseInfoData.aTableData = [
            {
              "key": "元数据代码:",
              "value": res.data.code
            },
            {
              "key": "元数据名称:",
              "value": res.data.name
            },
            {
              "key": "元数据类型:",
              "value": res.data.classifierName + '(' + res.data.classifierId + ')'
            },
            {
              "key": "上下文路径:",
              "value": res.data.context
            },
            {
              "key": "生效时间:",
              "value": "-"
            }
          ]
          that.code = res.data.code
          res.data.attrInfos.map(val => {
            let obj = {
              name: val.key,
              value: val.value

            }
            that.oAttsinfoData.aTableData.push(obj)
          })
        })
      })
    },
    getMetadataInfoList() {
      const _this = this;
      get('md/detail/' + _this.id).then(res => {
        if (res.code === 10000 && res.success === true) {
          _this.oBaseInfoData.aTableData = [
            {
              "key": "元数据代码:",
              "value": res.data.code
            },
            {
              "key": "元数据名称:",
              "value": res.data.name
            },
            {
              "key": "元数据类型:",
              "value": res.data.classifierName + '(' + res.data.classifierId + ')'
            },
            {
              "key": "上下文路径:",
              "value": res.data.path
            },
            {
              "key": "生效时间:",
              "value": res.data.startTime
            }
          ]
          _this.code = res.data.code
          _this.oAttsinfoData.aTableData = res.data.attributes
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    // 变更删除时查询元数据信息
    getMetadataInfoListDel() {
      const _this = this;
      let params = {
        startTime: this.$route.params.startTime,
        instanceId: this.$route.params.id
      }
      get('/md/getAlterationInfoWhenDel', params).then(res => {
        if (res.code === 10000 && res.success === true) {
          _this.oBaseInfoData.aTableData = [
            {
              "key": "元数据代码:",
              "value": res.data.code
            },
            {
              "key": "元数据名称:",
              "value": res.data.name
            },
            {
              "key": "元数据类型:",
              "value": res.data.classifierName + '(' + res.data.classifierId + ')'
            },
            {
              "key": "上下文路径:",
              "value": res.data.path
            },
            {
              "key": "生效时间:",
              "value": res.data.startTime
            }
          ]
          _this.code = res.data.code
          _this.oAttsinfoData.aTableData = res.data.attributes
        } else {
          _this.$message.error(res.message)
        }
      })
    }
  },
  mounted() {
  },
  created() {
    this.getDelMetadataInfoList();
  }
}
</script>

<style lang="scss" scoped>
  //外层card容器样式
  @import './../../../styles/dq/main-card-table.scss';

  .title-btn-class {
    position: absolute;
    right: 10px;
    top: 20px;
    display: flex;
    z-index: 100;
    margin-right: 10px;
  }
.el-collapse-item__header{
  border-bottom:1px solid red
}
.el-table{
  font-size: 12px
}
</style>
<style>
.child-search .el-input__inner {
    width:200px;
  }
.child-search{
  text-align: right;
  margin-bottom: 10px;
}
.handleAffect,.handleBlood{
  width:80px!important;
}
</style>
