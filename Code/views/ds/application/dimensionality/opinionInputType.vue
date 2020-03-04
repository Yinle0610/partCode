<template>
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
            <el-form-item :label="inputItem.attrName+'：'" :prop="inputItem.columnName">
             <!-- :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]:null"> -->
                <el-input v-model="inputData" :disabled="ifDisabled"></el-input>
            </el-form-item>
        </el-tooltip>
        <el-form-item :label="inputItem.attrName+'：'" :prop="inputItem.columnName" v-else-if="inputItem.columnType==='textfield'" :class="inputItem.nullable === false&&inputItem.columnName==='INSTANCE_NAME'?'is-required':''">
                      <!-- :rules="inputItem.nullable === false&&inputItem.columnName==='INSTANCE_NAME'?rules.INSTANCE_NAME:inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]:null"> -->
                      <!-- :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]:null"> -->
            <el-input v-model="inputData" :disabled="ifDisabled" ></el-input>
        </el-form-item>
        <el-form-item :label="inputItem.attrName+'：'" :prop="'NAMESPACE'" v-else-if="(inputItem.columnTypeValue!==undefined&&inputItem.columnTypeValue.indexOf('index') === -1) && inputItem.columnType==='treedirectory'"> 
        <!-- :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'change' }]:null"> -->
            <el-select
                  ref="classifySelect"
                  class="ruleClassifying"
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
             <!-- <el-button class="selectButton" @click="dropDown" >{{inputData2?inputData2:'请选择'}}<i class="el-icon-arrow-down" ref="icon1"></i></el-button>
                <el-collapse-transition>
                <div class="tree" v-if="ifShow.classify">
                    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" node-key="namespace" :default-checked-keys="[inputItem.namespace]"></el-tree>
                </div>
                </el-collapse-transition> -->
        </el-form-item>
        <!--指标管理-新增 使用此选择目录tree-->
        <el-form-item :label="inputItem.attrName+'：'" :prop="'NAMESPACE'" v-else-if="(inputItem.columnTypeValue!==undefined&&inputItem.columnTypeValue.indexOf('index') !== - 1)&& inputItem.columnType==='treedirectory'">
                      <!-- :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'change' }]:null"> -->
          <el-select
              ref="classifySelect"
              class="ruleClassifying"
              clearable
              style="width: 100%;"
              v-model="inputData2"
              placeholder="请选择"
              @focus="showTreeData"
          >
            <el-option :value="classifyValue" style="height: auto" class="onlyOption">
              <el-tree
                  accordion
                  style="margin: 0 -20px;"
                  :data="aTreeData"
                  node-key="attrValue"
                  @node-click="handleNodeClick"
                  :props="defaultProps"
                  :highlight-current="true"
                  :render-content="renderContent"
                  :default-checked-keys="[inputItem.attrValue]"
              ></el-tree>
            </el-option>
          </el-select>
          <!--<el-button class="selectButton" @click="dropDown2" >{{inputData2?inputData2:'请选择'}}<i class="el-icon-arrow-down" ref="icon1"></i></el-button>
          <el-collapse-transition>
            <div class="tree" v-if="ifShow.classify">
              <el-tree :data="aTreeData" :props="defaultProps" @node-click="handleNodeClick" node-key="namespace" :default-checked-keys="[inputItem.namespace]"></el-tree>
            </div>
          </el-collapse-transition>-->
        </el-form-item>
        <el-form-item :label="inputItem.attrName+'：'" :prop="inputItem.columnName" v-else-if="inputItem.attrName !== '指标类型' && inputItem.columnType==='combobox'">
        <!-- :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'change' }]:null"> -->
             <el-select v-model="inputData" placeholder="请选择" :disabled="ifDisabled">
                <el-option :label="val.textField" :value="val.valueField" v-for="(val,index) in comboboxData" :key="val+index"></el-option>
            </el-select>
        </el-form-item>
        <!--指标管理-新增，指标类型-->
        <el-form-item :label="inputItem.attrName+'：'" :prop="inputItem.columnName" v-else-if="inputItem.attrName === '指标类型' && inputItem.columnType==='combobox'">
                      <!-- :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'change' }]: null"> -->
          <el-select v-model="inputData" placeholder="请选择" :disabled="ifDisabled" @change="comboboxChange(inputItem.attrName, $event)">
            <el-option :label="val.textField" :value="val.valueField" v-for="(val,index) in comboboxData" :key="val+index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="inputItem.attrName+'：'" :prop="inputItem.columnName" v-else-if="inputItem.columnType==='textarea'">
                      <!-- :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]: null"> -->
             <el-input type="textarea" autosize v-model="inputData" :disabled="ifDisabled"></el-input>
        </el-form-item>

        <!-- 计数器 -->
        <el-form-item :label="inputItem.attrName+'：'" :prop="inputItem.columnName" v-else-if="inputItem.columnType === 'integerfield'">
                      <!-- :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]:null"> -->
          <el-input-number v-model="inputData" :disabled="ifDisabled" controls-position="right" :min="1" :max="10000000"></el-input-number>
        </el-form-item>
        <el-form-item :label="inputItem.attrName+'：'" :prop="inputItem.columnName" v-else-if="inputItem.columnType == null" :class="inputItem.nullable === false&&inputItem.columnName==='INSTANCE_NAME'?'is-required':''">
        <!-- :rules="inputItem.nullable === false?[{ required: true, message: '请输入'+inputItem.attrName, trigger: 'blur' }]:null"> -->
             <el-input v-model="inputData" :disabled="ifDisabled"></el-input>
        </el-form-item>

    </div>
