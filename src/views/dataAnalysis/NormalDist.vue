<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="padding-left: 10px">
      <el-tab-pane label="曲线图" name="graph">
        <el-select size="small" class="btnSearch" 
        v-model="queryForm.equipNo" @change="changeChart()"
        filterable clearable placeholder="请选择设备">
          <el-option 
            v-for="item in queryEquipList" 
            :key="item.id" :label="item.equipNo" :value="item.equipNo">
          </el-option>
        </el-select>
        <div class="btnSearch">
          <el-date-picker size="small"
            v-model="value1" @change="changeDate()"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-tab-pane>

      <el-tab-pane label="柱状图" name="bar">
        <el-select size="small" class="btnSearch" 
        v-model="queryForm.equipNo" @change="changeChart()"
        filterable clearable placeholder="请选择设备">
          <el-option 
            v-for="item in queryEquipList" 
            :key="item.id" :label="item.equipNo" :value="item.equipNo">
          </el-option>
        </el-select>
        <div class="btnSearch">
          <el-date-picker size="small"
            v-model="value1" @change="changeDate()"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-tab-pane>

    </el-tabs>

    <div id="graph"></div>

    <div id="bar"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "normaldist",
  data() {
    return {
      currentUserId:"",
      //显示柱状图
      dialogVisible:false,
      //选择设备
      queryEquipList:[],
      queryForm:{
        equipNo:"",
      },
      value1:[],
      //tabs
      activeName: "graph",
      //日期
      startTime:"",
      endTime:"",
    };
  },
  mounted() {
    //this.drawGraph();
  },
  methods: {
    //点击标签事件
    handleClick(tab, event) {
      if (tab.name == "graph") {
        this.drawGraph();
      } else if (tab.name == "bar") {
        this.drawBar();
      }
    },
    //曲线图
    drawGraph() {
      document.getElementById("bar").style = "display: none";
      document.getElementById("graph").style = "display: block; width: 100%; height: 500px;margin-top:50px";
      var myGraph = echarts.init(document.getElementById("graph"));

      let xAxis = [];
      let data = [];
      let _this = this;

      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'POST',
        url: '/industryData/getNormalLineChart',
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
            xAxis.push(res.data.data[i].name);
            data.push(res.data.data[i].value);
          }
          myGraph.setOption({
            title: {
              text: '检测数据历史统计图',
              left: 'center',
            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              boundaryGap: ['1%', '1%'],
              data: xAxis
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data:data,
              type:'line'
            }]
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

    //柱状图
    drawBar() {
      document.getElementById("graph").style = "display: none";
      document.getElementById("bar").style = "display: block;width: 100%; height: 500px;margin-top:50px";
      var myBar = echarts.init(document.getElementById("bar"));
      
      let data = [];
      
      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'POST',
        url: '/industryData/getNormalBarChart',
        data: {
          lineno:this.queryForm.equipNo,
          userId:this.currentUserId,
          startTime:this.startTime,
          endTime:this.endTime
        }
      })
      .then(res=>{
        //console.log(res);
        if(res.data.status == 200){
          for(let i=0;i<res.data.data.length;i++){
            data.push({
              product:res.data.data[i].date,
              '健康':res.data.data[i].healthValue,
              '亚健康':res.data.data[i].subHealthValue,
              '不健康':res.data.data[i].unHealthValue,
            });
          }
          myBar.setOption({
            title: {
              text: '检测数据历史统计图',
              left: 'center',
            },
            legend: {
              bottom: "bottom",
            },
            tooltip: {},
            dataset: {
              dimensions: ['product', '健康', '亚健康', '不健康'],
              source: data
            },
            xAxis: {type: 'category'},
            yAxis: {},
            series: [
                {type: 'bar',itemStyle: {color: "#4CAE85"}},
                {type: 'bar',itemStyle: {color: "#FFAD00"}},
                {type: 'bar',itemStyle: {color: "#FF6356"}}
            ]
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
    //获取用户所拥有权限的设备信息
    loadEquipList(){
      this.$axios.get("/equipment/getUserEquip?userId=" + this.currentUserId)
      .then(res=>{
        if(res.data.status == 200){
          this.queryEquipList = res.data.data;
          this.queryForm.equipNo = this.queryEquipList[0].equipNo;
          this.drawGraph();
        }else{
          this.$message({
            type: 'warning',
            duration: 2000,
            message: '获取设备信息失败!'
          });
        }
      });
    },

    changeChart(){
      if (this.activeName == "graph") {
        this.drawGraph();
      } else if (this.activeName == "bar") {
        this.drawBar();
      }
    },

    changeDate(){
      if(this.value1 != null && this.value1.length > 0){
        let startTime = this.value1[0];
        let endTime = this.value1[1];
        let date = {
          year: startTime.getFullYear(),
          month: startTime.getMonth() + 1,
          date: startTime.getDate(),
        }
        let newmonth = date.month>=10?date.month:'0'+date.month;
        let day = date.date>=10?date.date:'0'+date.date;
        this.startTime = date.year + "-" + newmonth + '-' + day;

        date = {
          year: endTime.getFullYear(),
          month: endTime.getMonth() + 1,
          date: endTime.getDate(),
        }
        newmonth = date.month>=10?date.month:'0'+date.month;
        day = date.date>=10?date.date:'0'+date.date;
        this.endTime = date.year + "-" + newmonth + '-' + day;

        this.changeChart();
      }
    }

  },

  created() {
    this.currentUserId = localStorage.getItem('id');

    this.loadEquipList();

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    this.startTime = new Date(year,month,1);
    this.endTime = new Date(year,month,day);
    this.value1.push(new Date(year,month,1));
    this.value1.push(new Date(year,month,day));
  }
};
</script>
<style scoped>
.btnSearch {
  margin: 5px 10px;
  float: right;
}
</style>
