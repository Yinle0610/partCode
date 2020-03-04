<template>
  <div>
    <div class="opinion-input-type">
        <el-tooltip class="item editor" effect="dark"  placement="right" v-if="inputItem.columnType==='textfield'&&inputItem.attrName==='定义格式'">
            <div slot="content">
                <div>a 字母字符</div>
                <div>n 数字字符</div>
                <div>an 字母数字字符</div>
                <div>anc 字母数字汉字字符</div>
                <div>a3 3位字母字符，定长</div>
                <div>n3 3位数字字符，定长</div>
                <div>an3 3位字母数字字符，定长</div>
                <div>anc3 3位字母数字汉字字符，定长</div>
                <div>a..3 最多为3位字母字符</div>
                <div>n..3 最多为3位数字字符</div>
                <div>an..3 最多为3位字母数字字符</div>
                <div>anc..3 最多为3位字母数字汉字字符</div>
                <div>a3.. 最少为3位字母字符</div>
                <div>n3.. 最少为3位数字字符</div>
                <div>an3.. 最少为3位字母数字字符</div>
                <div>anc3.. 最少为3位字母数字汉字字符</div>
                <div>18n(2) 18位数字字符，其中包括小数点后的两个小数位</div>
                <div>YYYYMMDD 年月日</div>
                <div>YYYYMMDD HH:MM:SS 年月日时分秒</div>
              </div>
            <el-form-item 
              :label="inputItem.attrName+'：'" :prop="inputItem.columnName"
              :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]:null">
                <el-input v-model.trim="inputData" :disabled="ifDisabled" @keyup.delete.native="watchDelete"></el-input>
            </el-form-item>
        </el-tooltip>
        <el-form-item 
          :label="inputItem.attrName+'：'" 
          :prop="inputItem.columnName"         
          v-else-if="inputItem.columnType==='textfield'"
          :rules="inputItem.nullable === true?null:inputItem.columnName ==='INSTANCE_NAME'?ruleForm.instanceName:[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]"
          :class="inputItem.nullable === false&&inputItem.columnName==='INSTANCE_NAME'?'is-required':''">
            <el-input v-model.trim="inputData" :disabled="ifDisabled" @keyup.delete.native="watchDelete"></el-input>
        </el-form-item>
        <el-form-item 
          :label="inputItem.attrName+'：'" :prop="inputItem.columnName" v-else-if="inputItem.columnType==='treedirectory'"
          :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]:null">
          <el-select
              ref="classifySelect"
              class="ruleClassifying"
              clearable
              style="width: 100%;"
              v-model="inputData2"
              placeholder="请选择"
            >
              <el-option :value="classifyValue" style="height: auto" class="onlyOption">
                <el-tree
                  accordion
                  style="margin: 0 -20px;"
                  :data="treeData"
                  node-key="attrValue"
                  @node-click="handleNodeClick"
                  :props="defaultProps"
                  :highlight-current="true"
                  :render-content="renderContent"
                  :default-checked-keys="[inputItem.attrValue]"
                ></el-tree>
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item 
          :label="inputItem.attrName+'：'" :prop="inputItem.columnName" v-else-if="inputItem.columnType==='combobox'"
          :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]:null">
            <el-select v-model="inputData" placeholder="请选择" :disabled="ifDisabled">
                <el-option :label="val.textField" :value="val.valueField" v-for="(val,index) in comboboxData" :key="val+index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item 
          :label="inputItem.attrName+'：'" 
          :prop="inputItem.columnName" 
          v-else-if="inputItem.columnType==='textarea'"
          :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]:null">
            <el-input type="textarea" autosize v-model.trim="inputData" :disabled="ifDisabled"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="inputItem.attrName+'：'" :prop="inputItem.columnName" v-else-if="inputItem.columnType==='textarea'">
            <el-input-number v-model="inputData" controls-position="right" :min="0" ></el-input-number>
        </el-form-item> -->
        <el-form-item 
          :label="inputItem.attrName+'：'" :prop="inputItem.columnName" v-else-if="inputItem.columnType==null" 
          :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]:null">
            <el-input v-model.trim="inputData" :disabled="ifDisabled" @keyup.delete.native="watchDelete"></el-input>
        </el-form-item>
    </div>
    <div class="dialogforinstanceName">
       <el-dialog title="提示" :visible.sync="showSames" :append-to-body="true">
        <div slot="title" style="border-bottom: 1px solid #e8ebed;padding-bottom:10px">
          <i class="el-icon-info" style="color: rgb(92,182,255); margin-right: 5px;"></i>提示
        </div>
        <p>在以下目录下发现相同标准名称：</p>
        <ul class="dialog-ul">
          <li v-for="(item, index) in sameList" :key="index">
            {{item.path}}
            <el-button @click="toSeeDetail(item)" type="text">查看</el-button>
          </li>
        </ul>
        <div slot="footer" class="dialog-footer" style="width:100%;border-top: 1px solid #e8ebed;padding-top:10px">
          <el-button @click="cancelSure" size='small'>取 消</el-button>
          <el-button type="primary" @click="otherSure" size='small'>确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { get } from '@/utils/request'
