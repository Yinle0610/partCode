<template>
  <el-collapse v-model="aActiveCollapse">
    <el-collapse-item title="基本信息"
                      name="基本信息">
      <el-table :data="oBaseInfo.aTableData"
                v-loading="oBaseInfo.bLoading"
                :show-header="false"
                :cell-style="cellNameBg"
                border
                size="small"
                style="width: 100%">
        <el-table-column prop="key"
                         label=""
                         width="200">
        </el-table-column>
        <el-table-column prop="value"
                         label="">
                         <template slot-scope="scope">
                           <span v-html="scope.row.value"></span>
                         </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
    <el-collapse-item title="属性信息"
                      name="属性信息">
      <div v-loading="oAttsinfo.bLoading">
        <el-table :data="oAttsinfo.aTableData"
        v-if="!oAttsinfo.bLoading"
        :show-header="false"
        :cell-style="cellNameBg"
        border
        size="small"
        style="width: 100%">
        <el-table-column prop="name"
                  label=""
                  width="200">
        </el-table-column>
        <el-table-column prop="value"
                  label="">
        <template slot-scope="scope">
        <span v-if="scope.row.name === '存储过程内容'&&scope.row.value" v-highlight><pre><code class='lang-SQL hljs'>{{ scope.row.value }}</code></pre></span>
        <span v-else-if="scope.row.name === 'SQL'&&scope.row.value" v-highlight><pre><code class='lang-SQL hljs'>{{ scope.row.value }}</code></pre></span>
        <span v-html="scope.row.value" v-else></span>
        </template>
        </el-table-column>
        </el-table>
      </div>
      
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  data () {
    return {
      aActiveCollapse: ['基本信息', '属性信息']
    }
  },
  props: ['oBaseInfo', 'oAttsinfo'],
  methods: {
    cellNameBg (params) {
      if (params.columnIndex === 0) {
        return 'background: #f5f7f9'
      }
    }
  },
  watch: {
    oBaseInfo: {
      handler(newValue, oldValue) {
        console.log(this.oBaseInfo, 'basInfo')
      },
      deep: true
    }
  }
}
</script>
