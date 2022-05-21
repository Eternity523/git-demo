/* 进行表单验证 */
editFormInfo(){
    this.$refs.editFormRef.validate(async valid =>{
        if(!valid) return ;
        const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,{
            roleName:this.efitForm.roleName,roleDesc:this.editForm.roleDesc
        })
        if(res.meta.status !==200){
            return this.$message.error('错误请求')
        }
        this.EditDialogVisible=false
        this.getRoleList()
        this.$message.success('修改成功')
    })
}
/*  通过id删除角色 */
 async removeRoleById(id){
     const confirmResult = await this.$confirm(
         "是否永久删除该用户，是否继续？"，
         "提示"，
          {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }//用catch捕获错误信息
     ).catch(err=>err)
     if(confirmResult !=="confirm"){
         return this.$message.info('删除用户信息失败')
     }
    //如果不为confirm就是确认删除用户 请求接口删除用户的操作
  const {data:res} = await this.$http.put('roles/'+id)
  if(res.meta.status !==200){
      return this.$message.error('删除用户失败')
  }
    this.$message.success('删除用户成功') 
    this.getRoleList()
 }