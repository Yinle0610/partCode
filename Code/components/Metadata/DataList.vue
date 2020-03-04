<template>
  <div>
    <ul class="list-box">
      <li v-for="item in oList.aList"
          @click="goDetail(item)">
        <el-tooltip effect="dark"
                    :content="item.classifierId"
                    placement="right">
          <div>{{item.classifierId}}</div>
        </el-tooltip>
        <div class="md-textcon text-ellipsis">
          <div class="textcon-top">
            {{item.code}}
            <!-- <span>INFO作业</span> -->
          </div>
          <div class="textcon-bottom text-ellipsis">
            <span>元数据类型：{{item.classifierName}}（{{item.classifierId}})</span>&nbsp;&nbsp;|&nbsp;&nbsp;
            <span>上下文路径：{{item.path}}</span>
          </div>
        </div>
      </li>
    </ul>
    <el-pagination background
                   @size-change="handleSize"
                   @current-change="handleCurrent"
                   :current-page="oList.iCurrentPage"
                   :page-sizes="[10, 20, 30, 40]"
                   :page-size="oList.iCurrentSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="oList.iTotal">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: ['oList'],
  methods: {
    handleSize (value) {
      this.$emit('size-change', value)
    },
    handleCurrent (value) {
      this.$emit('current-change', value)
    },
    goDetail (item) {
      this.$emit('go-detail', item)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import "../../styles/variables";

$list-redius-bg: #2b85e4;

.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.list-box {
  padding: 0;
  margin: 0;
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
      .textcon-top {
        line-height: 30px;
        font-size: 14px;
      }
      .textcon-bottom {
        line-height: 24px;
        font-size: 12px;
        color: #666;
      }
    }
  }
}

.el-pagination {
  text-align: center;
  margin-top: 15px;
}
</style>