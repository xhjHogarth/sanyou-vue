<template>
  <div>
    <el-button class="btnAdd" size="small" type="primary" @click="dialogVisible = true;">添加厂家</el-button>

    <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
    <el-input v-model="keywords" placeholder="输入厂家名称" class="inputSearch" 
    @keyup.enter.native="doSearch"></el-input>

    
    <el-table ref="multipleTable" tooltip-effect="dark" style="width: 100%;margin-bottom: 20px;"
    :data="tableData" row-key="id" border lazy :load="load" :key="key"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    :height="tableHeight" >
      <el-table-column prop="index" label="编号" width="180"></el-table-column>
      <el-table-column prop="factoryName" label="厂家名"></el-table-column>
      <el-table-column prop="manage" label="管理">
        <template slot-scope="scope">
            <el-button size="mini" type="primary" class="el-icon-lock"
            :disabled="scope.row.layer==2?true:false"
            @click="handleDistr(scope.$index, scope.row)">添加下级</el-button>
            <el-button size="mini" type="primary" class="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" class="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Number(totalCount)">
    </el-pagination>

    
    <el-dialog title="添加厂家" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="厂家名称:">
          <el-input v-model="form.factoryName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false;addFactory()">提 交</el-button>
        <el-button @click="dialogVisible = false;cancel()">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加部门" :visible.sync="dialogVisible2" width="30%">
      <el-form :model="form2" label-width="100px">
        <el-form-item label="部门名称:">
          <el-input v-model="form2.factoryName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible2 = false;addSubFactory()">提 交</el-button>
        <el-button @click="dialogVisible2 = false;cancel()">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="form3.title" :visible.sync="dialogVisible3" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item :label="form3.label">
          <el-input v-model="form3.factoryName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible3 = false;updateFactory()">提 交</el-button>
        <el-button @click="dialogVisible3 = false;cancel()">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "factory",
  data() {
    return {
      currentUserId:"",
      //表格高度
      tableHeight:500,
      //表格数据
      tableData:[],
      key:0,
      //分页
      currentPage:1,
      pageSize: 10,
      totalCount:0,
      //查询条件
      keywords:'',

      //添加厂家
      dialogVisible:false,
      form:{
        factoryName:""
      },
      //添加下级
      dialogVisible2:false,
      form2:{
        factoryName:"",
        parentId:""
      },
      //编辑
      dialogVisible3:false,
      form3:{
        id:"",
        factoryName:"",
        title:"",
        label:"",
      },
    };
  },
  methods: {
    //添加厂家
    addFactory(){
      this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/factory/addFactory',
          data: {
            factoryName: this.form.factoryName,
            layer: 1
          }
      })
      .then(res => {
        if(res.data.status == 200){
          this.$message({
              duration: 2000,
              message: '添加成功!',
              type: 'success'
          });
        }else{
          this.$message({
            type: 'warning',
            duration: 2000,
            message: res.data.msg
          });
        }
        let pageSize = this.pageSize;
        let currentPage = this.currentPage;
        let query = this.keywords;
        this.loadData(query,currentPage,pageSize);
        this.form.factoryName="";
      });
    },
    //取消
    cancel(){
      this.form.factoryName="";

      this.form2.factoryName="";
      this.form2.parentId="";
    },
    //每页显示数据量变更
    handleSizeChange: function (val) {
        this.pageSize = val;
        let currentPage = this.currentPage;
        let query = this.keywords;
        if(query == null || query == NaN)
            query = "";
        this.loadData(query,currentPage,val);
    },
    //页码变更
    handleCurrentChange: function (val) {
        this.currentPage = val;
        let pageSize = this.pageSize;
        this.loadData("",val,pageSize);
    },
    //加载厂家数据
    loadData: function(query, page, pageSize){
        let _this = this;
        
        if(query == null || query == NaN)
            query = "";
        if(page == null || page == NaN)
            page = 1;
        if(pageSize == null || pageSize == NaN)
            pageSize = 10;

        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'GET',
          url:'/factory/query?query='+ query +'&page=' + page + '&pageSize=' + pageSize
        })
        .then(res => {
            if(res.data.status == 200){
              let data = res.data.data;
              _this.tableData = data.rows;
              _this.totalCount = data.records;
            }else{
              this.$message({
                type: 'warning',
                duration: 2000,
                message: '没有权限查看!'
              });
            }
        });
    },
    //加载下级公司或部门
    load(tree, treeNode, resolve) {
      let parentId = tree.id;
      let subList = [];

      this.$axios.get('/factory/querySubFactory?parentId=' + parentId)
      .then(res => {
        if(res.data.status == 200){
          subList = res.data.data;
        }
      });

      setTimeout(() => {
        resolve(subList);
      }, 1000)
    },
    //添加下级
    handleDistr(index,row){
      this.dialogVisible2 = true;
      this.form2.parentId = row.id;
    },
    addSubFactory(){
      this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/factory/addSubFactory',
          data: {
            factoryName: this.form2.factoryName,
            layer: 2,
            parentId:this.form2.parentId
          }
      })
      .then(res => {
        if(res.data.status == 200){
          this.$message({
            duration: 2000,
            message: '添加成功!',
            type: 'success'
          });
        }else{
          this.$message({
            type: 'warning',
            duration: 2000,
            message: res.data.msg
          });
        }
        
        let pageSize = this.pageSize;
        let currentPage = this.currentPage;
        let query = this.keywords;
        this.loadData(query,currentPage,pageSize);
        this.form2.factoryName="";
        this.form2.parentId="";
        this.key++;
      });
    },
    //编辑
    handleEdit(index,row){
      this.dialogVisible3 = true;
      this.form3.id = row.id;
      let layer = row.layer;
      if(layer == 1){
        this.form3.title = "厂家编辑";
        this.form3.label = "厂家名称:";
      }else if(layer == 2){
        this.form3.title = "部门编辑";
        this.form3.label = "部门名称:";
      }
      this.form3.factoryName = row.factoryName;
    },
    updateFactory(){
      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'POST',
        url: '/factory/updateFactoryInfo',
        data: {
          id:this.form3.id,
          factoryName: this.form3.factoryName
        }
      }).then(res => {
        console.log(res);
        if(res.data.status == 200){
          this.$message({
            duration: 2000,
            message: '修改成功!',
            type: 'success'
          });
          
        }else{
          this.$message({
            type: 'warning',
            duration: 2000,
            message: res.data.msg
          });
        }
        let pageSize = this.pageSize;
        let currentPage = this.currentPage;
        let query = this.keywords;
        this.loadData(query,currentPage,pageSize);
        this.key++;
      });

    },
    //删除
    handleDelete(index,row){
      this.$confirm('此操作将删除该厂家, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          this.$axios({
            headers:{
              userId:this.currentUserId
            },
            method: 'POST',
            url: '/factory/deleteFactory',
            data: {
                id: row.id,
                layer: row.layer,
                deleteMark: 1
            }
          })
          .then(res => {
            if(res.data.status == 200){
              this.$message({
                  type: 'success',
                  duration: 2000,
                  message: '删除成功!'
              });
              
            }else{
              this.$message({
                  duration: 2000,
                  message: res.data.msg,
                  type: 'warning'
              });
            }
            let currentPage = this.currentPage;
            let pageSize = this.pageSize;
            let query = this.keywords;
            this.loadData(query,currentPage,pageSize);
            this.key++;
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          duration: 2000,
          message: '已取消删除'
        });          
      });
    },
    //搜索
    doSearch(){
      let query = this.keywords;
      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      this.loadData(query,currentPage,pageSize);
    }

  },
  mounted(){
    this.$nextTick(() => {
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
        window.onresize = () => {
            this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
        };
    });
  },
  created() {
    this.currentUserId = localStorage.getItem('id');

    let currentPage = this.currentPage;
    let pageSize = this.pageSize;
    this.loadData("",currentPage,pageSize);
  }
};
</script>

<style scoped>

  .btnAdd {
    margin: 10px 10px;
    float: left;
  }
  .btnSearch {
    margin: 10px 10px;
    float: right;
  }
  .inputSearch {
    float: right;
    width: 250px;
    padding-right: 10px;
    padding-top: 5px;
  }
</style>