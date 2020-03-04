<template>
  <div class="diagram-container">
    <div v-show="!bSvgLineageIsShow" id="myDiagramDiv" class="lineage-diagram" :style="panelCLass"></div>
    <!--全局概览图-->
    <div v-show="!bSvgLineageIsShow" id="myOverviewDiv"></div>
    <div v-show="!bSvgLineageIsShow" class="stick-btn">
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
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--svg 血统分析图-->
    <div v-show="bSvgLineageIsShow" style="overflow: auto; height: 100%;">
      <svgLineage
          :dataFlowType="dataFlowType"
          :itemId="metadataId"
      ></svgLineage>
    </div>

    <!--右键菜单 html结构-->
    <div id="contextMenu" v-show="bContextMenuVisible" :style="{left: nLeft + 'px', top: nTop + 'px'}">
      <ul>
        <li @click="goMdDetails"><span>详细信息</span></li>
        <!--<li v-permission="'LINEAGE_ANALYSIS'" @click="goLineageAnalysis"><span>血统分析</span></li>
        <li v-permission="'IMPACT_ANALYSIS'" @click="goImpactAnalysis"><span>影响分析</span></li>-->
      </ul>
    </div>

    <div id="tooltip" v-show="bTooltipVisible" :style="{left: nTipBoxLeft + 'px', top: nTipBoxTop + 'px'}">
      <table>
        <tr>
          <td>代码: </td>
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
               :title="selectedName"
               :visible.sync="bShowDetails"
               direction="rtl"
               :show-close="false"
               size="50%">
      <div class="title">基本信息</div>
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
            <a v-if="scope.row.key === '元数据代码'" class="a-color" @click="goMetadataDetails('child')">{{scope.row.value}} </a>
            <a v-else-if="scope.row.key === '父元数据代码'" class="a-color" @click="goMetadataDetails('parent')">{{scope.row.value}} </a>
            <span v-else>{{scope.row.value}} </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="title">属性信息</div>
      <el-table :data="aAttrTableData"
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
    </el-drawer>
  </div>