import bus from '@/utils/bus'
export default {
  props: ['inputItem', 'oldName'],
  data() {
    const checkInstanceName = (rule, value, callback) => {
      if (this.inputData === '' || this.inputData === null) {
        callback(new Error("请输入业务术语中文名"));
      } else {
        let params = {
          instanceName: this.inputData,
          parentId: this.parentId,
          instanceId: this.instanceId // 编辑时有instanceId
        };
        // console.log("请输入业务术语中文名11", params)
        get("/ds/bizTerm/checkStandardNameIsExist", params).then(
          res => {
            // console.log(res);
            if (res.code === 10000 && res.success) {
              if (res.data.length > 0) {
                // 不同目录下有重名的
                this.showSames = true;
                this.sameList = res.data;
                this.$emit("hasNoRepeat", false)
                callback();
              } else {
                this.$emit("hasNoRepeat", true)
                // 无重复
                this.showSames = false;
                callback();
              }
            } else {
              // 相同目录下有重名的
              callback(new Error(res.message));
            }
          }
        );
      }
    };
    return {
      ruleForm: {
        instanceName: [{ validator: checkInstanceName, trigger: "blur" }]
      },
      ifDisabled: false,
      inputData: null,
      inputData2: '',
      classifyValue: '',
      ifShow: {
        classify: false
      },
      defaultProps: {
        children: 'childNodes',
        label: 'nodeName'
      },
      comboboxData: [],
      treeData: [],
      // oldName: '',
      oldcName: this.oldName,
      isClickDelete: '',
      nodeList: [],
      selectClear: false,
      parentId: '', // instanceName判断是否重复传参使用
      showSames: false, // instanceName判断是否重复，不同目录下存在时存放相同内容
      sameList: [], // instanceName判断是否重复，不同目录下存在时存放相同内容
      instanceId: ''// 编辑时 instanceName判断是否重复传参使用
    }
  },
  watch: {
    // inputData(val) {
    //   bus.$emit(this.inputItem.columnName, this.inputData)
    // },
    "inputData": {
      handler: function(val, oldval) {
        bus.$emit(this.inputItem.columnName, this.inputData)
        if (this.inputItem.columnName === "INSTANCE_NAME") {
          if (val !== this.oldcName || this.isClickDelete) {
            get('/ds/bizTerm/queryHomologousEnVocabularies', {
              cnTerm: val
            }).then(res => {
              if (res.code === 10000 && res.success === true) {
                let eName = res.data[0]
                let shortName = res.data[1]
                bus.$emit("ename", eName)
                bus.$emit("shortName", shortName)
              } else {
                this.$message.error(res.message)
              }
            })
          }
        }
      },
      deep: true
    },
    nodeList() {
      bus.$emit('getNodeArr', this.nodeList)
      // console.log("this.nodeListthis.nodeList", this.nodeList)
    }
  },
  methods: {
    // 子组件内的dialog确定 并 保存时 调用父组件的save方法
    otherSure() {
      this.$emit('childSaveSure');
      this.showSames = false
    },
    cancelSure() {
      this.$emit('childCancelSure');
      this.showSames = false
    },
    // 详情(instnceName验证使用)
    toSeeDetail(item) {
      this.showSames = false
      this.$emit('hiddenDialog')
      let row = item;
      row.instanceName = item.name;
      row.instanceId = item.id;
      this.$router.push({
        name: "professionalDetail",
        params: {
          id: item.id,
          _title: item.name,
          name: item.name
        }
      });
    },
    watchDelete() {
      this.isClickDelete = true
    },
    dropDown() {
      this.ifShow.classify = !this.ifShow.classify;
    },
    handleNodeClick(data, node) {
      if (this.selectClear) {
        this.nodeList = [];
        this.selectClear = false;
      }
      // console.log(this.nodeList, 0)
      // console.log(data, node)
      node.data.id = node.data.nodeId;
      node.data.name = node.data.nodeName;
      node.data.notetype = "metadata";
      this.nodeList.map((item, index) => {
        if (item.level === node.level) {
          this.nodeList.splice(index, this.nodeList.length);
        }
      })
      this.nodeList.push(node)
      if (node.isLeaf) {
        this.$refs.classifySelect.blur();
      }
      this.inputData = data.nodeId;
      this.inputData2 = data.nameContext;
      bus.$emit("parentid", data.nodeId)
    },
    showTreeData() {
      // this.ifShow.classify = !this.ifShow.classify;
      this.$emit('dropDown', this.inputItem.columnTypeValue)
    },
    /* 指标管理 - 新增时用到*/
    comboboxChange(name, value) {
      this.$emit('comboboxChange', value)
    },
    // 自定义tree 图标 文字
    renderContent(h, params) {
      // console.log(params);
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
              float: 'unset',
              fontWeight: 'unset'
            }
          }),
          h("span", sText)
        ]
      );
    }
  },
  created() {
    // console.log("treedirectory", this.inputItem)
    // console.log(this.inputItem)
    this.selectClear = true;
    if (this.inputItem.columnType === 'combobox') {
      get('/ds/listStandardAttrComboboxInfos', {
        columnTypeValue: this.inputItem.columnTypeValue
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.comboboxData = res.data
        } else {
          this.$message.error(res.message);
        }
      })
    } else if (this.inputItem.columnType === 'treedirectory') {
      // console.log("this.inputItem.columnTypeValue", this.inputItem)
      get(this.inputItem.columnTypeValue).then(res => {
        if (res.code === 10000 && res.success) {
          this.treeData = res.data
        } else {
          this.$message.error(res.message);
        }
      })
    }
    if (this.inputItem.onlyRead === true) {
      this.ifDisabled = true
    }
    if (this.inputItem.attrValueId && this.inputItem.columnType === 'treedirectory') {
      bus.$emit("parentid", this.inputItem.attrValueId)
    }
    if (this.inputItem.instanceId) {
      bus.$emit("instanceId", this.inputItem.instanceId)
    }
    if (this.inputItem.attrValue && this.inputItem.columnType === 'treedirectory') {
      this.inputData2 = this.inputItem.attrValue;
      // console.log(this.inputItem, 999)
    } else if (this.inputItem.attrValuNamespace && this.inputItem.attrValuName && this.inputItem.columnType === 'treedirectory') {
      // console.log(this.inputItem, 888)
      let arr = []
      arr = this.inputItem.attrValuNamespace.split("/")
      this.inputData = arr[arr.length - 1]

      bus.$emit("parentid", arr[arr.length - 1])

      this.nodeList = this.inputItem.nodeList
      this.inputData2 = this.inputItem.attrValuName
    } else if (this.inputItem.attrValue) {
      this.inputData = this.inputItem.attrValue;
      this.inputData2 = this.inputItem.attrNamespace
    }
    if (this.inputItem.columnName === 'STRING_5') {
      bus.$on("ename", (e) => {
        // console.log("ename2222", e)
        this.inputData = e
        // console.log(" this.inputData = e]", this.inputData)
      })
    }
    if (this.inputItem.columnName === 'STRING_3') {
      bus.$on("shortName", (e) => {
        this.inputData = e
      })
    }
    if (this.inputItem.columnName === "INSTANCE_NAME") {
      bus.$on("parentid", (e) => {
        this.parentId = e
      })
      bus.$on("instanceId", (e) => {
        this.instanceId = e
      })
    }
    if (this.inputItem.columnName === 'STRING_2') {
      if (this.inputData === "" || this.inputData === null) {
        this.inputData = "待发布"
      }
    }
  }
}
</script>
<style lang="scss" scoped>
 @import "../../../styles/treeIconScoped";
 .opinion-input-type{
    .ruleClassifying {
        /deep/ .el-select-dropdown__item {
          padding: 0;
        }
      }
    
  }
  .onlyOption{
    font-weight: 500!important;
  }
  .dialogforinstanceName{
    /deep/ .el-dialog__header{
      border-radius: 5px;
      border-bottom: 1px solid #e8ebed;
    }
    .el-dialog__footer{
      border-top: 1px solid #e8ebed;
    }
  }
  .dialog-ul {
    padding: 0;
    margin: 0;
    li {
      list-style-type: none;
    }
    .el-button {
      margin-left: 10px;
    }
  }

</style>
