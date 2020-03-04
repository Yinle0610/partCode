<template>
  <div class="meta-query">
    <div class="content-box">
      <div class="left-box">
        <el-card shadow="hover">
          <div class="title">视图范围</div>
          <div class="view-box">
            <el-checkbox-group v-model="checkList"
                               @change="changeData">
              <div class="check-box"
                   v-for="item in aViews">
                <el-checkbox :label="item.viewId">{{item.viewName}}</el-checkbox>
                <span class="icon icon-view"></span>
              </div>
            </el-checkbox-group>
          </div>
        </el-card>
      </div>
      <div class="right-box">
        <el-card shadow="hover">
          <div class="filter-box">
            <el-select v-model="selectVal"
                       placeholder="请选择"
                       @change="changeData"
                       style="width: 100px;">
              <el-option v-for="item in options"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
            <el-input placeholder="请输入内容"
                      prefix-icon="el-icon-search"
                      style="width: 300px;margin-left: 10px;"
                      v-model="keyword"
                      @keyup.enter.native="changeData"
            >
            </el-input>
          </div>
          <div class="md-content">
            <data-list :oList="oList"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       @go-detail="goDetail"></data-list>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { get } from '@/utils/request'
import DataList from '@/components/Metadata/DataList'

export default {
  name: 'metaQuery',
  components: { DataList },
  data () {
    return {
      // 列表数据
      oList: {
        bLoading: false,
        aList: [],
        iCurrentPage: 1,
        iCurrentSize: 10,
        iTotal: 0
      },
      // 选中的视图id
      checkList: [],
      // 下拉框数据
      options: [{ name: '全部', id: '000' }],
      // 当前选中的下拉框id
      selectVal: '000',
      // 搜索框数据
      keyword: this.$route.query.keyword || '',
      // 视图数据
      aViews: []
    }
  },
  methods: {
    // 获取视图
    getView () {
      get('/md/listAllSysView').then(res => {
        if (res.code === 10000 && res.success === true) {
          this.aViews = res.data
          res.data.forEach(i => {
            this.checkList.push(i.viewId)
          });
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取列表
    getList () {
      this.oList.bLoading = true
      get('/md/search', {
        classifierId: this.selectVal === '000' ? '' : this.selectVal,
        viewIds: this.checkList.join(','),
        keyword: this.keyword,
        current: this.oList.iCurrentPage,
        size: this.oList.iCurrentSize
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          const data = res.data
          this.oList.aList = data.records
          this.oList.iTotal = data.total
          this.oList.bLoading = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleSizeChange (value) {
      this.oList.iCurrentSize = value
      this.getList()
    },
    handleCurrentChange (value) {
      this.oList.iCurrentPage = value
      this.getList()
    },
    // 获取下拉框数据
    getClassify () {
      get('/mm/listMetaModelExistMetadataForSelect').then(res => {
        if (res.code === 10000 && res.success === true) {
          this.options = this.options.concat(res.data)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    changeData () {
      this.oList.iCurrentPage = 1
      this.getList()
    },
    // 点击跳转详情页
    goDetail (item) {
      this.$router.push({
        name: 'impactAndLineageDetail', // '元数据'详情页
        params: {
          _title: item.name,
          id: item.id,
          classifierId: item.classifierId
        }
      })
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  mounted () {
  },
  created () {
    this.getView()
    this.getClassify()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "../../styles/treeIcon";
@import "../../styles/variables";

.meta-query {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  top: 0;
  left: 0;
  bottom: 0;
  background-color: $page-bg;
  .content-box {
    position: absolute;
    width: 100%;
    height: calc(100vh - 84px);
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    .left-box {
      width: 360px;
      height: 100%;
      padding: 10px;
      .el-card {
        width: 340px;
        height: 100%;
        .el-card__body {
          padding: 16px;
          position: relative;
          .title {
            font-size: 16px;
            border-bottom: 1px solid $border;
            padding: 0 10px 10px 10px;
            font-weight: bold;
            line-height: 26px;
          }
          .view-box {
            width: 100%;
            height: calc(100vh - 190px);
            margin-top: 15px;
            overflow-y: auto;
            .el-checkbox__input.is-checked + .el-checkbox__label {
              color: #606266;
            }
            .el-checkbox-group {
              .check-box {
                position: relative;
                margin-top: 15px;
                .el-checkbox {
                  .el-checkbox__label {
                    padding-left: 45px;
                  }
                }
                .icon-view {
                  position: absolute;
                  display: inline-block;
                  width: 25px;
                  height: 25px;
                  background-size: 25px 25px;
                  left: 24px;
                  top: -3px;
                }
              }
            }
          }
        }
      }
    }
  }
  .right-box {
    flex: 1;
    position: relative;
    width: calc(100% - 360px);
    padding: 10px 10px 10px 0;
    height: 100%;
    .el-card {
      width: 100%;
      height: 100%;
      .el-card__body {
        padding: 0 16px 16px 16px;
        .filter-box {
          border-bottom: 1px solid $border;
          padding: 10px 0;
        }
        .md-content {
          width: 100%;
          height: calc(100vh - 180px);
          overflow-y: auto;
        }
      }
    }
  }
}
</style>
