<template>
  <div class="mm-right">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span style="line-height: 30px;">元数据</span>
        <div class="filter-box">
          <el-select @change="selectSys" class="first-select" v-model="systemId" placeholder="请选择">
            <el-option
              clearable
              v-for="item in systemList"
              :key="item.instanceId"
              :label="item.instanceName"
              :value="item.instanceId"
            ></el-option>
          </el-select>
          <el-select
            clearable
            @change="selectSchema"
            class="schema-select"
            v-model="schemaId"
            placeholder="请选择Schema"
          >
            <el-option
              v-for="item in schemaList"
              :key="item.instanceId"
              :label="item.instanceName"
              :value="item.instanceId"
            ></el-option>
          </el-select>
          <el-select
            clearable
            @change="selectTable"
            class="table-select"
            v-model="tableId"
            placeholder="请选择表名"
          >
            <el-option
              v-for="item in tableList"
              :key="item.instanceId"
              :label="item.instanceName"
              :value="item.instanceId"
            ></el-option>
          </el-select>
          <el-input
            @keyup.enter.native="getDataMappingInfo"
            class="input-search"
            placeholder="请输入"
            v-model="keyword"
          ></el-input>
        </div>
      </div>
      <div class="listsBox">
        <ul class="mm-items">
          <li
            :class="[item.click? 'clicked': '']"
            @click="choseData(item, index)"
            v-for="(item,index) in dataList"
            :key="index"
          >
            <el-tooltip class="item" effect="dark" :content="item.classifierId" placement="right">
              <div class="mm-icon text-ellipsis">Table</div>
            </el-tooltip>
            <div class="mm-textcon">
              <p class="text-ellipsis">
                {{item.instanceCode}}
                <span>({{item.instanceName}})</span>
                <el-tag v-show="item.hasMapping === 1" type="success" effect="plain">已映射</el-tag>
              </p>
              <span
                class="describe text-ellipsis"
              >元数据类型：{{item.classifierName}}({{item.classifierId}})&nbsp;&nbsp;|&nbsp;&nbsp;上下文路径:{{item.nameContext}}</span>
            </div>
            <i @click.stop="clickArrow(item)" class="arrow"></i>
          </li>
        </ul>
      </div>
      <div class="page-right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageCurrent"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <div class="chose-right">
        已选择:
        <div class="right-tags">
          <el-tag
            @close="closeTag(index)"
            @click="choseTag(item)"
            v-for="(item ,index) in choseList"
            :key="index"
            type="info"
            closable
          >{{ item.instanceName }}</el-tag>
        </div>
        <!-- <span v-for="(item, index) in choseList" :key="index">{{item}}</span> -->
      </div>
    </el-card>
  </div>
</template>

<script>
import { get } from "@/utils/request";
export default {
  name: "right",
  data() {
    return {
      schemaName: "",
      tableName: "",
      value: "",
      systemList: [],
      systemId: "",
      schemaList: [],
      schemaId: "",
      tableList: [],
      tableId: "",
      keyword: "",
      pageCurrent: 1,
      pageSize: 10,
      dataList: [],
      total: 0,
      choseList: []
    };
  },
  methods: {
    clickArrow(item) {
      this.$router.push({
        name: "impactAndLineageDetail",
        params: {
          id: item.instanceId,
          classifierId: item.classifierId,
          _title: item.instanceCode
        }
      });
    },
    // 改变展示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataMappingInfo();
    },
    // 翻页
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getDataMappingInfo();
    },
    // 获取系统下拉
    getSystemList() {
      get("/ds/execution/listSystemInfos").then(res => {
        if (res.code === 10000 && res.success) {
          this.systemList = res.data;
          this.systemId = this.systemList[0].instanceId;
          this.$parent.getSystemId(this.systemId);
          this.getDataMappingInfo();
        }
      });
    },
    // 选择系统
    selectSys(val) {
      this.systemId = val;
      this.$parent.getSystemId(this.systemId);
      this.schemaId = "";
      this.getSchanmeInfos();
      this.getDataMappingInfo();
    },
    // 获取schame下拉数据
    getSchanmeInfos() {
      get("/ds/execution/listSchanmeInfos", {
        systemId: this.systemId
      }).then(res => {
        this.schemaList = res.data;
      });
    },
    // 选择schema
    selectSchema(val) {
      this.schemaId = val;
      this.tableId = "";
      this.getTableList();
      this.getDataMappingInfo();
    },
    // 获取表名下拉
    getTableList() {
      get("/ds/execution/listTableInfos", {
        schemaId: this.schemaId
      }).then(res => {
        this.tableList = res.data;
      });
    },
    // 选择表名
    selectTable(val) {
      this.tableId = val;
      this.getDataMappingInfo();
    },
    // 获取表格数据
    getDataMappingInfo() {
      get("/ds/execution/listMetaDataMappingInfo", {
        keyword: this.keyword,
        pageCurrent: this.pageCurrent,
        pageSize: this.pageSize,
        schemaId: this.schemaId,
        systemId: this.systemId,
        tableId: this.tableId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.total = res.data.total;
          this.dataList = res.data.records;
          if (this.choseList.length > 0) {
            this.setClick();
          }
        }
      });
    },
    // 添加选中属性
    setClick() {
      this.dataList.map(item => {
        this.choseList.map(a => {
          item.instanceId === a.instanceId ? (item.click = true) : "";
        });
        return item;
      });
    },
    // 选择映射属性
    choseData(item, index) {
      // this.$parent.checkRepeat()
      if (this.choseList.length > 0) {
        let add = true;
        this.choseList.map(a => {
          if (a.instanceId === item.instanceId) {
            add = false;
          }
        });
        if (add) {
          this.choseList.push(item);
        }
      } else {
        this.choseList.push(item);
      }
      this.setClick();
      this.$emit("getMetaData", this.choseList);
    },
    // 关闭标签
    closeTag(index) {
      this.dataList.map(item => {
        item.click = false;
        return item;
      });
      this.choseList.splice(index, 1);
      // this.dataList
      this.setClick();
      this.$emit("getMetaData", this.choseList);
    },
    choseTag(item) {
      this.$router.push({
        name: "impactAndLineageDetail",
        params: {
          id: item.instanceId,
          classifierId: item.classifierId,
          _title: item.instanceCode
        }
      });
    },
    // 清空选中
    clearTag() {
      // this.olderChoseList = this.choseList
      this.choseList = [];
      this.dataList.map(item => {
        item.click = false;
        return item;
      });
      this.setClick();
      this.$emit("getMetaData", this.choseList);
    }
  },
  created() {
    this.getSystemList();
  }
};
</script>

