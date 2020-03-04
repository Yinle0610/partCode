<template>
  <el-collapse id="collapse" v-model="aActiveCollapse" @change="handleClick">
    <el-collapse-item title="基本信息" name="基本信息">
      <el-table
        :data="oBaseInfo.aTableData"
        v-loading="oBaseInfo.bLoading"
        :show-header="false"
        :cell-style="cellNameBg"
        border
        size="small"
        style="width: 100%"
      >
        <el-table-column show-overflow-tooltip prop="key" label width="200"></el-table-column>
        <el-table-column show-overflow-tooltip prop="value" label>
          <template slot-scope="scope">
            <div v-html="scope.row.value"></div>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
    <el-collapse-item title="属性信息" name="属性信息">
      <el-table
        :data="oAttsinfo.aTableData"
        v-loading="oAttsinfo.bLoading"
        :show-header="false"
        :cell-style="cellNameBg"
        border
        size="small"
        style="width: 100%"
      >
        <el-table-column prop="name" width="200"></el-table-column>
        <el-table-column prop="value">
          <template slot-scope="scope">
            <span v-if="scope.row.name === '存储过程内容'" v-highlight>
              <pre><code class="lang-SQL hljs">{{scope.row.value ? scope.row.value : ''}}</code></pre>
            </span>
            <span v-else-if="scope.row.name === 'SQL'" v-highlight>
              <pre><code class="lang-SQL hljs">{{scope.row.value ? scope.row.value : ''}}</code></pre>
            </span>
            <span v-else v-html="scope.row.value" ></span>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
    <!-- 动态生成  字段、索引、主键等等 -->
    <div v-if="childInfos">
      <el-collapse-item
        @change="handleClick(item, index)"
        class="collapse"
        v-show="childInfos.aTableData.length > 0"
        v-for="(item, index) in childInfos.aTableData"
        :key="index"
        :title="showCollapseTitle(item)"
        :name="item.classifierName"
      >
        <el-form style="width:300px;float:right;">
          <el-form-item style="width:135px;float: left;" class="search-keyword">
            <el-select
              @change="changeType(item, index, $event)"
              v-model="type[index]"
              placeholder="请选择搜索分类"
              size="mini"
            >
              <el-option
                :label="opt.label"
                :value="opt.prop"
                v-for="(opt, num) in selectList"
                :key="num"
                align="center"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width:160px;float: left;margin-left:5px;">
            <el-input
              v-model="keyword[index]"
              @keyup.enter.native="handleSearch(item, index)"
              placeholder="请输入内容..."
              onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
              size="mini"
              clearable
            >
              <i slot="suffix" class="el-icon-search" @click="handleSearch(item, index)"></i>
            </el-input>
          </el-form-item>
        </el-form>
        <el-table
          v-if="item.data"
          :data="item.data.records"
          v-loading="item.bLoading"
          :header-cell-style="{background:'#f8f8f9',color:'#666'}"
          border
          size="small"
        >
          <el-table-column
            v-for="(i, num) in item.headerVOS"
            :key="num"
            :prop="i.prop"
            sortable
            show-overflow-tooltip
            :label="i.label"
            min-width="200"
          >
            <template slot-scope="scope">
              <el-button
                class="ellipsis"
                @click="toMetaCodeDetail(item.data.records, num, scope)"
                v-if="i.prop === 'instanceName'"
                type="text"
              >{{scope.row[i.prop]}}</el-button>
              <span v-else>{{scope.row[i.prop]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          ref="pagination"
          class="mt10"
          style="text-align: center;"
          @size-change="handleSizeChange(item, index, $event)"
          @current-change="handleCurrentChange(item, index, $event)"
          :current-page="item.data.current"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="item.data.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="item.data.total"
        ></el-pagination>
      </el-collapse-item>
    </div>
    <!-- 数据问题 -->
    <div v-if="problems">
      <el-collapse-item v-show="problems.aTableData.length > 0" title="数据问题" name="数据问题">
        <el-table
          :data="problems.aTableData"
          v-loading="problems.bLoading"
          border
          style="width: 100%"
          :header-cell-style="{background:'#f8f8f9',color:'#666'}"
        >
          <el-table-column show-overflow-tooltip label="问题编号" prop="id">
            <template slot-scope="scope">
              <el-button @click="clickProblemCode(scope.row)" type="text">{{scope.row.id}}</el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="desc" label="问题描述"></el-table-column>
          <el-table-column show-overflow-tooltip prop="submitUserName" label="提交人"></el-table-column>
          <el-table-column show-overflow-tooltip prop="submitTime" label="提交时间"></el-table-column>
        </el-table>
      </el-collapse-item>
    </div>
    <!-- 相关标准 -->
    <div v-if="relStandards">
      <el-collapse-item v-show="relStandards.aTableData.length > 0" title="相关标准" name="相关标准">
        <el-table
          :data="relStandards.aTableData"
          v-loading="relStandards.bLoading"
          :cell-style="cellNameBg"
          border
          size="small"
          style="width: 100%"
          :header-cell-style="{background:'#f8f8f9',color:'#666'}"
        >
          <el-table-column show-overflow-tooltip label="标准编号" prop="code"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="标准名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="classifierName" label="标准类别"></el-table-column>
          <el-table-column show-overflow-tooltip prop="namespace" label="上下文路径"></el-table-column>
        </el-table>
      </el-collapse-item>
    </div>
  </el-collapse>
</template>

<script>
import { get } from "@/utils/request";
export default {
  data() {
    return {
      aActiveCollapse: ["基本信息", "属性信息"],
      // 新展开的Collapse
      newCollapse: "",
      // 标准类型
      // propSearch: '',
      // 关键字
      // keyword: '',
      // 下拉框数据
      selectList: [
        {
          prop: "name",
          label: "元数据名称"
        },
        {
          prop: "code",
          label: "元数据代码"
        }
      ],
      type: [],
      keyword: [],
      classifierIds: []
    };
  },
  props: [
    "oBaseInfo",
    "oAttsinfo",
    "childInfos",
    "problems",
    "relStandards",
    "instanceId"
  ],
  methods: {
    showCollapseTitle(item) {
      let classifierName = item.classifierName
      if (item.relateType === 'Dep') {
        classifierName = `相关的${classifierName}`
      }
      if (item.roleId) {
        classifierName = `【${item.roleId}】${classifierName}`
      }
      return classifierName
    },
    changeType(item, index, val) {
      // console.log(item, index, val)
      console.log(this.type, "this.type");
      // item.propSearch = val
      // this.childInfos.aTableData[index].propSearch = val;
    },
    cellNameBg(params) {
      if (params.columnIndex === 0) {
        return "background: #f5f7f9";
      }
    },
    // 搜索
    handleSearch(item, index) {
      console.log(this.classifierIds);
      console.log(item, index);
      console.log(this.type[index], this.keyword);
      let params = {
        relateClassifierId: item.classifierId,
        relateType: item.relateType,
        pageCurrent: item.data.current,
        pageSize: item.data.size,
        instanceId: this.instanceId
      }
      if (this.type[index]) {
        if (this.type[index] === 'code') {
          params.code = this.keyword[index]
        } else {
          params.name = this.keyword[index]
        }
      } else {
        params.keyword = this.keyword[index]
      }
      console.log(params)
      this.getTableMsg(params, index)
    },
    // 字段  跳转元数据代码详情
    toMetaCodeDetail(item, num, scope) {
      console.log(item, num, scope.$index);
      console.log(item[scope.$index]);
      let msg = item[scope.$index];
      this.$router.push({
        name: "impactAndLineageDetail",
        params: {
          id: msg.instanceId,
          classifierId: msg.classifierId,
          _title: msg.instanceName
        }
      });
    },
    handleClick(val) {
      console.log(val);
      // this.aActiveCollapse = ["基本信息", "属性信息", `${val}`]
    },
    handleSizeChange(item, index, val) {
      // this.oldList = this.aActiveCollapse.toString();
      console.log(item, index, val);
      // console.log(val)
      // console.log(this.$refs.pagination);
      // this.childInfos.aTableData[index].bLoading = true;
      this.childInfos.aTableData[index].data.current = 1;
      let params = {
        relateClassifierId: item.classifierId,
        relateType: item.relateType,
        pageCurrent: item.data.current,
        pageSize: val,
        instanceId: this.instanceId
      }
      if (this.type[index]) {
        if (this.type[index] === 'code') {
          params.code = this.keyword[index]
        } else {
          params.name = this.keyword[index]
        }
      } else {
        params.keyword = this.keyword[index]
      }
      // console.log(item, index, val);
      // let params = {
      //   classifierId: this.classifierIds[index],
      //   instanceId: this.instanceId,
      //   pageCurrent: item.data.current,
      //   pageSize: val
      // };
      console.log(params, 'paramsSize')
      this.getTableMsg(params, index);
      // console.log(this.$refs.pagination)
    },
    handleCurrentChange(item, index, val) {
      console.log(val, item, index);
      this.childInfos.aTableData[index].bLoading = true;
      let params = {
        relateClassifierId: item.classifierId,
        relateType: item.relateType,
        pageCurrent: val,
        pageSize: item.data.size,
        instanceId: this.instanceId
      }
      if (this.type[index]) {
        if (this.type[index] === 'code') {
          params.code = this.keyword[index]
        } else {
          params.name = this.keyword[index]
        }
      } else {
        params.keyword = this.keyword[index]
      }
      // let params = {
      //   code: this.keyword[index],
      //   instanceId: '',
      //   keyword: this.type[index],
      //   name: this.keyword[index]
      // };
      console.log(params, 'paramsCurrent')
      this.getTableMsg(params, index);
    },
    getTableMsg(params, index) {
      get("/md/relate/info", params).then(res => {
        console.log(res);
        // this.childInfos.aTableData[index].childTable = [];
        this.childInfos.aTableData[index].data = res.data;
        this.childInfos.aTableData[index].bLoading = false;
        // this.childInfos.aTableData[index].selectList = res.extras.heard;
      });
    },
    // 数据问题 点击跳转
    clickProblemCode(item) {
      console.log(item);
      let params = null;
      get("home/matter/queryDetailParams?questionId=" + item.id).then(res => {
        params = res.data;
        console.log(params);
        this.$router.push({
          name: "particulars",
          query: {
            bid: params.businessId,
            type:
              params.caseStatus === "已关闭" ? "已关闭" : params.noteMessage,
            pid: params.processId
          }
        });
      });
    },
    // 标准编号点击
    clickRelStandards(item) {
      console.log(item);
    }
  },
  created() {
    // let arr = [1, 2, 3];
    // arr.map(val => {
    //   this.type.push(null);
    // })
  },
  watch: {
    oAttsinfo: {
      handler(newValue, oldValue) {
        console.log(this.oAttsinfo, 'oaa')
      }
    },
    oBaseInfo: {
      handler(newValue, oldValue) {
        // if (!newValue) {
        //   this.ifCurrentNode = true;
        // }
        this.type = [];
        this.keyword = [];
        this.classifierIds = [];
        // this.childInfos.aTableData.map(item => {
        //   this.type.push(null);
        //   this.keyword.push(null);
        //   this.classifierIds.push(item.data.records[0].classifierId);
        // });
        console.log(this.oBaseInfo, "55");
        this.aActiveCollapse = ["基本信息", "属性信息"];
        console.log(this.oAttsinfo, 'oaa')
      },
      deep: true
    },
    childInfos: {
      handler(newValue, oldValue) {
        console.log(this.childInfos);
        // this.childInfos.aTableData.map(item => {
        // })
        //   let arr = [];
        //   item.childTable = [];
        //   item.data.records.map(val => {
        //     arr.push(val.cols);
        //   });
        //   item.childTable = arr;
        //   console.log(item, arr);
        //   return item;
        // });
      },
      deep: true
    },
    aActiveCollapse(newValue, oldValue) {
      console.log(newValue, oldValue, "0202");
      // let msg = ''
      for (let i in newValue) {
        if (!oldValue.includes(newValue[i])) {
          // msg = newValue[i]
          this.childInfos.aTableData.map((item, index) => {
            if (newValue[i] === item.groupName) {
              console.log(item.groupName, item);
              item.data.size = 10;
              item.data.current = 1;
              item.propSearch = "123";
              item.keyword = "";
              this.handleSizeChange(item, index, 10);
            }
            return item;
          });
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.collapse /deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}
.collapse /deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
  background: none;
  border-radius: 2px;
}
.collapse /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: rgb(239, 239, 239);
  border-radius: 10px;
}
.collapse /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
.ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: unset;
}
.el-table__body {
  border-left: 1px solid #ebeef5;
}
.el-collapse-item:last-child {
  margin-bottom: 0;
}
.el-form-item {
  margin-bottom: 3px;
}
#collapse /deep/ .el-collapse-item__content {
  padding: 5px 0px;
}
#collapse /deep/ .lang-SQL::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}
#collapse /deep/ .lang-SQL::-webkit-scrollbar-track {
  background: none;
  border-radius: 2px;
}
#collapse /deep/ .lang-SQL::-webkit-scrollbar-thumb {
  background: rgb(239, 239, 239);
  border-radius: 10px;
}
#collapse /deep/ .lang-SQL::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>
