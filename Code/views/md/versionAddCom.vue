<template>
<div class="versin-add_com">
  <div class="mb20">
    <div class="right-title">
      <i class="line"></i>定版范围
    </div>
    <div class="right-table">
      <el-table
        size="small"
        :data="tableData"
        border
        :header-cell-style="{'background': '#f8f8f9', 'color': '#606266'}"
      >
        <el-table-column prop="code" label="分支代码"></el-table-column>
        <el-table-column prop="name" label="分支名称"></el-table-column>
        <el-table-column prop="classifierId" label="分支元数据类型"></el-table-column>
        <el-table-column prop="versionRange" label="定版范围">
          <template slot-scope="scope">
            <el-select
              multiple
              size="mini"
              v-model="versionRange"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in scope.row.selectList"
                :key="index"
                :label="item.classifierName"
                :value="item.classifierId"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="version">
    <div class="right-title">
      <i class="line"></i>版本信息
    </div>
    <div class="version-box">
      <el-form
        :model="versionForm"
        :rules="rules"
        ref="versionForm"
        label-width="100px"
        class="demo-versionForm"
      >
        <!-- <el-form-item label="版本编号：" prop="number">
                  <el-input v-model="versionForm.number"></el-input>
        </el-form-item>-->
        <el-form-item label="是否基线：" prop="isBsLine">
          <el-select v-model="versionForm.isBsLine" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本描述：" prop="desc">
          <el-input v-model="versionForm.desc"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="primary" :disabled="saveBtn" @click="handleSave('versionForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
import { postByJson, parseAjaxResponse } from "@/utils/request";
export default {
  name: "",
  props: {
    tableData: {
      type: Array,
      default: []
    }
  },
  watch: {
    tableData: {
      handler(newVal, oldVal) {
        this.versionRange = []
        // for (let i in this.versionForm) {
        //   this.versionForm[i] = ''
        // }
        this.$refs['versionForm'].resetFields()
      },
      deep: true
    }
  },
  data() {
    return {
      saveBtn: false,
      versionRange: [],
      versionForm: {
        number: '',
        isBsLine: '',
        desc: ''
      },
      rules: {
        isBsLine: [
          { required: true, message: '请选择是否是基线!', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入版本描述!', trigger: 'blur' }
        ]
      },
      treeNode: null
    };
  },
  methods: {
    // 保存
    handleSave(formName) {
      this.saveBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            verDesc: this.versionForm.desc, // 版本说明
            verName: this.getNowFormatDate(), // 版本编号
            verType: this.versionForm.isBsLine, // 版本类型： 0-普通版本;1-基线版本
            versionMDs: {
              classifierId: this.versionRange.toString(),
              instanceId: this.tableData[0].id
            }
          }
          postByJson('/mdVersion/releaseVersion', params).then(
            res => {
              parseAjaxResponse(res)
              this.saveBtn = false
            }
          )
        } else {
          this.saveBtn = false
          return false;
        }
      });
    },
    // 获取本地年月日时分秒作为版本编号
    getNowFormatDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let hour = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (seconds >= 1 && seconds <= 9) {
        seconds = "0" + seconds;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = `${year}${month}${strDate}${hour}${minutes}${seconds}`;
      return currentdate;
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.versin-add_com {
.version {
  margin-bottom: 80px;
  .version-box {
    padding: 0 30px;
    .demo-versionForm {
      width: 80%;
    }
  }
}
.right-title {
      font-family: "PingFangSC-Regular", "PingFang SC";
      font-weight: 400;
      height: 30px;
      line-height: 30px;
      font-style: normal;
      font-size: 16px;
      color: #666666;
      border-bottom: unset;
      margin-bottom: 20px;
      padding: 0 20px;
      .line {
      height: 100%;
      width: 4px;
      float: left;
      display: block;
      background: #579ef3;
      margin-right: 15px;
      }
    }
    .right-table {
      padding: 0 10px;
    }
/deep/ .el-table {
  font-size: 12px;
  height: 100%;
  .preview,
  .blood2,
  .anaalysis2,
  .editor {
    width: 22px;
    height: 22px;
  }
}
.mb20 {
  margin-bottom: 20px;
}
}
</style>