<template>
  <div>
    <el-button class="btnAdd" size="small" type="primary" @click="dialogVisible = true">添加角色</el-button>
    <el-button class="btnUpdate" size="small" type="primary" v-show="!show"  @click="show = true;handleBatchUpdate()">批量更新</el-button>
    <el-button class="btnUpdate" size="small" type="success" v-show="show" @click="saveAll()">保存</el-button>
    <el-button class="btnUpdate" size="small" type="info" v-show="show" @click="show = false;cancel()">取消</el-button>
    <el-button class="btnDelete" size="small" type="danger" @click="handleBatchDelete()">批量删除</el-button>
    
    <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
    <el-input v-model="keywords" placeholder="搜索编码/名称/分组" class="inputSearch" 
    @keyup.enter.native="doSearch"></el-input>
    
    <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData"
    style="width: 100%;" :height="tableHeight" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="roleCode" label="角色编码">
        <template slot-scope="scope">
            <el-input placeholder="请输入内容" v-show="show" v-model="scope.row.roleCode"></el-input>
            <span v-show="!show">{{scope.row.roleCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="角色名称">
        <template slot-scope="scope">
            <el-input placeholder="请输入内容" v-show="show" v-model="scope.row.title"></el-input>
            <span v-show="!show">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="分组" show-overflow-tooltip></el-table-column>
      <el-table-column prop="manage" label="管理">
        <template slot-scope="scope">
            <el-button size="mini" type="primary" class="el-icon-lock"
            @click="handleDistr(scope.$index, scope.row)">分配权限</el-button>
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

    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="角色编码">
          <el-input v-model="form.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false;addRole()">提 交</el-button>
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="roleTitle" :visible.sync="dialogVisible2" width="30%">
        <div style="height:350px;overflow-y:scroll">
          <div v-for="(data, index) in resourceData" :key="data.id">
            <el-checkbox :label="data.resCode" @change="checkAllChildren($event,data, index)"
            :indeterminate="indeterminate[index]" v-model="checkedAll[index]">{{data.title}}</el-checkbox>
            <div style="margin: 10px 0;"></div>
            <el-checkbox-group v-model="checkList[index]" @change="selectChildrenCheck($event,index, data)">
              <el-checkbox v-for="item in data.children"
                :key="item.id" :label="item.id">{{ item.title }}</el-checkbox>
            </el-checkbox-group>
            <div style="margin: 10px 0;"></div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible2 = false;assignAuth()">提 交</el-button>
          <el-button @click="dialogVisible2 = false">关 闭</el-button>
        </span>
      
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: 'role',
     data() {
      return {
        currentUserId:"",
        //表格高度
        tableHeight:500,
        //表格数据
        tableData:[],
        //分页
        currentPage:1,
        pageSize: 10,
        totalCount:0,
        //查询条件
        keywords:'',
        //是否显示角色新增表单
        dialogVisible: false,
        //新增角色的表单数据
        form:{
            roleCode:'',
            title:''
        },
        //启用编辑
        show: false,
        beforeUpdate:[],
        updateList:[],
        //分配资源标题
        roleTitle: "",
        dialogVisible2: false,
        //所有的资源
        resourceData:[],
        //选中的资源
        checkList: [],
        //选中图标判断标志
        indeterminate: {},
        checkedAll: {},
        //角色id
        roleId:""
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
      //加载角色数据
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
          url:'/role/query?query='+ query +'&page=' + page + '&pageSize=' + pageSize
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
      //新增角色
      addRole:function() {
        let form = this.form;
        let roleCode = form.roleCode;
        let title = form.title;
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/role/addRole',
          data: {
              roleCode: roleCode,
              title: title
          }
        })
        .then(res => {
            //console.log(res);
          this.form = {
              roleCode:'',
              title:''
          };
          if(res.data.status == 200){
            this.$message({
                duration: 2000,
                message: "新增成功",
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
      //搜索
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
        this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            headers:{
              userId:this.currentUserId
            },
            method: 'POST',
            url: '/role/deleteRoles',
            data: [{
              id: row.id,
              deleteMark: 1
            }]
          })
          .then(res => {
            //console.log(res);
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
          });
            
        }).catch(() => {
          this.$message({
            type: 'info',
            duration: 2000,
            message: '已取消删除'
          });          
        });
      },
      //批量删除
      handleBatchDelete: function() {
        //console.log(this.multipleSelection);
        this.$confirm('此操作将批量删除角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let multipleSelection = this.multipleSelection;
          let deleteList = [];
          const length = multipleSelection.length;
          for(let i = 0;i<length;i++){
            let role = {
              id: multipleSelection[i].id,
              deleteMark: 1
            }
            deleteList.push(role);
          }
          this.$axios({
            headers:{
              userId:this.currentUserId
            },
            method: 'POST',
            url: '/role/deleteRoles',
            data: deleteList
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

        this.$confirm('此操作将批量更新角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for(let i =0;i<presentList.length;i++){
            if(presentList[i].id == originList[i].id){
              let role = {};
              role.id = presentList[i].id;

              if(presentList[i].roleCode == "")
              {
                  this.$message({
                      duration: 2000,
                      message: '角色编码不能为空!',
                      type: 'warning'
                  });
                  return;
              }
              if(presentList[i].title == "")
              {
                  this.$message({
                      duration: 2000,
                      message: '角色名称不能为空!',
                      type: 'warning'
                  });
                  return;
              }

              if(presentList[i].roleCode != originList[i].roleCode){
                role.roleCode = presentList[i].roleCode;
              }
              if(presentList[i].title != originList[i].title){
                role.title = presentList[i].title;
              }
              if((role.roleCode != null && role.roleCode != '' && role.roleCode != NaN) 
              || (role.title != null && role.title != '' && role.title != NaN)){
                updateList.push(role);
              }
            }
          }
          this.$axios({
            headers:{
              userId:this.currentUserId
            },
            method: 'POST',
            url: '/role/updateRoles',
            data: updateList
          })
          .then(res => {
            this.beforeUpdate = [];
            this.updateList = [];
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
            let currentPage = this.currentPage;
            let pageSize = this.pageSize;
            let query = this.keywords;
            this.loadData(query,currentPage,pageSize);
            this.show = false;
          });
        }).catch(() => {
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
      //加载角色拥有的资源
      handleDistr: function(index, row){
        this.roleTitle = "给【" + row.title + "】分配权限";
        this.dialogVisible2 = true;
        let id = row.id;
        this.roleId = id;

        for (let key=0;key<this.resourceData.length;key++) {
          this.$set(this.checkList, key, []);
          this.$set(this.indeterminate, key, false);
          this.$set(this.checkedAll, key, false);
        }

        this.$axios.get('/role/queryAuth?roleId=' + id)
        .then(res => {
          let data = res.data.data;
          let resourceData = this.resourceData;
          if(data != undefined && data.length > 0){
            for(let i=0;i<resourceData.length;i++){
              this.checkList[i] = [];
              let tempList = [];
              for(let j=0;j<data.length;j++){
                for(let k=0;k<resourceData[i].children.length;k++){
                  if(data[j].id == resourceData[i].children[k].id){
                    tempList.push(data[j].id);
                  }
                }
              }
              this.$set(this.checkList, i, tempList);
              if(tempList.length == resourceData[i].children.length){
                this.$set(this.indeterminate, i, false);
                this.$set(this.checkedAll, i, true);
              }else if(tempList.length > 0){
                this.$set(this.indeterminate, i, true);
                this.$set(this.checkedAll, i, false);
              }
              tempList = [];
            }
          }
          
        });
      },
      //获取资源数据
      loadResourceData: function(){
        this.$axios.get('/resource/getAll')
        .then(res => {
          this.resourceData = res.data.data;
          for (let key=0;key<this.resourceData.length;key++) {
            this.$set(this.checkList, key, []);
            this.$set(this.indeterminate, key, false);
            this.$set(this.checkedAll, key, false);
          }
        });
      },
      checkAllChildren: function(value,data, index){
        //console.log(data);
        if (value) {
          let checkList = [];
          for(let i = 0;i<data.children.length;i++){
            checkList.push(data.children[i].id);
          }
          this.checkList[index] = checkList;
        } else {
          this.checkList[index] = [];
        }
        this.indeterminate[index] = false;
        this.checkedAll[index] = value;
      },
      selectChildrenCheck(list, index, data) {
        //console.log(list);
        //console.log(this.checkList);
        //是否全选
        let isCheckedAll = list.length > 0 && list.length < data.children.length;
        //多选框状态
        this.indeterminate[index] = isCheckedAll;
        //二级选中的code
        this.checkList[index] = list;
        //二级全选
        if (list.length == data.children.length) {
          this.checkedAll[index] = true;
        } else {
          this.checkedAll[index] = false;
        }
      },
      //分配资源权限
      assignAuth: function(){
        let roleId = this.roleId;
        let resources = [];
        for(let i=0;i<this.checkList.length;i++){
          for(let j=0;j<this.checkList[i].length;j++){
            resources.push({"id":this.checkList[i][j]});
          }
        }
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/role/assignAuth?roleId=' + roleId,
          data: resources
        })
        .then(res => {
          if(res.data.status == 200){
            this.$message({
              type: 'success',
              duration: 2000,
              message: '保存成功!'
            });
          }else{
            this.$message({
                duration: 2000,
                message: res.data.msg,
                type: 'warning'
            });
          }
          
        });
      },
    },
    created() {
      this.currentUserId = localStorage.getItem('id');

      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      this.loadData("",currentPage,pageSize);
      
      this.loadResourceData();
    }
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
    margin: 10px 10px;
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
