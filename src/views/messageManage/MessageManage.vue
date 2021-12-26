<template>
  <div>
      
    <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData"
        style="width: 100%;margin-bottom: 20px;" :height="tableHeight">
        <el-table-column prop="index" label="编号" width="180"></el-table-column>
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="description" label="内容" width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="username" label="反馈人" width="180"></el-table-column>
        <el-table-column prop="createtime" label="反馈时间" width="200" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="url" label="图片" width="180">
            <template slot-scope="scope">
                <el-image 
                style="width: 180px; height: 180px"
                :src="'http://60.191.72.227:8081/images/' + scope.row.url"  
                :preview-src-list="['http://60.191.72.227:8081/images/' + scope.row.url]" />
            </template>
        </el-table-column>
        <el-table-column prop="isHandled" label="是否处理" width="180" :formatter="isHandledFormat"></el-table-column>
        <el-table-column prop="handleUserName" label="处理人" width="180" :formatter="handleUsernameFormat"></el-table-column>
        <el-table-column prop="handleTime" label="处理时间" width="200" :formatter="handleDateFormat"></el-table-column>
        <el-table-column prop="manage" label="操作"  width="180" fixed="right">
            <template slot-scope="scope">
                <el-tooltip content="处理" placement="top">
                    <el-button size="mini" type="primary" class="el-icon-edit" :disabled="scope.row.isHandled==1"
                    @click="handleMessage(scope.$index, scope.row)"></el-button>
                </el-tooltip>
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
  name: "messagelist",
  data() {
    return {
        //用户id
        currentUserId:"",
        //列表数据
        tableData:[],
        //表格高度
        tableHeight:500,
        //分页条件
        currentPage:1,
        pageSize: 10,
        totalCount:0,
    };
  },

  methods: {
    //每页显示数据量变更
    handleSizeChange: function (val) {
        this.pageSize = val;
        var currentPage = this.currentPage;
        this.loadData(currentPage,val);
    },
    //页码变更
    handleCurrentChange: function (val) {
        this.currentPage = val;
        var pageSize = this.pageSize;
        this.loadData(val,pageSize);
    },
    //格式化日期
    dateFormat:function(row,column){
    　　var date = row[column.property];
        if(date === null){
            return ''
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },
    //处理状态判断
    isHandledFormat:function(row,column){
        var isHandled = row[column.property];
        if(isHandled == null || isHandled == 0)
            return "未处理";
        if(isHandled == 1)
            return "已处理";
        return "未处理";
    },
    //处理用户名是否显示
    handleUsernameFormat:function(row,column){
        var username = row[column.property];
        if(row.isHandled == null || row.isHandled == 0){
            return ''
        }
        return username;
    },
    //处理日期格式化
    handleDateFormat:function(row,column){
        var date = row[column.property];
        if(date === null || row.isHandled == null || row.isHandled == 0){
            return ''
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },
    //加载数据
    loadData: function(page, pageSize){
        let _this = this;
        
        var userId = _this.currentUserId;
        if(page == null || page == NaN)
            page = 1;
        if(pageSize == null || pageSize == NaN)
            pageSize = 10;

        this.$axios({
            method: 'GET',
            url:'/app/question/query?page=' + page + '&pageSize=' + pageSize
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
    //处理消息
    handleMessage(index, row){
        var _this = this;
        this.$confirm('是否已经处理该问题?', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning'
        }).then(() => {
            this.$axios({
                method: 'POST',
                url: '/app/question/handleMessage',
                data: {
                    id: row.id,
                    handleUserId:_this.currentUserId,
                }
            })
            .then(res => {
                if(res.data.status == 200){
                    this.$message({
                        type: 'success',
                        duration: 2000,
                        message: '处理成功!'
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
                message: '已取消处理'
            });          
        });
    },
    
  },

  created(){
    this.currentUserId = localStorage.getItem('id');

    let currentPage = this.currentPage;
    let pageSize = this.pageSize;
    this.loadData(currentPage,pageSize);
  },
  mounted(){
    this.$nextTick(() => {
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
        window.onresize = () => {
            this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
        };
    });
  },
};
</script>
<style scoped>
  
</style>
