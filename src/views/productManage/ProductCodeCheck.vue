<template>
  <div>
    <el-button class="btnAdd" size="small" type="primary" @click="dialogVisible = true">编码检测</el-button>
    <el-button class="btnAdd" size="small" type="primary" @click="dialogVisible2 = true">新增阴极板</el-button>

    <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" style="width: 100%;margin-bottom: 20px;" :height="tableHeight" >
        <el-table-column prop="productCode" label="阴极板编码" ></el-table-column>
        <el-table-column prop="productValue" label="平面度" ></el-table-column>
        <el-table-column prop="createtime" label="创建时间" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="manage" label="管理">
            <template slot-scope="scope">
                <el-tooltip content="删除阴极板" placement="top">
                    <el-button size="mini" type="danger" class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10,20,30,40]"
        :page-size="10"
        layout="total,sizes,prev,pager,next,jumper"
        :total="Number(totalCount)">
    </el-pagination>

    <el-dialog title="阴极板编码检测" :visible.sync="dialogVisible" width="550px" :before-close="handleClose">
      <el-form :model="product" label-width="100px" style="margin-right:50px">
        <el-form-item label="起始编码:">
            <el-input v-model="product.startProductCode"></el-input>
        </el-form-item>
        <el-form-item label="截止编码:">
            <el-input v-model="product.endProductCode"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkProductCode();">检 测</el-button>
        <el-button @click="handleClose()">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增阴极板" :visible.sync="dialogVisible2" width="550px" :before-close="handleClose">
      <el-form :model="product" label-width="100px" style="margin-right:50px">
        <el-form-item label="阴极板编码:">
            <el-input v-model="product.productCode"></el-input>
        </el-form-item>
        <el-form-item label="平面度:">
            <el-input v-model="product.productValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProduct();">创 建</el-button>
        <el-button @click="handleClose()">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: "productcodecheck",
  data() {
    return {
      //当前登录用户id
      currentUserId: "",
      //表格高度
      tableHeight: 500,
      //表格数据
      tableData: [],
      //分页
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      dialogVisible:false,
      product:{
          startProductCode:'',
          endProductCode:'',
          productCode:'',
          productValue:'',
      },
      dialogVisible2:false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
      };
    });
  },
  methods: {
    //每页显示数据量变更
    handleSizeChange:function(val){
        this.pageSize = val;
        let currentPage = this.currentPage;
        this.loadData(currentPage,val);
    },
    //页码变更
    handleCurrentChange:function(val){
        this.currentPage = val;
        let pageSize = this.pageSize;
        this.loadData(val,pageSize);
    },
    //格式化日期
    dateFormat:function(row,column){
        var date = row[column.property];
        if(date === null){
            return ''
            } ;
        return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },
    //关闭dialog，清空数据
    handleClose(){
      this.product = {
        startProductCode:'',
        endProductCode:'',
      };
      this.dialogVisible=false;
      this.dialogVisible2=false;
    },
    //加载阴极板数据
    loadData: function(page, pageSize){
        let _this = this;
        
        var query = "";
        var state = "";
        var maintainType = "";
        var factoryId = "";
        
        if(page == null || page == NaN)
            page = 1;
        if(pageSize == null || pageSize == NaN)
            pageSize = 10;

        this.$axios({
            headers:{
                userId:this.currentUserId
            },
            method: 'GET',
            url:'/product/query?query='+ query +'&page=' + page + '&pageSize=' + pageSize + '&state=' + state + '&maintainType=' + maintainType + '&factoryId=' + factoryId
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
    //检测编码
    checkProductCode(){
        var _this = this;
        _this.$axios({
            headers:{
                userId:_this.currentUserId
            },
            method: 'POST',
            url: '/product/checkProductCode',
            data:_this.product
        })
        .then(res => {
        //console.log(res);
        if(res.data.status == 200){
            this.$message({
            type: 'success',
            duration: 2000,
            message: '阴极板没有缺失!'
            });
        }else{
            this.$message({
            duration: 2000,
            message: res.data.msg,
            type: 'warning'
            });
        }
        this.handleClose();

        let currentPage = _this.currentPage;
        let pageSize = _this.pageSize;
        _this.loadData(currentPage,pageSize);
        });
    },
    //新增阴极板
    addProduct(){
        var _this = this;
        var product = _this.product;

        this.$axios({
            headers: {
                userId: this.currentUserId,
            },
            method: "POST",
            url: "/product/addProduct",
            data: product,
        }).then((res) => {
            //console.log(res);
            if (res.data.status == 200) {
            this.$message({
                duration: 2000,
                message: "创建成功!",
                type: "success",
            });
            } else {
            this.$message({
                duration: 2000,
                message: res.data.msg,
                type: "warning",
            });
            }
            this.handleClose();
            var currentPage = this.currentPage;
            var pageSize = this.pageSize;
            this.loadData(currentPage,pageSize);
        });
    },
    //删除订单
    handleDelete:function(index, row){
      this.$confirm('此操作将删除该阴极板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/product/deleteProduct',
          data:{
              id:row.id
          }
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

    let currentPage = this.currentPage;
    let pageSize = this.pageSize;
    this.loadData(currentPage,pageSize);
  },
};
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
</style>
