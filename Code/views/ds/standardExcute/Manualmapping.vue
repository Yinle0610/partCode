<template>
  <div class="p10 manualMapping">
    <div>
      <!-- left -->
      <left-part ref="left" @getChoseMsg="getDataStandard"></left-part>
    </div>
    <div class="mm-right">
      <right-part ref="right" @getMetaData="getMetaData"></right-part>
    </div>
    <div class="mm-center">
      <el-button
        :disabled="isDisabled"
        @click="handleAdd"
        v-permission="'MAPPING_CREATE'"
        :type="isDisabled?'info':'primary'"
        :plain="isDisabled"
      >添加</el-button>
      <el-badge :value="detailTableList.length" class="item">
        <div @click="detailVisible = true" class="cart"></div>
      </el-badge>
    </div>
    <!-- 弹窗 -->
    <el-dialog class="Dialog" title="映射关系确认" :visible.sync="detailVisible">
      <el-table
        :data="detailTableList"
        border
        style="width: 100%;border:1px solid #EBEEF5"
        show-header
        :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
      >
        <el-table-column property="sinstanceCode" label="标准编码">
          <template slot-scope="scope">
            <el-button type="text">{{scope.row.sinstanceCode}}</el-button>
          </template>
        </el-table-column>
        <el-table-column property="sinstanceName" label="标准名称"></el-table-column>
        <el-table-column property="minstanceName" label="元数据代码">
          <template slot-scope="scope">
            <el-button type="text">{{scope.row.minstanceName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column property="minstanceCode" label="元数据名称"></el-table-column>
        <el-table-column width="120" align="center" property="address" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="handleDetailRemove(scope.row)"
              icon="el-icon-delete"
              type="warning"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="detailVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { postByJson } from "@/utils/request";
import leftPart from "./leftPart";
import rightPart from "./rightPart";

export default {
  name: "ManualMapping",
  components: {
    leftPart,
    rightPart
  },
  data() {
    return {
      // 数据标准
      dataStandard: {},
      // 元数据
      metadata: [],
      // 弹窗隐藏
      detailVisible: false,
      // 弹窗表数据
      detailTableList: [],
      // 系统ID
      systemId: "",
      // 新增映射传给后台的值
      sendMsg: []
    };
  },
  methods: {
    // 系统id
    getSystemId(val) {
      this.systemId = val;
    },
    // 选择数据标准
    getDataStandard(val) {
      this.dataStandard = val;
      if (this.metadata.length > 0) {
        this.detailTableList.map(item => {
          if (item.dsInstanceId === this.dataStandard.instanceId) {
            this.metadata.map(res => {
              if (res.instanceId === item.mdInstanceId) {
                this.$message.warning("不能重复添加");
                this.$refs.left.clearChose();
              }
            });
          }
        });
      }
    },
    // 选择元数据
    getMetaData(val) {
      this.metadata = val;
      if (this.dataStandard.instanceId) {
        this.detailTableList.map(item => {
          if (
            item.dsInstanceId === this.dataStandard.instanceId &&
            this.metadata.length > 0
          ) {
            if (item.mdInstanceId === this.metadata[0].instanceId) {
              this.$message.warning("不能重复添加");
              this.$refs.right.clearTag();
            }
          }
        });
      }
    },
    // 删除选择的映射
    handleDetailRemove(item) {
      this.detailTableList.map((res, index) => {
        if (res.mdInstanceId === item.mdInstanceId) {
          this.detailTableList.splice(index, 1);
        }
      });
    },
    // 添加
    handleAdd() {
      this.metadata.map(item => {
        this.detailTableList.push({
          sinstanceCode: this.dataStandard.instanceCode,
          sinstanceName: this.dataStandard.instanceName,
          minstanceName: item.instanceName,
          minstanceCode: item.instanceName,
          dsInstanceId: this.dataStandard.instanceId, // 数据标准ID
          mdInstanceId: item.instanceId, // 元数据ID
          exeSystemId: this.systemId // 执行系统ID
        });
      });
      this.$refs.left.clearChose();
      this.$refs.right.clearTag();
    },
    // 保存
    handleSave() {
      this.detailTableList.map(item => {
        this.sendMsg.push({
          dsInstanceId: item.dsInstanceId, // 数据标准ID
          exeSystemId: item.exeSystemId, // 执行系统ID
          mdInstanceId: item.mdInstanceId // 元数据ID
        });
      });
      postByJson("/ds/execution/createMappingInfo", this.sendMsg).then(res => {
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
          this.detailTableList = []
        } else {
          this.$message.error(res.message);
        }
        this.detailVisible = false;
      });
    }
  },
  computed: {
    // 添加按钮禁用状态
    isDisabled: function() {
      if (this.dataStandard.instanceId && this.metadata.length > 0) {
        return false;
      } else {
        return true;
      }
    }
  },
  created() {}
};
</script>

<style lang='scss' scoped>
.manualMapping {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /deep/.el-tree {
      position: relative;
      cursor: default;
      background: #fff;
      color: #606266;
      position: absolute;
      top: 140px;
      right: 0px;
      left: 0;
      padding: 0 16px;
      height: calc(100% - 187px);
      overflow-y: auto;
      font-size: 14px;
  }
  .mm-center {
    position: absolute;
    width: calc(100% - 20px);
    height: 52px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    height: 52px;
    text-align: center;
    background: #fff;
    line-height: 52px;
    .item {
      position: absolute;
      top: 20px;
      right: 30px;
      .cart {
        position: absolute;
        right: 0px;
        top: 0px;
        cursor: pointer;
        width: 25px;
        height: 25px;
        background: url("../../../../static/images/temporary-storage.png")
          no-repeat;
        background-size: 100%;
      }
    }
  }
  .Dialog /deep/ {
    .el-dialog {
      width: 80%;
    }
    .dialog-footer {
      text-align: center;
    }
    .el-dialog__header {
      border-bottom: 1px solid #e8eaec;
      padding: 14px 16px;
      line-height: 1;
      line-height: 20px;

      .el-dialog__title {
        display: inline-block;
        width: 100%;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #17233d;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-dialog__headerbtn {
        top: 15px;
      }
    }
  }
}
.el-tree {
      position: relative;
      cursor: default;
      background: #fff;
      color: #606266;
      position: absolute;
      top: 140px;
      right: 0px;
      left: 0;
      padding: 0 16px;
      height: calc(100% - 187px);
      overflow-y: auto;
      font-size: 14px;
  }
</style>
