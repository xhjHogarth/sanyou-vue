<template>
  <div>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick" style="padding-left: 10px">

        <el-tab-pane label="图表" name="pie">
          <el-button size="mini" type="primary" class="btnSearch" @click="download()">下载数据</el-button>
          <el-select size="small" class="btnSearch" 
          v-model="queryForm.equipNo" @change="changeChart()"
          filterable clearable placeholder="请选择设备">
            <el-option 
              v-for="item in queryEquipList" 
              :key="item.id" :label="item.equipNo" :value="item.equipNo">
            </el-option>
          </el-select>
          <!-- <el-checkbox style="margin: 10px 10px;float:right" v-model="checked" label="1">自动刷新</el-checkbox> -->
        </el-tab-pane>

        <el-tab-pane label="数据" name="data">
          <el-button size="mini" type="primary" class="btnSearch" @click="download()">下载数据</el-button>
          <el-select size="small" class="btnSearch" 
          v-model="queryForm.equipNo" @change="changeTable()"
          filterable clearable placeholder="请选择设备">
            <el-option 
              v-for="item in queryEquipList" 
              :key="item.id" :label="item.equipNo" :value="item.equipNo">
            </el-option>
          </el-select>
          <!-- <el-checkbox style="margin: 10px 10px;float:right" v-model="checked" label="1">自动刷新</el-checkbox> -->

          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :height="tableHeight">
            <el-table-column prop="lineno" label="设备编号" width="100"> </el-table-column>
            <el-table-column prop="datatime" label="测量时间" :formatter="dateFormat" width="180"></el-table-column>
            <el-table-column prop="max" label="MAX" width="100"></el-table-column>
            <el-table-column prop="maxno" label="MAX NO" width="120"></el-table-column>
            <el-table-column prop="plateno" label="产品编号" width="120"></el-table-column>
            <el-table-column prop="max1" label="MAX1" width="100"></el-table-column>
            <el-table-column prop="max2" label="MAX2" width="100"></el-table-column>
            <el-table-column prop="max3" label="MAX3" width="100"></el-table-column>
            <el-table-column prop="max4" label="MAX4" width="100"></el-table-column>
            <el-table-column prop="max5" label="MAX5" width="100"></el-table-column>
            <el-table-column prop="max6" label="MAX6" width="100"></el-table-column>
            <el-table-column prop="max7" label="MAX7" width="100"></el-table-column>
            <el-table-column prop="max8" label="MAX8" width="100"></el-table-column>
            <el-table-column prop="max9" label="MAX9" width="100"></el-table-column>
            <el-table-column prop="max10" label="MAX10" width="100"></el-table-column>
            <el-table-column prop="max11" label="MAX11" width="100"></el-table-column>
            <el-table-column prop="max12" label="MAX12" width="100"></el-table-column>
            <el-table-column prop="max13" label="MAX13" width="100"></el-table-column>
            <el-table-column prop="max14" label="MAX14" width="100"></el-table-column>
            <el-table-column prop="max15" label="MAX15" width="100"></el-table-column>
            <el-table-column prop="max16" label="MAX16" width="100"></el-table-column>
            <el-table-column prop="max17" label="MAX17" width="100"></el-table-column>
            <el-table-column prop="max18" label="MAX18" width="100"></el-table-column>
            <el-table-column prop="max19" label="MAX19" width="100"></el-table-column>
            <el-table-column prop="max20" label="MAX20" width="100"></el-table-column>
            <el-table-column prop="max21" label="MAX21" width="100"></el-table-column>
            <el-table-column prop="max22" label="MAX22" width="100"></el-table-column>
            <el-table-column prop="max23" label="MAX23" width="100"></el-table-column>
            <el-table-column prop="max24" label="MAX24" width="100"></el-table-column>
            <el-table-column prop="max25" label="MAX25" width="100"></el-table-column>
            <el-table-column prop="max26" label="MAX26" width="100"></el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="20"
            layout="total, sizes, prev, pager, next, jumper"
            :total="Number(totalCount)">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div id="pie"></div>

  </div>
</template>

