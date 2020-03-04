<!--视窗模式-->
<template>
  <div class="right-basic">
    <div class="box">
      <div slot="header" class="clearfix card-title">
        <el-button class="back-btn" @click="goBack" size="small"><&nbsp;返回</el-button>
      </div>
      <div class="box-content">
        <div class="basic-content">
          <div id="myDiagramDiv" class="lineage-diagram"></div>
          <!--全局概览图-->
          <div id="myOverviewDiv"></div>
          <div class="stick-btn">
            <el-dropdown :hide-on-click="false" @command="handleCommand">
              <span><i class="el-icon-s-tools icon-class"></i></span>
              <el-dropdown-menu>
                <el-dropdown-item :command="'refresh'">
                  <el-tooltip effect="dark" content="刷新" placement="left">
                    <i class="el-icon-refresh icon-class"></i>
                  </el-tooltip>
                </el-dropdown-item>
                <el-dropdown-item :command="'zoomIn'">
                  <el-tooltip effect="dark" content="放大" placement="left">
                    <i class="el-icon-zoom-in icon-class"></i>
                  </el-tooltip>
                </el-dropdown-item>
                <el-dropdown-item :command="'zoomOut'">
                  <el-tooltip effect="dark" content="缩小" placement="left">
                    <i class="el-icon-zoom-out icon-class"></i>
                  </el-tooltip>
                </el-dropdown-item>
                <el-dropdown-item :command="'recover'">
                  <el-tooltip effect="dark" content="暂无功能" placement="left">
                    <i class="icon-recover icon-class"></i>
                  </el-tooltip>
                </el-dropdown-item>
                <el-dropdown-item :command="'fullScreen'">
                  <el-tooltip effect="dark" content="暂无功能" placement="left">
                    <i class="icon-full-screen icon-class"></i>
                  </el-tooltip>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <!--右键菜单 html结构-->
          <div id="contextMenu" v-show="bContextMenuVisible" :style="{left: nLeft + 'px', top: nTop + 'px'}">
            <ul>
              <li @click="showStandardDetails" v-if="bIsShow"><span>详细信息</span></li>
              <li @click="toAddCatalog"><span>新增目录</span></li>
              <li @click="toEditCatalog" v-if="bIsShow"><span>修改目录</span></li>
              <li @click="showDeleteDialog" v-if="bIsShow"><span>删除目录</span></li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import go from 'gojs'
  import { get, parseAjaxResponse } from '@/utils/request'
  import { loading } from '@/utils/layer'

  export default {
    name: "windowMode",
    props: {
      windowModeId: {
        type: String,
        default: ''
      },
      windowModeNamespace: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        $: {},
        myDiagram: {},
        highlightColor: '#2555f0',
        bContextMenuVisible: false,
        bIsShow: true,
        bLoading: false,
        nodeDataArray: [],
        nLeft: 0,
        nTop: 0,
        selectedId: null,
        selectedParentId: "",
        namespace: null,
        diagramData: {
          class: "go.GraphLinksModel",
          copiesArrays: true,
          copiesArrayObjects: true,
          nodeDataArray: [],
          linkDataArray: []
        },
        myOverview: null
      }
    },
    watch: {
      bContextMenuVisible(value) {
        if (value) {
          document.body.addEventListener('click', () => { this.bContextMenuVisible = false })
        } else {
          document.body.removeEventListener('click', () => { this.bContextMenuVisible = false })
        }
      }
    },
    methods: {
      // 详细信息
      showStandardDetails() {
        this.$emit('getCatalogDetail', false, 'windowMode', this.selectedId)
      },
      toAddCatalog () {
        this.$emit('toAddCatalog', this.namespace, true)
      },
      toEditCatalog () {
        this.$emit('toEditCatalog', this.selectedId, this.namespace, true)
      },
      showDeleteDialog () {
        this.$emit('showDeleteDialog', this.selectedId, this.namespace, true, true, this.selectedParentId)
      },
      init() {
        this.$ = go.GraphObject.make
        this.myDiagram = this.$(go.Diagram, 'myDiagramDiv', {
          "linkingTool.direction": go.LinkingTool.BackwardsOnly,
          "undoManager.isEnabled": false,
          "allowDelete": false,
          "allowLink": false,
          "allowCopy": false,
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom
        },
          // 在画布空白处右键->'新建目录'按钮
        { contextMenu: this.getContextMenuAddCatalog() }
        )
        // Overview
        this.myOverview =
          this.$(go.Overview, "myOverviewDiv", // the HTML DIV element for the Overview
            { observed: this.myDiagram, contentAlignment: go.Spot.Center }); // tell it which Diagram to show and pan

        this.configureTemplate()
        this.queryDiagramData()
      },
      configureNodeTemplate() {
        let _this = this
        // 节点模板
        this.myDiagram.nodeTemplate =
          _this.$(go.Node, 'Auto',
            {
              textEditable: false,
              cursor: 'pointer'
            },
            _this.$(go.Shape, 'Rectangle',
              { fill: null, stroke: "#ccc", cursor: "pointer", strokeWidth: 0.5 }
            ),
            _this.$(go.Panel, 'Horizontal',
              {
                stretch: go.GraphObject.Horizontal, padding: 5, margin: 0, background: "#42B983"
              },
              _this.$(go.Picture,
                {
                  alignment: go.Spot.Center,
                  margin: 5, width: 20, height: 20
                },
                new go.Binding('source', 'source')),
              _this.$(go.TextBlock,
                {
                  alignment: go.Spot.Center,
                  editable: false,
                  margin: 5,
                  font: "bold 14px arial",
                  opacity: 0.8,
                  stroke: "#fff"
                },
                new go.Binding("text", "name").makeTwoWay()),
              _this.$(go.TextBlock,
                {
                  alignment: go.Spot.Center,
                  editable: false,
                  // margin: 5,
                  font: "bold 14px arial",
                  opacity: 0.8,
                  stroke: "#fff"
                },
                new go.Binding("text", "count").makeTwoWay())
            ),
            { contextMenu: this.getContextMenuTemplate() }
          )
      },
      // 右键菜单 事件
      getContextMenuTemplate() {
        let _this = this
        return _this.$(go.HTMLInfo, {
          show: function(obj, diagram, tool) {
            let nodeData = obj.part.data
            console.log(nodeData)
            _this.selectedId = nodeData.id
            _this.selectedParentId = nodeData.parentId
            _this.namespace = nodeData.path;
            console.log(_this.namespace, 'namespace')
            // _this.selectedCode = nodeData.code
            // _this.selectedClassifierId = nodeData.classifierId
            // _this.selectedName = nodeData.name
            _this.bContextMenuVisible = true
            _this.bIsShow = true
            let e = event || window.event;
            _this.nLeft = e.offsetX
            _this.nTop = e.offsetY
          }
        })
      },
      // 右键 - 新建目录
      getContextMenuAddCatalog() {
        let _this = this
        return _this.$(go.HTMLInfo, {
          show: function() {
            _this.selectedId = _this.windowModeId
            _this.namespace = _this.windowModeNamespace

            console.log('右键 - 新建目录')
            console.log(_this.selectedId)
            console.log(_this.namespace, 'namespace')

            _this.bContextMenuVisible = true
            _this.bIsShow = false // 右键box 除 新建目录 外，其他不显示
            let e = event || window.event;
            _this.nLeft = e.offsetX
            _this.nTop = e.offsetY
          }
        })
      },
      configureTemplate() {
        this.configureNodeTemplate()
      },
      queryDiagramData() {
        let _this = this
        // 加载数据
        if (_this.bLoading) {
          return
        }
        // 获取主数据视窗模式数据 /masterData/showWindowMode
        let url = '/masterData/showWindowMode'
        _this.bLoading = true
        let load = loading('正在加载，请稍候...', '#myDiagramDiv')
        get(url, {
          instanceId: _this.windowModeId
        }).then((res) => {
          load.close()
          parseAjaxResponse(res, () => {
            console.log(res.data, '视窗模式')
            _this.nodeDataArray = res.data.map(node => {
              // console.log(node, '视窗模式node')
              let obj = {}
              let sNode = node.dataStandardVO
              for (let key in sNode) {
                obj[key] = sNode[key]
              }
              obj.count = `（${node.count}）`
              obj.entity = node.entity
              //     item.background = '#42B983'
              //     item.opacity = 0.8
              let source
              if (obj.classifierId === 'Context') {
                switch (obj.entity) {
                  case 'T': // 实体目录
                    source = require('./../../assets/images/commonIcon/entity_yes.png')
                    break
                  case 'F': // 非实体目录
                    source = require('./../../assets/images/commonIcon/entity_no.png')
                    break
                }
                obj.source = source
              }
              return obj
            })
            console.log(_this.nodeDataArray)
            _this.layout()
          })
          _this.bLoading = false
        }).catch(() => {
          load.close()
          _this.bLoading = false
        })
      },
      load() {
        this.diagramData.nodeDataArray = this.nodeDataArray
        // gojs 渲染画布
        this.myDiagram.model = go.Model.fromJson(this.diagramData)
      },
      layout() {
        // 刷新
        this.load()
        // 重新布局
        this.myDiagram.layoutDiagram(true)
      },
      handleCommand(command) {
        let _this = this
        switch (command) {
          case 'refresh':
            _this.refresh()
            break
          case 'zoomIn':
            _this.zoomIn()
            break
          case 'zoomOut':
            _this.zoomOut()
            break
          case 'recover':
            _this.recover()
            break
          case 'fullScreen':
            _this.fullScreen()
            break;
          default:
        }
      },
      // 刷新
      refresh() {
        this.nodeDataArray.length = 0
        this.queryDiagramData()
      },
      // 放大
      zoomIn() {
        if (this.myDiagram.scale < 3) {
          this.myDiagram.scale += 0.1;
        }
      },
      // 缩小
      zoomOut() {
        if (this.myDiagram.scale > 0.7) {
          this.myDiagram.scale -= 0.1;
        }
      },
      // 返回
      goBack() {
        this.$emit('showmain', 'card')
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="scss" scoped>
  .right-basic{
    height: calc(100vh - 107px);
    background:#fff;
    border-radius: 4px;
    padding: 10px 8px;
    .box{
      height: 100%;
      padding:0px 15px;
      /*overflow: auto;*/
      .box-content{
        height: calc(100vh - 170px);
      }
    }
    .box::-webkit-scrollbar{
      width:5px;
      height:10px;
    }
    .box::-webkit-scrollbar-track{
      background: none;
      border-radius:2px;
    }
    .box::-webkit-scrollbar-thumb{
      background: rgb(239, 239, 239);
      border-radius:10px;
    }
    .box::-webkit-scrollbar-thumb:hover{
      background:#bfbfbf;
    }
    .card-title {
      height: 55px;
      padding: 5px 50px;
      border-bottom: 1px solid rgba(228, 228, 228, 1);
      padding-left: 10px;
    }
    .basic-content{
      height: calc(100% - 30px);
      position: relative;

      #myDiagramDiv{
        position: relative;
        height: 100%;
        /*画布滚动条样式*/
        /deep/ ::-webkit-scrollbar {
          width: 5px;
          height: 7px;
        }
        /deep/ ::-webkit-scrollbar-track {
          background: none;
          border-radius: 2px;
        }
        /deep/ ::-webkit-scrollbar-thumb {
          background: rgb(239, 239, 239);
          border-radius: 10px;
        }
        /deep/ ::-webkit-scrollbar-thumb:hover {
          background: #bfbfbf;
        }
      }

      #myOverviewDiv {
        position: absolute;
        width: 160px;
        height: 80px;
        bottom: 5px;
        left: 5px;
        background-color: aliceblue;
        z-index: 300;
        border: solid 1px blue;
      }

      .stick-btn {
        position: absolute;
        z-index: 100;
        top: 15px;
        right: 15px;
        i.icon-class {
          font-size: 30px;
          color: #CDCDCD;
          display: block;
          transition: all 0.2s ease-in-out;
          -webkit-transition: all 0.2s ease-in-out;
          -moz-transition: all 0.2s ease-in-out;
          -o-transition: all 0.2s ease-in-out;
        }
        i.icon-class:hover {
          color: #061100;
          transform: rotate(180deg);
          -webkit-transform: rotate(180deg);
          -moz-transform: rotate(180deg);
          -o-transform: rotate(180deg);
          -ms-transform: rotate(180deg);
        }
      }
      //右键菜单样式
      #contextMenu {
        z-index: 101;
        position: absolute;
        left: 5px;
        top: 0;
        font-size: 12px;
        min-width: 90px;
        max-height: 200px;
        margin: 5px 0;
        padding: 5px 0;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, .2);

        ul {
          list-style: none;
          top: 0;
          left: 0;
          margin: 0;
          padding: 0;

          li:hover {
            background: #f3f3f3;
          }

          li {
            position: relative;
            margin: 0;
            line-height: normal;
            padding: 7px 16px;
            clear: both;
            color: #515a6e;
            font-size: 12px !important;
            white-space: nowrap;
            list-style: none;
            cursor: pointer;
            transition: background .2s ease-in-out;
          }
        }
      }
    }
  }

  .el-dropdown-menu {
    .el-dropdown-menu__item {
      padding: 2px 5px 2px 8px;
      margin: 10px 0;
      height: 24px;
      line-height: 20px;
      text-align: center;
      i.icon-class {
        font-size: 20px;
        color: #8A8A8A;
      }
      i.icon-recover {
        display: inline-block;
        margin: 0 0;
        padding: 0 0;
        width: 25px;
        height: 24px;
        background: url("./../../assets/images/windowMode1.png") no-repeat;
        background-size: 18px 18px;
      }
      i.icon-full-screen {
        display: inline-block;
        margin: 0 0;
        padding: 0 0;
        width: 25px;
        height: 24px;
        background: url("./../../assets/images/windowMode2.png") no-repeat;
        background-size: 18px 18px;
      }
    }
  }
</style>