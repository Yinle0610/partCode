<template>
  <div style="padding:10px 20%;" id="adddoc">
    <el-card shadow="hover">
      <el-form :model="addForm" ref="addForm" :rules="addFormRule" class="add-form">
        <el-form-item class="addtitle1">
          <el-input autofocus v-model="addForm.sTitle" :maxlenght="50" placeholder="请输入标题（最多50字）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="24">
              <div class="editor">
                <el-tabs @tab-click="clickTab" v-model="activeName" type="border-card">
                  <el-tab-pane label="Markdown" name="first">
                    <div class="editor-container">
                      <!-- <markdown-editor
                        id="contentMd"
                        ref="contentMd"
                        v-model="sContentMark"
                        :height="320"
                        :zIndex="20"
                      ></markdown-editor>-->
                      <markdown-editor v-model="sContentMark" :configs="configs"></markdown-editor>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="富文本" name="second">
                    <div>
                      <div ref="editor" style="text-align:left"></div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-top:20px">
          <div>
            <svg-icon icon-class="attachment" class="svgsize"></svg-icon>
            <span class="title">附件</span>
          </div>
          <el-upload
            :headers="headers"
            :on-success="handleSuccess"
            :action="`${api}/kno/doc/uploadDocAttach`"
            style="display:inline-block;"
          >
            <el-button icon="el-icon-upload" size="small">上传文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item style="margin-top:20px" prop="spaceBelong">
          <div>
            <svg-icon icon-class="breadcrumb" class="svgsize"></svg-icon>
            <span class="title">归属空间</span>
          </div>
          <el-select v-model="addForm.spaceBelong" placeholder="请选择" clearable>
            <el-option
              v-for="(item, index) in spaceList"
              :key="index"
              :label="item.spaceName"
              :value="item.spaceId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="doclab">
          <div>
            <svg-icon icon-class="tags" class="svgsize"></svg-icon>
            <span class="title">标签（最多只能添加3个）</span>
          </div>
          <div class="tagDiv">
            <el-tag
              class="tags"
              :key="index"
              v-for="(item, index) in aTagArr"
              closable
              type="info"
              :disable-transitions="false"
              @close="handleCloseTag(item)"
            >{{item}}</el-tag>
            <el-autocomplete
              class="input-new-tag"
              :maxlength="10"
              v-model.trim="sAddTag"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearch"
              placeholder="+    新增"
              @select="handleTagAdd"
              @blur="handleTagAdd"
              @keyup.enter.native="handleTagAdd"
            ></el-autocomplete>
          </div>
        </el-form-item>
        <el-form-item style="text-align: center; margin-top: 70px;border-top: 1px solid #EBEEF5;
    padding-top: 20px;">
          <el-button size="small" @click="handleSave" v-if="this.$route.params.isDraft===1">保存草稿</el-button>
          <el-button
            size="small"
            style="margin-left: 8px"
            type="primary"
            @click="handlePublish"
          >立即发布</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog title="请输入备注信息" :visible.sync="remarkFormVisible">
      <el-form :model="remarkForm" ref="remarkBox" :rules="remarkRules">
        <el-form-item prop="content">
          <el-input placeholder="请输入备注信息..." :rows="4" type="textarea" v-model="remarkForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remarkFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('remarkBox')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import markdownEditor from "vue-simplemde";