<script>
import echarts from "echarts";
import moment from 'moment';
export default {
  name: "rtdata",

  data() {
    return {
      currentUserId:"",
      //表格高度
      tableHeight:500,
      //表格数据
      tableData: [],
      
      checked: false,
      activeName: 'pie',
      isShow: 'false',
      //选择设备
      queryEquipList:[],
      queryForm:{
        equipNo:"",
      },
      //分页
      currentPage:1,
      pageSize: 20,
      totalCount:0,
      //日期
      startTime:"",
      endTime:""
    };
  },
  mounted(){
    // if(this.queryForm.equipNo != ''){
    //   this.drawPie();
    // }
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 300;
      window.onresize = () => {
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 300;
      };
    });
  },
  methods: {
    //点击标签事件
    handleClick(tab, event) {
      if (tab.name == "pie") {
        this.drawPie();
      } else {
        this.showData();
      }
    },
    //绘制图表
    drawPie() {
      //基于准备好的dom，初始化echarts实例
      //this.isShow = false;
      document.getElementById("pie").style="display: block;width: 100%; height: 500px;margin-top:30px"
      var myChart = echarts.init(document.getElementById("pie"));
      
      let data = [];
      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'POST',
        url: '/industryData/getPieChart',
        data: {
          lineno:this.queryForm.equipNo,
          userId:this.currentUserId,
          startTime:this.startTime,
          endTime:this.endTime
        }
      })
      .then(res=>{
        if(res.data.status == 200){
          
          for(let i=0;i<res.data.data.length;i++){
            data.push({value:res.data.data[i].value,name:res.data.data[i].name});
          }
          myChart.setOption({
            title: {
              text: "检测数据实时统计", //主标题
              x: "center", //x轴方向对齐方式
            },
            tooltip: {
              trigger: "item",
              formatter: "{b}: {c} ({d}%)",
            },
            legend: {
              orient: "vertical",
              bottom: "bottom",
            },
            series: [
              {
                type: "pie",
                radius: "80%",
                center: ["50%", "50%"],
                data: data,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                  normal: {
                    color: function(params) {
                      //自定义颜色
                      var colorList = [
                      '#FF6356', '#FFAD00', '#4CAE85'
                      ];
                      return colorList[params.dataIndex]
                    }
                  }
                },
              },
            ],
          });
        }else{
          this.$message({
            duration: 2000,
            message: res.data.msg,
            type: 'warning'
          });
        }
      });

    },
    //显示数据
    showData() {
      document.getElementById("pie").style="display: none"
      // this.isShow = true;
      this.loadData(1,20);
    },
    //获取用户所拥有权限的设备信息
    loadEquipList(){
      this.$axios.get("/equipment/getUserEquip?userId=" + this.currentUserId)
      .then(res=>{
        if(res.data.status == 200){
          this.queryEquipList = res.data.data;
          if(this.queryEquipList.length > 0){
            this.queryForm.equipNo = this.queryEquipList[0].equipNo;
            this.drawPie();
          }
        }else{
          this.$message({
            type: 'warning',
            duration: 2000,
            message: '获取设备信息失败!'
          });
        }
      });
    },
    //加载检测数据
    loadData: function(page, pageSize){
        let _this = this;
        
        if(page == null || page == NaN)
            page = 1;
        if(pageSize == null || pageSize == NaN)
            pageSize = 20;

        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url:'/industryData/query?page=' + page + '&pageSize=' + pageSize,
          data:{
            lineno:this.queryForm.equipNo,
            userId:this.currentUserId,
            startTime:this.startTime,
            endTime:this.endTime
          }
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
    //日期格式化
    dateFormat:function(row,column){
  　　var date = row[column.property];
      if(date === undefined){
          return ''
        } ;
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },

    //下载数据
    download(){
      let startTime = this.startTime.replace(/-/g,'/');
      let endTime = this.endTime.replace(/-/g,'/');
      window.location.href = "http://60.191.72.227:8081/industryData/download?startTime=" + startTime + 
      "&endTime=" + endTime + "&equipNo=" + this.queryForm.equipNo;
    },

    changeChart(){
      this.drawPie();
    },

    changeTable(){
      this.loadData(1,20);
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
    this.startTime = date.year + "-" + newmonth + '-' + day;
    this.endTime = date.year + "-" + newmonth + '-' + day;

    this.loadEquipList();
  }

};
</script>
<style scoped>
.container {
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(245, 245, 246);;
}
.container-left {
  margin-left: 10px;
  height: 56px;
  line-height: 56px;
}
.space {
  margin: 5px;
}
.btnSearch {
    margin: 5px 10px;
    float: right;
  }
</style>
