<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 用户头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="FormRules" label-width="0px" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
         <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
 
  data() {
    return {
        //这是登录表单的数据登录对象
        loginForm:{
            username:'admin',
            password:'123456'
        },
        FormRules:{
            username:[
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
            ]
        }
    };
  },
  methods: {
      resetForm(){
         this.$refs.loginFormRef.resetFields();
      },
     /*  login(){
        this.$refs.loginFormRef.validate(valid =>{
         if(!valid){
           this.$message.error('登陆失败')
         }else{
           this.$message.success('登陆成功')
           sessionStorage.setItem('token',JSON.stringify(this.loginForm))
           this.$router.push('/home')
         }
        })
      } */
      login(){
        this.$refs.loginFormRef.validate(async valid =>{
          if(!valid) return;
          const{data:res} = await this.$http.post('login',this.loginForm)
          if(res.meta.status !== 200) return console.log("登陆失败")
          this.$message.success('登陆成功')
           sessionStorage.setItem('token',res.data.token)
           this.$router.push('/home')
        })
      },

  
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-image:url('../assets/3.jpg');
  background-size: 100%;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  opacity: 0.85;
  //圆角边框
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 150px;
  transform: translate(-50%);
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    //输入框超出文本框
    box-sizing: border-box;

}
.avatar_box {
  position: absolute;
  height: 130px;
  width: 130px;
  opacity: 1;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  left: 35%;
  top: -60px;
  //扩散10像素
  box-shadow: 0 0 10px #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgb(148, 223, 148);
  }
}
.btns{
      display: flex;
      justify-content: flex-end;
  }
</style>