import pinyin from "pinyin";
// import MarkdownEditor from "@/components/MarkdownEditor";
import Tinymce from "@/components/Tinymce";
import E from "wangeditor";
import { getToken } from "@/utils/auth";
import { post, get, parseAjaxResponse } from "@/utils/request";
export default {
  name: "editDocument",
  components: { markdownEditor, Tinymce },
  data() {
    const checkTitle = (rule, value, callback) => {
      console.log(value);
      if (this.addForm.sTitle === "") {
        callback(new Error("请输入标题!"));
      } else {
        callback();
      }
    };
    const checkSpaceBelong = (rule, value, callback) => {
      console.log(value);
      if (this.addForm.spaceBelong === "") {
        callback(new Error("请选择空间!"));
      } else {
        callback();
      }
    };
    const checkContent = (rule, value, callback) => {
      console.log(value);
      if (this.sContentMark || this.sEditorContent) {
        callback();
      } else {
        callback(new Error("请填写文档内容!"));
      }
    };
    const checkTagList = (rule, value, callback) => {
      console.log(value);
      if (this.aTagArr.length < 1) {
        callback(new Error("请添加标签!"));
      } else {
        callback();
      }
    };
    return {
      activeName: 'first',
      selectTags: [],
      spaceBelong: "", // 空间归属
      // 空间下拉
      spaceList: [],
      configs: {
        status: false,
        spellChecker: false,
        renderingConfig: {
          codeSyntaxHighlighting: true,
          highlightingTheme: "atom-one-light"
        }
      },
      msg: "",
      headers: {},
      remarkFormVisible: false,
      remarkForm: {
        content: ""
      },
      aTagArr: [],
      sAddTag: "",
      addForm: {
        sTitle: "",
        spaceBelong: "",
        content: this.type === 0 ? this.sEditorContent : this.sContentMark,
        type: this.type,
        tagList: this.aTagArr
      },
      addFormRule: {
        sTitle: [
          {
            validator: checkTitle,
            trigger: "blur"
          }
        ],
        spaceBelong: [
          {
            validator: checkSpaceBelong,
            trigger: "change"
          }
        ],
        content: [
          {
            validator: checkContent,
            trigger: "blur"
          }
        ],
        tagList: [
          {
            validator: checkTagList,
            trigger: "blur"
          }
        ]
      },
      sContentMark: "",
      sEditorContent: "",
      type: 1,
      remarkRules: {
        content: [
          { required: true, message: "备注信息不能为空", trigger: "blur" }
        ]
      },
      api: "",
      attachId: "",
      oldSpaceId: '',
      oldSpaceName: '',
      fromName: "", // 从哪里进来，记录name，编辑完成后原路返回
      paramsToEdit: {}
    };
  },
  methods: {
    // 删除标签
    handleCloseTag(tag) {
      this.aTagArr.splice(this.aTagArr.indexOf(tag), 1);
    },
    // 页面添加标签
    handleTagAdd() {
      const sAddTag = this.sAddTag;
      if (sAddTag && this.aTagArr.length < 3) {
        this.aTagArr.push(sAddTag);
      }
      this.inputVisible = false;
      this.sAddTag = "";
    },
    clickTab(val) {
      val.label === "富文本" ? (this.type = 0) : (this.type = 1);
    },
    handleSuccess(res) {
      if (res.code === 10000 && res.success) {
        this.attachId = res.data.attachId;
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.message);
      }
    },
    handleSave() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (this.addForm.spaceBelong === this.oldSpaceName) {
            this.addForm.spaceBelong = this.oldSpaceId
          }
          post("/kno/doc/saveDraft", {
            attachId: this.attachId, //  附件ID
            docId: "",
            info: this.type === 0 ? this.sEditorContent : this.sContentMark, // 内容
            labelNames: this.aTagArr.toString(), // 标签名
            spaceId: this.addForm.spaceBelong || this.msg.spaceId, // 空间ID
            tempId: this.$route.params.tempId ? this.$route.params.tempId : '', // 草稿ID
            title: this.addForm.sTitle, // 文档标题
            type: this.type //  文档类型 --0:富文本; --1:MarkDown
          }).then(res => {
            if (res.code === 10000 && res.success) {
              this.$message.success(res.message);
              this.closeSelectedTag(this.$route)
              this.$router.push({
                name: "MY_KONWLEDGE",
                params: {
                  isdraft: "draft"
                }
              });
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    handlePublish() {
      this.$refs["addForm"].validate(valid => {
        console.log(valid);
        if (valid) {
          this.remarkFormVisible = true;
        } else {
          return false;
        }
      });
      // let flag = 0
      // this.aTagArr.forEach(element => {
      //   if (element.length > 10) {
      //     flag = 1
      //   }
      // });
      // if (flag === 0) {
      //   this.remarkFormVisible = true;
      // } else {
      //   this.$message.warning("标签长度需要小于10")
      // }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editDoc();
          this.remarkFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getSpaceList() {
      get("/kno/doc/listSpaceOnEditorPermission").then(res => {
        console.log(res);
        parseAjaxResponse(res, () => {
          this.spaceList = res.data;
        });
      });
    },
    getTags() {
      get("/kno/label/listLabel", {
        pageCurrent: 1,
        pageSize: 10000
      }).then(res => {
        parseAjaxResponse(res, () => {
          console.log(res);
          res.data.records.map(item => {
            item.value = item.name;
            return item;
          });
          this.selectTags = res.data.records;
          console.log(this.selectTags);
        });
      });
    },
    editDoc() {
      if (this.msg.docId) {
        post("/kno/doc/editDocument", {
          docId: this.msg.docId,
          attachId: this.attachId, //  附件Id
          info: this.type === 0 ? this.sEditorContent : this.sContentMark, // 内容
          labelNames: this.aTagArr.toString(), // 标签名
          remark: this.remarkForm.content, // 备注
          spaceId: this.msg.spaceId, // 空间ID
          title: this.addForm.sTitle, // 文档标题
          type: this.type //  文档类型 --0:富文本; --1:MarkDown
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.$message.success(res.message);
            // this.$router.push({ name: "knowledgeManagement" });
            // this.closeNavTag(this.$route)
            this.closeSelectedTag(this.$route)
            this.$router.push({
              name: "MY_KONWLEDGE",
              params: {
                isdraft: "nodraft"
              }
            });
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        post("/kno/doc/createDocument", {
          tempId: this.$route.params.tempId,
          attachId: this.attachId,
          info: this.type === 0 ? this.sEditorContent : this.sContentMark, // 内容
          labelNames: this.aTagArr.toString(), // 标签名
          remark: this.remarkForm.content, // 备注
          spaceId: this.msg.spaceId, // 空间ID
          title: this.addForm.sTitle, // 文档标题
          type: this.type //  文档类型 --0:富文本; --1:MarkDown
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.$message.success(res.message);
            // this.$router.push({ name: "knowledgeManagement" });
            // this.closeNavTag(this.$route)
            this.closeSelectedTag(this.$route)
            this.$router.push({
              name: "MY_KONWLEDGE",
              params: {
                isdraft: "nodraft"
              }
            });
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    getDocMsg() {
      get("/kno/doc/getToBeEditedDocInfo", {
        docId: this.msg.docId,
        spaceId: this.msg.spaceId,
        tempId: this.$route.params.tempId ? this.$route.params.tempId : null
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.addForm.sTitle = res.data.title;
          this.attachId = res.data.attachId;
          this.msg.spaceId = res.data.spaceId;
          // this.addForm.spaceBelong = res.data.spaceId;
          this.oldSpaceId = res.data.spaceId;
          this.oldSpaceName = res.data.spaceName;
          this.addForm.spaceBelong = res.data.spaceName;
          let tags = res.data.labelNames;
          this.$refs.editor.html = res.data.info;
          if (tags !== "" && tags !== undefined) {
            this.aTagArr = tags.split(",");
          } else {
            this.aTagArr = [];
          }
          this.type = res.data.type;
          this.activeName = this.type === 1 ? 'first' : 'second'
          this.type === 1
            ? (this.sContentMark = res.data.info)
            : (this.sEditorContent = res.data.info);
          var editor = new E(this.$refs.editor);
          editor.customConfig.onchange = html => {
            this.sEditorContent = html;
          };
          editor.customConfig.uploadImgShowBase64 = true
          editor.create();
          if (res.data.type === 0) {
            editor.$textElem[0].innerHTML = `<p>${this.sEditorContent}</p>`;
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    querySearch(queryString, cb) {
      var str;
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      var pattern2 = new RegExp("[A-Za-z]+");
      if (pattern.test(this.sAddTag)) {
        str = "中文";
      } else if (pattern2.test(this.sAddTag)) {
        str = "英文";
      }
      if (str === "英文") {
        cb(this.eSearch());
      } else if (str === "中文") {
        let result = queryString
          ? this.selectTags.filter(this.createFilter(queryString))
          : this.selectTags;
        cb(result);
      }
    },
    createFilter(queryString) {
      return item => {
        return item.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1;
      };
    },
    eSearch() {
      this.sAddTag = this.sAddTag.toLowerCase();
      let res = this.selectTags;
      let selectArr = [];
      res.map(val => {
        // 全拼
        let pname = pinyin(val.value, {
          style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
          heteronym: true
        });
        let newpname = "";
        pname.map(pval => {
          if (pval.length > 1) {
            newpname += pval[0];
          } else {
            newpname += pval;
          }
        });
        val.newpname = newpname;
        // 首部拼音
        let spname = pinyin(val.value, {
          style: pinyin.STYLE_NORMAL, // 设置拼音风格
          heteronym: true
        });
        let newspname = "";
        spname.map(spval => {
          if (spval.length > 1) {
            newspname += spval[0];
          } else {
            newspname += spval;
          }
        });
        val.newspname = newspname;
      });
      // 拼音匹配
      res.map(val => {
        if (
          val.newspname.indexOf(this.sAddTag) > -1 ||
          val.newpname.indexOf(this.sAddTag) > -1
        ) {
          selectArr.push(val);
        }
      });
      return selectArr;
    },
    // 关闭nav上的tag路由
    closeNavTag(view) {
      this.$store.dispatch("delVisitedViews", view).then(views => {
        if (this.isActive(view)) {
          if (this.fromName === 'knoDetail') {
            this.$router.push({ name: this.fromName, params: this.paramsToEdit })
          } else {
            this.$router.push({ name: this.fromName });
          }
        }
      });
    },
    // 判断是否为当前页面
    isActive(route) {
      return route.path === this.$route.path;
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          let latestView = null
          views.map(val => {
            if (val.name === 'MY_KONWLEDGE') {
              latestView = val
            }
          })
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/portal/konwledge')
          }
        }
      })
    }
  },
  mounted() {
    this.headers = {
      "X-Token": getToken()
    };
  },
  created() {
    console.log(this.$route.params, 'edit')
    this.api = process.env.BASE_API;
    this.getSpaceList();
    this.getTags();
    if (
      this.$route.params.spaceId ||
      this.$route.params.tempId ||
      this.$route.params.docId
    ) {
      this.msg = this.$route.params;
      this.getDocMsg();
    }
    if (this.$route.params.params) {
      console.log(this.paramsToEdit)
      this.paramsToEdit = this.$route.params.params
      console.log(this.paramsToEdit)
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log(to, from, next)
    next(vm => {
      // 获取跳过来的上一级 页面的name
      vm._data.fromName = from.name
    })
  }
};
</script>
<style>
.editor-toolbar.fullscreen {
  z-index: 1999 !important;
}
.CodeMirror-fullscreen {
  z-index: 1999 !important;
}
</style>
<style lang='scss' scoped>
.add-form {
  font-size: 14px;
  /deep/ .svgsize {
    width: 22px;
    height: 22px;
    margin-top: 7px;
    margin-right: 5px;
    float: left;
  }
  .title {
  }
}
.input-new-tag {
  width: 90px;
  /deep/ .el-input__inner {
    height: 32px;
  }
  /deep/ .el-input {
    top: 2px;
  }
  /* margin-left: 10px; */
}
.tags {
  /* margin-left: 10px; */
  margin-right: 10px;
}
.tagDiv {
  position: relative;
  width: 100%;
  display: inline-block;
  /* border: 1px solid #dcdee2; */
  border-radius: 4px;
  color: #515a6e;
  /* padding: 1px 10px; */
  min-height: 32px;
  margin-bottom: 20px;
}
#adddoc /deep/ #adddoc /deep/ .addtitle1 .el-form-item__label {
  font-size: 14px;
  color: #515a6e;
}
#adddoc /deep/ #adddoc /deep/ .addtitle1 .el-input__inner {
  height: 32px;
}
#adddoc /deep/ .el-card__body {
  padding: 40px 70px;
  padding-bottom: 0;
}
#adddoc /deep/ #adddoc /deep/ .doclab .el-input__inner {
  border: 1px dashed #dcdfe6;
}
#adddoc /deep/ #adddoc /deep/ .doclab .el-form-item__content {
  line-height: 22px;
}
#adddoc /deep/ .doclab .input-new-tag {
  width: 100px;
}
#adddoc /deep/ .el-dialog__header {
  border-bottom: 1px solid #e8eaec;
  padding: 14px 16px;
  line-height: 1;
  font-size: 12px;
  color: #515a6e;
}
#adddoc /deep/ .el-dialog__header span {
  line-height: 20px;
  font-size: 14px;
  color: #17233d;
  font-weight: 700;
}
#adddoc /deep/ .el-dialog__body {
  border-bottom: 1px solid #e8eaec;
  /* padding: 15px 20px; */
}
#adddoc /deep/ .el-form-item {
  /* margin-bottom: 10px; */
}
#adddoc /deep/ .w-e-text-container {
  z-index: 10 !important;
}
#adddoc /deep/ .w-e-menu {
  z-index: 11 !important;
}
</style>

