<template>
  <div class="data-map">
    <el-card shadow="hover" class="card-container" id="sample_content" ref="sample_content">
      <div slot="header" class="clearfix">
        <span class="header_title">{{generateTitle}}：{{this.$route.params._title | handleTitle}}</span>
        <div class="bottom">
          <el-form inline>
            <el-form-item label="关系信息:">
              <el-select v-model="oSearchForm.showLinkText" size="mini" style="width: 100px;" @change="handleLinkTextChange">
                <el-option label="显示" value="1"></el-option>
                <el-option label="隐藏" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="显示模式:">
              <el-select v-model="oSearchForm.showMode" size="mini" style="width: 100px;" @change="handleModeChange">
                <el-option label="代码" value="0"></el-option>
                <el-option label="名称" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- canvas画布区域 -->
      <lineage-analysis ref="lineageAnalysis"
                          :id="id"
                          :dataFlowType="dataFlowType"
                          :titleName="$route.params._title">
      </lineage-analysis>
    </el-card>
  </div>
</template>
<script>
  import LineageAnalysis from '@/components/Dlieage/DS/LineageAnalysis'
  export default {
    name: 'dsLineageAnalysisCanvas',
    components: { LineageAnalysis },
    data() {
      return {
        oSearchForm: {
          showMode: '1',
          showLinkText: '1'
        },
        id: this.$route.params.id,
        dataFlowType: this.$route.params.dataFlowType
      }
    },
    computed: {
      generateTitle() {
        let dataFlow = {
          forward: '血统分析-应用(Uage)',
          backward: '血统分析-参考(Reference)',
          full: '血统分析-全链(Ref&Uage)'
        }
        return dataFlow[this.dataFlowType]
      }
    },
    filters: {
      handleTitle: function (title) {
        if (!title) {
          return ''
        }
        return title.substring(title.indexOf('-') + 1)
      }
    },
    methods: {
      handleModeChange() {
        this.$refs.lineageAnalysis.switchMode(this.oSearchForm.showMode)
      },
      handleLinkTextChange() {
        this.$refs.lineageAnalysis.switchShowLinkText(this.oSearchForm.showLinkText)
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
