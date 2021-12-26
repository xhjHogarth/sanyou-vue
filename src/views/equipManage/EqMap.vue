<template>
  <div>
    <div style="height:50px">
      <el-select size="small" class="btnSearch" 
      v-model="queryForm.factoryId"
      @change="getEquip" 
      filterable clearable placeholder="请选择厂家">
        <el-option 
          v-for="item in queryFactoryList" 
          :key="item.id" :label="item.factoryName" :value="item.id">
        </el-option>
      </el-select>
      <el-select size="small" class="btnSearch" 
      v-model="queryForm.equipId" 
      @change="getMap"
      filterable clearable placeholder="请选择设备">
        <el-option 
          v-for="item in queryEquipList" 
          :key="item.id" :label="item.equipNo" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div>
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
    </div>
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
    name: 'eqmap',
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
        //搜索
        queryFactoryList:[],
        queryEquipList:[],
        queryForm:{
          factoryId:"",
          equipId:"",
        },
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
      }
    },
    methods:{
      //获取厂家数据
      getFactory(){
        this.$axios.get('/factory/getAll')
        .then(res => {
          this.factoryList = res.data.data;
          this.queryFactoryList = res.data.data;
        });
      },

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
      //获取设备
      getEquip(){
        let factoryId = this.queryForm.factoryId;

        this.queryEquipList = [];
        this.queryForm.equipId="";

        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: "GET",
          url: "/equipment/getEquip?factoryId=" + factoryId,
        })
        .then(res=>{
          if(res.data.status == 200){
            this.queryEquipList = res.data.data;
          }
        });
      },

      //获取地址信息
      getMap(id){
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: "GET",
          url: "/equipment/getEquipById?id=" + id,
        })
        .then(res=>{
          if(res.data.status == 200){
            let equip = res.data.data;

            if(equip.equipLng != null){
              this.map.center.lng = equip.equipLng;
            }else{
              this.map.center.lng = 120.349799;
            }
            if(equip.equipLat != null){
              this.map.center.lat = equip.equipLat;
            }else{
              this.map.center.lat = 30.320579;
            }
            this.key++;
          }
        });
      }


    },
    created(){
      this.currentUserId = localStorage.getItem('id');

      this.getFactory();
    },
  }

</script>
<style scoped>
.btnSearch {
  margin: 10px 15px;
  float: left;
}
.map {
  width: 100%;
  height: 600px;
}
.map >>> .BMap_cpyCtrl {
  display: none !important;
}
.map >>> .anchorBL {
  display: none !important;
}
</style>
