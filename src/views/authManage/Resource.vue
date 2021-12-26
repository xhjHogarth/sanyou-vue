<template>
  <div>
    <el-button class="btnAdd" size="small" type="primary" @click="dialogVisible = true">添加权限</el-button>
    <el-button class="btnUpdate" size="small" type="primary" v-show="!show"  @click="show = true;handleBatchUpdate()">批量更新</el-button>
    <el-button class="btnUpdate" size="small" type="success" v-show="show" @click="saveAll()">保存</el-button>
    <el-button class="btnUpdate" size="small" type="info" v-show="show" @click="show = false;cancel()">取消</el-button>
    <el-button class="btnDelete" size="small" type="danger" @click="handleBatchDelete()">批量删除</el-button>

    <el-button class="btnSearch" size="small" type="primary" @click="doSearch" icon="el-icon-search">搜索</el-button>
    <el-input v-model="keywords" placeholder="搜索编码/名称/分组" class="inputSearch" 
    @keyup.enter.native="doSearch"></el-input>

    <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData"
      style="width: 100%" :height="tableHeight"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" ></el-table-column>
      <el-table-column prop="resCode" label="资源编码" >
        <template slot-scope="scope">
        <el-input placeholder="请输入内容" v-show="show" v-model="scope.row.resCode"></el-input>
        <span v-show="!show">{{scope.row.resCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="资源名称" >
        <template slot-scope="scope">
        <el-input placeholder="请输入内容" v-show="show" v-model="scope.row.title"></el-input>
        <span v-show="!show">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parentCode" label="父编码" ></el-table-column>
      <el-table-column prop="url" label="接口地址" ></el-table-column>
      <el-table-column prop="manage" label="管理">
        <template slot-scope="scope">
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

    <el-dialog title="添加资源" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="资源编码">
          <el-input v-model="form.resCode"></el-input>
        </el-form-item>
        <el-form-item label="资源名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="父编码">
          <el-input v-model="form.parentCode"></el-input>
        </el-form-item>
        <el-form-item label="接口地址">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false;addResource()">提 交</el-button>
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
 
export default {
    name: 'resource',
    data() {
      return {
        currentUserId:"",
        currentPage:1,
        pageSize: 10,
        totalCount:0,
        tableData:[],
        keywords:"",
        dialogVisible:false,
        form:{
            resCode:'',
            title:'',
            parentCode:'',
            url:""
        },
        multipleSelection: [],
        tableHeight:500,
        //启用编辑
        show: false,
        beforeUpdate:[],
        updateList:[],
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
        window.onresize = () => {
            this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
        };
      });
    },
    methods: {
      handleSelectionChange(val){
          this.multipleSelection = val;
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
      //加载资源数据
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
          url:'/resource/query?query='+ query +'&page=' + page + '&pageSize=' + pageSize
        })
        .then(res => {
          //console.log(res);
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
      //查询
      doSearch: function() {
        if(this.keywords == ""){
          this.loadData("",1,10);
        }else{
          let currentPage = this.currentPage;
          let pageSize = this.pageSize;
          let query = this.keywords;
          this.loadData(query,currentPage,pageSize);
        }
      },
      //删除
      handleDelete(index, row) {
        //console.log(index, row);
        this.$confirm('此操作将删除该资源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            headers:{
              userId:this.currentUserId
            },
            method: 'POST',
            url: '/resource/deleteResources',
            data: [{
              id: row.id,
              deleteMark: 1
            }]
          })
          .then(res => {
            //console.log(res);
            if(res.data.status == 200){
              this.$message({
                duration: 2000,
                message: '删除成功!',
                type: 'success'
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
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            duration: 2000,
            message: '已取消删除'
          });          
        });
      },
      //添加资源
      addResource: function() {
        let form = this.form;
        let resCode = form.resCode;
        let title = form.title;
        let parentCode = form.parentCode;
        let url = form.url;
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/resource/addResource?parentCode=' + parentCode,
          data: {
            resCode: resCode,
            title: title,
            url:url
          }
        })
        .then(res => {
          this.form = {
            resCode:'',
            title:'',
            parentCode:'',
            url:""
          };

          if(res.data.status == 200){
            this.$message({
                duration: 2000,
                message: "添加成功!",
                type: 'success'
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
        });
      },
      //批量删除
      handleBatchDelete: function() {
        //console.log(this.multipleSelection);
        this.$confirm('此操作将删除该资源, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          let multipleSelection = this.multipleSelection;
          let deleteList = [];
          const length = multipleSelection.length;
          for(let i = 0;i<length;i++){
            let resource = {
              id: multipleSelection[i].id,
              deleteMark: 1
            }
            deleteList.push(resource);
          }
          this.$axios({
            headers:{
              userId:this.currentUserId
            },
            method: 'POST',
            url: '/resource/deleteResources',
            data: deleteList
          })
          .then(res => {
            //console.log(res);
            if(res.data.status == 200){
              this.$message({
                duration: 2000,
                message: "删除成功!",
                type: 'success'
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
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            duration: 2000,
            message: '已取消删除'
          });          
        });
      },
      //批量修改
      handleBatchUpdate:function() {
          this.beforeUpdate = JSON.parse(JSON.stringify(this.tableData));
      },
      //保存
      saveAll:function() {
        let originList = this.beforeUpdate;
        let presentList = this.tableData;
        let updateList = this.updateList;

        this.$confirm('此操作将批量更新资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
        for(let i =0;i<presentList.length;i++){
          if(presentList[i].id == originList[i].id){
            let resource = {};
            resource.id = presentList[i].id;
            
            if(presentList[i].resCode == ""){
                this.$message({
                  duration: 2000,
                  message: '资源编码不能为空!',
                  type: 'warning'
                });
                return;
            }
            if(presentList[i].title == ""){
              this.$message({
                duration: 2000,
                message: '资源名称不能为空!',
                type: 'warning'
              });
              return;
            }

            if(presentList[i].resCode != originList[i].resCode){
                resource.resCode = presentList[i].resCode;
            }
            if(presentList[i].title != originList[i].title){
                resource.title = presentList[i].title;
            }
            if((resource.resCode != null && resource.resCode != '' && resource.resCode != NaN) 
            || (resource.title != null && resource.title != '' && resource.title != NaN)){
                updateList.push(resource);
            }
          }
        }
        this.$axios({
            headers:{
              userId:this.currentUserId
            },
            method: 'POST',
            url: '/resource/updateResources',
            data: updateList
        })
        .then(res => {
          if(res.data.status == 200){
            this.$message({
                type: 'success',
                duration: 2000,
                message: '更新成功!'
            });
          }else{
            this.$message({
                duration: 2000,
                message: res.data.msg,
                type: 'warning'
            });
          }
          this.beforeUpdate = [];
          this.updateList = [];
          let currentPage = this.currentPage;
          let pageSize = this.pageSize;
          let query = this.keywords;
          this.loadData(query,currentPage,pageSize);
          this.show = false;});
        })
        .catch(() => {
          this.beforeUpdate = [];
          this.updateList = [];
          this.$message({
              type: 'info',
              duration: 2000,
              message: '已取消更新'
          });
        });
      },
      //取消批量修改
      cancel: function() {
          let currentPage = this.currentPage;
          let pageSize = this.pageSize;
          let query = this.keywords;
          this.beforeUpdate = [];
          this.loadData(query,currentPage,pageSize);
      },
    },
    created() {
      this.currentUserId = localStorage.getItem('id');

      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      this.loadData("",currentPage,pageSize);
    },
}

</script>
<style scoped>
  
  .inputSearch {
    float: right;
    width: 250px;
    padding-right: 10px;
    padding-top: 5px;
  }
  .btnSearch {
    margin: 10px 20px;
    float: right;
  }
  .btnAdd {
    margin: 10px 10px;
    float: left;
  }
  .btnDelete {
    margin: 10px 10px;
    float: left;
  }
  .btnUpdate {
    margin: 10px 10px;
    float: left;
  }
</style>
