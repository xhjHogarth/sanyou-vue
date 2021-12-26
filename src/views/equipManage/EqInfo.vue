<template>
  <div>
    <el-button class="btnAdd" size="small" type="primary" @click="dialogVisible = true">添加设备</el-button>

    <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
    <el-input v-model="queryForm.query" placeholder="请输入设备编号" class="inputSearch" @keyup.enter.native="doSearch"></el-input>
    <el-select size="small" class="btnSearch" v-model="queryForm.factoryId" filterable clearable placeholder="请选择厂家">
      <el-option
        v-for="item in factoryList"
        :key="item.id"
        :label="item.factoryName"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select
      size="small"
      class="btnSearch"
      v-model="queryForm.equipStatus"
      filterable
      clearable
      placeholder="请选择设备状态">
      <el-option
        v-for="item in queryStatusList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

    <el-table ref="multipleTable" tooltip-effect="dark" style="width: 100%; margin-bottom: 20px"
      :data="tableData" row-key="id" :height="tableHeight">
      <el-table-column prop="equipNo" label="设备编号" width="180"></el-table-column>
      <el-table-column prop="factoryName" label="厂家名称" width="180"></el-table-column>
      <el-table-column prop="subFactoryName" label="生产线" width="180"></el-table-column>
      <el-table-column prop="equipStatusName" label="状态" width="180"></el-table-column>
      <el-table-column prop="equipOnlineTime" label="在线时长" width="180"></el-table-column>
      <el-table-column prop="equipCycle" label="周期" width="180"></el-table-column>
      <el-table-column prop="equipHealthLimit" label="健康上线" width="180"></el-table-column>
      <el-table-column prop="equipSubhealthLimit" label="亚健康上线" width="180"></el-table-column>
      <el-table-column prop="equipAddress" label="设备地址" width="180"></el-table-column>
      <el-table-column prop="enableMark" label="启用/禁用" width="180" fixed="right">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enableMark"
            @change="changeStatus(scope.$index, scope.row)"
            active-color="#13ce66"
            :active-value="1"
            inactive-color="#ff4949"
            :inactive-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="manage" label="管理" width="180" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="地图选点" placement="top">
            <el-button size="mini" type="primary" class="el-icon-lock" @click="handleDistr(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="编辑设备信息" placement="top">
            <el-button size="mini" type="primary" class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除设备" placement="top">
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

    <el-dialog title="添加设备" :visible.sync="dialogVisible" width="40%">
      <el-form :model="form" label-width="100px" size="small">
        <el-form-item label="设备编号:">
          <el-input v-model="form.equipNo"></el-input>
        </el-form-item>
        <el-form-item label="厂家名称:">
          <el-select v-model="form.factoryId" filterable @change="selectSubFactory" placeholder="请选择厂家">
            <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产线:">
          <el-select v-model="form.subFactoryId" filterable placeholder="请选择生产线">
            <el-option
              v-for="item in subFactoryList"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备所在地:">
          <el-input v-model="form.equipAddress"></el-input>
        </el-form-item>
        <el-form-item label="阴极周期:">
          <el-input v-model="form.equipCycle"></el-input>
        </el-form-item>
        <el-form-item label="健康临界点:">
          <el-input v-model="form.equipHealthLimit"></el-input>
        </el-form-item>
        <el-form-item label="亚健康临界点:">
          <el-input v-model="form.equipSubhealthLimit"></el-input>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-select v-model="form.enableMark">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addEquipment()">提 交</el-button>
        <el-button @click="dialogVisible = false;cancel();">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="设备编辑" :visible.sync="dialogVisible2" width="40%">
      <el-form :model="form" label-width="100px" size="small">
        <el-form-item label="设备编号:">
          <el-input v-model="form.equipNo"></el-input>
        </el-form-item>
        <el-form-item label="厂家名称:">
          <el-select v-model="form.factoryId" filterable @change="selectSubFactory" placeholder="请选择厂家">
            <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产线:">
          <el-select v-model="form.subFactoryId" filterable placeholder="请选择生产线">
            <el-option
              v-for="item in subFactoryList"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备所在地:">
          <el-input v-model="form.equipAddress"></el-input>
        </el-form-item>
        <el-form-item label="阴极周期:">
          <el-input v-model="form.equipCycle"></el-input>
        </el-form-item>
        <el-form-item label="健康临界点:">
          <el-input v-model="form.equipHealthLimit"></el-input>
        </el-form-item>
        <el-form-item label="亚健康临界点:">
          <el-input v-model="form.equipSubhealthLimit"></el-input>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-select v-model="form.enableMark">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateEquipment()">提 交</el-button>
        <el-button @click="dialogVisible2 = false;cancel();">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="地图选点" :visible.sync="dialogVisible3" width="70%">
      <b>地址</b>：{{map.address}}
      <b style="margin-left:10px">经度</b>：<el-input size="small" v-model.number="map.center.lng" class="input" style="margin: 0 10px"></el-input>
      <b>纬度</b>：<el-input size="small" v-model.number="map.center.lat" class="input" style="margin-left: 10px"></el-input>
      <baidu-map class="map" :center="map.center" :zoom="map.zoom" :key="key"
      @ready="handler">
        <!--缩放-->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
        <!--定位-->
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
        <!--点-->
        <bm-marker :position="map.center" :dragging="map.dragging" animation="BMAP_ANIMATION_DROP" @dragend="dragend">
            <!--提示信息-->
            <!-- <bm-info-window :show="false"></bm-info-window> -->
        </bm-marker>
      </baidu-map>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateAddress()">提 交</el-button>
        <el-button @click="dialogVisible3 = false;">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
