<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡品视图 -->
    <el-card>
      <!-- 添加角色区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 可以获取该行信息的全部数据 -->
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1 === 0 ? 'bdtop':'']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 ===0?'':'bdtop']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          <!-- <template slot-scope="scope">
            <el-row>
              <el-col>
                <el-tag></el-tag>
              </el-col>
            </el-row>
          </template>-->
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-deit" @click="EditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加用户的对话框  -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
      <!-- 内容主体区 -->
      <el-form :model="addRolesForm" ref="roleForm" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户的对话框  -->
    <el-dialog title="修改用户" :visible.sync="EditDialogVisible" width="50%">
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色介绍" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="SetRightDialogVisible" width="30%" @close="SetRightDialogColsed">
      <!-- 树形控件 -->
      <el-tree :data="rightList" :props="treeProps" ref="treeRef" node-key="id" show-checkbox default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      EditDialogVisible: false,
      dialogVisible: false,
      SetRightDialogVisible: false,
      //查询到的用户对象
      editForm: {},
      //所有权限数据
      rightList: {},
      treeProps:{
        /* 表示展示的是哪个值 */
        label: 'authName',
        /* 表示通过哪个节点嵌套的 */
        children: 'children'
      },
      //默认选中的节点Id值数组
      defKeys:[],
      //当前即将分配权限的roleid
      roleId:"",
      //添加用户的表单数据
      addRolesForm: {
        roleName: "",
        roleDesc: ""
      }
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
      //console.log(this.roleList);
    },
    //修改对话框
    async EditDialog(id) {
      //console.log(id)
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editForm = res.data;
      this.EditDialogVisible = true;
    },
    //修改编辑列表
    /*   editFormInfo() {
      //进行表单验证
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        this.$http
          .put("roles/" + this.editForm.roleId, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          })
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("修改角色失败!");
            }
            this.$message.success("修改角色成功!");
            this.getRoleList();
          });
        this.EditDialogVisible = false;
      });
    }, */
    editFormInfo() {
      //进行表单验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.roleId,
          { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改请求失败");
        }
        //关闭对话框
        this.EditDialogVisible = false;
        this.getRoleList();
        this.$message.success("修改成功");
      });
    },
    //添加角色
    //表单提交预校验
    addUser() {
      //验证表单的值是否合法
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRolesForm);
        if (res.meta.status !== 200) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("用户添加成功");
        //隐藏添加用户的对话框
        this.dialogVisible = false;
        //重新获取用户列表
        this.getRoleList();
      });
    },
    //删除角色通过id
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
        //用catch捕获错误信息
      ).catch(err => err);
      //如果用户确认了删除，则返回值为字符串confirm  结果值为confirm或者是cancel
      if (confirmResult !== "confirm") {
        //如果用户取消了删除，则返回值为字符串cancel
        return this.$message.info("已经取消删除");
      }
      //请求删除用户操作
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      //重新发起请求
      this.getRoleList();
    },
    //删除权限管理图标
    async removeRightById(role, rightId) {
      const confirmRemove = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmRemove !== "confirm") {
        return this.$message.info("取消了");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      /*  this.getRoleList()  不建议用该方法会导致全都渲染 */
      /* 将返回的最新权限赋值给子节点避免每次都要刷新  */
      role.children = res.data;
      this.$message.success("删除成功");
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      //显示对话框的时候保存一份id
      this.roleId=role.id
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("设置权限分配失败");
      }
      //把获取到的权限数据保存到data中
      this.rightList = res.data;
      //console.log(this.rightList);
      //递归获取三级节点的id
      this.getLeafKeys(role,this.defKeys)
      this.SetRightDialogVisible = true;
      //this.$message.success('设置权限成功')
    },
    //通过递归的形式，获取角色下所有三级权限的id,并保存到defkys数组中
    getLeafKeys(node,arr){
      //如果当前node节点不包含children属性 ，则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      //遍历子节点的每一项赋值给叶子节点值
      node.children.forEach(item => this.getLeafKeys(item,arr))
    },
    SetRightDialogColsed(){
      this.defKeys = []
    },
    //点击确定添加新的权限  将全选和半选中数组展开成一个数组返回
    async allotRights(){
      const keys =[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      //console.log(keys)  //用，连接
     const idStr = keys.join(',')
     //console.log(idStr)
     const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
     if(res.meta.status !==200){
       return this.$message.error('分配权限失败')
     }
     this.$message.success('分配权限成功')
     this.getRoleList() 
     this.SetRightDialogVisible= false
    },
    
  }
};
</script>

<style scoped lang='less'>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>