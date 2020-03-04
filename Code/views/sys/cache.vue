<template>
  <div class="data-sync">
    <el-card class="box-card">
      <el-form>
        <el-form-item>
          <el-button type="primary" size="mini" @click="doClearMetaModel">清空元模型缓存</el-button>
          <span class="op-tip">清空掉系统缓存的所有元模型以及元模型属性(包括元数据、数据标准)</span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { post, parseAjaxResponse } from '@/utils/request'
export default {
  name: 'cache',
  data() {
    return {
    }
  },
  methods: {
    doClearMetaModel() {
      post('/sys/cache/clearMetaModel').then(res => {
        parseAjaxResponse(res)
      })
    }
  }
}
</script>
<style lang="scss">
.data-sync {
  .box-card{
    margin:10px 10px 0 10px;
    height: 700px;
    .card-head{
      display: block;
      margin-bottom: 10px;
      font-weight: bold;
      font-size:16px
    }

    .op-tip {
      color: #8a8a88;
    }
  }
}
</style>
