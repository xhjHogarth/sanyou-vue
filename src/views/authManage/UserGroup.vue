<template>
  <div>
    <el-button class="btnAdd" size="small" type="primary" @click="dialogVisible = true;">添加用户组</el-button>

    <el-button class="btnSearch" size="mini" type="info" icon="el-icon-info" circle @click="dialogVisible3 = true"></el-button>
    <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
    <el-input v-model="keywords" placeholder="用户组名称" class="inputSearch" 
    @keyup.enter.native="doSearch"></el-input>

    <el-table ref="multipleTable" tooltip-effect="dark" style="width: 100%" :data="tableData"
    :height="tableHeight" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="index" label="编号"></el-table-column>
      <el-table-column prop="groupName" label="名称"></el-table-column>
      <el-table-column prop="typeName" label="类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="levelName" label="级别" show-overflow-tooltip></el-table-column>
      <el-table-column prop="rolesName" label="拥有的角色" show-overflow-tooltip></el-table-column>
      <el-table-column prop="manage" label="管理">
        <template slot-scope="scope">
            <el-button size="mini" type="primary" class="el-icon-lock"
            @click="handleDistr(scope.$index, scope.row)">分配权限</el-button>
            <el-button size="mini" type="primary" class="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" class="el-icon-delete"
            :disabled="scope.row.groupType==1?true:false"
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

    <el-dialog title="添加用户组" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="用户组名称:">
          <el-input v-model="form.groupName"></el-input>
        </el-form-item>
        <el-form-item label="用户组级别:">
          <el-select v-model="form.groupLevel" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false;addUserGroup()">提 交</el-button>
        <el-button @click="dialogVisible = false;cancel()">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="用户组编辑" :visible.sync="dialogVisible2" width="30%">
      <el-form :model="form2" label-width="120px">
        <el-form-item label="用户组名称:">
          <el-input v-model="form2.groupName"></el-input>
        </el-form-item>
        <el-form-item label="用户组级别:">
          <el-select v-model="form2.groupLevel" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible2 = false;editUserGroup()">提 交</el-button>
        <el-button @click="dialogVisible2 = false;">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="帮助信息" :visible.sync="dialogVisible3" width="30%">
      <ol>
        <li v-for="item in items" :key="item.index" style="font-size:15px">
          {{ item }}
          <div style="margin: 5px 0;"></div>
        </li>
      </ol>
    </el-dialog>

    <el-dialog :title="groupTitle" :visible.sync="dialogVisible4" width="30%">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 10px 0;"></div>
      <el-checkbox-group v-model="checkedList" @change="handleCheckedListChange">
        <el-checkbox v-for="item in roleList"
          :key="item.id" :label="item.id">{{ item.title }}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible4 = false;assignRoles()">提 交</el-button>
        <el-button @click="dialogVisible4 = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
 
  export default {
    name: 'usergroup',
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
          groupName:'',
          groupLevel:''
        },
        options: [{
          value: 1,
          label: '管理组'
        }, {
          value: 2,
          label: '会员组'
        }, {
          value: 3,
          label: '合作伙伴'
        }],
        //编辑用户组
        dialogVisible2:false,
        form2:{
          id:"",
          groupType:"",
          groupName:'',
          groupLevel:''
        },
        //帮助信息
        dialogVisible3:false,
        items:[
          '1. 只有“管理组”才有权限进入后台，会员组只能在前台用户中心操作——不管分配了多少权限都是无法进入后台',
          '2. 系统组的用户您不能删除，这在很多地方的默认操作需要用到！',
          '3. 用户组本身不具有任何权限，其所拥有的权限为所分配到的角色权限总和',
          '4. 如果您想给用户组权限，请先到角色管理中给角色分配权限，然后在本页面给用户组分配角色，这样用户组即可继承所分配到的角色的权限'
        ],
        //分配权限
        groupId:"",
        groupTitle:"",
        dialogVisible4:false,
        isIndeterminate:false,
        checkAll:false,
        checkedList:[],
        roleList:[],
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
      //加载用户组数据
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
            url:'/userGroup/query?query='+ query +'&page=' + page + '&pageSize=' + pageSize
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
      //新增用户组
      addUserGroup:function(){
        let form = this.form;
        let groupName = form.groupName;
        let groupLevel = form.groupLevel;
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/userGroup/addGroup',
          data: {
              groupName: groupName,
              groupLevel: groupLevel
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
          
          let query = this.keywords;
          let currentPage = this.currentPage;
          let pageSize = this.pageSize;
          this.loadData(query,currentPage,pageSize);

          this.form.groupName = "";
          this.form.groupLevel = "";
        });
      },
      //搜索
      doSearch:function(){
        let query = this.keywords;
        let currentPage = this.currentPage;
        let pageSize = this.pageSize;
        this.loadData(query,currentPage,pageSize);
      },
      //加载用户组权限
      handleDistr: function(index, row){
        this.groupTitle = "给【" + row.groupName + "】分配角色";
        this.dialogVisible4 = true;
        let id = row.id;
        this.groupId = id;

        this.isIndeterminate = false;
        this.checkAll = false;
        this.checkedList = [];

        this.$axios.get('/userGroup/queryRoles?groupId=' + id)
        .then(res => {
          let data = res.data.data;
          if(res.data.status == 200){
            let tempList = [];
            for(let i=0;i<data.length;i++){
              tempList.push(data[i].id);
            }
            this.checkedList = tempList;
            if(tempList.length == this.roleList.length){
              this.isIndeterminate = false;
              this.checkAll = true;
            }else if(tempList.length > 0){
              this.isIndeterminate = true;
              this.checkAll = false;
            }
          }else{
            this.$message({
              duration: 2000,
              message: '加载用户组权限失败!',
              type: 'warning'
            });
          }
        });
      },
      //编辑
      handleEdit: function(index, row){
        this.form2.groupName = row.groupName;
        this.form2.groupLevel = row.groupLevel;

        this.form2.id = row.id;
        this.form2.groupType = row.groupType;
        this.dialogVisible2 = true;
        
      },
      //修改用户组信息
      editUserGroup(){
        let form = this.form2;
        let groupName = form.groupName;
        let groupLevel = form.groupLevel;
        let id = form.id;
        let groupType = form.groupType;
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/userGroup/updateUserGroup',
          data: {
              id: id,
              groupType:groupType,
              groupName: groupName,
              groupLevel: groupLevel
          }
        })
        .then(res => {
          if(res.data.status == 200){
            this.$message({
                type: 'success',
                duration: 2000,
                message: '修改成功!'
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
      //删除
      handleDelete(index, row) {
        this.$confirm('此操作将删除该用户组, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          this.$axios({
            headers:{
              userId:this.currentUserId
            },
            method: 'POST',
            url: '/userGroup/deleteUserGroup',
            data: {
              id: row.id,
              groupType: row.groupType,
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
          });
        }).catch(() => {
          this.$message({
              type: 'info',
              duration: 2000,
              message: '已取消删除'
          });          
        });
      },
      //取消
      cancel(){
        this.form.groupName = "";
        this.form.groupLevel = "";

        this.form2.groupName = "";
        this.form2.groupLevel = "";
        this.form2.id = "";
        this.form2.groupType = "";
      },
      //获取角色数据
      loadRoleData: function(){
        this.$axios.get('/role/getAll')
        .then(res => {
          this.roleList = res.data.data;
        });
      },
      //全选
      handleCheckAllChange(val){
        if(val){
          let tempList = [];
          for(let i=0;i<this.roleList.length;i++){
            tempList.push(this.roleList[i].id);
            this.checkedList = tempList;
          }
        }else{
          this.checkedList = [];
        }
        this.isIndeterminate = false;
      },
      handleCheckedListChange(value){
        let count = value.length;
        this.checkAll = count == this.roleList.length;
        this.isIndeterminate = count > 0 && count < this.roleList.length;
      },
      //分配用户组角色
      assignRoles(){
        let groupId = this.groupId;
        let roles = [];
        console.log(this.checkedList);
        for(let i=0;i<this.checkedList.length;i++){
          roles.push({"id":this.checkedList[i]});
        }
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/userGroup/assignRoles?groupId=' + groupId,
          data: roles
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
          let currentPage = this.currentPage;
          let pageSize = this.pageSize;
          let query = this.keywords;
          this.loadData(query,currentPage,pageSize);
        });
      },
    },
    created() {
        this.currentUserId = localStorage.getItem('id');

        let currentPage = this.currentPage;
        let pageSize = this.pageSize;
        this.loadData("",currentPage,pageSize);
        
        this.loadRoleData();
    }
  }

</script>
<style scoped>
  
  .inputSearch {
    margin-left: 10px;
  }
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
</style>