</template>
<script>
  import go from 'gojs'
  import { get, parseAjaxResponse } from '@/utils/request'
  import { loading } from '@/utils/layer'
  import { fullScreen } from '@/utils'
  import svgLineage from "../../views/md/svgLineage";

  export default {
    // 数据流向分析组件
    name: 'dataFlowAnalysis',
    props: {
      metadataId: {
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
      bSvgLineageIsShow: {
        type: Boolean,
        default: false
      }
    },
    components: {
      svgLineage
    },
    data() {
      return {
        $: {},
        myDiagram: {},
        highlightColor: '#2555f0',
        linkHighlightColor: '#ff0000',
        showMode: '0',
        showEtl: '1',
        showLevel: '0',
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
        aAttrTableData: [],
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
      if (!this.bSvgLineageIsShow) {
        this.init()
      }
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
        this.linkLoop()
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
        let url
        if (this.dataFlowType === 'forward') {
          url = '/md/impactAnalysis'
        } else if (this.dataFlowType === 'backward') {
          url = '/md/lineageAnalysis'
        } else if (this.dataFlowType === 'endToEnd') {
          url = '/md/asg/lineageAnalysis';
        } else {
          return
        }
        _this.bLoading = true
        let load = loading('正在加载，请稍候...', '.diagram-container')
        get(url, {
          metadataId: _this.metadataId,
          level: _this.highestLevel,
          nextLevelMetadataIds: _this.highestLevelNodeKeys.join(','),
          showEtl: this.showEtl === '0',
          showLevel: this.showLevel
        }).then((res) => {
          load.close()
          parseAjaxResponse(res, () => {
            let nodeData = res.data.nodeDataArray
            nodeData.map(node => {
              if (node.columnList) {
                node.context = node.context.concat(node.columnList)
              }
              if (node.context) {
                node.context.map(item => {
                  if (item.current) {
                    item.background = '#A9FFA5'
                    item.opacity = 0.7
                  }
                  let source
                  switch (item.classifierId) {
                    case 'System':
                      source = require('./../../assets/images/metadata/System.png')
                      break;
                    case 'Schema':
                      source = require('./../../assets/images/metadata/Schema.png')
                      break;
                    case 'Database':
                      source = require('./../../assets/images/metadata/Database.png')
                      break;
                    case 'Table':
                      source = require('./../../assets/images/metadata/Table.png')
                      break;
                    case 'View':
                      source = require('./../../assets/images/metadata/View.png')
                      break;
                    case 'Column':
                    default:
                      source = require('./../../assets/images/metadata/Column.png')
                  }
                  item.source = source
                  return item
                })
              }
            })
            // 去掉收尾是同一结点的线
            this.linkDataArray = res.data.linkDataArray.filter(item => item.fromPort !== item.toPort)
            this.nodeDataArray = nodeData
            _this.layout()
          })
          _this.bLoading = false
        }).catch(() => {
          load.close()
          _this.bLoading = false
        })
      },
      load() {
        // 过滤
        this.diagramData.nodeDataArray = this.nodeDataArray;
        this.diagramData.linkDataArray = this.linkDataArray;
        // 过滤掉收尾是同一个结点的线
        this.diagramData.linkDataArray = this.diagramData.linkDataArray.filter(item => item.fromPort !== item.toPort);
        // gojs读取数
        this.myDiagram.model = go.Model.fromJson(this.diagramData);
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
      refresh() {
        this.highestLevelNodeKeys.length = 0
        this.highestLevel = 0
        this.nodeDataArray.length = 0
        this.linkDataArray.length = 0
        this.queryDiagramData()
      },
      switchShowLevel(showLevel) {
        // 切换显示等级
        this.showLevel = showLevel;
        this.configureTemplate();
        this.queryDiagramData();
      },
      switchMode(mode) {
        // 0是代码 1是名称
        this.showMode = mode
        this.configureTemplate()
        // 重新布局
        this.myDiagram.layoutDiagram(true)
      },
      switchShowEtl(showEtl) {
        // 0显示 1隐藏
        this.showEtl = showEtl
        this.configureTemplate();
        this.queryDiagramData();
      },
      configureTemplate() {
        if (this.showEtl === '0') {
          this.configureEtlNodeTemplate();
        }
        this.configureNodeTemplate();
      },
      configureLinkTemplate() {
        let _this = this
        this.myDiagram.linkTemplate = this.$(
          go.Link,
          { curve: go.Link.Bezier,
            curviness: 20,
            toShortLength: 15,
            toEndSegmentLength: 50,
            fromEndSegmentLength: 50,
            layerName: 'Background' },
          // 总的宽度
          // _this.$(go.Shape, { isPanelMain: true, stroke: "#fff", strokeWidth: 3 }),
          // 外边框
          // _this.$(go.Shape, { isPanelMain: true, stroke: "#fff", strokeWidth: 1 }),
          _this.$(go.Shape, {
            isPanelMain: true, stroke: "#666", strokeWidth: 3, name: "PIPE", // 管道的宽度2D8CF0
            // 线段长度
            strokeDashArray: [5, 5] },
          new go.Binding('stroke', 'isHighlighted', (h, shape) => { return h ? _this.linkHighlightColor : "#666666" }).ofObject(),
          new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 3 : 1 }).ofObject(),
          ),
          _this.$(go.Shape, { toArrow: "Triangle", fill: "#999", stroke: null },
            new go.Binding('stroke', 'isHighlighted', (h, shape) => { return h ? _this.linkHighlightColor : null }).ofObject(),
            new go.Binding('fill', 'isHighlighted', (h, shape) => { return h ? _this.linkHighlightColor : '#999' }).ofObject()
          )
        )
      },
      configureEtlNodeTemplate() {
        let _this = this
        this.myDiagram.nodeTemplateMap.add('EtlNode',
          _this.$(go.Node, 'Auto', {
            // mouseOver: _this.handleMouseOver,
            // mouseLeave: _this.handleMouseLeave
            contextMenu: this.getContextMenuTemplate()
          },
          _this.$(go.Shape, "Diamond", {
            width: 20, height: 20, fill: "#ffb1b6", stroke: "#cc3053", strokeWidth: 1 }
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
            // mouseOver: _this.handleMouseOver,
            // mouseLeave: _this.handleMouseLeave,
            contextMenu: this.getContextMenuTemplate()
          },
          _this.$(go.Shape, 'Rectangle',
            {
              fill: null,
              stroke: "#ccc",
              cursor: "pointer",
              strokeWidth: 0.5,
              fromLinkable: true,
              fromLinkableSelfNode: true,
              fromLinkableDuplicates: true,
              toLinkable: true,
              toLinkableSelfNode: true,
              toLinkableDuplicates: true
            },
            new go.Binding("stroke", "isHighlighted", (h, shape) => { return h ? _this.highlightColor : "#656565" }).ofObject(),
            new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 2 : 0.5 }).ofObject()
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
      configureDetailNodeTemplate() {
        let _this = this
        // 配置表结点样式
        this.myDiagram.nodeTemplate = this.$(
          go.Node, 'Auto', {
            textEditable: false,
            // mouseOver: _this.handleMouseOver,
            // mouseLeave: _this.handleMouseLeave,
            contextMenu: this.getContextMenuTemplate()
          },
          _this.$(go.Shape, 'Rectangle',
            {
              fill: null,
              stroke: "#ccc",
              cursor: "pointer",
              strokeWidth: 0.5,
              fromLinkable: true,
              fromLinkableSelfNode: true,
              fromLinkableDuplicates: true,
              toLinkable: true,
              toLinkableSelfNode: true,
              toLinkableDuplicates: true
            },
            new go.Binding("stroke", "isHighlighted", (h, shape) => { return h ? _this.highlightColor : "#656565" }).ofObject(),
            new go.Binding('strokeWidth', 'isHighlighted', (h) => { return h ? 2 : 0.5 }).ofObject()
          ),
          _this.$(go.Panel, 'Vertical',
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
                new go.Binding("itemArray", "columnList"))
            )
          )
        )
      },
      getColumnsTemplateForColumn() {
        let _this = this
        return _this.$(
          go.Panel, 'TableRow',
          {
            background: "transparent",
            fromLinkable: true,
            toLinkable: true
          },
          _this.$(go.TextBlock, {
            column: 0,
            margin: new go.Margin(3, 25),
            font: "13px arial",
            alignment: go.Spot.Left,
            isMultiline: false,
            stroke: 'black'
          }, new go.Binding("text", "code")),
          _this.$(go.TextBlock, {
            column: 1,
            margin: new go.Margin(3, 3),
            font: "13px arial",
            alignment: go.Spot.Left,
            isMultiline: false,
            stroke: 'black'
          }, new go.Binding("text", "dataType")),
          new go.Binding('background', 'background'),
          new go.Binding('opacity', 'opacity'),
          new go.Binding("portId", "key")
        )
      },
      getColumnsTemplateForTable() {
        let _this = this
        return _this.$(
          go.Panel, 'TableRow',
          {
            background: "transparent",
            fromLinkable: true,
            toLinkable: true
          },
          this.$(go.Picture, {
            column: 0,
            alignment: go.Spot.Left,
            margin: 2,
            width: 18,
            height: 18
          }, new go.Binding('source', 'source')),
          _this.$(go.TextBlock, {
            column: 0,
            margin: new go.Margin(3, 25),
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
        this.selectedPath = nodeData.fullPath
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
      goMdDetails() {
        // 调转到元数据详情
        get(`/md/detail/${this.selectedId}`).then((res) => {
          parseAjaxResponse(res, () => {
            this.bShowDetails = true
            let md = res.data
            this.aBaseTableData = [
              { key: '元数据代码', value: md.code },
              { key: '元数据名称', value: md.name },
              { key: '元数据类型', value: md.classifierName + '(' + md.classifierId + ')' },
              { key: '父元数据代码', value: md.parentMetadata.code },
              { key: '父元数据名称', value: md.parentMetadata.name },
              { key: '父元数据类型', value: md.parentMetadata.classifierName + '(' + md.parentMetadata.classifierId + ')' }
            ]

            this.selectedParentId = md.parentMetadata.id
            this.selectedParentCode = md.parentMetadata.code
            this.selectedParentClassifierId = md.parentMetadata.classifierId

            let url = this.dataFlowType === 'forward' ? '/md/getImpactStatistic' : '/md/getLineageStatistic'

            get(url, { instanceId: this.selectedId, classifierId: this.selectedClassifierId }).then(res => {
              parseAjaxResponse(res, () => {
                let count = res.data
                if (count > 0) {
                  let node;
                  switch (md.classifierId) {
                    case 'Schema':
                      node = {
                        key: this.dataFlowType === 'forward' ? `影响系统` : `来源系统`,
                        value: count + '个'
                      }
                      break;
                    case 'Table':
                      node = {
                        key: this.dataFlowType === 'forward' ? `影响库` : `来源库`,
                        value: count + '个'
                      }
                      break;
                    case 'Column':
                      node = {
                        key: this.dataFlowType === 'forward' ? `影响表` : `来源表`,
                        value: count + '张'
                      }
                      break
                    default:
                  }
                  if (node) {
                    this.aBaseTableData.push(node)
                  }
                }
                this.aBaseTableData.push(...[
                  { key: '上下文路径', value: md.path },
                  { key: '生效时间', value: md.startTime }
                ])
                this.aAttrTableData.length = 0;
                md.attributes.forEach(item => {
                  this.aAttrTableData.push({
                    key: item.name,
                    value: item.value
                  })
                });
              })
            })
          })
        })
      },
      goLineageAnalysis() {
        // 调转到血统分析
        this.$router.push({
          name: 'lineageAnalysisCanvas',
          params: {
            id: this.selectedId,
            _title: this.selectedCode,
            classifierId: this.selectedClassifierId
          }
        })
      },
      goImpactAnalysis() {
        // 调用影响分析
        this.$router.push({
          name: 'impactAnalysisCanvas',
          params: {
            id: this.selectedId,
            _title: this.selectedCode,
            classifierId: this.selectedClassifierId
          }
        })
      },
      goMetadataDetails(type) {
        let params = {}
        if (type === 'child') {
          params.id = this.selectedId
          params._title = this.selectedCode
          params.classifierId = this.selectedClassifierId
        } else {
          params.id = this.selectedParentId
          params._title = this.selectedParentCode
          params.classifierId = this.selectedParentClassifierId
        }
        this.$router.push({
          name: 'impactAndLineageDetail',
          params
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import './../../styles/dq/main-card-table.scss';
  .lineage-diagram {
    width: 100%;
  }
  /*全局概览图div样式*/
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
      min-width: 120px;
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
        background: url("../../../src/assets/images/icon-recover.png") no-repeat;
        background-size: 20px 20px;
      }
      i.icon-full-screen {
        display: inline-block;
        margin: 0 0;
        padding: 0 0;
        width: 25px;
        height: 24px;
        background: url("../../../src/assets/images/quanpin.png") no-repeat;
        background-size: 20px 20px;
      }
    }
  }

  // 抽屉样式
  #drawer /deep/ .el-drawer__container .el-drawer {
    .el-drawer__body {
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

</style>
