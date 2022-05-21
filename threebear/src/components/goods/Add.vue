<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- 步骤条区域  active指定的动态效果-->
      <el-steps :space="200" :active="activeIndex -0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        ref="ruleFormRef"
        :model="addForm"
        label-width="100px"
        :rules="addFormRules"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="tabPosition"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
                v-model="addForm.goods_cat"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片上传的地址-->
            <el-upload
              action="https://lianghj.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              v-model="addForm.goods_introduce"
              ref="myQuillEditor"
            ></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览窗口 -->
    <el-dialog title="提示" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: 0,
      tabPosition: "left",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        //商品详情介绍
        goods_introduce: "",
        //图片的数组
        pics: [],
        attrs:[]
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输如商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输如商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输如商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输如商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //动态 静态属性数据列表
      manyTableData: [],
      onlyTableData: [],
      fileList: [],
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      previewVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  methods: {
    //获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表数据失败");
      }
      this.cateList = res.data;
      // console.log(this.cateList);
    },
    //级联选择器中的数据项发生变化时，就会触发这个函数
    handleChange() {
      //console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = "";
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    /*   async tabClicked(){

     /*  //证明访问的是动态参数面板
      if(this.activeIndex === '1'){
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
      }
      if(res.meta.status !== 200){
        return this.$message.error('获取动态参数列表失败')
      }
      console.log(res.data)
      //动态参数列表数据
      this.manyTableData = res.data 
      
      if(this.activeIndex === '1'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
      }
      if(res.meta.status !== 200){
        return this.$message.error('获取动态参数列表失败')
      }
      console.log(res.data)
    } */
    async tabClicked() {
      // console.log(this.activeIndex)
      // 证明访问的是动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败！");
        }

        console.log(res.data);
        //foreach遍历将字符串分割成数组
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        });
        this.manyTableData = res.data;

        /*  res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性失败！");
        }

        console.log(res.data);
        this.onlyTableData = res.data;
      } */
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("请求静态数据失败");
        }
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    //处理图片的预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    //处理移除图片上传成功
    handleRemove(file) {
      //1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      //2.从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath);
      //3.调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    //监听图片上传成功的事件
    handleSuccess(response) {
      //console.log(response)
      //1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      //2.将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo);
      //console.log(this.addForm)
    },
    //添加商品
     add(){
      //console.log(this.addForm)
      //添加表单的预验证
      this.$refs.ruleFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('请填写必要的表单项！')
        }
        //执行添加的业务逻辑
        //将数组形式转换为字符串 在data中goods_cat动态绑定到级联选择器的v-model中，且goods_cat数据类型为数组，当想将goods_cat以字符串形式打印出来时，编译器会报错
        const form =  _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        //console.log(form)
        //处理动态参数
        this.manyTableData.forEach(item =>{
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join('')
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTableData.forEach(item =>{
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals,
          }
           this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        //发起添加请求
        const {data:res} = await this.$http.post('goods',form)
        if(res.meta.status !==201){
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')

      })
    }
  }
};
</script>

<style scoped lang="less">
.el-checkbox {
  margin: 0 10px 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>