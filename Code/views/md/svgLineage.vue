<template>
  <div>
    <div class="svgg-class"></div>

    <!--右键菜单 html结构-->
    <!--<div id="contextMenu" v-show="bContextMenuVisible" :style="{left: nLeft + 'px', top: nTop + 'px'}">-->
    <div id="contextMenu">
      <ul>
<!--        <li @click="goMdDetails"><span>详细信息</span></li>-->
<!--        <li v-show="bIsShowLineage" class="toLineage" @click="toLineage">血统分析</li>-->
        <li v-show="bIsShowLineage" class="toImpact" >影响分析</li>
        <li v-show="bIsShowLineage" class="toLineage" >血统分析</li>
      </ul>
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
  import { get, getSvg, parseAjaxResponse } from "@/utils/request";
  import { loading } from "../../utils/layer";
  // import { mapGetters } from 'vuex'
  import Cookies from 'js-cookie'

  export default {
    name: "svgLineage",
    props: {
      dataFlowType: {
        type: String,
        default: 'forward'
      },
      itemId: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        sItemId: this.itemId,
        // 右键选中的元数据结点id
        selectedId: '',
        bIsShowDetail: false,
        bIsShowLineage: false,
        selectedName: '',
        bShowDetails: false,
        aBaseTableData: [],
        aAttrTableData: [],
        oAttTemplate: {
          Table: [
            '注释', '所有者', '描述', '表空间'
          ],
          Column: [
            '注释', '类型', '长度', '精度'
          ]
        },
        // LineageName could be only :
        constLineageName: {
          forward_high: 'forward_high',
          backward_high: 'backward_high',
          forward_detail: 'forward_detail', // 影响分析
          backward_detail: 'backward_detail' // 血统分析
        }
      }
    },
    methods: {
      init() {
        // sToken 为true ，则svg是登录状态
        let sToken = Cookies.get('svgToken')
        console.log(sToken)
        if (sToken === "true") {
          let lineageName = null
          if (this.dataFlowType === 'forward') {
            lineageName = this.constLineageName.forward_detail
          } else if (this.dataFlowType === 'backward') {
            lineageName = this.constLineageName.backward_detail
          }
          this.getSvgForwardData(lineageName)
        }
      },

      // login() {
      //   post('/api/RaaS/raas/login', {
      //     user: 'ADMIN',
      //     password: 'compass2018'
      //   }).then((res) => {
      //     console.log(res)
      //     if (res.status === 200) {
      //       console.log('登录成功')
      //       let lineageName = null
      //       if (this.dataFlowType === 'forward') {
      //         lineageName = this.constLineageName.forward_detail
      //       } else if (this.dataFlowType === 'backward') {
      //         lineageName = this.constLineageName.backward_detail
      //       }
      //       this.getSvgForwardData(lineageName)
      //     }
      //   })
      // },
      getSvgForwardData(lineageName) {
        const load = loading('正在加载数据...')
        getSvg('/api/RaaS/raas/lineage/graph', {
          itemID: this.sItemId,
          lineageName: lineageName,
          format: 'svg',
          diagram: 'diagram_svc',
          depth: 0,
          limit: 0
        }).then((res) => {
          console.log(res)
          if (res.status === 200) {
            console.log('获取svg xml成功')
            let svgDataXml = res.data
            let svgContainer = document.getElementsByClassName('svgg-class')[0]
            svgContainer.innerHTML = svgDataXml
            load.close()
            // SvgItem 处理
            this.handleSvgItem()
          } else {
            load.close()
          }
        }).catch((res) => {
          console.log(new Error(res))
          load.close()
        })
      },
      // toLineage () {
      //   // this.getSvgForwardData()
      // },
      handleSvgItem() {
        let _this = this

        // 右键 box
        let contextMenu = document.getElementById("contextMenu");

        let graph = document.querySelector('g#graph0.graph');
        // console.log(graph)
        let nodes = graph.querySelectorAll(".node")
        // console.log(nodes)
        let childNodes = []
        nodes.forEach((nodesItem, nodesIndex) => {
          // console.log(nodesItem.children, 'item.childNodes')
          // console.log(Array.from(nodesItem.children), 'childNodes')
          Array.from(nodesItem.children).map((item, index) => {
            if (item.nodeName === 'polygon') { // polygon 多边形
              // console.log('polygon')
              // console.log(nodesIndex)
              childNodes.push(nodesItem)
            }
          })
        })
        // console.log(childNodes, 'childNodes')
        childNodes.forEach((cItem, cIndex) => {
          // console.log(cItem.children, 'cItem.children')
          // console.log(Array.from(cItem.children), 'Array.from(cItem.children)')
          Array.from(cItem.children).forEach((item, index) => {
            if (item.nodeName === "g") { // node节点
              // console.log(item, 'item g node 222')
              // 禁止a标签点击事件
              let cAtag = item.children[0]
              cAtag.setAttribute('href', `javascript:void(0);`)

              // 右键点击事件
              item.oncontextmenu = function (e) {
                e.preventDefault(); // 阻止右击时系统默认的弹出框
                console.log(e, '右键点击事件')
                console.log(e.target)
                // 获取a标签上的id ，即item id
                let aEle = e.target.parentElement
                let idStrOfAtag = aEle.getAttribute('xlink:href')
                let titleStrOfAtag = aEle.getAttribute('xlink:title')
                let sId = ""
                console.log(idStrOfAtag, 'idStrOfAtag')
                if (idStrOfAtag.indexOf('=') === -1) { // idStrOfAtag : #242879
                  sId = idStrOfAtag.split('#')[1]
                } else { // idStrOfAtag : /rochade/index.zul?id=251911
                  sId = idStrOfAtag.split('=')[1]
                }
                console.log(sId, 'sId')
                // 将sId显示在页面上
                // let liSecond = contextMenu.querySelectorAll("ul li")[1]
                // // liSecond.innerText = `id信息：${sId}`
                // liSecond.innerText = `血统分析（id：${sId}）`
                // console.log(liSecond)

                // item id 血统分析
                _this.sItemId = sId
                if (_this.sItemId.length > 2 && !titleStrOfAtag.includes('System')) { // 调用 血统分析 接口
                  _this.bIsShowLineage = true
                  let toLineageEle = document.getElementsByClassName("toLineage")[0]
                  let toImpactEle = document.getElementsByClassName("toImpact")[0]
                  // let title = titleStrOfAtag.split(".")[1]
                  let title = titleStrOfAtag.slice(titleStrOfAtag.lastIndexOf('.') + 1, titleStrOfAtag.length)
                  toLineageEle.onclick = function () {
                    _this.$router.push({
                      name: 'lineageAnalysisCanvas',
                      params: {
                        id: _this.sItemId,
                        _title: title,
                        classifierId: this.classifierId,
                        bSvgLineageIsShow: true
                      }
                    })
                  }
                  toImpactEle.onclick = function () {
                    _this.$router.push({
                      name: 'impactAnalysisCanvas',
                      params: {
                        id: _this.sItemId,
                        _title: title,
                        classifierId: this.classifierId,
                        bSvgLineageIsShow: true
                      }
                    })
                  }
                } else {
                  _this.bIsShowLineage = false
                }
                // 右键box 不显示
                if (_this.sItemId.length < 2 || titleStrOfAtag.includes('System')) {
                  contextMenu.style.display = "none"
                } else {
                  // 右键box 显示
                  contextMenu.style.display = "block"
                }
                // 右键box 显示，和坐标位置
                contextMenu.style.left = (e.layerX) + 'px'
                contextMenu.style.top = (e.layerY) + 'px'
              }
              let getFillColor = ""
              let setFillColor = "red"
              // 鼠标移入
              item.onmouseover = function (e) {
                // console.log(e.target)
                if (e.target.nodeName === 'text') {
                  // first polygon
                  let firstPolygon = e.target.parentElement.children[0]
                  console.log('鼠标移入 text')
                  if (firstPolygon.getAttribute('fill') !== 'none' && firstPolygon.getAttribute('fill') !== setFillColor) {
                    getFillColor = firstPolygon.getAttribute('fill') !== null ? firstPolygon.getAttribute('fill') : ""
                  }
                  console.log(getFillColor, 'getFillColor')
                  // 填充颜色改变
                  if (getFillColor !== "" && getFillColor !== '') {
                    // console.log(firstPolygon, '填充颜色改变')
                    firstPolygon.setAttribute('fill', setFillColor)
                  }
                } else if (e.target.nodeName === 'polygon' && e.target.getAttribute("stroke") === 'none') {
                  console.log('鼠标移入 polygon')
                  if (e.target.getAttribute('fill') !== 'none' && e.target.getAttribute('fill') !== setFillColor) {
                    getFillColor = e.target.getAttribute('fill') !== null ? e.target.getAttribute('fill') : ""
                  }
                  console.log(getFillColor, 'getFillColor')
                  console.log(getFillColor === "")
                  // 填充颜色改变
                  if (getFillColor !== "" && getFillColor !== '') {
                    // console.log(e.target, '填充颜色改变')
                    e.target.setAttribute('fill', setFillColor)
                  }
                }
              }
              // 鼠标移出
              item.onmouseleave = function (e) {
                console.log(e.target)
                let polygonEles = e.target.children[0].children
                // console.log(polygonEles, 'polygonEles')
                Array.from(polygonEles).forEach((item, index) => {
                  if (item.nodeName === "polygon" && item.getAttribute("stroke") === 'none') {
                    console.log('鼠标移出 polygon')
                    console.log(getFillColor, 'getFillColor')
                    console.log(getFillColor === "")
                    if (getFillColor !== "" && getFillColor !== '') {
                      item.setAttribute('fill', getFillColor)
                    }
                  }
                })
              }
            }
          })
        })

        /* 点击body上其他点，右键box不显示*/
        document.body.addEventListener('click', () => {
          contextMenu.style.display = "none"
        })
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
                let classifierId = md.classifierId
                let attTemplates = this.oAttTemplate[classifierId]
                let attributes = {}
                md.attributes.filter((item) => attTemplates.includes(item.name)).forEach((item) => {
                  let name = item.name
                  attributes[name] = item
                })
                this.aAttrTableData.length = 0
                if (attTemplates) {
                  attTemplates.forEach((item) => {
                    this.aAttrTableData.push({
                      key: item,
                      value: attributes[item].value
                    })
                  })
                }
              })
            })
          })
        })
      }
    },
    created() {
      if (this.itemId.length < 10 && this.itemId.length > 3) {
        this.init()
      }
    }
  }
</script>

<style lang="scss" scoped>
  /*右键菜单样式*/
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
    display: none;
  }

  #contextMenu ul {
    list-style: none;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
  }

  #contextMenu ul li:hover {
    background: #f3f3f3;
  }

  #contextMenu ul li {
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
</style>