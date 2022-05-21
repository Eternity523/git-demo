<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20"> 
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- table表格区域 -->
    <el-table :data="goodsList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" width="60px" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" width="100px" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间" width="200px" prop="add_time">
        <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="medium"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="removeById(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 6, 8, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
        queryInfo:{
            query:'',
            pagenum:1,
            pagesize:10
        },
        goodsList:[],
        total:0
    };
  },
  created() {
      this.getGoodsList()
  },
  methods: {
    //根据分页数据对应的
    async getGoodsList(){
       const {data:res}=await this.$http.get('goods',{params:this.queryInfo})
       if(res.meta.status !== 200){
          return this.$message.error('商品获取列表失败')
       }
       this.$message.success('商品获取列表成功')
        console.log(res.data)
       this.goodsList = res.data.goods
       this.total = res.data.total
      
    },
    //当页码发生改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      //重新获取列表
      this.getGoodsList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    //删除功能
    async removeById(id){
      //增加一个提示框 返回的是promise对象 
      const confirmResult= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)//捕获错误消息
      if(confirmResult !== 'confirm'){
        return this.$message.info('已取消删除')
      }
      const {data:res} = await this.$http.delete(`goods/${id}`)
      if(res.meta.status !==200){
        return this.$message.error('删除请求失败')
      }
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    //添加跳转到相应的界面
    goAddpage(){
      this.$router.push('/goods/add')
    }
  }
};
</script>

<style scope lang="less">
</style>