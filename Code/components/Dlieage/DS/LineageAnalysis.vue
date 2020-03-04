<template>
  <div class="diagram-container">
    <div id="myDiagramDiv" class="lineage-diagram" :style="panelCLass"></div>
    <!--全局概览图-->
    <div id="myOverviewDiv"></div>
    <!-- 导出 div结构 -->
    <div id="myImages" style="width:100%; height:100%;position: absolute;left: 0px;top: 0px;display: none"></div>
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
            <el-tooltip effect="dark" content="复原" placement="left">
              <i class="icon-recover icon-class"></i>
            </el-tooltip>
          </el-dropdown-item>
          <el-dropdown-item :command="'fullScreen'">
            <el-tooltip effect="dark" content="全屏" placement="left">
              <i class="icon-full-screen icon-class"></i>
            </el-tooltip>
          </el-dropdown-item>
          <el-dropdown-item :command="'export'">
            <el-tooltip effect="dark" content="导出PDF" placement="left">
              <i class="icon-export icon-class"></i>
            </el-tooltip>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--右键菜单 html结构-->
    <div id="contextMenu" v-show="bContextMenuVisible" :style="{left: nLeft + 'px', top: nTop + 'px'}">
      <ul>
        <li @click="showStandardDetails"><span>详细信息</span></li>
        <li @click="goLineageAnalysis('backward')"><span>参考分析</span></li>
        <li @click="goLineageAnalysis('forward')"><span>影响分析</span></li>
        <li @click="goLineageAnalysis('full')"><span>全链分析</span></li>
      </ul>
    </div>

    <div id="tooltip" v-show="bTooltipVisible" :style="{left: nTipBoxLeft + 'px', top: nTipBoxTop + 'px'}">
      <table>
        <tr>
          <td>编号: </td>
          <td>{{selectedCode}}</td>
        </tr>
        <tr>
          <td>名称: </td>
          <td>{{selectedName}}</td>
        </tr>
        <tr>
          <td>类型: </td>
          <td>{{selectedClassifierName + '(' + selectedClassifierId + ')'}}</td>
        </tr>
        <tr>
          <td>路径: </td>
          <td>{{selectedPath}}</td>
        </tr>
      </table>
    </div>

    <!-- 抽屉：系统信息  -->
    <el-drawer id="drawer"
               class="lineage-drawer"
               :title="selectedName + '(' + selectedCode + ')'"
               :visible.sync="bShowDetails"
               direction="rtl"
               :show-close="false"
               size="50%">
      <div class="title">基本属性</div>
      <el-table :data="aBaseTableData"
                :show-header="false"
                border
                style="width: 100%">
        <el-table-column
          label=""
          width="200">
          <template slot-scope="scope"> {{scope.row.key + ":"}}</template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="">
          <template slot-scope="scope">
            <a v-if="scope.row.key === '标准编号'" class="a-color" @click="goStandardDetails">{{scope.row.value}} </a>
            <span v-else>{{scope.row.value}} </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="title">业务属性</div>
      <el-table :data="aBusinessTableData"
                :show-header="false"
                border
                style="width: 100%">
        <el-table-column
          label=""
          width="200">
          <template slot-scope="scope"> {{scope.row.key + ":"}}</template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="">
        </el-table-column>
      </el-table>
      <div class="title">技术属性</div>
      <el-table :data="aTechTableData"
                :show-header="false"
                border
                style="width: 100%">
        <el-table-column
          label=""
          width="200">
          <template slot-scope="scope"> {{scope.row.key + ":"}}</template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="">
          <template slot-scope="scope">
            <span v-if="scope.row.key === '技术口径' && scope.row.value" v-highlight>
              <pre>
                <code class='lang-SQL hljs' style="background: #e2effd;">{{ scope.row.value }}</code>
              </pre>
            </span>
            <span v-else>{{scope.row.value}} </span>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
  import go from 'gojs'
  import { get, parseAjaxResponse } from '@/utils/request'
  import { loading } from '@/utils/layer'
  import { fullScreen, generateLineageTitle, generateImages } from '@/utils'
  import JsPDF from 'jspdf'

  export default {
    // 数据标准血统分析
    name: 'lineageAnalysis',
    props: {
      id: {
        type: String,
        default: ''
      },
      classifierId: {
        type: String,
        default: ''
      },
      dataFlowType: {
        type: String,
        default: 'forward'
      },
      titleName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        $: {},
        myDiagram: {},
        highlightColor: '#2555f0',
        linkHighlightColor: '#ff0000',
        showMode: '1',
        showLinkText: '1',
        bContextMenuVisible: false,
        bShowDetails: false,
        bTooltipVisible: false,
        highestLevelNodeKeys: [],
        highestLevel: 0,
        bLoading: false,
        nodeDataArray: [],
        linkDataArray: [],
        diagramData: {
          class: "go.GraphLinksModel",
          copiesArrays: true,
          copiesArrayObjects: true,
          linkFromPortIdProperty: "fromPort",
          linkToPortIdProperty: "toPort",
          nodeDataArray: [],
          linkDataArray: []
        },
        // 右键选中的元数据结点id
        selectedId: '',
        selectedCode: '',
        selectedClassifierId: '',
        selectedClassifierName: '',
        selectedParentId: '',
        selectedParentCode: '',
        selectedParentClassifierId: '',
        selectedName: '',
        selectedPath: '',
        nTipBoxLeft: 0,
        nTipBoxTop: 0,
        nLeft: 0,
        nTop: 0,
        aBaseTableData: [],
        aBusinessTableData: [],
        aTechTableData: [],
        oAttTemplate: {
          Table: [
            '注释', '所有者', '描述', '表空间'
          ],
          Column: [
            '注释', '类型', '长度', '精度'
          ]
        },
        myOverview: null
      }
    },
    computed: {
      panelCLass() {
        return {
          // height: (document.body.scrollHeight - 220) + 'px'
        }
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
    mounted() {
      this.init()
    },
    methods: {
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
          case 'export':
            _this.exportPDF()
            break;
          default:
        }
      },
      init() {
        let _this = this
        this.$ = go.GraphObject.make
        this.myDiagram = this.$(go.Diagram, 'myDiagramDiv', {
          "linkingTool.direction": go.LinkingTool.BackwardsOnly,
          "undoManager.isEnabled": false,
          "allowDelete": false,
          "allowLink": false,
          "allowCopy": false,
          // Put the diagram contents at the top center of the viewport
          initialDocumentSpot: go.Spot.TopCenter,
          initialViewportSpot: go.Spot.TopCenter,
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
          // "grid.visible": true,
          layout: _this.$(go.LayeredDigraphLayout, { isInitial: false, isOngoing: false, layerSpacing: 50 })
        })
        // Overview
        this.myOverview =
          this.$(go.Overview, "myOverviewDiv", // the HTML DIV element for the Overview
            { observed: this.myDiagram, contentAlignment: go.Spot.Center }); // tell it which Diagram to show and pan

        this.configureLinkTemplate()
        this.configureTemplate()
        // this.linkLoop()  // 屏蔽link线条流水动态效果
        this.queryDiagramData()
      },
      doDataFlow() {
        this.queryDiagramData()
      },
      queryDiagramData() {
        let _this = this
        // 加载数据
        if (_this.bLoading) {
          return
        }
        let url = '/ds/lineageAnalysis'
        _this.bLoading = true
        let load = loading('正在加载，请稍候...', '.diagram-container')
        get(url, {
          id: _this.id,
          dataFlowType: _this.dataFlowType
        }).then((res) => {
          load.close()
          parseAjaxResponse(res, () => {
            _this.nodeDataArray = res.data.nodeDataArray.map(node => {
              node.context.map(item => {
                // let b = 1.5
                // let minWidth = 50
                // item.len1 = node.len1 * b
                // item.len2 = node.len2 * b
                // item.len3 = node.len3 * b
                // item.len4 = node.len4 * b
                // item.len1 = item.len1 > minWidth ? item.len1 : minWidth
                // item.len1 = item.len1 + 21
                // item.len2 = item.len2 > minWidth ? item.len2 : minWidth
                // item.len2 = item.len2 + 21
                // item.len3 = item.len3 > minWidth ? item.len3 : minWidth
                // item.len4 = item.len4 > minWidth ? item.len4 : minWidth #F2CE83
                if (item.current) {
                  item.background = '#42B983'
                  item.opacity = 0.8
                }
                let source
                switch (item.classifierId) {
                  case 'Context':
                    source = require('./../../../assets/images/standard/Context.png')
                    break
                  case 'MasterDataInfoItem':
                    source = require('./../../../assets/images/standard/MasterDataInfoItem.png')
                    break
                  case 'RuleInfoItem':
                    source = require('./../../../assets/images/standard/RuleInfoItem.png')
                    break
                  case 'DimentsionInfoItem':
                    source = require('./../../../assets/images/standard/DimentsionInfoItem.png')
                    break
                  case 'DimentsionItem':
                    source = require('./../../../assets/images/standard/DimentsionItem.png')
                    break
                  case 'BaseIndexInfoItem':
                    source = require('./../../../assets/images/standard/BaseIndexInfoItem.png')
                    break
                  case 'DeriveIndexInfoItem':
                    source = require('./../../../assets/images/standard/DeriveIndexInfoItem.png')
                    break
                  case 'RuleIndexInfoItem':
                    source = require('./../../../assets/images/standard/RuleIndexInfoItem.png')
                    break
                  case 'CalculateIndexInfoItem':
                    source = require('./../../../assets/images/standard/CalculateIndexInfoItem.png')
                    break
                  case 'BizTermInfoItem':
                    source = require('./../../../assets/images/standard/BizTermInfoItem.png')
                    break
                  default:
                    source = require('./../../../assets/images/standard/Parent.png')
                }
                item.source = source
                return item
              })
              return node
            })
            _this.linkDataArray = res.data.linkDataArray
            _this.layout()
          })
          _this.bLoading = false
        }).catch(() => {
          load.close()
          _this.bLoading = false
        })
      },
      appendNewNodes(nodeDataArray, linkDataArray) {
        let _this = this
        let highestLevel = _this.highestLevel + 1
        let existsNodeIds = _this.nodeDataArray.map(item => item.key)
        let temp = []
        let existNewNode = false
        nodeDataArray.forEach(item => {
          if (highestLevel === 1) {
            if (!(item.level === 1 && item.key === _this.metadataId)) {
              _this.nodeDataArray.push(item)
            }
            existNewNode = true
            if (item.level === 1 && item.key !== _this.metadataId) {
              temp.push(item.key)
            }
          } else if (!existsNodeIds.includes(item.key)) {
            existNewNode = true
            _this.nodeDataArray.push(item)
            if (highestLevel === item.level) {
              temp.push(item.key)
            }
          }
        })
        if (existNewNode) {
          _this.highestLevel += 1
        }
        if (temp.length > 0) {
          _this.highestLevelNodeKeys = temp
        }
        _this.linkDataArray = _this.linkDataArray.concat(linkDataArray)
        return existNewNode
      },
      load() {
        // 过滤
        this.diagramData.nodeDataArray = this.nodeDataArray
        this.diagramData.linkDataArray = this.linkDataArray

        // gojs读取数
        this.myDiagram.model = go.Model.fromJson(this.diagramData)
      },
      layout() {
        // 刷新
        this.load()
        // 重新布局
        this.myDiagram.layoutDiagram(true)
      },
      zoomIn() {
        if (this.myDiagram.scale < 3) {
          this.myDiagram.scale += 0.1;
        }
      },
      zoomOut() {
        if (this.myDiagram.scale > 0.7) {
          this.myDiagram.scale -= 0.1;
        }
      },
      recover() {
        this.myDiagram.scale = 1;
        this.layout()
      },
      fullScreen() {
        fullScreen()
      },
      generateImages(width, height, myDiagram) {
        generateImages(width, height, myDiagram)
      },
      refresh() {
        this.highestLevelNodeKeys.length = 0
        this.highestLevel = 0
        this.nodeDataArray.length = 0
        this.linkDataArray.length = 0
        this.queryDiagramData()
      },
      // 导出PDF
      exportPDF() {
        let db = this.myDiagram.documentBounds.copy();
        let boundswidth = db.width;
        let boundsheight = db.height;

        let pdfwidth = document.querySelector('#myDiagramDiv').offsetWidth;
        let pdfHeight = document.querySelector('#myDiagramDiv').scrollHeight;
        this.generateImages(pdfwidth, pdfHeight, this.myDiagram);// 生成图片
        let imgs = document.querySelectorAll('#myImages .images');
        // es6类数组转换为数组
        let imgArr = Array.from(imgs);
        // console.log(imgArr);
        let doc = new JsPDF('landscape', 'pt', [pdfwidth * 0.75, pdfHeight * 0.75]);
        // x 、 y 偏移量
        let xOffset = pdfwidth > boundswidth ? (pdfwidth * 0.75 - boundswidth * 0.75) / 2 : 0
        let yOffset = pdfHeight > boundsheight ? (pdfHeight * 0.75 - boundsheight * 0.75) / 2 : 0

        imgArr.forEach((item, index) => {
          // 将图片转化为dataUrl
          let imageData = item.src;
          doc.addImage(imageData, 'PNG', xOffset, yOffset, pdfwidth * 0.75, pdfHeight * 0.75);
          doc.addPage();
        })
        // 文档中显示的页数
        let pageCount = doc.internal.getNumberOfPages();
        // 删除最后一页 空白页
        doc.deletePage(pageCount)
        // 导出文件名字
        let titleName = generateLineageTitle(this.dataFlowType, this.titleName).split('-')[2]
        titleName = titleName !== undefined ? `（${titleName}）` : ""
        doc.save(`血统分析${titleName}.pdf`);
      },
      switchMode(mode) {
        // 0是代码 1是名称
        this.showMode = mode
        this.configureTemplate()
        // 重新布局
        this.myDiagram.layoutDiagram(true)
      },
      switchShowLinkText(showLinkText) {
        // 0隐藏 1显示
        this.showLinkText = showLinkText
        this.configureTemplate()
        this.layout()
      },
      configureTemplate() {
        this.configureNodeTemplate()
        this.configureLinkTemplate()
      },
      configureLinkTemplate() {
        let _this = this
        this.myDiagram.linkTemplate = this.$(
          go.Link,
          { curve: go.Link.Bezier,
            curviness: 20,
            // toShortLength: 15,
            toEndSegmentLength: 50,
            fromEndSegmentLength: 50,
            layerName: 'Background' },
          _this.$(go.Shape, {
            isPanelMain: true, stroke: "#666", strokeWidth: 3, name: "PIPE" // 管道的宽度2D8CF0
            // 线段长度
            // strokeDashArray: [5, 5]
          },
          new go.Binding('stroke', 'isHighlighted', (h, shape) => { return h ? _this.linkHighlightColor : "#666666" }).ofObject(),
          new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 3 : 1 }).ofObject(),
          ),
          _this.$(go.Shape, { toArrow: "Triangle", fill: "#999", stroke: null },
            new go.Binding('stroke', 'isHighlighted', (h, shape) => { return h ? _this.linkHighlightColor : null }).ofObject(),
            new go.Binding('fill', 'isHighlighted', (h, shape) => { return h ? _this.linkHighlightColor : '#999' }).ofObject()
          ),
          _this.$(go.TextBlock, {
            column: 0,
            margin: new go.Margin(3, 21),
            font: "8px arial",
            width: 30,
            alignment: go.Spot.Center,
            isMultiline: false,
            stroke: '#b6b6b6'
          }, new go.Binding("text", _this.showLinkText === '1' ? 'text' : null))
        )
      },
      configureEtlNodeTemplate() {
        let _this = this
        this.myDiagram.nodeTemplateMap.add('EtlNode',
          _this.$(go.Node, 'Auto', {
            // mouseOver: _this.handleMouseOver,
            // mouseLeave: _this.handleMouseLeave
          },
          _this.$(go.Shape, "Circle", {
            width: 30, height: 30, fill: "#ffb1b6", stroke: "#cc3053", strokeWidth: 2 }
          )
          )
        )
      },
      configureNodeTemplate() {
        let _this = this
        // 配置表结点样式
        this.myDiagram.nodeTemplate = this.$(
          go.Node, 'Auto', {
            textEditable: false,
            cursor: 'pointer'
            // mouseOver: _this.handleMouseOver,
            // mouseLeave: _this.handleMouseLeave
          },
          _this.$(go.Shape, 'Rectangle', { fill: null, stroke: "#ccc", cursor: "pointer", strokeWidth: 0.5 },
            new go.Binding("stroke", "isHighlighted", (h, shape) => { return h ? _this.highlightColor : "#656565" }).ofObject(),
            new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 2 : 1 }).ofObject()
          ),
          _this.$(go.Panel, 'Vertical',
            _this.$(go.Panel, 'Table',
              {
                padding: 0,
                minSize: new go.Size(100, 10),
                defaultStretch: go.GraphObject.Horizontal,
                defaultRowSeparatorStroke: '#656565',
                defaultColumnSeparatorStroke: '#656565',
                itemTemplate: _this.getColumnsTemplateForTable()
              },
              new go.Binding("itemArray", "context"))
          )
        )
      },
      getColumnsTemplateForTable() {
        let _this = this
        return _this.$(
          go.Panel, 'TableRow',
          {
            // background: "#e63c5d",
            fromLinkable: true,
            toLinkable: true,
            contextMenu: this.getContextMenuTemplate()
          },
          this.$(go.Picture, {
            column: 0,
            alignment: go.Spot.Left,
            margin: 3,
            width: 15,
            height: 15
          }, new go.Binding('source', 'source')),
          _this.$(go.TextBlock, {
            column: 0,
            margin: new go.Margin(3, 21),
            font: "13px arial",
            alignment: go.Spot.Left,
            isMultiline: false,
            stroke: 'black'
          }, new go.Binding("text", _this.showMode === '0' ? "classifierId" : "classifierName")),
          _this.$(go.TextBlock, {
            column: 1,
            margin: new go.Margin(3, 3),
            font: "13px arial",
            alignment: go.Spot.Left,
            isMultiline: false,
            stroke: 'black'
          }, new go.Binding("text", _this.showMode === '0' ? "code" : "name")),
          // _this.$(go.Panel, "Auto",
          //   {
          //     column: 0
          //   },
          //   _this.$(go.Shape, "Rectangle",
          //     {
          //       fill: null,
          //       height: 20,
          //       strokeWidth: 0.5
          //     },
          //     new go.Binding("stroke", "isHighlighted", (h, shape) => { return h ? _this.highlightColor : "#ff3556" }).ofObject(),
          //     new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 1 : 0 }).ofObject(),
          //     new go.Binding('width', _this.showMode === '0' ? 'len1' : 'len2')
          //   ),
          //   this.$(go.Picture, {
          //     alignment: go.Spot.Left,
          //     margin: 2,
          //     width: 18,
          //     height: 18,
          //     source: require('./../../../assets/images/standard/test.png')
          //   }),
          //   _this.$(go.TextBlock, {
          //     alignment: go.Spot.Left,
          //     margin: new go.Margin(3, 25),
          //     font: "13px arial"
          //   }, new go.Binding("text", _this.showMode === '0' ? 'classifierId' : 'classifierName'))
          // ),
          // _this.$(go.Panel, "Auto",
          //   {
          //     column: 1
          //   },
          //   _this.$(go.Shape, "Rectangle",
          //     {
          //       fill: null,
          //       height: 20,
          //       strokeWidth: 0.5
          //     },
          //     new go.Binding("stroke", "isHighlighted", (h, shape) => { return h ? _this.highlightColor : "#ff3556" }).ofObject(),
          //     new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 1 : 0 }).ofObject(),
          //     new go.Binding('width', _this.showMode === '0' ? 'len3' : 'len4')
          //   ),
          //   _this.$(go.TextBlock, {
          //     alignment: go.Spot.Left,
          //     margin: new go.Margin(3, 3),
          //     font: "13px arial"
          //   }, new go.Binding("text", _this.showMode === '0' ? 'code' : 'name'))
          // ),
          new go.Binding('background', 'background'),
          new go.Binding('opacity', 'opacity'),
          new go.Binding("portId", "key")
        )
      },
      getContextMenuTemplate() {
        let _this = this
        // 获取右键菜单模板
        return _this.$(go.HTMLInfo, {
          show: function(obj, diagram, tool) {
            let nodeData = obj.part.data
            console.log(obj.part.topIndex)
            _this.selectedId = nodeData.key
            _this.selectedCode = nodeData.code
            _this.selectedClassifierId = nodeData.classifierId
            _this.selectedName = nodeData.name
            _this.bContextMenuVisible = true
            let e = event || window.event;
            _this.nLeft = e.offsetX
            _this.nTop = e.offsetY
          }
        })
      },
      cancelHighlight(e, node) {
        node.diagram.clearHighlighteds()
      },
      handleMouseOver(e, node) {
        this.highlightRelatedLinkForNode(e, node)
        this.showTooltip(node)
      },
      handleMouseLeave(e, node) {
        this.cancelHighlight(e, node)
        this.bTooltipVisible = false
      },
      showTooltip(node) {
        let tooltip = document.getElementById('tooltip')
        let e = event || window.event
        if (!e) {
          return
        }
        let left = e.offsetX - tooltip.offsetWidth / 2
        this.nTipBoxLeft = left > 0 ? left : 0
        this.nTipBoxTop = e.offsetY - tooltip.offsetHeight - 5

        let nodeData = node.part.data
        this.selectedCode = nodeData.code
        this.selectedName = nodeData.name
        this.selectedClassifierName = nodeData.classifierName
        this.selectedClassifierId = nodeData.classifierId
        this.selectedPath = nodeData.path
        this.bTooltipVisible = true
      },
      highlightRelatedLinkForNode(e, node) {
        let _this = this
        node.diagram.clearHighlighteds()
        let links = node.linksConnected
        links.each(function (link) {
          _this.highlightLink(link, true)
          if (link.fromNode === link.toNode) {
            return
          }
          if (node === link.fromNode) {
            _this.highlightUpAllLinksToRoot(link.toNode, 'forward')
          } else {
            _this.highlightUpAllLinksToRoot(link.fromNode, 'backward')
          }
        });
        node.isHighlighted = true
        let tb = node.findObject("TEXTBLOCK")
        if (tb !== null) {
          tb.stroke = this.highlightColor
        }
      },
      highlightLink(link, show) {
        link.isHighlighted = show
        link.fromNode.isHighlighted = show
        link.toNode.isHighlighted = show
      },
      highlightUpAllLinksToRoot(node, direction) {
        let _this = this
        let links = node.linksConnected
        if (links) {
          links.each(function (li) {
            let otherNode = li.getOtherNode(node)
            if (!li.isHighlighted) {
              if (direction === 'forward' && otherNode === li.toNode) {
                _this.highlightLink(li, true);
                _this.highlightUpAllLinksToRoot(otherNode, direction)
              }
              if (direction === 'backward' && otherNode === li.fromNode) {
                _this.highlightLink(li, true)
                _this.highlightUpAllLinksToRoot(li, otherNode, direction)
              }
            }
          })
        }
      },
      linkLoop() {
        // 流水线条，设置水流速度
        let _this = this
        let diagram = _this.myDiagram
        setTimeout(function () {
          let oldskips = diagram.skipsUndoManager;
          diagram.skipsUndoManager = true;
          diagram.links.each(function (link) {
            let shape = link.findObject("PIPE");
            let off = shape.strokeDashOffset - 2;
            shape.strokeDashOffset = (off <= 0) ? 20 : off;
          });
          diagram.skipsUndoManager = oldskips;
          _this.linkLoop();
        }, 300);// 速度
      },
      goLineageAnalysis(dataFlowType) {
        // 调转到血统分析
        this.$router.push({
          name: 'dsLineageAnalysisCanvas',
          params: {
            dataFlowType: dataFlowType,
            id: this.selectedId,
            _title: generateLineageTitle(dataFlowType, this.selectedName)
          }
        })
      },
      showStandardDetails() {
        let load = loading('正在加载，请稍候...', '.rtl');
        get('/masterData/getMasterDataDetail', {
          id: this.selectedId
        }).then(res => {
          load.close()
          this.aBaseTableData = []
          this.aBusinessTableData = []
          this.aTechTableData = []
          parseAjaxResponse(res, () => {
            res.data.basicInfo.forEach(item => {
              if (item.columnName !== 'INSTANCE_ID') {
                if (item.belongs === '基本属性') {
                  this.aBaseTableData.push({
                    key: item.attrName,
                    value: item.attrValue
                  })
                }
                if (item.belongs === '业务属性') {
                  this.aBusinessTableData.push({
                    key: item.attrName,
                    value: item.attrValue
                  })
                }
                if (item.belongs === '技术属性') {
                  this.aTechTableData.push({
                    key: item.attrName,
                    value: item.attrValue
                  })
                }
              }
            })
          })
        })
        this.bShowDetails = true
      },
      goStandardDetails() {
        // 调到标准详情
        switch (this.selectedClassifierId) {
          case 'PublicCodeInfoItem':
            this.$router.push({
              name: 'commonCode',
              params: {
                classifierId: this.selectedClassifierId,
                id: this.selectedId
              }
            })
            break
          case 'MasterDataInfoItem':
            this.$router.push({
              name: 'masterDataDetails',
              params: {
                id: this.selectedId,
                classifierId: this.selectedClassifierId,
                _title: this.selectedName,
                headerTitle: this.selectedName
              }
            })
            break
          case 'DimentsionInfoItem':
            this.$router.push({
              name: "dimensionDetails",
              params: {
                id: this.selectedName,
                _title: this.selectedName,
                detailId: this.selectedId
              }
            })
            break
          case 'BaseIndexInfoItem':
          case 'CalculateIndexInfoItem':
          case 'RuleIndexInfoItem':
          case 'DeriveIndexInfoItem':
            this.$router.push({
              name: 'indexManagementDetails',
              params: {
                id: this.selectedId,
                classifierId: this.selectedClassifierId,
                _title: this.selectedName
              }
            })
            break
          case 'RuleInfoItem':
            this.$router.push({
              name: "ruleDetail",
              params: {
                id: this.selectedId,
                _title: this.selectedName,
                row: {
                  instanceId: this.selectedId,
                  instanceName: this.selectedName
                }
              }
            })
            break
          case 'BizTermInfoItem':
            this.$router.push({
              name: "professionalDetail",
              params: {
                id: this.selectedId,
                _title: this.selectedName,
                name: this.selectedName
              }
            })
            break
          default:
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import './../../../styles/dq/main-card-table.scss';
  .lineage-diagram {
    width: 100%;
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
  .diagram-container {
    border: none;
    position: relative;
    height: 100%;

    /*滚动条样式调整*/
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    ::-webkit-scrollbar-track {
      background: none;
      border-radius: 2px;
    }
    ::-webkit-scrollbar-thumb {
      background: rgb(239, 239, 239);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #bfbfbf;
    }

    /deep/ .lineage-diagram{
      height: 100%;
    }
    .stick-btn {
      position: absolute;
      z-index: 100;
      top: 14px;
      right: 52px;
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
        background: url("./../../../assets/images/icon-recover.png") no-repeat;
        background-size: 20px 20px;
      }
      i.icon-full-screen {
        display: inline-block;
        margin: 0 0;
        padding: 0 0;
        width: 25px;
        height: 24px;
        background: url("./../../../assets/images/quanpin.png") no-repeat;
        background-size: 20px 20px;
      }
      i.icon-export {
        display: inline-block;
        margin: 0 0;
        padding: 0 0;
        width: 25px;
        height: 24px;
        background: url("./../../../assets/images/fenxiang.png") no-repeat;
        background-size: 20px 20px;
      }
    }
  }
  // 提示信息
  #tooltip {
    font-size: 14px;
    z-index: 99;
    position: absolute;
    opacity: 0.8;
    background-color: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
    border-radius: 5px;
    padding: 0;
    margin: 0;
  table {
      padding: 5px 7px;
      margin: 0;
      tr {
        display: block;
        margin: 3px 0;
        text-align: left;
        td {
          word-break: break-all;
          word-wrap: break-word;
        }
        td:nth-child(1) {
          max-width: 70px;
          display: inline-block;
        }
        td:nth-child(2) {
          min-width: 100px;
          max-width: 200px;
          display: inline-block;
        }
      }
    }
  }
}

 // 抽屉样式
  .lineage-drawer /deep/ {
    .el-drawer__body::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .el-drawer__body::-webkit-scrollbar-track {
      background: none;
      border-radius: 2px;
    }
    .el-drawer__body::-webkit-scrollbar-thumb {
      background: rgb(239, 239, 239);
      border-radius: 10px;
    }
    .el-drawer__body::-webkit-scrollbar-thumb:hover {
      background: #bfbfbf;
    }
    .el-drawer__body{
      padding: 16px;
      border-top: 1px solid #e8eaec;
      overflow: auto;      
      div.title {
        height: 40px;
        line-height: 40px;
        color: #727678;
        margin-left: 3px;
        font-size: 13px;
        font-weight: bold;
      }

      .el-table__body-wrapper table tbody {
        font-size: 12px;

        tr td div {
          padding: 0 18px;
        }

        tr.el-table__row td:nth-child(1) {
          background-color: #f5f7f9;
        }
      }
    }
  }


</style>
