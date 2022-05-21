<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- 设置表格的索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 用作用域插槽来写 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} 当前这一行的数据-->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="EditDialog(scope.row.id)"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              @click="removeUserById(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--添加用户的对话框  -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" @close="addformClose" width="50%">
      <!-- 内容主体区 -->
      <el-form
        :model="addform"
        :rules="rules"
        ref="ruleForm"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户的对话框  -->
    <el-dialog
      title="修改用户"
      :visible.sync="EditDialogVisible"
      width="50%"
      @close="EditDialogColse()"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <!-- 需要写校验规则的就传递prop -->
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddEditDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色添加对话框 -->
    <el-dialog title="角色分配" :visible.sync="SetRoleDialogVisible" width="50%" @close="SetRoleDialogClosed">
      <p>当前的用户名：{{userInfo.username}}</p>
      <p>当前的角色名：{{userInfo.role_name}}</p>
      <p>
        分配的新角色名：
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName" 
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SaveUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//手机验证
/* let checkmobile=(rule,value,callback)=>{
  let reg = /^1[345789]\d{9}$/
  if(!reg.test(value)){
    callback(new Error('请输入11位手机号'))
  }else{
    callback()
  }
    } */
export default {
  name: "Users",
  data() {
    //手机号验证
    var checkmobile = (rule, value, callback) => {
      const mobileReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (mobileReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };
    //验证邮箱
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z1-9_-])+@([a-zA-Z1-9_-])+(\.[a-zA-Z1-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      EditDialogVisible: false,
      SetRoleDialogVisible: false,
      //查询到的用户对象
      editForm: {},
      //添加用户的表单数据
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户输入的长度在3-10个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户输入的长度在6-15个字符",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入邮箱正确格式",
            required: true,
            trigger: "blur",
            validator: checkEmail
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入电话正确格式",
            trigger: "blur",
            type: "number",
            validator: checkmobile
          }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入邮箱正确格式",
            required: true,
            trigger: "blur",
            validator: checkEmail
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入电话正确格式",
            trigger: "blur",
            type: "number",
            validator: checkmobile
          }
        ]
      },
      userInfo: {},
      //所有角色的数据列表
      rolesList: [],
      selectedRoleId:[]
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //可以获取对象用async和await简化数组对象,从对象身上结构赋值给res
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
      //console.log(res);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //状态改变时发起数据请求，接口数据成功返回
    async userStateChange(userState) {
      //是根据接口文档的格式来改变的
      const { data: res } = await this.$http.put(
        `users/${userState.id}/state/${userState.mg_state}`
      );
      if (res.meta.status !== 200) {
        userState.mg_state = !userState.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      return this.$message.success("更新用户状态成功");
    },
    //关闭的时候清空表单
    addformClose() {
      this.$refs.ruleForm.resetFields();
    },
    //表单提交预校验
    addUser() {
      //验证表单的值是否合法
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addform);
        if (res.meta.status !== 200) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("用户添加成功");
        //隐藏添加用户的对话框
        this.dialogVisible = false;
        //重新获取用户列表
        this.getUserList();
      });
    },
    //修改对话框
    async EditDialog(id) {
      //console.log(id)
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editForm = res.data;
      this.EditDialogVisible = true;
    },
    //修改表单的重置操作
    EditDialogColse() {
      this.$refs.editFormRef.resetFields();
    },
    AddEditDialog() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        //发起修改数据请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改请求失败");
        }
        //关闭对话框
        this.EditDialogVisible = false;
        //刷新数据列表成功
        this.getUserList();
        //提示修改成功
        this.$message.success("修改成功");
      });
    },
    //根据id删除用户的id值 如果对象的值是promise对象可以用async和await优化异步函数
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
          //捕获错误信息
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除");
      }
      //请求删除用户操作
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      //重新发起请求
      this.getUserList();
    },
    //添加角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      //先获取用户角色的列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = res.data;
      this.SetRoleDialogVisible = true;
    },
    //添加角色
    async SaveUserInfo(){
      //如果没有id请求分配添加id
      if(!this.selectedRoleId){
        return this.$message.error('请选择要分配的角色')
      }
      //选中id请求添加
      const{data:res}= await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      if(res.meta.status !==200){
        return this.$message.error('请求分配角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.SetRoleDialogVisible = false
    },
    SetRoleDialogClosed(){
      //将用户id和用户输入置空
      this.selectedRoleId =""
      this.userInfo = {}
    }
  }
};
</script>

<style>
</style>