<template>
    <div class="editor-container" ref="editorContainer">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <el-button class='edit-back' size="small" style="float: left;" @click="$emit('colse')">返回</el-button>
            </div>
            <div class="rule-title clearfix">
              <span class="rule-title_content">
                <img style="width: 21px;height: 21px;" src alt />
                <i @click="handleCollect" :style="{color:collect?'rgb(247, 186, 42)':'', cursor: 'pointer',marginRight:'5px'}" :class="[collect? 'el-icon-star-on' : 'el-icon-star-off']"></i>
                {{EName?dimensionName+' ['+EName+']':dimensionName}}
              </span>
              <el-tag size="small" type="success" v-if="state">{{state}}</el-tag>
              <div style="float:right">
                <el-button
                @click="handleDelete"
                class="basic-button fr"
                style="margin-left:10px;"
                type="danger"
              >
                <i class="dataTable-icon del"></i>删除
              </el-button>
              <el-button @click="handleEdit" class="basic-button fr" style type="warning">
                <i class="dataTable-icon edit"></i>编辑
              </el-button>
              <el-dropdown class="fr" @command="handleBlood">
                <el-button
                  class="basic-button fr"
                  style="width: 85px;padding: 0px 10px 0 20px;"
                  type="primary"
                >
                  <i class="dataTable-icon blood"></i>关系
                </el-button>
                <el-dropdown-menu slot="dropdown" trigger="click">
                  <el-dropdown-item :command="'backward'">参 考</el-dropdown-item>
                  <el-dropdown-item :command="'forward'">应 用</el-dropdown-item>
                  <el-dropdown-item :command="'full'">全 链</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              </div>  
            </div>
            <div class="card-body">
                <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
                    <el-tab-pane label="基本信息" name="first" >
                        <div class="base-msg">
                          <p v-for="val in basicData" :key="val.attrName" v-show="val.hidden!==true">
                            <span>{{val.attrName+'：'}}</span>
                            <span>{{val.attrValue}}</span>
                          </p>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="关系信息" name="second">
                      <div style="padding:0 30px;" class="relationship">
                        <div class="title">参考(Reference)</div>
                        <div class="button">
                           <el-tooltip class="item" effect="dark" content="新增" placement="top" v-permission="'DIM_EDIT'">
                              <el-button type="text" @click="addNewReference">
                                <svg-icon icon-class="addindetail" class="addindetail" style="width:22px;height:22px;"></svg-icon>
                              </el-button>
                            </el-tooltip>
                           <el-tooltip class="item" effect="dark" content="删除" placement="top" v-permission="'DIM_EDIT'">
                              <el-button type="text" @click="delReference">
                                <svg-icon icon-class="deleteRed" class="deleteRed" style="width:23px;height:23px;"></svg-icon>
                              </el-button>
                            </el-tooltip>
                          <!-- <el-button type="primary" size="mini" class="zengjia" @click="addNewReference"><svg-icon icon-class="zengjia"></svg-icon>  新增</el-button> -->
                          <!-- <el-button type="danger" size="mini" class="shanchu" @click="delReference"><svg-icon icon-class="shanchu"></svg-icon> 删除</el-button> -->
                        </div>
                        <div class="table">
                          <el-table :data="ReferenceTable.data" border style="width: 100%" size="mini" :header-cell-style="{background:'#f8f8f9',textAlign:'center',color:'#666'}" :cell-style="isClass" :header-cell-class-name="isClass2"
                              @selection-change="referenceSelectionChange">
                              <el-table-column type="selection" width="50">
                              </el-table-column>
                              <el-table-column align="center" prop="name" label="标准名称"></el-table-column>
                              <el-table-column align="center" prop="classifierName" label="标准类型"></el-table-column>
                              <el-table-column align="center" label=" 标准代码">
                                <template slot-scope="scope">
                                  <el-button type="text" @click.native="goToSeeDetail(scope.row.id,scope.row.name)">{{ scope.row.code}}</el-button>
                                </template>
                              </el-table-column>
                              <el-table-column align="center" prop="context" label="上下文路径"></el-table-column>
                              <el-table-column align="center" prop="relationshipName" label=" 关系类型"></el-table-column>
                          </el-table>
                        </div>
                        <div style="text-align:center;margin-top:30px;">
                            <el-pagination
                            background
                            :page-size="ReferenceTable.page.size"
                            layout="prev, pager, next"
                            :total="ReferenceTable.page.total"
                            @current-change="handleCurrentChange3">
                            </el-pagination>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="认责信息" name="third">
                      <div class="confess-account">
                        <div class="found">
                          <div class="title">创建人</div>
                          <div class="button">
                            <el-tooltip class="item" effect="dark" placement="right" v-for="val in accusationData.creatorList" :key="val.username">
                              <div slot="content">
                                <p>部门：{{val.groupname}}</p>
                                <p>工作电话：{{val.workphone}}</p>
                                <p>邮箱:{{val.mail}}</p>
                                <p>手机号:{{val.mobilephone}}</p>
                              </div>
                              <el-button>
                                <svg-icon icon-class="see-user" class="see-user"></svg-icon>
                                <span>{{val.username}}</span>
                                <!-- <svg-icon icon-class="no" class="close" @click.native="handleClose2(val)"></svg-icon> -->
                              </el-button>
                            </el-tooltip>
                            <div v-if="accusationData.creatorList.length===0" style="font-size:13px;padding-left:5px;color:#999;">暂无创建人</div>
                          </div>
                        </div>
                        <div class="found">
                          <div class="title">发布人</div>
                          <div class="button">
                            <el-tooltip class="item" effect="dark" placement="right" v-for="val in accusationData.issuerList" :key="val.username">
                              <div slot="content">
                                <p>部门：{{val.groupname}}</p>
                                <p>工作电话：{{val.workphone}}</p>
                                <p>邮箱:{{val.mail}}</p>
                                <p>手机号:{{val.mobilephone}}</p>
                              </div>
                              <el-button>
                                <svg-icon icon-class="see-user" class="see-user"></svg-icon>
                                <span>{{val.username}}</span>
                                <!-- <svg-icon icon-class="no" class="close" @click.native="handleClose2(val)"></svg-icon> -->
                              </el-button>
                            </el-tooltip>
                            <div v-if="accusationData.issuerList.length===0" style="font-size:13px;padding-left:5px;color:#999;">暂无发布人</div>
                          </div>
                        </div>
                        <div class="found">
                          <div class="title">使用人</div>
                          <div class="button">
                            <el-tooltip class="item" effect="dark" placement="right" v-for="val in accusationData.userList" :key="val.username">
                              <div slot="content">
                                <p>部门：{{val.groupname}}</p>
                                <p>工作电话：{{val.workphone}}</p>
                                <p>邮箱:{{val.mail}}</p>
                                <p>手机号:{{val.mobilephone}}</p>
                              </div>
                              <el-button>
                                <svg-icon icon-class="see-user" class="see-user"></svg-icon>
                                <span>{{val.username}}</span>
                                <svg-icon icon-class="no" class="close" @click.native="handleClose2(val,'使用人')" v-permission="'DIM_EDIT'"></svg-icon>
                              </el-button>
                            </el-tooltip>
                            <el-button style="padding: 8px 22px 8px 20px;" @click="addNewAccount('使用人')" v-permission="'DIM_EDIT'">
                              <svg-icon icon-class="add2" class="add"></svg-icon>
                               <span style="color:#333;bottom:4px;">增加</span>
                            </el-button>
                          </div>
                        </div>
                        <div class="found">
                          <div class="title">归口责任人</div>
                          <div class="button">
                            <el-tooltip class="item" effect="dark" placement="right" v-for="val in accusationData.dutyList" :key="val.username">
                              <div slot="content">
                                <p>部门：{{val.groupname}}</p>
                                <p>工作电话：{{val.workphone}}</p>
                                <p>邮箱:{{val.mail}}</p>
                                <p>手机号:{{val.mobilephone}}</p>
                              </div>
                              <el-button>
                                <svg-icon icon-class="see-user" class="see-user"></svg-icon>
                                <span>{{val.username}}</span>
                                <svg-icon icon-class="no" class="close" @click.native="handleClose2(val,'归口责任人')" v-permission="'DIM_EDIT'" v-if="accusationData.dutyList.length!==0&&isParentNode"></svg-icon>
                              </el-button>
                             </el-tooltip>
                            <el-button style="padding: 8px 22px 8px 20px;" @click="addNewAccount('归口责任人')" v-permission="'DIM_EDIT'" v-if="accusationData.dutyList.length===0&&isParentNode">
                              <svg-icon icon-class="add2" class="add"></svg-icon>
                               <span style="color:#333;bottom:4px;">增加</span>
                            </el-button>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="维度值信息" name="fourth">
                      <div style="padding:0 35px;margin-top:35px;" class="relationship">
                        <div class="title2">维度值列表</div>
                        <div class="button">
                          <el-tooltip class="item" effect="dark" content="新增" placement="top" v-permission="'DIM_EDIT'">
                              <el-button type="text" @click="dialogTableVisible3=true">
                                <svg-icon icon-class="addindetail" class="addindetail" style="width:22px;height:22px;"></svg-icon>
                              </el-button>
                            </el-tooltip>
                           <el-tooltip class="item" effect="dark" content="删除" placement="top" v-permission="'DIM_EDIT'">
                              <el-button type="text" @click="delDimensionList('wMess')">
                                <svg-icon icon-class="deleteRed" class="deleteRed" style="width:22px;height:22px;"></svg-icon>
                              </el-button>
                            </el-tooltip>
                          <!-- <el-button type="primary" size="mini" class="zengjia" @click="dialogTableVisible3=true"><svg-icon icon-class="zengjia"></svg-icon>  新增</el-button> -->
                          <!-- <el-button type="danger" size="mini" class="shanchu" @click="delDimensionList('wMess')"><svg-icon icon-class="shanchu"></svg-icon> 删除</el-button> -->
                        </div>
                        <div class="table">
                          <el-table :data="wMess.data" border style="width: 100%" size="mini" :header-cell-style="{background:'#f8f8f9',textAlign:'center',color:'#666'}" :cell-style="isClass" :header-cell-class-name="isClass2"
                              @selection-change="wHandleSelectionChange">
                              <el-table-column type="selection" width="50">
                              </el-table-column>
                              <el-table-column align="center" label="维度值代码" prop="valueCode"></el-table-column>
                              <el-table-column align="center" prop="valueDesc" label="维度值描述"></el-table-column>
                              <!-- <el-table-column align="center" prop="effectDate" label=" 生效日期"></el-table-column> -->
                              <!-- <el-table-column align="center" prop="invalidDate" label=" 失效日期"></el-table-column> -->
                          </el-table>
                        </div>
                        <div style="text-align:center;margin-top:30px;">
                            <el-pagination
                            background
                            :page-size="wMess.page.size"
                            layout="prev, pager, next"
                            :total="wMess.page.total"
                            @current-change="handleCurrentChange4">
                            </el-pagination>
                        </div>
                      </div>

                      <div style="padding:0 35px;margin-top:50px;" class="relationship">
                        <div class="title2">维度值映射列表</div>
                        <div class="button">
                          <el-tooltip class="item" effect="dark" content="新增" placement="top" v-permission="'DIM_EDIT'">
                            <el-button type="text" @click="dialogTableVisible4=true">
                              <svg-icon icon-class="addindetail" class="addindetail" style="width:22px;height:22px;"></svg-icon>
                            </el-button>
                          </el-tooltip>
                           <el-tooltip class="item" effect="dark" content="删除" placement="top" v-permission="'DIM_EDIT'">
                              <el-button type="text" @click="delDimensionList('wMMess')">
                                <svg-icon icon-class="deleteRed" class="deleteRed" style="width:23px;height:23px;"></svg-icon>
                              </el-button>
                            </el-tooltip>
                          <!-- <el-button type="primary" size="mini" class="zengjia" @click="dialogTableVisible4=true"><svg-icon icon-class="zengjia"></svg-icon>  新增</el-button> -->
                          <!-- <el-button type="danger" size="mini" class="shanchu" @click="delDimensionList('wMMess')"><svg-icon icon-class="shanchu"></svg-icon> 删除</el-button> -->
                        </div>
                        <div class="table">
                          <el-table :data="wMMess.data" border style="width: 100%" size="mini" :header-cell-style="{background:'#f8f8f9',textAlign:'center',color:'#666'}" :cell-style="isClass" :header-cell-class-name="isClass2"
                              @selection-change="wHandleSelectionChange2">
                          <el-table-column type="selection" width="50">
                          </el-table-column>
                          <el-table-column align="center" prop="dimensionValueCode" label="维度值代码" show-overflow-tooltip ></el-table-column>
                          <el-table-column align="center" prop="dimensionValueDesc" label="维度值描述"></el-table-column>
                          <el-table-column align="center" label="公共代码编号">
                            <template slot-scope="scope">
                              <el-button type="text">{{ scope.row.commonCodeCode }}</el-button>
                            </template>
                          </el-table-column>
                          <el-table-column align="center" prop="commonCodeName" label="公共代码名称"></el-table-column>
                          <el-table-column align="center" prop="commonCodeValue" label="公共代码取值"></el-table-column>
                          <el-table-column align="center" prop="commonCodeDesc" label="公共代码取值描述"></el-table-column>
                      </el-table>
                        </div>
                        <div style="text-align:center;margin-top:30px;">
                            <el-pagination
                            background
                            :page-size="wMMess.page.size"
                            layout="prev, pager, next"
                            :total="wMMess.page.total"
                            @current-change="handleCurrentChange5">
                            </el-pagination>
                        </div>
                      </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
        <!-- 关系信息弹窗 -->
        <el-dialog :visible.sync="dialogTableVisible" class="relationTip">
          <div slot="title">
            请选择参考来源
          </div>
          <div>
            <el-form :inline="true" >
              <el-col :span="11">
                <el-form-item label="关系类型：" label-width="60px">
                  <el-select v-model="referenceSource.relationshipId" placeholder="请选择" size="mini">
                  <el-option :label="val.relationshipName" :value="val.relationshipId" v-for="val in ReferenceTable.listMess" :key="val.relationshipId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="margin-left:15px;">
                <el-form-item label="关键字：" label-width="50px" class="input">
                  <el-input v-model="referenceSource.keyword" placeholder="请输入内容" size="mini" clearable @input="goToSearch()"><i slot="suffix" class="el-icon-search" ></i></el-input>
                </el-form-item>
              </el-col> 
            </el-form>
          </div>
          
          <el-table :data="referenceSource.data" border size="mini" 
                    :header-cell-style="{background:'#f8f8f9',textAlign:'center',color:'#666'}" 
                    :cell-style="{textAlign:'center'}" 
                    ref="referenceTable"
                    v-if="referenceSource.fromClassifierId" 
                    :show-overflow-tooltip="true"
                    @select="sourceHandleSelection">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column property="code" label="标准代码" width="150"></el-table-column>
            <el-table-column property="name" label="标准名称" width="180"></el-table-column>
            <el-table-column property="classifierName" label="标准类型"></el-table-column>
          </el-table>
          <div v-else style="text-align:center;padding-top:60px;">
            <p>暂无数据</p>
          </div>
          <div style="text-align:center;margin-top:30px;" v-if="referenceSource.relationshipId">
              <el-pagination
              background
              layout="prev, pager, next"
              :page-size="referenceSource.pageSize"
              :total="referenceSource.total"
              @current-change="referenceHandleCurrentChange">
              </el-pagination>
          </div>
          <div style="margin-top:50px;" v-if="referenceSource.selectArr.length>0">
            <span style="font-size:13px;">已选择：</span>
            <el-tag closable effect="plain" size="mini" v-for='val in referenceSource.selectArr' :key="val.id" style="margin-right:5px;" @close="delSelect('referenceSource.selectArr',val)">{{val.name}}</el-tag>
          </div>
          <div slot="footer" style="text-align:center;">
            <el-button type="primary" size="mini" @click="saveNewReference">确定</el-button>
          </div>
        </el-dialog>
        <!-- 维度值信息弹窗 -->
        <el-dialog :visible.sync="dialogTableVisible3" class="relationTip">
          <div slot="title">
            请选择引用对象
          </div>
          <div>
            <!-- <el-tooltip class="item" effect="dark" content="新增" placement="top" v-permission="'DIM_EDIT'">
              <el-button type="text" @click="getNewDimensionInput">
                <svg-icon icon-class="addindetail" class="addindetail" style="width:22px;height:22px;"></svg-icon>
              </el-button>
            </el-tooltip> -->
            <el-button type="primary" size="mini" class="zengjia"  @click.native="getNewDimensionInput"><svg-icon icon-class="zengjia"></svg-icon>  新增</el-button>
          </div>
           <el-form class="bt-form">
              <el-table :data="wMess.addData"  size="mini" :header-cell-style="{background:'#f8f8f9',color:'#666'}">
                <el-table-column  label="序号" type="index" width="50" align="center"></el-table-column>
                <el-table-column  label="维度值代码" width="150" align="center">
                  <template slot-scope="scope">
                    <el-form-item class="bt-input">
                      <el-input  v-model="scope.row.valueCode" size="mini" style="width: 100%;"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column property="name" label="维度值描述" width="200" align="center">
                  <template slot-scope="scope">
                    <el-form-item class="bt-input">
                      <el-input  v-model="scope.row.valueDesc" size="mini" :maxlength="30"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column property="address" label="操作" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-delete tabla-i" @click="delDimensionValues(scope.row)"></i>
                  </template>
                  
                </el-table-column>
              </el-table>
            </el-form>
          <div slot="footer" style="text-align:center;">
            <el-button type="primary" size="mini" @click.native="getNewDimensionValues">确定</el-button>
          </div>
        </el-dialog>
        <!-- 维度值映射信息弹窗 -->
        <el-dialog :visible.sync="dialogTableVisible4" class="relationTip" width="600px">
          <div slot="title">
            新增维度值映射
          </div>
         <div>
           <!-- <el-tooltip class="item" effect="dark" content="新增" placement="top" v-permission="'DIM_EDIT'">
              <el-button type="text" @click="getNewDimensionInput2">
                <svg-icon icon-class="addindetail" class="addindetail" style="width:22px;height:22px;"></svg-icon>
              </el-button>
            </el-tooltip> -->
            <el-button type="primary" size="mini" class="zengjia" @click.native="getNewDimensionInput2"><svg-icon icon-class="zengjia"></svg-icon>  新增</el-button>
          </div>          
          <el-form class="bt-form">
              <el-table :data="wMMess.addData"  size="mini" :header-cell-style="{background:'#f8f8f9',color:'#666'}">
                <el-table-column  label="序号" type="index" width="50" align="center"></el-table-column>
                <el-table-column  label="维度值取值" width="120" align="center">
                  <template slot-scope="scope">
                    <el-tag type="info" effect="plain" size="small" v-if="scope.row.valueDesc===''||scope.row.valueDesc===undefined" @click.native="dimensionList(scope.row,scope.$index,'desc' )" style="cursor: pointer">+  增加</el-tag>
                    <el-tag type="info" effect="plain" size="small" v-else-if="scope.row.valueDesc" closable @close="delSelect('wMMess.addData.desc',scope.$index)">
                      {{scope.row.valueDesc.valueDesc}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column property="name" label="代码值取值" width="160" align="center">
                  <template slot-scope="scope">
                    <el-tag type="info" effect="plain" size="small" v-if="scope.row.valueCode===''||scope.row.valueCode===undefined" @click.native="dimensionList(scope.row,scope.$index,'code' )" style="cursor: pointer">+  增加</el-tag>
                    <el-tag type="info" effect="plain" size="small" v-else-if="scope.row.valueCode" closable @close="delSelect('wMMess.addData.code',scope.$index)">{{scope.row.valueCode.desc}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column property="name" label="代码值取值描述"  align="center" width="110">
                  <template >
                    <i >无</i>
                  </template>
                </el-table-column>
                <el-table-column property="address" label="操作" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-delete tabla-i" @click="delDimensionValues2(scope.row)"></i>
                  </template>
                  
                </el-table-column>
              </el-table>
            </el-form>
          <div slot="footer" style="text-align:center;">
            <el-button type="primary" size="mini" @click="getNewDimensionMap">确定</el-button>
          </div>
        </el-dialog>
        <!-- 维度映射弹出框2  -->
        <el-dialog :title="wList.whichType==='desc'?'请选择维度值':'请选择代码值'" :visible.sync="dialogTableVisible5" width="600px" class="people-dialog"> 
          <el-input placeholder="请输入内容" v-model="wList.keyword" @input="searchW('desc')" clearable v-if="wList.whichType==='desc'">
            <i slot="suffix" class="el-input__icon el-icon-search" ></i>
          </el-input>
          <el-input placeholder="请输入内容" v-model="cList.keyword" @input="searchW('code')" clearable v-else>
            <i slot="suffix" class="el-input__icon el-icon-search" ></i>
          </el-input>
          <div class="table">
            <el-table :data="wList.data" border style="width: 100%;margin-top:15px;" size="mini" 
            :header-cell-style="{background:'#f8f8f9',textAlign:'center',color:'#666'}" 
            :cell-style="isClass" 
            :header-cell-class-name="isClass2"
            highlight-current-row
            @current-change="handleChange"
            v-if="wList.whichType==='desc'">
                <el-table-column align="center" label="维度值代码" prop="valueCode"></el-table-column>
                <el-table-column align="center" prop="valueDesc" label="维度值描述"></el-table-column>
                <!-- <el-table-column align="center" prop="effectDate" label=" 生效日期"></el-table-column>
                <el-table-column align="center" prop="invalidDate" label=" 失效日期"></el-table-column> -->
            </el-table>
            <el-table :data="cList.data" border style="width: 100%;margin-top:15px;" size="mini" 
            :header-cell-style="{background:'#f8f8f9',textAlign:'center',color:'#666'}" 
            :cell-style="isClass" 
            :header-cell-class-name="isClass2"
            highlight-current-row
            @current-change="handleChange2"
            v-else>
                <el-table-column align="center" label="公共代码项取值" prop="code"></el-table-column>
                <el-table-column align="center" prop="desc" label="公共代码项名称"></el-table-column>
                <el-table-column align="center" prop="path" label="上下文路径" show-overflow-tooltip=""></el-table-column>
            </el-table>
          </div>
          <div style="text-align:center;margin-top:30px;">
              <el-pagination
              background
              layout="prev, pager, next"
              :page-size="wList.page.size"
              :total="wList.page.total"
              v-if="wList.whichType==='desc'"
              @current-change="handleCurrentChange1">
              </el-pagination>
              <el-pagination
              background
              layout="prev, pager, next"
              :page-size="cList.page.size"
              :total="cList.page.total"
              v-else
              @current-change="handleCurrentChange2">
              </el-pagination>
          </div>
          <div style="margin-top:50px;" v-if="wList.val!==null&&wList.whichType==='desc'">
            <span style="font-size:13px;">已选择：</span><el-tag closable effect="plain" size="mini" @close="delSelect('wList.val')">{{wList.val.valueCode+' ('+wList.val.valueDesc+')'}}</el-tag>
          </div>
          <div style="margin-top:50px;" v-if="wList.desc!==null&&wList.whichType==='code'">
            <span style="font-size:13px;">已选择：</span><el-tag closable effect="plain" size="mini" @close="delSelect('wList.desc')">{{wList.desc.code+' ('+wList.desc.desc+')'}}</el-tag>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible5 = false">取 消</el-button>
            <el-button type="primary" @click="sureWList(wList.whichType)">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="请选择用户" :visible.sync="dialogTableVisible2" width="520px" class="people-dialog"> 
          <div slot="" v-if="wData.filterSponsorArr.length>0&&!whichAccount" class="tree-slot">
              已选择： <el-tag v-for="tag in wData.filterSponsorArr" :key="tag.userId" type="info" closable @close="handleClose(tag)" size="small" style="margin-right:5px;">
                      {{tag.title}}
                      </el-tag>
          </div>
          <div slot="" v-if="wData.filterSponsorData&&whichAccount" class="tree-slot">
              已选择： <el-tag  type="info" closable @close="handleClose3()" size="small" style="margin-right:5px;">
                      {{wData.filterSponsorData.title}}
                      </el-tag>
          </div>
          <el-input placeholder="请输入内容" v-model="wData.wKeyword" @input="toSearch" clearable>
            <i slot="suffix" class="el-input__icon el-icon-search" ></i>
          </el-input>
          <el-tree
            class="filter-tree"
            :data="wData.problemTakerData"
            :props="wData.defaultProps"
            ref="tree" 
            v-if="wData.treeSelect.length==0"
            node-key="userId"
            @node-click="selectTreeValue"
            style="height: 200px;overflow:auto;">
          </el-tree>
          <div class="tree-select-div people" v-if="wData.treeSelect.length>0">
              <div v-for="select in wData.treeSelect" :key="select.userId" class="item">
                  <p   @click="selectTreeValue(select)">
                      {{select.title}}  （ {{ select.parent }} )
                  </p>
                  <!-- <Icon type="ios-checkmark" color="#1890ff"></Icon> -->
              </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="saveAccusationData">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 删除提示 -->
        <el-dialog :visible.sync="deleteDialog" class="delete-dialog" title="删除提示" width="50%">
          <delete-dialog ref="deleteMenuDialog"></delete-dialog>
          <div class="dialog-btn">
            <el-button type="primary" @click="isDeleteMenu?toDelCatalog():handDel()">确定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import { get, postByJson, post } from '@/utils/request'
import { generateLineageTitle } from "@/utils"
import pinyin from 'pinyin'
import bus from '@/utils/bus'
import { loading } from "@/utils/layer";
export default {
  name: "editorData",
  components: { },
  data() {
    return {
      isParentNode: false, // 判断是不是父节点信息项
      collect: false, // 信息项是否被收藏
      EName: null, // 标题英文名
      state: null, // 发布状态
      selectId: '',
      classifierId: '',
      dimensionName: null,
      dimensionId: null,
      activeName: 'first',
      routeData: null,
      dialogTableVisible: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      dialogTableVisible4: false,
      dialogTableVisible5: false,
      deleteDialog: false,
      ifShow: {
        classify: false
      },
      basicData: [], // 基本信息data
      // 关系信息-参考列表
      ReferenceTable: {
        page: {
          current: 1,
          size: null,
          total: 0
        },
        data: [],
        listMess: [],
        delArr: []
      },
      referenceSource: {
        keyword: null,
        pageCurrent: 1,
        pageSize: 5,
        total: null,
        fromClassifierId: null,
        relationshipId: null,
        data: [],
        selectArr: []
      },
      // 认责信息
      accusationData: {
        // 创建人列表
        creatorList: [],
        // 发布人列表
        issuerList: [],
        // 使用人列表
        userList: [],
        // 责任人列表
        dutyList: []
      },
      whichAccount: false,
      wData: {
        wKeyword: '',
        problemTakerData: [],
        treeSelect: [],
        defaultProps: {
          children: 'children',
          label: 'title',
          isLeaf: 'isLeaf'
        },
        filterSponsorArr: [],
        filterSponsorData: null,
        pfilterSponsorArr: [],
        pfilterSponsorData: null,
        porSou: [],
        porLevel: [],
        closable: true
      },
      // 维度值信息-维度值列表
      wMess: {
        page: {
          current: 1,
          size: null,
          total: 0
        },
        data: [],
        addData: [],
        delArr: []
      },
      // 维度值信息选择-维度值列表
      wList: {
        page: {
          current: 1,
          size: 5,
          total: 0
        },
        data: [],
        val: null,
        desc: null,
        keyword: '',
        whichType: 'desc'
      },
      cList: {
        page: {
          current: 1,
          size: 5,
          total: 0
        },
        data: [],
        keyword: ''
      },
      // 维度值信息-维度值映射列表
      wMMess: {
        page: {
          current: 1,
          size: null,
          total: 0
        },
        data: [],
        addData: [],
        delArr: [],
        index: null
      },
      basicMsg: null,
      nodeList: null,
      addNode: false

    }
  },
  watch: {
    'referenceSource.relationshipId'(val) {
      this.referenceSource.relationshipId = val;
      this.ReferenceTable.listMess.map(res => {
        if (res.relationshipId === val) {
          this.referenceSource.fromClassifierId = res.fromClassifierId;
          return
        }
      })

      this.getReferenceSource(this.referenceSource.fromClassifierId)
    },
    'wData.wKeyword'(val) {
      if (val === '') {
        this.wData.treeSelect = []
      }
    },
    // 'inputForm.INSTANCE_NAME': {
    //   handler: function (val, oldVal) {
    //     console.log(val, this.lockObj.first)
    //     if (!this.lockObj.first) {
    //       get('/ds/bizTerm/queryHomologousEnVocabularies', { cnTerm: val }).then(res => {
    //         if (res.code === 10000) {
    //           this.$set(this.inputData[this.eIndex], 'attrValue', res.data[0])
    //           console.log(this.inputData[this.eIndex], ' index')
    //         }
    //       })
    //     } else {
    //       this.lockObj.first = false;
    //     }
    //   },
    //   deep: true
    // },
    dialogTableVisible3: {
      handler(newValue, oldValue) {
        if (!newValue) {
          this.wMess.addData = [];
        }
      },
      deep: true // 只要当obj中的值改变就会触发这个函数且,newValue,oldValue两个参数值相同;/
    }
  },
  methods: {
    // 保存
    toSave() {
      if (this.ruleForm) {
        this.getInputData();
      }
    },
    // 到详情
    goToSeeDetail(id, name) {
      this.$router.push({ name: "dimensionDetails", params: { 'id': name, '_title': name, 'detailId': id }})
      // }
    },
    handleEdit() {
      this.$parent.$parent.$parent.handleCommand(this.routeData.msg);
      console.log(this)
    },
    handleBlood(command) {
      this.$router.push({
        name: 'dsLineageAnalysisCanvas',
        params: {
          dataFlowType: command,
          id: this.dimensionId,
          _title: generateLineageTitle(command, this.dimensionName)
        }
      })
    },
    toSeeDetail(item) {
      let row = item;
      row.instanceName = item.name;
      row.instanceId = item.id;
      this.$router.push({
        name: "dimensionDetails",
        params: { id: item.id, _title: item.name, detailId: item.id, row: item }
      });
    },
    // 信息收藏接口
    handleCollect() {
      // console.log('click')
      if (this.collect) {
        get('/home/collection/cancelDsCollection', {
          instanceId: this.dimensionId
        }).then(res => {
          // console.log(res)
          if (res.code === 10000 && res.success) {
            this.$message.success('取消收藏成功')
          }
          this.getCollect()
        })
      } else {
        post('/home/collection/determineDsCollection', {
          instanceId: this.dimensionId
        }).then(res => {
          // console.log(res)
          if (res.code === 10000 && res.success) {
            this.$message.success('收藏成功')
          }
          this.getCollect()
        })
      }
    },
    // 是否被收藏
    getCollect() {
      get('/home/collection/weatherDsCollection', {
        instanceId: this.selectId
      }).then(res => {
        // console.log(res, 'collect')
        this.collect = res.data
      })
    },
    // 认责保存
    saveAccusationData() {
      console.log(this.wData.pfilterSponsorArr, this.wData.pfilterSponsorData)

      let params = {
        instanceId: this.selectId,
        users: this.wData.pfilterSponsorArr.join(','),
        prncipals: this.wData.pfilterSponsorData
      }
      post('/ds/editAccountability', params).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.dialogTableVisible2 = false;
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.accusationData.userList = [];
          this.accusationData.dutyList = [];
          this.getData();
          // let arr = JSON.parse(JSON.stringify(this.wData.filterSponsorArr));
          // arr.map((val, index) => {
          //   let data = {
          //     username: val.title,
          //     userId: val.userId
          //   }
          //   this.accusationData.userList.push(data);
          // })
          // let obj = {}
          // obj.username = this.wData.filterSponsorData.title;
          // obj.userId = this.wData.filterSponsorData.userId;
          // this.accusationData.dutyList.push(obj);
        } else {
          this.$message.error(res.message);
        }
      })
    },
    referenceHandleCurrentChange(val) {
      this.referenceSource.pageCurrent = val;
      this.getReferenceSource(this.referenceSource.fromClassifierId)
    },
    handleCurrentChange1(val) {
      this.wList.page.current = val;
      this.wGetData();
    },
    handleCurrentChange2(val) {
      this.cList.page.current = val;
      this.getCodeData();
    },
    handleCurrentChange3(val) {
      this.ReferenceTable.page.current = val;
      this.gGetData();
    },
    handleCurrentChange4(val) {
      this.wMess.page.current = val;
      this.wGetData();
    },
    handleCurrentChange5(val) {
      this.wMMess.page.current = val;
      this.wGetDataN();
    },
    // 映射单选表格事件-维度代码
    handleChange(currentRow, oldCurrentRow) {
      // console.log(currentRow,oldCurrentRow)
      this.wList.val = currentRow;
    },
    // 映射单选表格事件-公共代码
    handleChange2(currentRow, oldCurrentRow) {
      this.wList.desc = currentRow;
    },
    // tag删除事件
    delSelect(val, index) {
      if (val === 'wList.val') {
        this.wList.val = null;
      } else if (val === 'wMMess.addData.desc') {
        this.wList.val = null;
        this.wMMess.addData[index].valueDesc = '';
      } else if (val === 'wMMess.addData.code') {
        this.wList.code = null;
        this.wMMess.addData[index].valueCode = '';
      } else if (val === 'wList.desc') {
        this.wList.desc = null;
      } else if (val === 'referenceSource.selectArr') {
        this.referenceSource.data.map((val, key) => {
          if (val === index) {
            this.$refs.referenceTable.toggleRowSelection(val, false);
          }
        })
        this.referenceSource.selectArr.splice(this.referenceSource.selectArr.indexOf(index), 1);
      }
    },
    // 展示维度值映射弹出框2
    dimensionList(val, index, type) {
      this.wList.whichType = type;
      if (this.wList.whichType === 'desc') {
        this.wGetData()
      } else {
        this.getCodeData();
      }
      this.dialogTableVisible5 = true;
      this.wMMess.index = index;
    },
    // 映射弹出框2搜索
    searchW(type) {
      if (this.wList.whichType === 'desc') {
        this.wGetData()
      } else {
        this.getCodeData();
      }
    },
    // 映射添加输入框
    getNewDimensionInput2() {
      let obj = {
        valueCode: '',
        valueDesc: ''
      }
      this.wMMess.addData.push(obj)
    },
    // 获取公共代码项
    getCodeData() {
      this.cList.data = [];
      let params = {
        pageCurrent: this.cList.page.current,
        pageSize: this.cList.page.size,
        keyword: this.cList.keyword
      }
      get('/ds/public/queryAllPublicCodeItems', params).then(res => {
        res.data.records.map(val => {
          let a = {
            code: val.attributes[0].value,
            desc: val.name,
            id: val.id,
            path: val.path
          }
          this.cList.data.push(a);
        })
        this.cList.page.total = res.data.total;
        this.cList.page.size = res.data.size;
      })
    },
    // 确认选择
    sureWList(type) {
      if (type === 'desc') {
        this.wMMess.addData[this.wMMess.index].valueDesc = this.wList.val;
      } else if (type === 'code') {
        this.wMMess.addData[this.wMMess.index].valueCode = this.wList.desc;
      }
      this.dialogTableVisible5 = false;
      // console.log(this.wMMess)
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          let latestView = null
          views.map(val => {
            if (val.name === 'dimensionality') {
              latestView = val
            }
          })
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/ds/applicationStandard/dimensionality/dimensionality')
          }
        }
      })
    },
    getInputData() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.addItem = true;
          if (this.sameList.length > 0) {
            this.showSames = true;
          } else {
            this.showSames = false
            this.sureAdd()
          }
        } else {
          return false;
        }
      });
    },
    sureAdd() {
      if (this.addItem) {
        this.sendSaveMsg();
      }
      this.showSames = false;
      this.addItem = false;
    },
    sendSaveMsg() {
      this.ruleForm = []
      console.log(this.inputData, this.inputForm, 'this.inputData')
      this.inputData.map(val => {
        let a
        if (val.attrName === '维度分类') {
          console.log(this.$refs['input_' + val.columnName][0].inputData)
          if (this.$refs['input_' + val.columnName][0].inputData) {
            a = {
              key: this.fullPath.name,
              value: this.$refs['input_' + val.columnName][0].inputData
            }
          } else {
            a = {
              key: this.fullPath.name,
              value: this.fullPath.id
            }
          }
        } else if (val.attrName !== '全路径Ids') {
          a = {
            key: val.columnName,
            value: this.$refs['input_' + val.columnName][0].inputData
          }
        }

        this.ruleForm.push(a);
        if (val.attrName === '维度分类') {
          // console.log(this.ruleForm, a, this.$refs['input_' + val.columnName][0].inputData)
        }
      })

      this.ruleForm.splice(this.ruleForm.indexOf(undefined), 1);
      postByJson('/ds/application/dimension/saveDimensionBasicInfos', this.ruleForm).then(val => {
        if (val.code === 10000 & val.success) {
          this.$message({
            message: val.message,
            type: 'success'
          });
          let a = {
            keyword: null,
            nodeList: this.nodeList,
            addNode: this.addNode
          }
          this.closeSelectedTag(this.$route)
          this.$router.push({
            name: "dimensionality",
            params: a
          });
        } else {
          this.$message.error(val.message);
        }
      })
    },
    // 维度值添加输入框
    getNewDimensionInput() {
      let obj = {
        valueCode: '',
        valueDesc: ''
      }
      this.wMess.addData.push(obj)
    },
    // 添加维度值映射接口
    getNewDimensionMap() {
      if (this.wMMess.addData.length > 0) {
        let arr = [];
        this.wMMess.addData.map(val => {
          let obj = {
            commonCodeId: val.valueCode.id,
            dimensionValueId: val.valueDesc.valueId
          }
          arr.push(obj);
        })
        postByJson('/ds/application/dimension/createValueMappingInfos', arr).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.wGetDataN();
            this.dialogTableVisible4 = false;
          } else {
            this.$message.error(res.message);
          }
        })
      } else {
        this.$message({
          message: "请选择您要添加的维度值映射信息",
          type: 'warning'
        });
      }
    },
    // 添加维度值接口
    getNewDimensionValues() {
      if (this.wMess.addData.length > 0) {
        let params = {
          dimensionId: this.selectId,
          valueItems: this.wMess.addData
        }
        postByJson('/ds/application/dimension/createDimensionValue', params).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.wGetData();
            this.dialogTableVisible3 = false;
          } else {
            this.$message.error(res.message);
          }
        })
      } else {
        this.$message({
          message: "请选择您要添加的维度值映射信息",
          type: 'warning'
        });
      }
    },
    // 维度值弹出框删除
    delDimensionValues(val) {
      this.wMess.addData.splice(this.wMess.addData.indexOf(val), 1);
    },
    // 映射弹出框删除
    delDimensionValues2(val) {
      this.wMMess.addData.splice(this.wMess.addData.indexOf(val), 1);
    },
    delDimensionList(type) {
      // console.log(this.wMess.delArr)
      if (this.wMess.delArr.length > 0 && type === 'wMess') {
        this.$confirm('确定删除选中数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let string = '';
          this.wMess.delArr.map(val => {
            if (string.length === 0) {
              string += val.valueId;
            } else {
              string += ',' + val.valueId;
            }
          })
          get('/ds/application/dimension/removeDimensions', {
            instanceIds: string
          }).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.$message({
                message: res.message,
                type: 'success'
              });
              this.wGetData();
            } else {
              this.$message.error(res.message);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (this.wMMess.delArr.length > 0 && type === 'wMMess') {
        this.$confirm('确定删除选中数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          postByJson('/ds/application/dimension/removeValueMappingInfos', this.wMMess.delArr).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.$message({
                message: res.message,
                type: 'success'
              });
              this.wGetDataN();
            } else {
              this.$message.error(res.message);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$message.error('请选择您要删除的信息！');
      }
    },
    wGetDataN() {
      if (this.selectId) {
        // 维度值映射
        let yparams = {
          dimensionId: this.selectId,
          pageCurrent: this.wMMess.current,
          pageSize: this.wMMess.pageSize
        }
        get('/ds/application/dimension/listDimensionValueMappingInfos', yparams).then(res => {
          if (res.code === 10000 && res.success) {
            this.wMMess.data = res.data.records;
            this.wMMess.page.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        })
      }
    },
    wGetData() {
      if (this.selectId) {
        // 维度值
        let params = {}
        if (this.dialogTableVisible5) {
          params = {
            dimensionId: this.selectId,
            pageCurrent: this.wList.page.current,
            pageSize: this.wList.page.size,
            keyword: this.wList.keyword
          }
        } else {
          params = {
            dimensionId: this.selectId,
            pageCurrent: this.wMess.page.current,
            pageSize: this.wMess.page.size
          }
        }

        get('/ds/application/dimension/listDimensionValueInfos', params).then(res => {
          if (res.code === 10000 && res.success) {
            if (this.dialogTableVisible5) {
              this.wList.data = res.data.records;
              this.wList.page.total = res.data.total;
              this.wList.page.size = res.data.size;
            } else {
              this.wMess.data = res.data.records;
              this.wMess.page.total = res.data.total;
              this.wMess.page.size = res.data.size;
            }
            // console.log(this.wList.data,)
          } else {
            this.$message.error(res.message);
          }
        })
      }
    },
    toSearch() {
      var str
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      var pattern2 = new RegExp("[A-Za-z]+");
      if (pattern.test(this.wData.wKeyword)) {
        str = '中文'
      } else if (pattern2.test(this.wData.wKeyword)) {
        str = '英文'
      } else {
        this.wData.treeSelect = [];
      }
      // console.log(str)
      if (str === '英文') {
        this.eSearch()
      } else if (str === '中文') {
        this.showTree();
      }
    },
    showTree() {
      let selectArr = [];
      let res = this.wData.problemTakerData;
      res.map(val => {
        if (this.wData.wKeyword) {
          if (val.title.indexOf(this.wData.wKeyword) > -1) {
            for (let i = 0; i < val.children.length; i++) {
              if (val.children[i].title) {
                selectArr.push({
                  title: val.children[i].title,
                  userId: val.children[i].userId,
                  parent: val.title
                });
              }
            }
          } else {
            let child = val.children;
            child.map(item => {
              if (item.title && item.title.indexOf(this.wData.wKeyword) > -1) {
                selectArr.push({
                  title: item['title'],
                  userId: item['userId'],
                  parent: val['title']
                });
              }
            })
          }
        }
      })
      this.wData.treeSelect = selectArr;
      // this.problemTakerData = selectArr;
    },
    eSearch() {
      this.wData.wKeyword = this.wData.wKeyword.toLowerCase();
      let res = this.wData.problemTakerData;
      let selectArr = [];
      res.map(val => {
        let pname = pinyin(val.title, {
          style: pinyin.STYLE_NORMAL, // 设置拼音风格
          heteronym: true
        })
        let newpname = ''
        pname.map(val2 => {
          if (val2.length > 1) {
            newpname += val2[0]
          } else {
            newpname += val2
          }
        })
        val.pname = newpname;
        let spname = pinyin(val.title, {
          style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
          heteronym: true
        })
        let newspname = ''
        spname.map(val3 => {
          if (val3.length > 1) {
            newspname += val3[0]
          } else {
            newspname += val3
          }
        })
        val.spname = newspname;
        for (let i = 0; i < val.children.length; i++) {
          if (val.children[i]) {
            let pname = pinyin(val.children[i].title, {
              style: pinyin.STYLE_NORMAL, // 设置拼音风格
              heteronym: true
            })
            let newpname = ''
            pname.map(val2 => {
              if (val2.length > 1) {
                newpname += val2[0]
              } else {
                newpname += val2
              }
            })
            val.children[i].pname = newpname;
            let spname = pinyin(val.children[i].title, {
              style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
              heteronym: true
            })
            let newspname = ''
            spname.map(val3 => {
              if (val3.length > 1) {
                newspname += val3[0]
              } else {
                newspname += val3
              }
            })
            val.children[i].spname = newspname;
          }
        }
      })
      res.map(val => {
        if (this.wData.wKeyword) {
          if (val.spname.indexOf(this.wData.wKeyword) !== -1) {
            if (val.children.length > 0 && val.children[0].title !== undefined) {
              for (let i = 0; i < val.children.length; i++) {
                let n = val.children[i];
                n.parent = val.title;
                selectArr.push(n)
              }
            }
          } else if (val.pname.indexOf(this.wData.wKeyword) !== -1) {
            let bool = false;
            for (let m = 0; m < val.spname.length; m++) {
              if (this.wData.wKeyword[0] === val.spname[m]) {
                bool = true
              }
            }
            if (val.children.length > 0 && val.children[0].title !== undefined && bool) {
              for (let i = 0; i < val.children.length; i++) {
                let n = val.children[i];
                n.parent = val.title;
                selectArr.push(n)
              }
            }
          } else {
            if (val.children.length > 0 && val.children[0].title !== undefined) {
              val.children.map(item => {
                if (item.pname.indexOf(this.wData.wKeyword) !== -1) {
                  let bool = false;
                  for (let m = 0; m < item.spname.length; m++) {
                    if (this.wData.wKeyword[0] === item.spname[m]) {
                      bool = true
                    }
                  }

                  if (bool) {
                    let n = item;
                    n.parent = val.title;
                    selectArr.push(n)
                  }
                } else if (item.spname.indexOf(this.wData.wKeyword) !== -1) {
                  let n = item;
                  n.parent = val.title;
                  selectArr.push(n)
                }
              })
            }
          }
        }
      })
      this.wData.treeSelect = selectArr;
    },
    handleClick() {},
    selectTreeValue(data) {
      console.log(data)
      const that = this;
      if (data) {
        if (data.hasOwnProperty("children")) {
          data.selected = false;
        } else {
          if (data.userId !== undefined && !this.whichAccount) { // 多选
            // 问题发起人
            if (that.wData.pfilterSponsorArr.indexOf(data.userId) === -1) {
              that.wData.filterSponsorArr.push(data);
              that.wData.pfilterSponsorArr.push(data.userId);
            }
          } else if (data.userId !== undefined && this.whichAccount) {
            this.wData.filterSponsorData = data;
            this.wData.pfilterSponsorData = data.userId;
          }
        }
      } else {
        this.wData.wKeyword = '';
      }
    },
    // sure() {
    //   this.saveAccusationData();
    // },
    handleSelectionChange(val) {
      // console.log(val)
    },
    wHandleSelectionChange(val) {
      this.wMess.delArr = val;
    },
    wHandleSelectionChange2(val) {
      // console.log(val)
      this.wMMess.delArr = val;
    },
    sourceHandleSelection(val, row) {
      // console.log(val, row)
      this.referenceSource.selectArr = val;
    },
    saveNewReference() {
      if (this.referenceSource.selectArr.length > 0) {
        let arr = [];
        this.referenceSource.selectArr.map(val => {
          let a = {
            fromInstanceClassifierId: val.classifierId,
            fromInstanceId: val.id,
            relationship: this.referenceSource.relationshipId,
            toInstanceId: this.selectId,
            toInstanceClassifierId: this.classifierId
          }
          arr.push(a);
        })
        postByJson('/ds/createReferenceInfo', arr).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.gGetData();
            this.dialogTableVisible = false;
          } else {
            this.$message.error(res.message);
          }
        })
      } else {
        this.$message({
          message: "请选择参考来源",
          type: 'warning'
        });
      }
    },
    referenceSelectionChange(val) {
      this.ReferenceTable.delArr = val;
    },
    delReference() {
      if (this.ReferenceTable.delArr) {
        this.$confirm('确定删除选中数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let fromIds = [];
          this.ReferenceTable.delArr.map(val => {
            fromIds.push(val.id)
          })
          let params = {
            fromIds: fromIds.join(','),
            toId: this.selectId
          }
          post('/ds/removeReferenceInfo', params).then(res => {
            if (res.code === 10000 && res.success) {
              this.gGetData();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message.error(res.message);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$message({
          message: "请选择您要删除的信息",
          type: 'warning'
        });
      }
    },
    // 关系信息
    gGetData() {
      // 参考表
      let cParams = {
        dimensionId: this.selectId,
        pageCurrent: this.ReferenceTable.page.current,
        pageSize: this.ReferenceTable.page.size
      }
      get('/ds/application/dimension/listDimensionReferenceInfos', cParams).then(res => {
        if (res.code === 10000 && res.success) {
          this.ReferenceTable.page.total = res.data.total;
          this.ReferenceTable.data = res.data.records;
        } else {
          this.$message.error(res.message);
        }
      })
    },
    handleClose(tag) {
      this.wData.filterSponsorArr.splice(this.wData.pfilterSponsorArr.indexOf(tag.userId), 1);
      this.wData.pfilterSponsorArr.splice(this.wData.pfilterSponsorArr.indexOf(tag.userId), 1);
      console.log(this.wData.pfilterSponsorArr, this.wData.filterSponsorArr)
    },
    handleClose2(tag, type) {
      if (type === '使用人') {
        this.wData.filterSponsorArr.splice(this.wData.pfilterSponsorArr.indexOf(tag.userId), 1);
        this.wData.pfilterSponsorArr.splice(this.wData.pfilterSponsorArr.indexOf(tag.userId), 1);
        this.accusationData.userList.map((val, index) => {
          if (tag.userId === val.userId) {
            this.accusationData.userList.splice(index, 1);
            return
          }
        })
      } else if (type === '归口责任人') {
        this.wData.filterSponsorData = null;
        this.wData.pfilterSponsorData = null;
      }

      this.saveAccusationData()
    },
    handleClose3() {
      this.wData.filterSponsorData = null;
      this.wData.pfilterSponsorData = null;
    },
    goToSearch() {
      if (this.referenceSource.fromClassifierId) {
        this.getReferenceSource(this.referenceSource.fromClassifierId)
      } else {
        this.$message({
          message: '请选择一条数据',
          type: 'warning'
        });
      }
    },
    getReferenceSource(id) {
      // console.log(id, 'id')
      let params = {
        fromClassifierId: id,
        pageSize: this.referenceSource.pageSize,
        pageCurrent: this.referenceSource.pageCurrent,
        keyword: this.referenceSource.keyword,
        toInstanceId: this.selectId
      }
      get('/ds/listReferenceInfo', params).then(res => {
        if (res.code === 10000 && res.success) {
          this.referenceSource.data = res.data.records
          this.referenceSource.pageSize = res.data.size;
          this.referenceSource.pageCurrent = res.data.current;
          this.referenceSource.total = res.data.total;
          // console.log(this.referenceSource.total, 'eee')
        } else {
          this.$message.error(res.message);
        }
      })
    },
    addNewReference() {
      this.dialogTableVisible = true;
      get('/ds/application/dimension/getRefRelationshipType').then(res => {
        if (res.code === 10000 && res.success) {
          this.ReferenceTable.listMess = res.data
        } else {
          this.$message.error(res.message);
        }
      })
    },
    // 获取认责信息-用户分组列表
    addNewAccount(type) {
      if (type === '使用人') {
        this.dialogTableVisible2 = true;
        this.whichAccount = false;
        this.getUserList();
      } else if (type === '归口责任人') {
        this.dialogTableVisible2 = true;
        this.whichAccount = true;
        this.getUserList();
      } else if (type === '创建人' || type === '发布人') {
        this.$message({
          message: '暂无法添加' + type,
          type: 'warning'
        });
      }
    },
    getUserList() {
      get('/sys/user/listUserByGroup').then(res => {
        const that = this;
        if (res.code === 10000 && res.success) {
          let resData = res.data;
          that.wData.problemTakerData = resData.map(child => {
            if (child.users.length > 0 && child.users[0].userId !== undefined) {
              return {
                title: child.groupName,
                isLeaf: false,
                children: child.users.map(function (child2) {
                  return {
                    title: child2.userName,
                    userId: child2.userId
                  }
                })
              }
            } else {
              return {
                title: child.groupName,
                isLeaf: true,
                children: []
              }
            }
          });
        } else {
          this.$message.error(res.message);
        }
      })
    },
    dropDown() {
      this.ifShow.classify = !this.ifShow.classify;
    },
    isClass(row, column, rowIndex, columnIndex) {
      if (columnIndex === 0) {
        return 'text-align:center;border-right:none;'
      } else {
        return 'text-align:center;'
      }
    },
    isClass2(row, column, rowIndex, columnIndex) {
      if (columnIndex === 0) {
        return 'tableClass'
      }
    },
    // 头部删除按钮
    handleDelete() {
      this.$confirm(
        "您的操作将会永久删除所选标准及其相关关系，确定继续吗?",
        "警告",
        {
          confirmButtonText: "继续",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const load = loading("删除中...");
          get('/ds/application/dimension/removeDimensions', {
            instanceIds: this.selectId
          }).then(res => {
            if (res.code === 10000 && res.success) {
              load.close()
              this.$message({
                message: res.message,
                type: 'success'
              });
              this.$parent.$parent.$parent.getData();
              this.$emit('colse');
            } else {
              load.close()
              this.$message.error(res.message);
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    createdMess(val) {
      this.routeData = val;
      if (val.detailId) {
        this.selectId = val.detailId;
      }
      this.basicMsg = val.msg;
      if (val.nodeList1) {
        this.selectClear = true;
        this.nodeList = val.nodeList1;
        console.log(this.nodeList, 'this.nodeList')
      }
      this.getData();
      this.getCollect()
      console.log(val, 'this.lockObj.first')
      if (val.type) {
        this.activeName = val.type;
      }
    },
    getData() {
      console.log(1111)
      get('/ds/application/dimension/getDimensionDetailInfos', {
        dimensionId: this.selectId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          let data = res.data;
          this.basicData = data.basicInfo;
          this.accusationData = {
            creatorList: data.accusationInfos.creator,
            issuerList: data.accusationInfos.publisher,
            userList: data.accusationInfos.user,
            dutyList: data.accusationInfos.prncipal
          }
          this.parentId = data.parentId;
          this.wData.filterSponsorArr = [];
          this.wData.pfilterSponsorArr = [];
          this.accusationData.userList.map(val => {
            let obj = {
              title: val.username,
              userId: val.userId
            }
            this.wData.filterSponsorArr.push(obj)
            this.wData.pfilterSponsorArr.push(val.userId)
          })
          this.wData.filterSponsorData = null;
          this.wData.pfilterSponsorData = null;
          this.accusationData.dutyList.map(val => {
            let obj = {
              title: val.username,
              userId: val.userId
            }
            this.wData.filterSponsorData = obj;
            this.wData.pfilterSponsorData = obj.userId;
          })
          // 判断是不是父节点信息项
          this.isParentNode = data.accusationInfos.supIsParentIndex;

          this.classifierId = data.classifierId;
          this.dimensionName = data.dimensionName;
          this.dimensionId = data.dimensionId;
          this.EName = data.dimensionEnName;
          this.ReferenceTable.data = data.relationship.referenceInfos.records;
          this.ReferenceTable.page.total = data.relationship.referenceInfos.total;
          this.ReferenceTable.page.size = data.relationship.referenceInfos.size;
          this.wMess.data = data.dimensionValueInfos.dimensionValues.records;
          this.wMess.page.total = data.dimensionValueInfos.dimensionValues.total;
          this.wMess.page.size = data.dimensionValueInfos.dimensionValues.size;
          this.wMMess.data = data.dimensionValueInfos.mappingInfos.records;
          this.wMMess.page.total = data.dimensionValueInfos.mappingInfos.total;
          this.wMMess.page.size = data.dimensionValueInfos.mappingInfos.size;
          this.basicData.map(val => {
            if (val.attrName === '发布状态') {
              this.state = val.attrValue
            }
          })
        } else {
          this.$message.error(res.message);
        }
      })
    }
  },
  activated() {
    // if (this.$route.params.detailId) {
    //   this.selectId = this.$route.params.detailId;
    // }
    // this.getData();
    // if (this.$route.params.type) {
    //   this.activeName = this.$route.params.type;
    // }
    // 后加的
    // let arr = ['INSTANCE_ID',
    //   'INSTANCE_NAME',
    //   'INSTANCE_CODE',
    //   'NAMESPACE',
    //   'STRING_1',
    //   'STRING_2',
    //   'STRING_3',
    //   'STRING_4',
    //   'STRING_5',
    //   'STRING_6']
    // arr.map(val => {
    //   this.$set(this.inputForm, val, null)
    // })
    // if (this.$route.params.detailId) {
    //   this.selectId = this.$route.params.detailId;
    // }
    // this.getData();
    // // console.log(this.lockObj.first, 'this.lockObj.first')
    // if (this.$route.params.type) {
    //   this.activeName = this.$route.params.type;
    // }
  },
  created() {
  },
  beforeDestroy() {
    bus.$off('columnName')
    bus.$off('getNodeArr')
  }
}
</script>
<style lang="scss" scoped>
//外层card容器样式
@import "./../../../../styles/dq/main-card-table.scss";
$color-grey-light: #E0E0E0;
$color-border:#DCDFE6;
$color-font:#C0C4CC;
.editor-container{
    height:100%;
    .checkSame /deep/ {
    .el-dialog__wrapper .el-dialog .el-dialog__header {
      border: unset !important;
    }
    .el-dialog__wrapper .el-dialog .el-dialog__footer {
      text-align: center;
      padding: 20px;
      border: unset !important;
    }
    .el-dialog__body {
      padding: 0 20px;
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
  }
  .el-card{
      height:100%;
      padding:0 12px 10px;
      overflow:auto;
        /deep/ .el-card__header{
          // padding:11px;
          padding: 12px 11px 5px;
        }
       /deep/ .el-card__body{
        .card-body{
          .el-tabs{
            .el-tabs__header{
              .el-tabs__item {
                height: 40px;
                width: 80px;
                line-height: 40px;
                text-align: center;
                padding: 0px;
              }
            }
            .el-tabs__content{
              .relationship{
                .title{
                  border-bottom:1px solid $color-grey-light;
                  font-size: 17px;
                  padding:20px 10px;
                }
                .title2{
                  border-bottom:1px solid $color-grey-light;
                  font-size: 14px;
                  padding:12px 10px;
                }
                .button{
                  padding:10px 10px;
                  .el-button--mini{
                      font-size: 13px;
                      .svg-icon{
                          position:relative;
                      }
                  }
                  .zengjia{
                    padding:4px 10px 5.5px 10px;
                    .svg-icon{
                        width:15px;
                        height:15px;
                        top:1px;
                    }
                  }
                  .shanchu{
                    padding:4px 10px 6.5px 9px;
                      .svg-icon{
                          width:16px;
                          height:16px;
                          top:1px;
                      }                                      
                  }
                }
                .table{
                  padding:0 8px;
                  /deep/ .tableClass{
                      border-right:none!important;
                  }
                }
              }
              .confess-account{
                .title{
                  border-bottom:1px solid $color-grey-light;
                  font-size: 16px;
                  padding:20px 15px;
                }
                .found{
                  .button{
                    padding:20px 20px;
                    .el-button{
                      border:1px solid #333;
                      border-radius: 0;
                      padding: 8px 15px;
                      .see-user{
                        width:22px;
                        height:22px;
                        margin-right: 10px;
                      }
                      span{
                        color:#409EFF;
                        span{
                          position: relative;
                          bottom: 3px;
                          margin-right: 8px;
                        }
                      }
                      .close{
                        width:12px;
                        height:12px;
                        position: relative;
                        bottom:4px;
                      }
                      .add{
                        width:22px;
                        height:22px;
                        margin-right: 20px;
                      }
                    }
                  }
                }
                .found:nth-of-type(2),.found:nth-of-type(3),.found:nth-of-type(4){
                  margin-top:20px;
                }
              }
              .selectButton:focus{
                border-color: #409EFF;
                background-color: unset;
              }
              .selectButton:hover{
                // color: #409EFF;
                border-color: $color-font;
                background-color: unset;
              }
              .tree{
                border:1px solid $color-font;
                border-top:none;
              }
              .el-dropdown{
                width:100%;
                position: relative;

              }
              .selectButton{
                width:100%;
                padding:20px;
                position: relative;
                span{
                  position: absolute;
                  width:100%;
                  text-align: left;
                  left:10px;
                  top:50%;
                  transform: translateY(-50%);
                  color:$color-font;
                  i{
                    position: absolute;
                    right:20px;
                  }
                }
              }
              .opinion-input-type{
                  .el-tree{
                    .is-checked{
                      /deep/ .el-tree-node__content{
                        background-color:#4498f145; 
                      }
                      
                    }
                  }
              }
              .base-msg {
                padding:0 20px;
                p {
                  overflow: hidden;
                  font-size: 16px;
                  color: #666666;
                  margin-bottom: 30px;
                }
                .base-msg_content {
                  display: block;
                  float: right;
                  width: calc(100% - 80px);
                }
              }
            }
          }
        }
      }
    .rule-title {
      margin-bottom:15px;
      
      .rule-title_content {
        font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
        font-weight: 650;
        font-style: normal;
        font-size: 18px;
        color: rgba(102, 102, 102, 0.847058823529412);
        line-height: 24px;
      }
      .basic-button {
        height: 34px;
        width: 85px;
        padding: 0 15px 0 35px;
        position: relative;
      }
      .dataTable-icon {
        position: absolute;
        display: inline-block;
        width: 24px;
        height: 24px;
        left: 7px;
        top: 3px;
      }
      .blood {
        background: url(../../../../../src/assets/images/commonIcon/blood-icon.png)
          no-repeat;
        background-size: 100%;
      }
      .edit {
        background: url(../../../../../src/assets/images/commonIcon/edit.png)
          no-repeat;
        background-size: 100%;
      }
      .del {
        background: url(../../../../../src/assets/images/commonIcon/del.png)
          no-repeat;
        background-size: 100%;
      }
      .add {
        background: url(../../../../../src/assets/images/commonIcon/add.png)
          no-repeat;
        background-size: 100%;
      }
    }    
  }
  .relationTip{
    .el-dialog__header{
      padding: 20px 25px 10px;
      div{
        font-weight: 600;
        color:#666;
      }
    }
    /deep/ .el-dialog__body{
      padding:20px 20px 15px!important;
      .el-form-item{
          margin-right:0px;
          margin-bottom:15px;
          .el-form-item__label{
              padding-right:0px;
          }
          .el-form-item__content{
                width: 72%;
          }
      }
      .el-form-item.input{
          .el-form-item__content{
                width: 78%;
          }
      }
    }
  }
  .tree-select-div.people{
    margin-top:15px;
    margin-left:15px;
  }
  .filter-tree{
    margin-top:15px;
    margin-left:10px;
  }
  .tree-slot{
    margin-bottom:8px;
  }
  .bt-form{
    border:1px solid #E0E0E0;
    margin-top:10px;
    .el-form-item.bt-input{
      margin-bottom: 0px!important;
    }
    /deep/ .el-form-item__content{
      width:100%!important;
    }
  }
  .el-icon-delete.tabla-i{
    font-size: 18px;
    // position: relative;
    // bottom:3px;
  }
}
.editor{
    .el-tooltip__popper{
        max-width:360px;
    }
}
</style>