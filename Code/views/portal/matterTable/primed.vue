<template>
  <div>
    <el-table
      :data="aTableData"
      border
      show-header
      :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
      style="width: 100%"
    >
      <el-table-column prop="title" label="标题">
        <template slot-scope="scope">
          <el-button @click="toDetails(scope.row.docId)" type="text">{{scope.row.title}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="创建人"></el-table-column>
      <el-table-column prop="spaceName" label="空间"></el-table-column>
      <el-table-column prop="createDate" label="标签">
        <template slot-scope="scope">
          <div v-for="(item, index) in [scope.row.labelNames] " :key="index">{{item}}</div>
        </template>
      </el-table-column>

      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column prop="lastUpdateTime" label="更新时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row.docId)" type="primary" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>

<style>
</style>