<template>
  <div>
    
    <span class="label">搜索:</span>
    <el-input class="inputSearch" size="small" v-model="keywords" placeholder="请输入设备编号" 
    @keyup.enter.native="doSearch"></el-input>
    <el-button class="btnSearch" size="small" type="primary"  icon="el-icon-search" @click="doSearch()">搜索</el-button>
    
    <el-table ref="multipleTable" tooltip-effect="dark" style="width: 100%;margin-bottom: 20px;"
    :data="tableData" row-key="id" :height="tableHeight" border >
      <el-table-column prop="equipNo" label="设备编号" width="180"></el-table-column>
      <el-table-column prop="username" label="修改人" width="180"></el-table-column>
      <el-table-column prop="content" label="修改记录" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createtime" label="修改时间" width="180" :formatter="dateFormat"></el-table-column>
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
    name: 'paramrecord',
     data() {
      return {
       //表格高度
        tableHeight:500,
        //表格数据
        tableData:[],
        //分页
        currentPage:1,
        pageSize: 10,
        totalCount:0,
        //查询条件
        keywords:"",
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
    methods:{
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
      //加载参数修改记录数据
      loadData: function(query, page, pageSize){
          let _this = this;
          
          if(query == null || query == NaN)
              query = "";
          if(page == null || page == NaN)
              page = 1;
          if(pageSize == null || pageSize == NaN)
              pageSize = 10;

          this.$axios.get('/equipmentRecords/query?query='+ query +'&page=' + page + '&pageSize=' + pageSize)
          .then(res => {
              let data = res.data.data;
              _this.tableData = data.rows;
              _this.totalCount = data.records;
          });
      },
      //搜索
      doSearch(){
        console.log(1);
        let query = this.keywords;
        let currentPage = this.currentPage;
        let pageSize = this.pageSize;
        this.loadData(query,currentPage,pageSize);
      },
      dateFormat:function(row,column){
    　　var date = row[column.property];
        if(date === undefined){
            return ''
          } ;
        return moment(date).format("YYYY-MM-DD HH:mm:ss")
      },
    },

    created(){
      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      this.loadData("",currentPage,pageSize);
    },
  }

</script>
<style scoped>
  
  .label {
    padding-left: 10px;
  }
  .inputSearch {
    width: 250px;
    padding-left: 10px;
    padding-top: 5px;
  }
  .btnSearch {
    margin: 10px 10px;
  }
</style>
