<template>
  <div class="data-map">
    <el-card shadow="hover" class="card-container" id="sample_content" ref="sample_content">
      <div slot="header" class="clearfix">
        <span class="header_title">血统分析：{{this.$route.params._title}}</span>
        <div v-show="!bSvgLineageIsShow" class="bottom">
          <el-form inline>
            <el-form-item label="ETL信息:">
              <el-select v-model="oSearchForm.showETL" size="mini" style="width: 100px;" @change="handleETLChange">
                <el-option label="显示" value="0"></el-option>
                <el-option label="隐藏" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="显示模式:">
              <el-select v-model="oSearchForm.showMode" size="mini" style="width: 100px;" @change="handleModeChange">
                <el-option label="代码" value="0"></el-option>
                <el-option label="名称" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain size="mini" @click="upStream">回溯上游
                <i class="icon-class icon-up-stream"></i></el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- canvas画布区域 -->
      <data-flow-analysis ref="dataFlow"
                          :metadataId="this.$route.params.id"
                          :classifierId="this.$route.params.classifierId"
                          :dataFlowType="'backward'"
                          :bSvgLineageIsShow="bSvgLineageIsShow">
      </data-flow-analysis>
    </el-card>
  </div>
</template>
<script>
import DataFlowAnalysis from '@/components/Dlieage/DataFlowAnalysis.vue'
export default {
  name: 'lineageAnalysisCanvas',
  components: { DataFlowAnalysis },
  data() {
    return {
      bSvgLineageIsShow: this.$route.params.bSvgLineageIsShow,
      oSearchForm: {
        showETL: '1',
        showMode: '0'
      }
    }
  },
  methods: {
    upStream() {
      this.$refs.dataFlow.doDataFlow()
    },
    handleETLChange() {
      this.$refs.dataFlow.switchShowEtl(this.oSearchForm.showETL)
    },
    handleModeChange() {
      this.$refs.dataFlow.switchMode(this.oSearchForm.showMode)
    }
  }
}
</script>
<style lang="scss" scoped>
  .data-map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 10px 0 10px;
    overflow-y: auto;

    .card-container{
      height: calc(100% - 10px);
      /deep/ .el-card__body{
        height: calc(100% - 50px);
      }
    }

    .card-container /deep/ .header_title {
      line-height: 39px;
      font-weight: 700;
    }

    .card-container /deep/ .el-form-item {
      margin-bottom: 0;
    }

    .card-container /deep/ .el-card__header {
      padding: 10px 16px;

      div.bottom {
        float: right;
      }

      button.item {
        i.icon-class {
          display: inline-block;
          width: 16px;
          height: 11px;
          margin-left: -1px;
          margin-top: 0;
        }
        i.icon-up-stream {
          background: url("../../../src/assets/images/to_upper.png") no-repeat;
          background-size: 12px 12px;
        }
      }
    }
  }
</style>
