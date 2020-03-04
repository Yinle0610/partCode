<template>
  <div>
    <ul class="list-box">
      <li v-for="(item,index) in oList.aList" :key="item.instanceId"
          @click="goSelect(item,index)" :class="{cheack:index===which}">
        <el-tooltip effect="dark"
                    :content="item.classifierId"
                    placement="right">
          <div>{{item.classifierId}}</div>
        </el-tooltip>
        <div class="md-textcon text-ellipsis">
          <div class="textcon-top">
            {{item.instanceCode}}({{item.instanceName}})
          </div>
          <div class="textcon-bottom text-ellipsis">
            <!-- <span>元数据类型：{{item.classifierName}}（{{item.classifierId}})</span>&nbsp;&nbsp;|&nbsp;&nbsp; -->
            <span>上下文路径：{{item.nameContext}}</span>
          </div>
        </div>
        <div class="el-icon-arrow-right" @click.prevent="goDetail(item)" style="position: absolute;right:0;font-size:24px;color:#999;"></div>
      </li>
    </ul>
    <el-pagination background
                   @size-change="handleSize"
                   @current-change="handleCurrent"
                   :current-page="oList.iCurrentPage"
                   :page-sizes="[10, 20, 30, 40]"
                   :page-size="oList.iCurrentSize"
                   layout="sizes, prev, pager, next"
                   size="mini"
                   :total="oList.iTotal" v-if="oList.aList.length>0">
    </el-pagination>
    <div v-else style="text-align:center;color:#999;margin-top:20px;">暂无数据</div>
  </div>
</template>

<script>
export default {
  props: ['oList'],
  watch: {
    oList: {
      handler(newValue, oldValue) {
        console.log(this.oList, newValue)
      },
      deep: true // 只要当obj中的值改变就会触发这个函数且,newValue,oldValue两个参数值相同;/
    }
  },
  data() {
    return {
      which: null,
      instanceId: null
    }
  },
  methods: {
    handleSize (value) {
      this.$emit('size-change', value)
    },
    handleCurrent (value) {
      this.$emit('current-change', value)
    },
    goSelect (item, index) {
      this.which = index;
      this.instanceId = item.instanceId;
      let obj = {
        id: item.instanceId,
        classifierId: item.classifierId,
        code: item.instanceCode,
        name: item.instanceName,
        path: item.nameContext,
        namespace: item.namespace,
        parentId: item.parentId
      }
      this.$emit('instanceId', obj)
      // console.log(item)
    },
    goDetail(item) {
      console.log(item)
      this.$router.push({
        name: 'impactAndLineageDetail',
        params: {
          id: item.instanceId,
          _title: item.instanceName,
          classifierId: item.classifierId // 元数据类型ID
        }
      })
      this.$emit('close')
    }
  },
  created() {
    console.log(this.oList)
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import "../../../styles/variables";

$list-redius-bg: #2b85e4;

.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.list-box {
  padding: 0;
  margin: 0;
  .cheack{
    background-color: #f5f5f5;
  }
  li {
    padding: 15px 10px;
    display: flex;
    align-items: center;
    position: relative;
    border-bottom: 1px solid $border;
    cursor: pointer;
    .el-tooltip {
      width: 54px;
      height: 54px;
      background-color: $list-redius-bg;
      border-radius: 100%;
      font-size: 14px;
      line-height: 54px;
      color: $white;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: center;
    }
    .md-textcon {
      margin-left: 15px;
      width:calc(100% - 110px);
      .textcon-top {
        line-height: 30px;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .textcon-bottom {
        line-height: 24px;
        font-size: 12px;
        color: #666;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;    
      }
    }
  }
}

.el-pagination {
  text-align: center;
  margin-top: 15px;
}
</style>