</template>
<script>
import { get } from '@/utils/request'
import bus from '@/utils/bus'
export default {
  props: ['item', 'aTreeData'],
  data() {
    return {
      inputItem: '',
      ifDisabled: false,
      inputData: null,
      inputData2: null,
      classifyValue: '',
      defaultProps: {
        children: 'childNodes',
        label: 'nodeName'
      },
      comboboxData: [],
      treeData: [],
      nodeList: [],
      selectClear: false,
      firstTimes: true
    }
  },
  watch: {
    inputData(val) {
      if (this.inputItem.columnName) {
        let obj = {
          name: this.inputItem.columnName,
          val: this.inputData }
        bus.$emit('columnName', obj)
      }
    },
    nodeList() {
      bus.$emit('getNodeArr', this.nodeList)
    },
    'item': {
      handler: function (val, oldVal) {
        // console.log(val, 'oooo')
        this.inputItem = val
        // if()
        this.inputData = this.inputItem.attrValue;
      },
      deep: true
    }
  },
  methods: {
    // Event(e) {
    //   if (e.target.className === 'card-body') {
    //     this.ifShow.classify = false
    //   }
    // },
    // toSearch() {
    //   console.log(this.inputData)
    // },
    dropDown() {
      // this.ifShow.classify = !this.ifShow.classify;
    },
    showTreeData() {
      // this.ifShow.classify = !this.ifShow.classify;
      this.$emit('dropDown', this.inputItem.columnTypeValue)
    },
    handleNodeClick(data, node) {
      if (this.selectClear) {
        this.nodeList = [];
        this.selectClear = false;
      }
      console.log(this.nodeList, 0)
      console.log(data, node, 444)
      node.data.id = node.data.nodeId;
      node.data.name = node.data.nodeName;
      node.data.notetype = "metadata";
      // if (!this.nodeList.includes(node)) {
      //   this.nodeList.push(node);
      // }
      this.nodeList.map((item, index) => {
        if (item.level === node.level) {
          this.nodeList.splice(index, this.nodeList.length);
        }
      })
      this.nodeList.push(node)
      if (node.isLeaf) {
        this.$refs.classifySelect.blur();
      }

      this.inputData = data.namespace;

      this.inputData2 = data.nameContext;
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
    this.selectClear = true;
    this.inputItem = this.item
    console.log(this.item)
    if (this.inputItem.columnType === 'combobox') {
      get('/ds/listStandardAttrComboboxInfos', {
        columnTypeValue: this.inputItem.columnTypeValue
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.comboboxData = res.data
          if (this.inputItem.columnName === 'INDEX_TYPE') {
            if (this.inputItem.select) {
              this.inputData2 = this.inputItem.select.name
              this.comboboxData.map(item => {
                if (item.textField === this.inputItem.select.name) {
                  this.inputData = item.valueField
                }
              })
            }
          }
        } else {
          this.$message.error(res.message);
        }
      })
    } else if (this.inputItem.columnType === 'treedirectory') {
      /* 指标管理 - 选择目录，需要先指定指标类型*/
      // console.log(this.inputItem.columnTypeValue.indexOf('index'))
      if (this.inputItem.columnTypeValue.indexOf('index') === -1) { // 排除指标类型的情形，(接口：获取目录信息 /ds/application/index/listDicInfos) 指标类型下面的选择目录，初始化时不请求接口
        get(this.inputItem.columnTypeValue).then(res => {
          if (res.code === 10000 && res.success) {
            this.treeData = res.data
          } else {
            this.$message.error(res.message);
          }
        })
      }
    }
    if (this.inputItem.onlyRead === true) {
      this.ifDisabled = true
    }
    // console.log(this.inputItem, 111, this.inputItem.attrValue && this.inputItem.columnType === 'treedirectory')
    if (this.inputItem.attrValue && this.inputItem.columnType === 'treedirectory') {
      this.inputData2 = this.inputItem.attrValue;
      this.inputData = null
    } else if (this.inputItem.attrValuNamespace && this.inputItem.attrValuName && this.inputItem.columnType === 'treedirectory') {
      console.log(this.inputItem, 888)
      this.inputData = this.inputItem.attrValuNamespace
      this.nodeList = this.inputItem.nodeList
      this.inputData2 = this.inputItem.attrValuName
    } else if (this.inputItem.attrValue && this.inputItem.columnType !== 'treedirectory') {
      this.inputData = this.inputItem.attrValue;
      // this.inputData2 = this.inputItem.attrNamespace
    }
  }

}
</script>
<style lang="scss" scoped>
@import "../../../../styles/treeIconScoped";
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

</style>
