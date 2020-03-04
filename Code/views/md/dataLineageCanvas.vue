<template>
  <div class="data-map">
    <el-card shadow="hover" class="card-container" id="sample_content" ref="sample_content">
      <div slot="header" class="clearfix">
        <span class="header_title">数据血缘：{{this.$route.params._title}}</span>
        <div v-show="!bSvgLineageIsShow" class="bottom">
          <el-form inline>
            <el-form-item v-if="showLevel" label="层级:">
              <el-select v-model="oSearchForm.showLevel" size="mini" style="width: 100px;" @change="handleLevelChange">
                <el-option label="简单" value="0"></el-option>
                <el-option label="详细" value="1"></el-option>
              </el-select>
            </el-form-item>
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
            <!--<el-form-item>
              <el-button type="primary" plain size="mini" class="item" @click="downStream">展开下游
                <i class="icon-class icon-down-stream"></i></el-button>
            </el-form-item>-->
          </el-form>
        </div>
      </div>
      <!-- canvas画布区域 -->
      <data-lineage-analysis ref="dataFlow"
                          :metadataId="this.$route.params.id"
                          :classifierId="this.$route.params.classifierId"
                          :dataFlowType="'endToEnd'"
                          :bSvgLineageIsShow="bSvgLineageIsShow">
      </data-lineage-analysis>
    </el-card>
  </div>
</template>
<script>
import DataLineageAnalysis from '@/components/Dlieage/DataLineageAnalysis'
export default {
  name: 'dataLineageCanvas',
  components: { DataLineageAnalysis },
  data() {
    return {
      bSvgLineageIsShow: this.$route.params.bSvgLineageIsShow,
      oSearchForm: {
        showETL: '1',
        showMode: '0',
        showLevel: '0'
      },
      canShowLevelClassifierIds: ['Table', 'View', 'Transformation']
    }
  },
  computed: {
    showLevel () {
      return this.canShowLevelClassifierIds.includes(this.$route.params.classifierId);
    }
  },
  methods: {
    downStream() {
      this.$refs.dataFlow.doDataFlow()
    },
    handleETLChange() {
      this.$refs.dataFlow.switchShowEtl(this.oSearchForm.showETL)
    },
    handleModeChange() {
      this.$refs.dataFlow.switchMode(this.oSearchForm.showMode)
    },
    handleLevelChange() {
      this.$refs.dataFlow.switchShowLevel(this.oSearchForm.showLevel)
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
          line-height: 11px;
          margin-left: -1px;
          margin-top: 0;
        }

        i.icon-down-stream {
          background: url("../../../src/assets/images/to_next.png") no-repeat;
          background-size: 12px 12px;
        }
      }
    }
  }
</style>