//导入地图组件
import {
  BaiduMap,
  BmControl,
  BmView,
  BmAutoComplete,
  BmLocalSearch,
  BmMarker,
  BmNavigation,
} from "vue-baidu-map";


export default {
  name: "eqinfo",
   //地图组件
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmAutoComplete,
    BmLocalSearch,
    BmMarker,
    BmNavigation,
  },

  data() {
    return {
      currentUserId:"",
      //地图
      key:1,
      map:{
        center: {lng: 120.349799, lat: 30.320579},
        zoom: 15,
        show: true,
        dragging: true,
        address:"杭州电子科技大学",
        equipId:"",
      },
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
        factoryId: "",
        equipStatus: "",
      },
      queryStatusList: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "未上线",
        },
        {
          value: 2,
          label: "在线",
        },
        {
          value: 3,
          label: "已离线",
        },
      ],
      //新增设备
      dialogVisible: false,
      factoryList: [],
      subFactoryList: [],
      form: {
        id: "",
        equipNo: "",
        factoryId: "",
        subFactoryId: "",
        equipAddress: "",
        equipCycle: "",
        equipHealthLimit: "",
        equipSubhealthLimit: "",
        enableMark: 1,
      },
      statusList: [
        {
          value: 1,
          label: "启用",
        },
        {
          value: 0,
          label: "禁用",
        },
      ],
      //设备编辑
      dialogVisible2: false,
      //地图选点
      dialogVisible3: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 250;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 250;
      };
    });
  },
  methods: {
    //百度地图初始化
    handler({BMap, map}){
      let me = this;
      // console.log(BMap, map)
      // 鼠标缩放
      map.enableScrollWheelZoom(true);
      // 点击事件获取经纬度
      map.addEventListener('click', function (e) {
          // console.log(e.point.lng, e.point.lat)
      })
    },

    dragend(val) {
      //标注拖拽完成获取坐标信息
      this.map.center = val.point;
 
      let geocoder = new BMap.Geocoder(); //创建地址解析器的实例
      geocoder.getLocation(val.point, (rs) => {
        // console.log(rs);
        this.map.address = rs.surroundingPois[0].title;
      });
    },
    //弹出地图选点对话框
    handleDistr(index, row) {
      // console.log(index);
      this.dialogVisible3 = true;
      this.map.equipId = row.id;

      if(row.equipLng != null){
        this.map.center.lng = row.equipLng;
      }else{
        this.map.center.lng = 120.349799;
      }
      if(row.equipLat != null){
        this.map.center.lat = row.equipLat;
      }else{
        this.map.center.lat = 30.320579;
      }
      if(row.equipAddress != null && row.equipAddress != ''){
        this.map.address = row.equipAddress;
      }else{
        this.map.address = "杭州电子科技大学";
      }
      this.key++;
    },
    //更新地图信息
    updateAddress(){
      let id = this.map.equipId;
      let equipLng = this.map.center.lng;
      let equipLat = this.map.center.lat;
      let equipAddress = this.map.address;

      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: "POST",
        url: "/equipment/updateAddress",
        data: {
          id: id,
          equipLng: equipLng,
          equipLat: equipLat,
          equipAddress: equipAddress
        },
      })
      .then(res=>{
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
        this.dialogVisible3 = false;
        let currentPage = this.currentPage;
        let pageSize = this.pageSize;
        this.loadData(currentPage, pageSize);
      });
    },
    //每页显示数据量变更
    handleSizeChange: function (val) {
      this.pageSize = val;
      let currentPage = this.currentPage;

      this.loadData(currentPage, val);
    },
    //页码变更
    handleCurrentChange: function (val) {
      this.currentPage = val;
      let pageSize = this.pageSize;
      this.loadData(val, pageSize);
    },
    //获取厂家数据
    getFactory() {
      this.$axios.get("/factory/getAll").then((res) => {
        this.factoryList = res.data.data;
      });
    },
    selectSubFactory(value) {
      this.$axios
        .get("/factory/querySubFactory?parentId=" + value)
        .then((res) => {
          this.subFactoryList = res.data.data;
        });
    },
    //新增设备
    addEquipment() {
      let form = this.form;
      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: "POST",
        url: "/equipment/addEquipment",
        data: form,
      }).then((res) => {
        console.log(res);
        if (res.data.status == 200) {
          this.$message({
            type: "success",
            duration: 2000,
            message: "添加成功!",
          });
        } else {
          this.$message({
            type: "warning",
            duration: 2000,
            message: res.data.msg,
          });
        }
        let currentPage = this.currentPage;
        let pageSize = this.pageSize;
        this.loadData(currentPage, pageSize);
      });
      this.dialogVisible = false;
    },
    //取消
    cancel() {
      this.form = {
        equipNo: "",
        factoryId: "",
        subFactoryId: "",
        equipAddress: "",
        equipCycle: "",
        equipHealthLimit: "",
        equipSubhealthLimit: "",
        enableMark: 1,
      };
    },
    //加载设备数据
    loadData: function (page, pageSize) {
      let _this = this;

      if (page == null || page == NaN) page = 1;
      if (pageSize == null || pageSize == NaN) pageSize = 10;

      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: "POST",
        url: "/equipment/query?page=" + page + "&pageSize=" + pageSize,
        data: this.queryForm,
      }).then((res) => {
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
    //启用/禁用
    changeStatus(index, row) {
      let enableMark = row.enableMark;
      let msg = "";

      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: "POST",
        url: "/equipment/enableOrUnEnableEquip?id=" + row.id + "&mark=" + row.enableMark,
      }).then((res) => {
        if (res.data.status == 200) {
          if (enableMark == 0) {
            msg = "禁用成功!";
          } else {
            msg = "启用成功!";
          }
          this.$message({
            type: "success",
            duration: 2000,
            message: msg,
          });
          
        } else {
          if (enableMark == 0) {
            enableMark = 1;
            msg = "禁用失败!";
          } else {
            enableMark = 0;
            msg = "启用失败!";
          }

          this.$message({
            type: "warning",
            duration: 2000,
            message: res.data.msg,
          });
          this.tableData[index] = enableMark;
        }
        let currentPage = this.currentPage;
        let pageSize = this.pageSize;
        this.loadData(currentPage, pageSize);
      });
    },
    //搜索
    doSearch() {
      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      this.loadData(currentPage, pageSize);
    },
    //编辑设备
    handleEdit(index, row) {
      this.dialogVisible2 = true;

      this.selectSubFactory(row.factoryId);

      this.form.id = row.id;
      this.form.equipNo = row.equipNo;
      this.form.factoryId = row.factoryId;
      this.form.subFactoryId = row.subFactoryId;
      this.form.equipAddress = row.equipAddress;
      this.form.equipCycle = row.equipCycle;
      this.form.equipHealthLimit = row.equipHealthLimit;
      this.form.equipSubhealthLimit = row.equipSubhealthLimit;
      this.form.enableMark = row.enableMark;
    },
    updateEquipment() {
      let id = this.form.id;
      let equipNo = this.form.equipNo;
      let factoryId = this.form.factoryId;
      let subFactoryId = this.form.subFactoryId;
      let equipAddress = this.form.equipAddress;
      let equipCycle = this.form.equipCycle;
      let equipHealthLimit = this.form.equipHealthLimit;
      let equipSubhealthLimit = this.form.equipSubhealthLimit;
      let enableMark = this.form.enableMark;

      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: "POST",
        url: "/equipment/updateEquipInfo?userId=" + this.currentUserId,
        data: {
          id: id,
          equipNo: equipNo,
          factoryId: factoryId,
          subFactoryId: subFactoryId,
          equipAddress: equipAddress,
          equipCycle: equipCycle,
          equipHealthLimit: equipHealthLimit,
          equipSubhealthLimit: equipSubhealthLimit,
          enableMark: enableMark,
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
        this.dialogVisible2 = false;
      });
    },
    //删除
    handleDelete(index, row) {
      this.$confirm("此操作将删除该设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            headers:{
              userId:this.currentUserId
            },
            method: "POST",
            url: "/equipment/deleteEquip",
            data: {
              id: row.id,
              deleteMark: 1,
            },
          }).then((res) => {
            if (res.data.status == 200) {
              this.$message({
                type: "success",
                duration: 2000,
                message: "删除成功!",
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
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            duration: 2000,
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.currentUserId = localStorage.getItem('id');

    this.getFactory();

    let currentPage = this.currentPage;
    let pageSize = this.pageSize;
    this.loadData(currentPage, pageSize);
  },
};
</script>
<style scoped>
.input {
  width: 20%;
  margin-bottom: 10px;
}
.baidumap {
  width: 100%;
  height: 600px;
}

/* 去除百度地图版权那行字 和 百度logo */
.baidumap >>> .BMap_cpyCtrl {
  display: none !important;
}
.baidumap >>> .anchorBL {
  display: none !important;
}

.btnAdd {
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
.map {
    width: 100%;
    height: 450px;
}
.map >>> .BMap_cpyCtrl {
  display: none !important;
}
.map >>> .anchorBL {
  display: none !important;
}
</style>