<style lang='scss' scoped>
.clicked {
  p {
    color: #2d8cf0 !important;
  }
  span {
    color: #2d8cf0 !important;
  }
}
.mm-right {
  position: absolute;
  width: calc(100% - 350px);
  left: 340px;
  top: 10px;
  bottom: 10px;
  height: calc(100% - 82px);
  overflow-y: hidden;
  .el-tag--dark .el-tag__close {
    color: #ccc;
  }
  .text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /deep/ .el-card__header {
    padding: 12px 20px;
  }
  .el-card {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    width: 100%;
  }
  .ivu-card-body {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    width: 100%;
  }
  .filter-box {
    float: right;
    .input-search {
      width: 280px;
      margin-left: 10px;
    }
    .first-select {
      width: 100px;
      margin-right: 10px;
    }
    .schema-select {
      width: 115px;
      margin-right: 10px;
    }
    .table-select {
      width: 100px;
    }
    /deep/ .el-input__suffix {
      right: 0px;
    }
    /deep/ .el-input__inner {
      font-size: 12px;
      padding-right: 25px;
      padding-left: 5px;
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /deep/ .el-select__caret {
      line-height: 30px;
    }
  }
  .listsBox {
    // height: calc(100% - 107px);
    // overflow-y: auto;
    .mm-items {
      margin-top: 10px;
      padding: 0 20px;
      cursor: default;
      background: #fff;
      color: #606266;
      position: absolute;
      top: 50px;
      right: 0px;
      left: 0;
      padding: 0 16px;
      height: calc(100% - 170px);
      overflow-y: auto;
      li {
        padding: 10px;
        border-bottom: 1px solid #dcdee2;
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        .mm-icon {
          width: 50px;
          height: 50px;
          background: #2b85e4;
          color: #fff;
          font-size: 14px;
          margin-right: 15px;
          line-height: 50px;
          text-align: center;
          border-radius: 100%;
        }
        .mm-textcon {
          width: calc(100% - 75px);
          p {
            margin: 0;
            padding: 0;
            display: inline-block;
            width: 100%;
            font-size: 14px;
            color: #515a6e;
            line-height: 30px;
            /deep/ .el-tag {
              line-height: 20px;
              background: #f6ffed;
              border-color: #b7eb8f;
              display: inline-block;
              height: 22px;
              line-height: 22px;
              margin: 2px 4px 2px 10px;
              padding: 0 8px;
              border: 1px solid #e8eaec;
              border-radius: 3px;
              font-size: 12px;
              vertical-align: middle;
              opacity: 1;
              overflow: hidden;
              cursor: pointer;
            }
          }
          .describe {
            display: inline-block;
            width: 100%;
            font-size: 12px;
            color: #666;
            line-height: 24px;
          }
        }
        .arrow {
          position: absolute;
          display: inline-block;
          width: 22px;
          height: 22px;
          background: url("../../../../static/images/right-arrow.png") no-repeat;
          background-size: 100%;
          right: 0;
          top: 32px;
          z-index: 99;
        }
      }
    }
  }
  .page-right {
    position: absolute;
    bottom: 50px;
    text-align: center;
    width: 100%;
    left: 0;
    padding: 15px 20px;
    background: #fff;
  }
  .chose-right {
    position: absolute;
    font-size: 16px;
    line-height: 46px;
    font-weight: bold;
    color: #7e7e7e;
    bottom: 0;
    left: 0;
    padding: 0 16px;
    width: 100%;
    border-top: 1px solid #ebeef5;
    .right-tags {
      width: calc(100% - 64px);
      height: 46px;
      float: right;
      margin-top: -3px;
      overflow-y: auto;
    }
    .el-tag {
      color: #2d8cf0;
      line-height: 26px;
      height: 26px;
      margin-right: 5px;
      cursor: pointer;
    }
  }
}
</style>