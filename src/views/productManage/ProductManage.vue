<template>
  <div>
        <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
        <el-input v-model="queryForm.query" placeholder="请输入阴极板编码" class="inputSearch" @keyup.enter.native="doSearch"></el-input>

        <el-select size="small" class="btnSearch" v-model="queryForm.maintainType" @change="loadData(1,pageSize)"
        filterable clearable placeholder="报修类型">
          <el-option 
            v-for="item in mainTainList" 
            :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>        
        
        <el-select size="small" class="btnSearch" v-model="queryForm.state" @change="loadData(1,pageSize)"
        filterable clearable placeholder="阴极板状态">
          <el-option 
            v-for="item in stateList" 
            :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <el-select size="small" class="btnSearch" v-model="queryForm.factoryId" @change="loadData(1,pageSize)"
        filterable clearable placeholder="生产厂家">
          <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"></el-option>
        </el-select>

        <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" style="width: 100%;margin-bottom: 20px;" :height="tableHeight" >
            <el-table-column prop="productCode" label="阴极板编码" width="200"></el-table-column>
            <el-table-column prop="productValue" label="平面度" width="200"></el-table-column>
            <!-- <el-table-column prop="yjbSize" label="阴极板尺寸" width="200"></el-table-column> -->
            <el-table-column prop="productState" label="阴极板状态" :formatter="stateFormat" width="200"></el-table-column>
            <el-table-column prop="updateStateDate" label="状态更改时间" :formatter="dateFormat" width="250"></el-table-column>
            <el-table-column prop="maintainType" label="报修类型" :formatter="maintainFormat" width="200"></el-table-column>
            <el-table-column prop="username" label="报修人" :formatter="usernameFormat" width="200"></el-table-column>
            <el-table-column prop="updateMaintainDate" label="报修时间" :formatter="dateFormat" width="200"></el-table-column>
            <el-table-column prop="manage" label="管理" fixed="right" width="250">
                <template slot-scope="scope">
                    <el-tooltip content="编辑阴极板" placement="top">
                        <el-button size="mini" type="primary" class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
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

        <el-dialog title="阴极板编辑" :visible.sync="dialogVisible" width="25%">
            <el-form :model="form" label-width="100px" size="small" style="margin-right:50px">
                <el-form-item label="阴极板编号:">
                    <el-input v-model="form.productCode" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="平面度:">
                    <el-input v-model="form.productValue"></el-input>
                </el-form-item>
                <el-form-item label="阴极板状态:">
                    <el-select v-model="form.state" @change="checkIsMaintain()"
                    filterable clearable placeholder="阴极板状态">
                        <el-option
                            v-for="item in stateList"
                            :key="item.value" 
                            :label="item.label" 
                            :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="报修类型:">
                    <el-select v-model="form.maintainType" 
                    filterable clearable placeholder="报修类型" :disabled="maintainTypeFlag">
                        <el-option
                            v-for="item in mainTainList"
                            :key="item.value" 
                            :label="item.label" 
                            :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateProduct()">提 交</el-button>
                <el-button @click="cancel();">取 消</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: "productlist",
  data() {
    return {
        key:1,
        //用户id
        currentUserId:"",
        //搜索条件
        queryForm:{
            query:"",
            state:"",
            maintainType:"",
            factoryId:"",
        },
        stateList:[
            {
                value:0,
                label:"使用中"
            },
            {
                value:1,
                label:"维修中"
            },
            {
                value:2,
                label:"备用"
            },
            {
                value:3,
                label:"报废"
            },
        ],
        mainTainList:[
            {
                value:1,
                label:"槽面换板"
            },
            {
                value:2,
                label:"烧板"
            },
            {
                value:3,
                label:"镀铜层脱落"
            },
            {
                value:4,
                label:"弹性板"
            },
        ],
        factoryList:[],
        //列表数据
        tableData:[],
        //表格高度
        tableHeight:500,
        //分页条件
        currentPage:1,
        pageSize: 10,
        totalCount:0,
        //显示编辑阴极板状态的窗口
        dialogVisible:false,
        form:{
            id:"",
            productValue:"",
            productCode:"",
            state:-1,
            maintainType:"",
        },
        //是否可以编辑报修类型
        maintainTypeFlag:true,
    };
  },

  methods: {
        //搜索
        doSearch(){
            this.loadData(1,this.pageSize);
        },
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
        //维修状态转换
        maintainFormat:function(row,column){
            var maintain = row[column.property];
            if(maintain == null)
                return "";
            else if(maintain == 1){
                return "槽面换板";
            }else if(maintain == 2){
                return "烧板";
            }else if(maintain == 3){
                return "镀铜层脱落";
            }else if(maintain == 4){
                return "弹性板";
            }else
                return "";
        },
        //格式化日期
        dateFormat:function(row,column){
            var date = row[column.property];
            if(date === null){
                return ''
                } ;
            return moment(date).format("YYYY-MM-DD HH:mm:ss")
        },
        //报修人
        usernameFormat:function(row,column) {
            var username = row[column.property];
            if(row.productState != 1)
                return "";
            return username;
        },
        //获取厂家数据
        getFactory() {
            this.$axios.get("/factory/getAll").then((res) => {
                this.factoryList = res.data.data;
            });
        },
        //加载阴极板数据
        loadData: function(page, pageSize){
            let _this = this;
            
            var query = _this.queryForm.query;
            var state = _this.queryForm.state;
            var maintainType = _this.queryForm.maintainType;
            var factoryId = _this.queryForm.factoryId;
            
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
        //编辑阴极板
        handleEdit(index, row){
            this.form.id = row.id;
            this.form.productValue = row.productValue;
            this.form.productCode = row.productCode;
            this.form.state = row.productState;
            this.form.maintainType = row.maintainType;
            if(row.productState == 1)
                this.maintainTypeFlag=false;
            else
                this.maintainTypeFlag=true;

            this.dialogVisible = true;
            
        },
        //检查是否是维修状态
        checkIsMaintain(){
            var state = this.form.state;
            if(state == 1)
                this.maintainTypeFlag=false;
            else
                this.maintainTypeFlag=true;
        },
        updateProduct(){
            var _this = this;
            this.$axios({
                headers:{
                    userId:this.currentUserId
                },
                method: "POST",
                url: "/product/updateProduct",
                data: {
                    id:_this.form.id,
                    productCode: _this.form.productCode,
                    productValue:_this.form.productValue,
                    productState: _this.form.state,
                    userid: _this.currentUserId,
                    maintainType: _this.form.maintainType,
                },
            }).then((res) => {
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
                let currentPage = this.currentPage;
                let pageSize = this.pageSize;
                this.loadData(currentPage, pageSize);

                this.cancel();
            });
        },
        //取消
        cancel(){
            this.form={
                id:"",
                productValue:"",
                productCode:"",
                state:"",
                maintainType:"",
            };
            this.maintainTypeFlag=true;
            this.dialogVisible = false;
        },
  },

  created(){
    this.currentUserId = localStorage.getItem('id');

    this.getFactory();

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
