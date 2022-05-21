<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片三视图区域 -->
    <el-card>
      <el-alert title="注意：只允许为三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类</span>
          <!-- options 用来指定事件源  props用来配置对象 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button @click="adddialogVisible= true" type="primary" :disabled="isBtnDisabled">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 添加一个个展开行,展示数据 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable>{{item}}</el-tag>
                <!-- 添加动态输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 添加一个索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="ShowEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" @click="adddialogVisible= true" :disabled="isBtnDisabled">添加参数</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 添加一个展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable>{{item}}</el-tag>
                <!-- 添加动态输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="ShowEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+textTitle"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 添加验证表单项 -->
      <el-form :model="addForm" :rules="addFormrules" ref="addruleForm" label-width="100px">
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible= false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加编辑对话框 -->
    <el-dialog
      :title="'添加'+textTitle"
      :visible.sync="EditDialogVisible"
      width="50%"
      @close="EditDialogClose"
    >
      <!-- 添加验证表单项 -->
      <el-form
        :model="addEditForm"
        :rules="addEditFormRules"
        ref="addEditruleForm"
        label-width="100px"
      >
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="addEditForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible= false">取 消</el-button>
        <el-button type="primary" @click="EditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      //级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //级联选择器收集到的数据
      selectedCateKeys: [],
      //被激活的页签名称
      activeName: "many",
      //动态参数的数据
      manyTableData: [],
      //静态参数的数据
      onlyTableData: [],
      adddialogVisible: false,
      EditDialogVisible: false,
      addForm: {
        attr_name: ""
      },
      addFormrules: {
        attr_name: [
          {
            required: "true",
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      },
      addEditForm: {
        attr_name: ""
      },
      addEditFormRules: {
        attr_name: [
          {
            required: "true",
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表信息失败");
      }
      this.cateList = res.data;
      // console.log(this.cateList);
    },
    //级联选择框选中项变化，会触发这个函数
    handleChange() {
      this.getParamsData();
    },
    //获取参数的列表数据
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      //否则证明选中的是三级分类
      //console.log(this.selectedCateKeys);
      //跟据所选分类的id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("参数列表获取失败");
      }
      //将获取的数据分割
      //判断是否为空字符串
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : []
        //控制文本的显示与隐藏
        item.inputVisible = false
        //文本框中输入的值
        item.inputValue = ''
      });
      //console.log(res.data);
      //判断并分类
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },

    //tab页签点击事件的处理函数
    handleTabClick() {
      //console.log(this.activeName);
      this.getParamsData();
    },
    //关闭对话框的事件
    addDialogClose() {
      this.$refs.addruleForm.resetFields();
    },
    //表单确定提交数据
    addParams() {
      //先表单的验证
      this.$refs.addruleForm.validate(async valid => {
        if (!valid) return;
        const {
          data: res
        } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        });
        if (res.meta.status !== 201) {
          return this.$message.error("请求失败");
        }
        this.$message.success("添加参数成功");
        this.adddialogVisible = false;
        this.getParamsData();
      });
    },
    //编辑表单点击显示
    async ShowEditDialog(attr_id) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      this.addEditForm = res.data;
      this.EditDialogVisible = true;
    },
    //编辑表单的重置
    EditDialogClose() {
      this.$refs.addEditruleForm.resetFields();
    },
    //点击按钮修改对话框中的内容
    EditParams() {
      //修改之前进行表单的验证  表单的验证要带参数
      this.$refs.addEditruleForm.validate(async valid => {
        if (!valid) return;
        const {
          data: res
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.addEditForm.attr_id}`,
          { attr_name: this.addEditForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取失败");
        }
        /*  this.addEditForm = res.data */
        this.$message.success("修改参数成功");
        this.getParamsData();
        this.EditDialogVisible = false;
      });
    },
    //移除文本框内容
    async removeParams(attr_id) {
      //因为是文本框不用结构赋值
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      //删除执行
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败");
      }
      this.$message.success("删除参数成功");
      this.getParamsData();
    },
    //当点击或回车的时候控制输入框 失去焦点的时候又回到文本编辑状态
    async handleInputConfirm(row){
      if(row.inputValue.trim().length ===0){
        row.inputValue =''
        row.inputVisible = false
        return
      }
      //如果没有return 则证明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      //需要发起请求，保存这次操作
      const {data:res} = await
      this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(",")})
      if(res.meta.status !==200){
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数成功')
    },
    //点击切换显示输入框
    showInput(row){
      row.inputVisible = true;
      //让文本框自动获的焦点
      //nextTick方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    }


  },
  computed: {
    //如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选中的三级分类的的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    //动态计算标题的文本
    textTitle() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 20px 5px;
}
.el-tag {
  margin: 10px;
  right: 20px;
}
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>