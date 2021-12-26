<template>
  <div>
    <el-button class="btnAdd" size="small" type="primary" @click="dialogVisible = true">创建订单</el-button>

    <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
    <el-input v-model="queryForm.query" placeholder="搜索订单编码/名称" class="inputSearch" @keyup.enter.native="doSearch"></el-input>

    <el-select size="small" class="btnSearch" v-model="queryForm.projectId" @change="loadData(1,pageSize)"
    filterable clearable placeholder="请选择项目">
        <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"></el-option>
    </el-select>

    <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" style="width: 100%;margin-bottom: 20px;" :height="tableHeight">
      <el-table-column prop="orderCode" label="订单号" width="200"></el-table-column>
      <el-table-column prop="orderName" label="订单名称" width="250"></el-table-column>
      <el-table-column prop="projectCode" label="项目编码" width="200"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" width="250"></el-table-column>
      <el-table-column prop="ddbSize" label="导电棒尺寸" width="200"></el-table-column>
      <el-table-column prop="yjbSize" label="阴极板尺寸" width="200"></el-table-column>
      <el-table-column prop="createtime" label="创建日期" :formatter="dateFormat" width="200"></el-table-column>
      <el-table-column prop="username" label="创建人" width="200"></el-table-column>
      <el-table-column prop="manage" label="管理" fixed="right" width="250">
        <template slot-scope="scope">
          <el-tooltip content="编辑订单信息" placement="top">
            <el-button size="mini" type="primary" class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="阴极板分配" placement="top">
            <el-button size="mini" type="primary" class="el-icon-set-up" @click="handleProductDistr(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="阴极板查看" placement="top">
            <el-button size="mini" type="primary" class="el-icon-search" @click="handleProductQuery(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除订单" placement="top">
            <el-button size="mini" type="danger" class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Number(totalCount)">
    </el-pagination>

    <el-dialog title="创建订单" :visible.sync="dialogVisible" width="550px" :before-close="handleClose">
      <div style="height:350px;overflow-y:scroll">
        <el-form :model="form" label-width="100px" style="margin-right:50px">
            <el-form-item label="订单名称:">
                <el-input v-model="form.orderName"></el-input>
            </el-form-item>
            <el-form-item label="订单号:">
                <el-input v-model="form.orderCode"></el-input>
            </el-form-item>
            <el-form-item label="所属项目:">
                <el-select
                v-model="form.projectId" filterable placeholder="请选择项目">
                <el-option
                    v-for="item in projectList"
                    :key="item.id"
                    :label="item.projectName"
                    :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="导电棒尺寸:">
                <el-input v-model="form.ddbLength" placeholder="长"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.ddbWidth" placeholder="宽"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.ddbHeight" placeholder="高"></el-input>
            </el-form-item>
            <el-form-item label="阴极板尺寸:">
                <el-input v-model="form.yjbLength" placeholder="长"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.yjbWidth" placeholder="宽"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.yjbHeight" placeholder="高"></el-input>
            </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOrder();">创 建</el-button>
        <el-button @click="handleClose()">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑订单" :visible.sync="dialogVisible2" width="550px" :before-close="handleClose">
      <div style="height:350px;overflow-y:scroll">
        <el-form :model="form" label-width="100px" style="margin-right:50px">
            <el-form-item label="订单名称:">
                <el-input v-model="form.orderName"></el-input>
            </el-form-item>
            <el-form-item label="订单号:">
                <el-input v-model="form.orderCode"></el-input>
            </el-form-item>
            <el-form-item label="所属项目:">
                <el-select
                v-model="form.projectId" filterable placeholder="请选择项目">
                <el-option
                    v-for="item in projectList"
                    :key="item.id"
                    :label="item.projectName"
                    :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="导电棒尺寸:">
                <el-input v-model="form.ddbLength" placeholder="长"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.ddbWidth" placeholder="宽"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.ddbHeight" placeholder="高"></el-input>
            </el-form-item>
            <el-form-item label="阴极板尺寸:">
                <el-input v-model="form.yjbLength" placeholder="长"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.yjbWidth" placeholder="宽"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.yjbHeight" placeholder="高"></el-input>
            </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateOrder();">提 交</el-button>
        <el-button @click="handleClose()">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="阴极板分配" :visible.sync="dialogVisible3" width="550px" :before-close="handleClose">
      <el-form :model="form" label-width="100px" style="margin-right:50px">
        <el-form-item label="订单名称:">
            <el-input v-model="form.orderName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="订单号:">
            <el-input v-model="form.orderCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="起始编码:">
            <el-input v-model="distrProduct.startProductCode"></el-input>
        </el-form-item>
        <el-form-item label="截止编码:">
            <el-input v-model="distrProduct.endProductCode"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="distrProducts();">提 交</el-button>
        <el-button @click="handleClose()">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="阴极板信息" :visible.sync="dialogVisible4" width="40%" :before-close="handleClose">
      <el-table ref="multipleTable" tooltip-effect="dark" :height="350" :data="productlist">
        <el-table-column prop="productCode" label="阴极板编码"></el-table-column>
        <el-table-column prop="productValue" label="垂直度"></el-table-column>
        <el-table-column prop="productState" label="阴极板状态" :formatter="stateFormat"></el-table-column>
        <el-table-column prop="yjbSize" label="阴极板尺寸"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange_product"
        @current-change="handleCurrentChange_product"
        :current-page="currentPage_product"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Number(totalCount_product)">
      </el-pagination>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: "orderlist",
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
      //查询条件
      queryForm: {
        query: "",
        projectId:"",
        orderId:"",
      },
      //新建订单
      dialogVisible:false,
      form:{
          id:"",
          orderName:"",
          orderCode:"",
          projectId:"",
          ddbLength:"",
          ddbWidth:"",
          ddbHeight:"",
          yjbLength:"",
          yjbWidth:"",
          yjbHeight:"",
          userId:""
      },
      //项目列表
      projectList:[],
      //编辑订单
      dialogVisible2:false,
      //阴极板分配
      dialogVisible3:false,
      distrProduct:{
        id:"",
        startProductCode:"",
        endProductCode:""
      },
      //查看阴极板信息
      dialogVisible4:false,
      productlist:[],
      currentPage_product: 1,
      pageSize_product: 10,
      totalCount_product: 0,
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
    handleSizeChange: function (val) {
      this.pageSize = val;
      var currentPage = this.currentPage;
      this.loadData(currentPage,val);
    },
    //页码变更
    handleCurrentChange: function (val) {
      this.currentPage = val;
      var pageSize = this.pageSize;
      this.loadData(val,pageSize);
    },
    //格式化日期
    dateFormat: function (row, column) {
      var date = row[column.property];
      if (date === null) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    //关闭创建项目的dialog，清空数据
    handleClose(){
      this.form = {
        id:"",
        orderName:"",
        orderCode:"",
        projectId:"",
        ddbLength:"",
        ddbWidth:"",
        ddbHeight:"",
        yjbLength:"",
        yjbWidth:"",
        yjbHeight:"",
        userId:this.currentUserId,
      };
      this.dialogVisible=false;
      this.dialogVisible2=false;
      this.dialogVisible3=false;
      this.distrProduct={
        id:"",
        startProductCode:"",
        endProductCode:""
      };
      this.dialogVisible4=false;
      this.productlist=[];
    },
    //获取项目数据
    getProject(){
      this.$axios.get('/project/getAll')
      .then(res => {
        this.projectList = res.data.data;
      });
    },
    //创建订单
    addOrder(){
        var _this = this;
        var order = _this.form;
        if(order.projectId == undefined || order.projectId == ''){
            this.$message({
              type: 'warning',
              duration: 2000,
              message: '请选择项目!'
            });
            return;
        }
        if(order.userId == undefined || order.userId == '')
            order.userId = _this.currentUserId;

        this.$axios({
            headers: {
                userId: this.currentUserId,
            },
            method: "POST",
            url: "/order/addOrder",
            data: order,
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
    //加载数据
    loadData: function(page, pageSize){
        var _this = this;

        var query = _this.queryForm.query;
        var projectId = _this.queryForm.projectId;

        if(page == null || page == NaN)
          page = 1;
        if(pageSize == null || pageSize == NaN)
          pageSize = 10;
        
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'GET',
          url:'/order/query?page=' + page + '&pageSize=' + pageSize + "&query=" + query + "&projectId=" + projectId
        })
        .then(res => {
          if(res.data.status == 200){
            var data = res.data.data;
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
    //编辑订单信息
    handleEdit:function(index, row){
        var _this = this;

        _this.form.id = row.id;
        _this.form.orderName = row.orderName;
        _this.form.orderCode = row.orderCode;
        if(row.projectId != null)
          _this.form.projectId = row.projectId;
        _this.form.ddbLength = row.ddbWidth;
        _this.form.ddbWidth = row.ddbWidth;
        _this.form.ddbHeight = row.ddbHeight;
        _this.form.yjbLength = row.yjbLength;
        _this.form.yjbWidth = row.yjbWidth;
        _this.form.yjbHeight = row.yjbHeight;
        _this.form.userId = _this.currentUserId;
        _this.dialogVisible2 = true;

    },
    updateOrder(){
        var _this = this;

        this.$axios({
            headers: {
                userId: this.currentUserId,
            },
            method: "POST",
            url: "/order/updateOrder",
            data: _this.form,
        }).then((res) => {
            //console.log(res);
            if (res.data.status == 200) {
            this.$message({
                duration: 2000,
                message: "修改成功!",
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
      this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/order/deleteOrder?oid=' + row.id
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
    //阴极板分配
    handleProductDistr:function(index, row){
        var _this = this;

        _this.distrProduct.id = row.id;
        _this.form.orderName = row.orderName;
        _this.form.orderCode = row.orderCode;
        
        _this.dialogVisible3 = true;
    },
    distrProducts(){
        var _this = this;
        _this.$axios({
          headers:{
            userId:_this.currentUserId
          },
          method: 'POST',
          url: '/order/distrProduct',
          data:_this.distrProduct
        })
        .then(res => {
          //console.log(res);
          if(res.data.status == 200){
            this.$message({
              type: 'success',
              duration: 2000,
              message: '分配成功!'
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
    //搜索
    doSearch(){
        let currentPage = this.currentPage;
        let pageSize = this.pageSize;
        this.loadData(currentPage,pageSize);
    },
    //阴极板状态转换
    stateFormat:function(row,column){
        var state = row[column.property];
        if(state == null)
            return "";
        else if(state == 0){
            return "使用中";
        }else if(state == 1){
            return "维修中";
        }else if(state == 2){
            return "备用";
        }else if(state == 3){
            return "报废";
        }else
            return "";
    },
    //查看阴极板信息
    handleProductQuery:function(index, row){
        this.queryForm.orderId = row.id;
        this.loadProductData();
    },
    loadProductData(){
        var _this=this;
        this.$axios({
            headers:{
                userId:this.currentUserId
            },
            method: 'GET',
            url:'/order/getOrderProduct?oid=' + _this.queryForm.orderId + "&page=" + _this.currentPage_product + "&pageSize=" + _this.pageSize_product
        })
        .then(res => {
            if(res.data.status == 200){
                var data = res.data.data;
                _this.productlist = data.rows;
                _this.totalCount_product = data.records;
                this.dialogVisible4=true;
            }else{
                this.$message({
                    type: 'warning',
                    duration: 2000,
                    message: '没有权限查看!'
                });
            }
        });
    },
    //每页显示数据量变更
    handleSizeChange_product: function (val) {
      this.pageSize_product = val;
      var currentPage = this.currentPage_product;
      this.loadProductData(currentPage,val);
    },
    //页码变更
    handleCurrentChange_product: function (val) {
      this.currentPage_product = val;
      var pageSize = this.pageSize_product;
      this.loadProductData(val,pageSize);
    },
  },
  created() {
    this.currentUserId = localStorage.getItem("id");

    this.getProject();

    var currentPage = this.currentPage;
    var pageSize = this.pageSize;
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
