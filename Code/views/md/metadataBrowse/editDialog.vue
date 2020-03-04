<template>
  <div class="edit-box">
    <div class="edit-header">
      <el-button size="small" @click="goReturn">返回</el-button>
      <el-button style="float: right;" type="primary" size="small" @click="goSave">保存</el-button>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="原始信息" name="second">
        <el-form :model="form" class="meta-edit_form">
          <el-form-item
            v-for="(item, index) in inputList"
            :key="index"
            :label="`${item.name}:`"
            :prop="item.attStore"
            :label-width="formLabelWidth"
          >
            <el-select
              style="width: 100%;"
              v-if="item.columnType === 'combobox'"
              disabled
              v-model="form[item.attStore]"
            >
              <el-option
                v-for="(val, num) in item.selectList"
                :key="num"
                :label="val.textField"
                :value="val.valueField"
              ></el-option>
            </el-select>
            <el-input
              v-else-if="item.columnType === 'textfield'"
              disabled
              v-model="form[item.attStore]"
            ></el-input>
            <el-input v-else disabled v-model="form[item.attStore]"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="编辑信息" name="first">
        <el-form :model="editForm" class="meta-edit_form">
          <el-form-item
            v-for="(item, index) in editList"
            :key="index"
            :label="`${item.name}:`"
            :prop="item.attStore"
            :label-width="formLabelWidth"
          >
            <el-select
              style="width: 100%;"
              v-if="item.combId === 'combobox'"
              :disabled="item.isread === 'T'"
              v-model="editForm[item.attStore]"
            >
              <el-option
                v-for="(val, num) in item.selectList"
                :key="num"
                :label="val.textField"
                :value="val.valueField"
              ></el-option>
            </el-select>
            <el-input
              v-else-if="item.combId === 'textfield'"
              :disabled="item.isread === 'T'"
              v-model="editForm[item.attStore]"
            ></el-input>
            <el-input v-else :disabled="item.isread === 'T'" v-model="editForm[item.attStore]"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="pathBottom">
      <div class="path">上下文路径：{{formValue? formValue.path: ''}}</div>
    </div>
  </div>
</template>

<script>
import { loading } from "@/utils/layer";
import { get, post } from "@/utils/request";
export default {
  props: {
    formValue: { type: Object, default: null }
  },
  watch: {
    formValue: {
      handler(newValue, oldValue) {
        console.log(this.formValue, "formValue");
        this.activeName = "first";
        this.inputList = this.formValue.attributesNotEdit;
        this.editList = this.formValue.attributesIsEdit.map(item => {
          if (item.combId === "combobox") {
            get("/md/listMetadataAttrComboboxInfos", {
              datatypeId: item.dataTypeId
            }).then(res => {
              // item.select
              if (res.code === 10000 && res.success) {
                item.selectList = res.data;
              }
            });
          }
          return item;
        });
        this.formValue.attributesNotEdit.map(item => {
          this.form[item.attStore] = item.value ? item.value : "";
        });
        this.formValue.attributesIsEdit.map(item => {
          // if (item.isread !== 'T') {
          this.editForm[item.attStore] = item.value ? item.value : "";
          // this.editList[item.attStore] = ''
          // }
        });
        this.editForm = Object.assign({}, this.editForm);
        console.log(this.editForm, this.form);
        console.log(this.editList);
      },
      deep: true
    }
  },
  data() {
    return {
      activeName: "first",
      // 修改前的表单数据
      form: {},
      formLabelWidth: "120px",
      // 动态输入框
      inputList: [],
      editList: [],
      // 修改后的表单数据
      editForm: {}
    };
  },
  methods: {
    handleClick() {
      console.log(this.activeName);
    },
    // 返回
    goReturn() {
      console.log(this.formValue.type)
      // this.$parent.$parent.$parent.backChangeShow(this.formValue.type);
      this.$emit('changeShow', this.formValue.type)
    },
    // 保存
    goSave() {
      const load = loading("正在保存...");
      console.log(this.$parent);
      console.log(this.formValue.type);
      let params = {};
      params.instanceId = this.formValue.id;
      this.formValue.attributesIsEdit.map(item => {
        if (item.isread !== "T") {
          params[item.attStore] = this.editForm[item.attStore];
        }
      });
      console.log(params);
      post("/md/editMetadata", params).then(res => {
        if (res.code === 10000 && res.success) {
          load.close();
          this.$message.success(res.message);
          // this.$parent.$parent.$parent.changeComponentShow(this.formValue.type);
          this.$emit('changeComponentShow', this.formValue.type)
        } else {
          load.close();
          this.$message.error(res.message);
        }
      });
    }
  }
};
</script>

<style lang="scss" scope>
.meta-edit_form {
  width: 80%;
  margin: 0 auto;
  /deep/ .el-input {
    width: 90%;
  }
  .editor {
    width: 30px;
    height: 30px;
    vertical-align: middle;
    cursor: pointer;
  }
}
.dialog-footer {
  padding-top: 0;
  text-align: center;
}
.el-dialog__header {
  border-bottom: 1px solid #dcdfe6;
}
.el-dialog {
  padding: 0 10px;
}

.tab {
  overflow: hidden;
  li {
    cursor: pointer;
    list-style-type: none;
    width: 150px;
    float: left;
    height: 50px;
  }
}
.edit-box {
  height: calc(100% - 40px);
  position: relative;
  .el-tabs__content {
    height: calc(100% - 90px);
    overflow-y: auto;
  }
  .el-tabs__content::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }
  .el-tabs__content::-webkit-scrollbar-track {
    background: none;
    border-radius: 2px;
  }
  .el-tabs__content::-webkit-scrollbar-thumb {
    background: rgb(239, 239, 239);
    border-radius: 10px;
  }
  .el-tabs__content::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
  }
  .el-tabs {
    height: 100%;
    margin-top: 10px;
  }
  label {
    font-weight: unset;
  }
  .pathBottom {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    bottom: -42px;
    padding: 0 18px;
    z-index: 10;
    .path {
      border-top: 1px solid #ebeef5;
      height: 47px;
      line-height: 47px;
      background: #fff;
      color: #606266;
    }
  }
  // .el-tabs__item {
  //   padding: 0 5px;
  //   font-size: 12px;
  //   height: 30px;
  //   line-height: 30px;
  // }
}
</style>