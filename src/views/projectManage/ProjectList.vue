<template>
  <div>
    <el-button class="btnAdd" size="small" type="primary" @click="dialogVisible = true">创建项目</el-button>

    <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
    <el-input v-model="queryForm.query" placeholder="搜索项目编码/名称" class="inputSearch" @keyup.enter.native="doSearch"></el-input>

    <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" style="width: 100%;margin-bottom: 20px;" :height="tableHeight">
      <el-table-column prop="projectCode" label="项目编码" width="200"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" width="250"></el-table-column>
      <el-table-column prop="ddbSize" label="导电棒尺寸" width="200"></el-table-column>
      <el-table-column prop="yjbSize" label="阴极板尺寸" width="200"></el-table-column>
      <el-table-column prop="factoryName" label="项目厂家" width="250"></el-table-column>
      <el-table-column prop="createtime" label="创建日期" :formatter="dateFormat" width="250"></el-table-column>
      <el-table-column prop="username" label="创建人" width="200"></el-table-column>
      <el-table-column prop="manage" label="管理" fixed="right" width="250">
        <template slot-scope="scope">
          <el-tooltip content="编辑项目信息" placement="top">
            <el-button size="mini" type="primary" class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="订单查看" placement="top">
            <el-button size="mini" type="primary" class="el-icon-search" @click="handleOrderList(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="下载项目图纸" placement="top">
            <el-button size="mini" type="primary" class="el-icon-download" :disabled="scope.row.hasFile!=1"
            @click="handleDownload(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除项目" placement="top">
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

    <el-dialog title="创建项目" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div style="height:350px;overflow-y:scroll">
        <el-form :model="form" label-width="120px">
          <el-form-item label="项目名称">
            <el-input v-model="form.projectName"></el-input>
          </el-form-item>
          <el-form-item label="项目编码">
            <el-input v-model="form.projectCode"></el-input>
          </el-form-item>
          <el-form-item label="所在厂家:">
            <el-select
              v-model="form.factoryId" filterable placeholder="请选择厂家">
              <el-option
                v-for="item in factoryList"
                :key="item.id"
                :label="item.factoryName"
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
          <el-form-item label="项目图纸:">
            <el-upload
              class="upload-demo"
              ref="upload"
              :limit="1"
              action="http://127.0.0.1:8081/project/addProject2"
              :on-exceed="handleFileOneExceed"
              :on-change="handleChange"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选择图纸</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProject();">提 交</el-button>
        <el-button @click="handleClose()">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑项目" :visible.sync="dialogVisible2" width="30%">
      <div style="height:350px;overflow-y:scroll">
        <el-form :model="form2" label-width="120px">
          <el-form-item label="项目名称">
            <el-input v-model="form2.projectName"></el-input>
          </el-form-item>
          <el-form-item label="项目编码">
            <el-input v-model="form2.projectCode"></el-input>
          </el-form-item>
          <el-form-item label="所在厂家:">
            <el-select
              v-model="form2.factoryId" filterable placeholder="请选择厂家">
              <el-option
                v-for="item in factoryList"
                :key="item.id"
                :label="item.factoryName"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="导电棒尺寸:">
              <el-input v-model="form2.ddbLength" placeholder="长"></el-input>
          </el-form-item>
          <el-form-item>
              <el-input v-model="form2.ddbWidth" placeholder="宽"></el-input>
          </el-form-item>
          <el-form-item>
              <el-input v-model="form2.ddbHeight" placeholder="高"></el-input>
          </el-form-item>
          <el-form-item label="阴极板尺寸:">
              <el-input v-model="form2.yjbLength" placeholder="长"></el-input>
          </el-form-item>
          <el-form-item>
              <el-input v-model="form2.yjbWidth" placeholder="宽"></el-input>
          </el-form-item>
          <el-form-item>
              <el-input v-model="form2.yjbHeight" placeholder="高"></el-input>
          </el-form-item>
          <el-form-item label="项目图纸:">
            <el-upload
              class="upload-demo"
              ref="upload2"
              :limit="1"
              action="http://127.0.0.1:8081/project/addProject2"
              :on-exceed="handleFileOneExceed"
              :on-change="handleChange"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选择图纸</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateProject();">提 交</el-button>
        <el-button @click="dialogVisible2=false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="订单信息" :visible.sync="dialogVisible3" width="45%">
      <el-table ref="multipleTable" tooltip-effect="dark" :data="orderData">
        <el-table-column prop="orderCode" label="订单编码" width="180"></el-table-column>
        <el-table-column prop="orderName" label="订单名称" width="200"></el-table-column>
        <el-table-column prop="projectCode" label="项目编码" width="180"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" width="200"></el-table-column>
        <el-table-column prop="ddbSize" label="导电棒尺寸" width="180"></el-table-column>
        <el-table-column prop="yjbSize" label="阴极板尺寸" width="180"></el-table-column>
        <el-table-column prop="createtime" label="创建日期" :formatter="dateFormat" width="180"></el-table-column>
        <el-table-column prop="username" label="创建人" width="180"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: "projectlist",
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
      },
      //是否显示项目新增表单
      dialogVisible: false,
      //新增表单数据
      form: {
        projectName: "",
        projectCode: "",
        factoryId: "",
        userId: "",
        ddbLength:"",
        ddbWidth:"",
        ddbHeight:"",
        yjbLength:"",
        yjbWidth:"",
        yjbHeight:"",
      },
      fileList:[],
      //厂家列表
      factoryList: [],
      //修改项目信息
      dialogVisible2:false,
      form2: {
        id:"",
        projectName: "",
        projectCode: "",
        factoryId: "",
        userId: "",
        ddbLength:"",
        ddbWidth:"",
        ddbHeight:"",
        yjbLength:"",
        yjbWidth:"",
        yjbHeight:"",
      },
      //项目订单查看
      dialogVisible3:false,
      orderData:[],
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
        projectName: "",
        projectCode: "",
        factoryId: "",
        userId: this.currentUserId,
        ddbLength:"",
        ddbWidth:"",
        ddbHeight:"",
        yjbLength:"",
        yjbWidth:"",
        yjbHeight:"",
      };
      this.fileList=[];
      this.dialogVisible=false;
    },
    //处理文件上传个数超过限制
    handleFileOneExceed(file,fileList){
      // console.log(file);
      // console.log(fileList);
      this.$message({
        duration: 2000,
        message: "最多上传一张图纸!",
        type: "warning",
      });
    },
    //文件改变
    handleChange(file, fileList){
      this.fileList=[];
      if(fileList.length>0)
        this.fileList.push(fileList[0].raw);
    },
    //创建项目
    addProject() {
      var project = this.form;
      project.userId = this.currentUserId;

      var formData = new FormData();
      formData.append("projectName",project.projectName);
      formData.append("projectCode",project.projectCode);
      formData.append("factoryId",project.factoryId);
      formData.append("userId",project.userId);
      formData.append("ddbLength",project.ddbLength);
      formData.append("ddbWidth",project.ddbWidth);
      formData.append("ddbHeight",project.ddbHeight);
      formData.append("yjbLength",project.yjbLength);
      formData.append("yjbWidth",project.yjbWidth);
      formData.append("yjbHeight",project.yjbHeight);
      if(this.fileList.length>0){
        formData.append("file",this.fileList[0]);
      }

      this.$axios({
        headers: {
          userId: this.currentUserId,
        },
        method: "POST",
        url: "/project/addProject",
        data: formData,
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
        this.$refs['upload'].clearFiles();
        var currentPage = this.currentPage;
        var pageSize = this.pageSize;
        this.loadData(currentPage,pageSize);
      });
    },
    //获取厂家数据
    getFactory(){
      this.$axios.get('/factory/getAll')
      .then(res => {
        this.factoryList = res.data.data;
      });
    },
    //加载数据
    loadData: function(page, pageSize){
        var _this = this;

        var query = _this.queryForm.query;

        if(page == null || page == NaN)
          page = 1;
        if(pageSize == null || pageSize == NaN)
          pageSize = 10;
        
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'GET',
          url:'/project/query?query=' + query + '&page=' + page + '&pageSize=' + pageSize
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
    //查询
    doSearch(){
        var currentPage = this.currentPage;
        var pageSize = this.pageSize;
        this.loadData(currentPage,pageSize);
    },
    //编辑项目信息
    handleEdit:function(index, row){
      this.form2.id = row.id;
      this.form2.projectName = row.projectName;
      this.form2.projectCode = row.projectCode;
      if(row.factoryId != null)
        this.form2.factoryId = row.factoryId;
      this.form2.ddbLength = row.ddbLength;
      this.form2.ddbWidth = row.ddbWidth;
      this.form2.ddbHeight = row.ddbHeight;
      this.form2.yjbLength = row.yjbLength;
      this.form2.yjbWidth = row.yjbWidth;
      this.form2.yjbHeight = row.yjbHeight;

      this.dialogVisible2=true;
    },
    updateProject(){
      var project = this.form2;

      var formData = new FormData();
      formData.append("id",project.id);
      formData.append("projectName",project.projectName);
      formData.append("projectCode",project.projectCode);
      formData.append("factoryId",project.factoryId);
      formData.append("ddbLength",project.ddbLength);
      formData.append("ddbWidth",project.ddbWidth);
      formData.append("ddbHeight",project.ddbHeight);
      formData.append("yjbLength",project.yjbLength);
      formData.append("yjbWidth",project.yjbWidth);
      formData.append("yjbHeight",project.yjbHeight);
      if(this.fileList.length>0){
        formData.append("file",this.fileList[0]);
      }

      this.$axios({
        headers: {
          userId: this.currentUserId,
        },
        method: "POST",
        url: "/project/updateProject",
        data: formData,
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

        this.dialogVisible2=false;

        this.$refs['upload2'].clearFiles();
        var currentPage = this.currentPage;
        var pageSize = this.pageSize;
        this.loadData(currentPage,pageSize);
      });
    },
    //订单查看
    handleOrderList:function(index, row){
      var _this = this;
      _this.orderData = [];
      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'GET',
        url:'/project/getProjectOrder?pid=' + row.id
      })
      .then(res => {
        if(res.data.status == 200){
          var data = res.data.data;
          _this.orderData = data;
          _this.dialogVisible3=true;
        }else{
          this.$message({
            type: 'warning',
            duration: 2000,
            message: '没有权限查看!'
          });
        }
      });
    },
    //下载项目图纸
    handleDownload:function(index, row){
      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'GET',
        url: '/project/downloadProjectPDF?pid=' + row.id
      })
      .then(res=>{
        if(res.data.status == 200){
          console.log(res.data);
          window.open("http://60.191.72.227:8081/file/" + res.data.data);
        }else{
          this.$message({
            duration: 2000,
            message: res.data.msg,
            type: 'warning'
          });
        }
      });
    },
    //删除项目
    handleDelete:function(index, row){
      this.$confirm('此操作将删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/project/deleteProject?pid=' + row.id
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
    this.currentUserId = localStorage.getItem("id");

    this.getFactory();

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
