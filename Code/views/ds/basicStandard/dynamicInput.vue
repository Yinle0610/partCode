<template>
  <div>
    <!-- 普通输入框 -->
    <el-form-item
      v-if="bindItem.columnType==='textfield' && !bindItem.attrName.includes('取值')"
      :label="`${bindItem.attrName}：`"
      :prop="bindItem.key"
      :rules="bindItem.nullable === false?[{ required: true, message: '请输入'+bindItem.attrName, trigger: 'blur' }]:null"
    >
      <el-input v-model="inputData" :placeholder="`${'请输入'+bindItem.attrName}`" :disabled="bindItem.onlyRead"></el-input>
    </el-form-item>
    <!-- 下拉菜单 -->
    <el-form-item
      v-else-if="bindItem.columnType==='combobox'"
      :label="bindItem.attrName+'：'"
      :prop="bindItem.key"
      :rules="bindItem.nullable === false?[{ required: true, message: '请选择'+bindItem.attrName, trigger: 'blur' }]:null"
    >
      <el-select v-model="inputData" :disabled="bindItem.onlyRead">
        <el-option
          v-for="(item, index) in bindItem.selectList"
          :key="index"
          :label="item.textField"
          :value="item.valueField"
        ></el-option>
      </el-select>
    </el-form-item>
    <!-- 文本域 -->
    <el-form-item
      v-else-if="bindItem.columnType==='textarea'"
      :label="bindItem.attrName+'：'"
      :prop="bindItem.key"
      :rules="bindItem.nullable === false?[{ required: true, message: '请输入'+bindItem.attrName, trigger: 'blur' }]:null"
    >
      <el-input type="textarea" v-model="inputData" :disabled="bindItem.onlyRead"></el-input>
    </el-form-item>
    <!-- 日期选择器 -->
    <el-form-item
      v-else-if="bindItem.columnType==='datefield'"
      :label="bindItem.attrName+'：'"
      :prop="bindItem.key"
      :rules="bindItem.nullable === false?[{ required: true, message: '请输入'+bindItem.attrName, trigger: 'blur' }]:null"
    >
      <el-date-picker v-model="inputData" type="date" placeholder="选择日期"></el-date-picker>
    </el-form-item>
    <!-- 树形下拉框 -->
    <el-form-item
      v-else-if="bindItem.columnType==='treedirectory'"
      :label="bindItem.attrName+'：'"
      :prop="bindItem.key"
    >
      <el-select
        ref="classifySelect"
        class="ruleClassifying"
        clearable
        style="width: 100%;"
        v-model="treeInputData"
        placeholder="请选择"
      >
        <el-option :value="classifyValue" style="height: auto">
          <el-tree
            accordion
            style="margin: 0 -20px;"
            :data="bindItem.treeData"
            @node-click="nodeClick"
            :props="defaultProps"
            :highlight-current="true"
            :render-content="renderAddContent"
          ></el-tree>
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
// import bus from "@/utils/bus";
import { get } from "@/utils/request";

export default {
  name: "",
  props: {
    bindItem: { type: Object, default: null }
  },
  watch: {
    bindItem: {
      handler: function(val, oldVal) {
        console.log(val);
        console.log("123");
        console.log(this.bindItem);
      },
      deep: true
    },
    inputData() {
      this.$emit("changeInputValue", this.bindItem.key, this.inputData);
      // console.log(this.bindItem)
      // console.log(this.$parent,0)
    }
  },
  data() {
    return {
      inputData: null,
      defaultProps: {
        children: "childNodes",
        label: "nodeName"
      },
      // tree下拉的默认值
      treeInputData: "",
      classifyValue: ""
    };
  },
  methods: {
    nodeClick(data, node, dom) {
      console.log(data);
      console.log(node);
      console.log(dom);
      this.treeInputData = data.nameContext;
      this.inputData = data.namespace;
    },
    // 自定义tree 图标 文字
    renderAddContent(h, params) {
      let sText = params.data.nodeName;
      let iconType = "icon icon-folder";
      return h(
        "span",
        {
          class: "tree-node"
        },
        [
          h("div", {
            class: iconType,
            style: {
              marginRight: "4px",
              display: "inline-block",
              backgroundSize: "15px 15px",
              width: "15px",
              height: "15px",
              float: "unset",
              fontWeight: "unset"
            }
          }),
          h("span", sText)
        ]
      );
    }
  },
  created() {
    console.log(this.bindItem, "999");
    if (this.bindItem.columnType === "combobox") {
      get("/ds/listStandardAttrComboboxInfos", {
        columnTypeValue: this.bindItem.columnTypeValue
      }).then(res => {
        this.bindItem.selectList = res.data;
      });
    }
    if (this.bindItem.columnType === "treedirectory") {
      console.log(this.bindItem, "mm");
      this.inputData = this.bindItem.namespace;
      this.treeInputData = this.bindItem.value;
    }
    // if (this.bindItem.value) {
    //   this.inputData = this.bindItem.value
    //   this.treeInputData = this.bindItem.value
    // }
  }
};
</script>

<style>
</style>