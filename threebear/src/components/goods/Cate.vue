<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡品视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="ShowCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格  使用了tree-table  selection-type是否为展开行  selection-type是否为复选框  show-index是展示索引，index-text是索引标题-->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treeTable"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-circle-close" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level ===0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level ===1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,4,6,9]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框视图 -->
    <el-dialog title="添加分类" :visible.sync="AddCatedialogVisible" width="50%" @close="AddCatedialogClose">
      <!--添加分类的表单 -->
      <el-form
        ref="addCateFormRef"
        :rules="addCateFormRules"
        :model="addCateForm"
        label-width="80px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options用来指定数据源   prop用来指定配置对象-->
          <el-cascader expand-trigger="hover" v-model="selectedKeys" :options="ParentCateList"
           :props="cascaderProps"  @change="ParentCateChanged" clearable change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addlevel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      dialogVisible: false,
      AddCatedialogVisible: false,
      //商品分类的数据列表，默认为空
      catelist: [],
      total: 0,
      //自定义模板列，指定模板的类型是template
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          //表示当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "isok"
        },
        {
          label: "排序",
          //表示当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "order"
        },
        {
          label: "操作",
          //表示当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "opt"
        }
      ],
      //添加分类的表单数据项
      addCateForm: {
        cat_name: "",
        //父级分类的id
        cat_pid: 0,
        //分类的等级，默认要添加的是一级分类
        cat_level: 0
      },
      //添加分类的表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //父级分类的列表
      ParentCateList: [],
      selectedKeys:[],
      //用来指定配置对象的类型
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
     
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("用户请求失败");
      }
      this.catelist = res.data.result;
      //console.log(res.data.result)
      this.total = res.data.total;
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagenum的变化
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getCateList();
    },
    //点击按钮添加分类对话框
    ShowCateDialog() {
      this.getParentCateList();
      this.AddCatedialogVisible = true;
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级失败");
      }
      //console.log(res.data);
      this.ParentCateList = res.data;
    },
     //选择选项发生变化触发这个函数
      ParentCateChanged(){
        //console.log(this.selectedKeys)
        //如果selectedKeys数组中的length大于0 ，证明选中的父级分类
        //反之，就说明没有选中任何父级分类
        if(this.selectedKeys.length >0){
          //让父类分类的id 
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1] 
          //为当前分类的等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length
          //return 为了跳出本次循环
          return
        }else{
          //父级分类的id
          this.addCateForm.cat_pid = 0
          //为当前分类的等级赋值
          this.addCateForm.cat_level = 0
        }
      },
      addlevel(){
        //console.log(this.addCateForm)
        //进行表单验证
        this.$refs.addCateFormRef.validate(async valid=>{
          //如果预校验失败 直接返回
          if(!valid) return
          const {data:res} = await this.$http.post('categories',this.addCateForm)
          if(res.meta.status !==201){
            return thid.$message.error('添加分类失败')
          }
          this.$message.success('添加分类成功')
          this.getCateList()
          this.AddCatedialogVisible = false
        })
      },
      //监听对话框的关闭时间,重置表单数据
      AddCatedialogClose(){
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid =0
      }
  }
};
</script>

<style lang="less" >
.treeTable {
  margin-top: 15px;
}
.el-cascader-panel{      height: 250px;  }
//让input长度为100%
.el-cascader{
  width: 100%;
}
</style>