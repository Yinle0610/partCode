<!--问题查询-手工提交-问题详情页面-->
<template>
  <div class="auditingQuesDetails dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <el-steps :active="active" finish-status="success " process-status="process" style="height: 87px">
        <el-step title="已提交" description="已提交问题相关信息,等待下一步处理..."></el-step>
        <el-step title="已受理" description="问题已受理,已指派专人跟进..."></el-step>
        <el-step title="解决中" description="正在分析问题原因以及评估问题影响范围..."></el-step>
        <el-step title="已解决" description="已提交解决方案,待发起人确认..."></el-step>
        <el-step title="已关闭" description="发起人已接受解决方案,问题已关闭"></el-step>
      </el-steps>
      <el-divider></el-divider>

      <el-form ref="form" :model="form" label-width="12.0%">
        <div id="submitted" :style="{display: (active===0 ? 'block':'none')}" >
          <el-form-item label="问题描述：">
            <el-input :rows="5" readonly type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item label="影响范围：">
            <el-input :rows="3" readonly type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="来源：" prop="source" label-width="37.5%">
                <el-input size="small" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="问题等级：" prop="ques" label-width="37.5%">
                <el-input size="small" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期望解决时间:" label-width="37.5%">
                <el-form-item prop="date1">
                  <el-date-picker
                      readonly
                      size="small"
                      type="date"
                      placeholder="选择日期"
                      v-model="form.date1"
                      style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="发起人：">
            <el-tag type="info" size="small">标签三</el-tag>
          </el-form-item>
          <el-form-item label="涉及系统：">
            <el-tag type="info" size="small">标签三2</el-tag>
          </el-form-item>
          <el-form-item label="涉及表：">
            <el-tag type="info" size="small"><a class="a-color" @click="clickToMetaDataDetails">b04_agency</a></el-tag>
          </el-form-item>
          <el-form-item label="初步分析：：">
            <el-input readonly type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item label="提升建议：">
            <el-input readonly type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item label="附件：">
            <span class="a-color">无</span>
          </el-form-item>
        </div>

        <div id="accepted" :style="{display: (active===1 ? 'block':'none')}" >
          <el-form-item label="受理描述：">
            <el-input :rows="1" readonly type="textarea" v-model="form.desc" value="改造这张表的数据"></el-input>
          </el-form-item>
          <el-form-item label="责任项目组：">
            <el-tag type="info" size="small">信息技术部</el-tag>
          </el-form-item>
          <el-form-item label="责任项目组：">
            <el-tag type="info" size="small">徐卫政</el-tag>
          </el-form-item>
        </div>

        <div id="solving" :style="{display: (active===2 ? 'block':'none')}">
          <el-form-item label="问题原因分析：">
            <el-input :rows="1" readonly type="textarea" v-model="form.desc" value="改造这张表的数据"></el-input>
          </el-form-item>
          <el-form-item label="问题影响范围：">
            <el-input :rows="1" readonly type="textarea" v-model="form.desc" value="改造这张表的数据2"></el-input>
          </el-form-item>
          <el-form-item label="原因分类：">
            <el-tag type="info" size="small">源系统数据变更</el-tag>
          </el-form-item>
          <el-form-item label="质量维度：">
            <el-tag type="info" size="small">准确性</el-tag>
          </el-form-item>
          <el-form-item label="涉及系统：">
            <el-tag type="info" size="small">11</el-tag>
          </el-form-item>
          <el-form-item label="涉及表信息：">
            <el-tag type="info" size="small"><a class="a-color">b04_agency</a></el-tag>
          </el-form-item>
          <el-form-item label="涉及字段信息：">
            <el-tag type="info" size="small">无</el-tag>
          </el-form-item>
        </div>

        <div id="resolved" :style="{display: (active===3 ? 'block':'none')}">
          <el-form-item label="解决方案：">
            <el-input :rows="1" readonly type="textarea" v-model="form.desc" value="123"></el-input>
          </el-form-item>
          <el-form-item label="解决计划明细：">
            <el-input :rows="1" readonly type="textarea" v-model="form.desc" value="456"></el-input>
          </el-form-item>
          <el-form-item label="附件：">
            <span class="a-color">无</span>
          </el-form-item>
        </div>
        <!-- 已关闭 -->
        <div id="closed" :style="{display: (active===4 ? 'block':'none')}">
          <div align="center">
            <i class="el-icon-success" style="font-size: 50px; color: rgb(0, 204, 102);"></i>
          </div>
          <div align="center" class="closed-text">
            <h3>问题已关闭</h3>
            <span>问题关闭人：</span>
            <span>管理员</span>
            <span>关闭时间：</span>
            <span>2019-08-09 10:14:11</span>
          </div>
        </div>
        <div id="reject" style="display: none">

        </div>

        <el-divider></el-divider>
        <el-form-item align="right" >
          <el-button size="small" v-if="active===0" disabled="">上一步</el-button>
          <el-button size="small" v-else type="primary" @click="preStep">上一步</el-button>
          <el-button size="small" v-if="active===4" disabled>下一步</el-button>
          <el-button size="small" v-else type="primary" @click="next">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'detailsProblem',
    data() {
      return {
        active: 0,
        form: {

        }

      }
    },
    methods: {
      clickToMetaDataDetails() {
        this.$router.push({
          name: 'impactAndLineageDetail',
          params: {}
        })
      },
      preStep() {
        if (this.active-- < 1) this.active = 0
      },
      next() {
        if (this.active++ > 4) this.active = 0
      }
    },
    mounted() {

    }
  }
</script>


<style lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';

  .el-step__title {
    font-size: 14px;
  }

  .el-form-item {
    margin-bottom: 16px;
  }

  .a-color:hover{
    color: #57a3f3;
  }
  .closed-text{
    color: #515a6e;
    h3{
      margin: 4px 0;
      font-size: 16px;
    }
    span{
      font-size: 14px;
    }
  }

</style>
