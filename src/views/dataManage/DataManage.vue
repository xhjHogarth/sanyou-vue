<template>
  <div>
    <div style="height:52px">
      <el-button size="small" type="danger" class="btnDelete" icon="el-icon-delete" @click="handleDelete()">删除</el-button>

      <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
      <el-input v-model="queryForm.query" placeholder="" class="inputSearch" @keyup.enter.native="doSearch"></el-input>
      <el-select size="small" class="btnSearch" v-model="queryForm.queryLabel" placeholder="">
        <el-option 
          v-for="item in queryLabelList" 
          :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div style="hegith:20px;margin-bottom:5px">
      <span style="font-size:16px;margin-left:15px;">
        <b>机器编码</b>:  {{dataInfo.lineno}}  
        <b class="fontLabel">产品编码</b>:  {{dataInfo.plateno}}  
        <b class="fontLabel">时间</b>:  {{dataInfo.date}} 
        <b class="fontLabel">MAX</b>:  {{dataInfo.max}} 
        <b class="fontLabel">MAX NO</b>:  {{dataInfo.maxno}}
      </span>
    </div>
    
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :height="tableHeight">
      <el-table-column prop="maxn" label="MAX-N"> </el-table-column>
      <el-table-column prop="max" label="MAX"></el-table-column>
      <el-table-column prop="max1" label="No.1"></el-table-column>
      <el-table-column prop="max2" label="No.2"></el-table-column>
      <el-table-column prop="max3" label="No.3"></el-table-column>
      <el-table-column prop="max4" label="No.4"></el-table-column>
      <el-table-column prop="max5" label="No.5"></el-table-column>
      <el-table-column prop="max6" label="No.6"></el-table-column>
      <el-table-column prop="max7" label="No.7"></el-table-column>
      <el-table-column prop="max8" label="No.8"></el-table-column>
      <el-table-column prop="max9" label="No.9"></el-table-column>
      <el-table-column prop="max10" label="No.10"></el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="26"
      layout="prev, pager, next, jumper"
      :total="Number(totalCount)">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "attachmanage",
  data() {
    return {
      currentUserId:"",
      //查询条件
      queryForm:{
        query:"",
        queryLabel:"plateno"
      },
      queryLabelList:[{
        value:"plateno",
        label:"产品编码"
      },{
        value:"lineno",
        label:"机器编码"
      }],
      //表格数据
      tableData:[],
      dataInfo:{
        lineno:"",
        plateno:"",
        date:"",
        max:"",
        maxno:""
      },
      //表格高度
      tableHeight:500,
      //分页
      currentPage:1,
      totalCount:0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 220;
      window.onresize = () => {
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 220;
      };
    });
  },
  methods: {
    //页码变更
    handleCurrentChange: function (val) {
      this.currentPage = val;
      this.loadData(val);
    },
    //加载数据
    loadData(page){
      let _this = this;
        
      if(page == null || page == NaN)
          page = 1;

      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'POST',
        url:'/industryData/queryData?page=' + page,
        data:{
          lineno:"en02",
          userId:this.currentUserId,
          queryLabel:_this.queryForm.queryLabel,
          query:_this.queryForm.query
        }
      })
      .then(res => {
          if(res.data.status == 200){
            let data = res.data.data;
            _this.tableData = data.list;
            _this.totalCount = data.records;

            _this.dataInfo.lineno = data.lineno;
            _this.dataInfo.plateno = data.plateno;
            _this.dataInfo.date = data.date;
            _this.dataInfo.max = data.max;
            _this.dataInfo.maxno = data.maxno;
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
    doSearch(){
      this.loadData(1);
    },
    //删除
    handleDelete(){
      this.$confirm('此操作将删除检测数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        let deleteForm = {
          datatime:this.dataInfo.date,
          plateno:this.dataInfo.plateno,
          lineno:this.dataInfo.lineno
        };
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/industryData/deleteData',
          data: deleteForm
        })
        .then(res => {
          if(res.data.status == 200){
            this.$message({
              type: 'success',
              duration: 2000,
              message: '删除成功!'
            });
            let currentPage = this.currentPage;
            this.loadData(currentPage);
          }else{
            this.$message({
              duration: 2000,
              message: res.data.msg,
              type: 'warning'
            });
          }
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

    this.loadData(1);
  }
};
</script>
<style scoped>
.btnDelete {
  margin: 10px 10px;
  float: left;
}
.inputSearch {
  float: right;
  width: 200px;
  padding-right: 10px;
  padding-top: 5px;
}
.btnSearch {
  margin: 10px 10px;
  float: right;
}
.fontLabel{
  margin-left: 10px;
}

</style>
