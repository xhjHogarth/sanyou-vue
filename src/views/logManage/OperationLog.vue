<template>
  <div>
    <el-button class="btnAdd" size="small" type="primary" @click="downloadLog()">下载日志</el-button>
    <el-button class="btnDelete" size="small" type="danger" @click="handleBatchDelete()">批量删除</el-button>

    <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
    <el-input v-model="queryForm.query" placeholder="输入用户名/动作/接口地址" class="inputSearch" 
    @keyup.enter.native="doSearch"></el-input>
    <el-date-picker class="btnSearch" size="small" v-model="queryForm.createtime" align="right" type="date"
      placeholder="选择日期" :picker-options="pickerOptions">
    </el-date-picker>

    <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData"
    style="width: 100%;" :height="tableHeight" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="module" label="模块" show-overflow-tooltip></el-table-column>
      <el-table-column prop="action" label="动作" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ip" label="IP" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createtime" label="时间" show-overflow-tooltip :formatter="dateFormat"></el-table-column>
      <el-table-column prop="url" label="接口地址" show-overflow-tooltip></el-table-column>
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

  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: "operationlog",
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
      queryForm:{
        query:'',
        createtime:'2020-5-5',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
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
        
        this.loadData(currentPage,val);
    },
    //页码变更
    handleCurrentChange: function (val) {
        this.currentPage = val;
        let pageSize = this.pageSize;
        this.loadData(val,pageSize);
    },
    dateFormat:function(row,column){
  　　var date = row[column.property];
      if(date === undefined){
          return ''
        } ;
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },
    //加载日志数据
    loadData: function(page, pageSize){
      let _this = this;
      
      if(page == null || page == NaN)
        page = 1;
      if(pageSize == null || pageSize == NaN)
        pageSize = 10;

      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'POST',
        url:'/userLog/query?page=' + page + '&pageSize=' + pageSize,
        data:this.queryForm
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

    //下载日志
    downloadLog(){
      let createtime = this.queryForm.createtime;
      let nowDate = new Date(createtime);
      const date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
      }
      const newmonth = date.month>=10?date.month:'0'+date.month;
      const day = date.date>=10?date.date:'0'+date.date;
      let newDate = date.year + "/" + newmonth + '/' + day;

      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'GET',
        url: '/userLog/downloadUserLog'
      })
      .then(res=>{
        if(res.data.status == 200){
          window.location.href = "http://60.191.72.227:8081/userLog/download?createtime=" + newDate;
        }else{
          this.$message({
            duration: 2000,
            message: res.data.msg,
            type: 'warning'
          });
        }
      });
    },

    //查询
    doSearch(){
      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      this.loadData(currentPage,pageSize);
    },

    //批量删除
    handleBatchDelete(){
      this.$confirm('此操作将批量删除日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let multipleSelection = this.multipleSelection;
        let deleteList = [];
        const length = multipleSelection.length;
        for(let i = 0;i<length;i++){
          let userLog = {
            id: multipleSelection[i].id,
            deleteMark: 1
          }
          deleteList.push(userLog);
        }
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/userLog/deleteUserLog',
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
          this.loadData(currentPage,pageSize);
        });
      }).catch(() => {
          this.$message({
            type: 'info',
            duration: 2000,
            message: '已取消删除'
          });          
      });
    },
    //删除
    handleDelete(index,row){
      this.$confirm('此操作将删除该日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/userLog/deleteUserLog',
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
          this.loadData(currentPage,pageSize);
        });
          
      }).catch(() => {
        this.$message({
          type: 'info',
          duration: 2000,
          message: '已取消删除'
        });          
      });
    },
  },
  
  created() {
    this.currentUserId = localStorage.getItem('id');

    const nowDate = new Date();
    const date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
    }
    const newmonth = date.month>=10?date.month:'0'+date.month;
    const day = date.date>=10?date.date:'0'+date.date;
    this.queryForm.createtime = date.year + "-" + newmonth + '-' + day;

    let currentPage = this.currentPage;
    let pageSize = this.pageSize;
    this.loadData(currentPage,pageSize);
  }
};
</script>
<style scoped>
  .btnAdd {
    margin: 10px 10px;
    float: left;
  }
  .btnDelete {
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
