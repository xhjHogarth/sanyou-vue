<template>
  <div>
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
    
    <div id="graph"></div>


    <el-dialog title="检测数据历史统计图" 
      :modal-append-to-body='false'
      :visible.sync="dialogVisible" 
        @open="open()"
        append-to-body
        :before-close="handleClose">
        <div id="bar" style="width:100%;height:400px;padding-top:40px"></div>
    </el-dialog>

  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "cycledata",
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
      //日期
      startTime:"",
      endTime:"",
      barStartTime:"",
      barEndTime:""
    };
  },

  mounted() {
    //this.drawGraph();
  },

  methods: {
    //曲线图
    drawGraph() {
      document.getElementById("graph").style = "display: block; width: 100%; height: 500px;top:60px";
      var myGraph = echarts.init(document.getElementById("graph"));

      let xAxis = [];
      let healthData = [];
      let subHealthData = [];
      let unHealthData = [];
      let _this = this;

      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'POST',
        url: '/industryData/getCycleLineChart',
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
            xAxis.push(res.data.data[i].date);
            healthData.push(res.data.data[i].healthValue);
            subHealthData.push(res.data.data[i].subHealthValue);
            unHealthData.push(res.data.data[i].unHealthValue);
          }
          myGraph.setOption({
            title: {
              text: '检测数据历史统计图',
              left: 'center',
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['健康', '亚健康', '不健康'],
                bottom: "bottom",
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '6%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: ['1%', '1%'],
              data: xAxis
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '健康',
                type: 'line',
                //stack: '总量',
                data: healthData,
                itemStyle: {color: "#4CAE85"}
              },
              {
                name: '亚健康',
                type: 'line',
                //stack: '总量',
                data: subHealthData,
                itemStyle: {color: "#FFAD00"}
              },
              {
                name: '不健康',
                type: 'line',
                //stack: '总量',
                data: unHealthData,
                itemStyle: {color: "#FF6356"}
              }
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

      

      myGraph.on('click', function (params) {
        console.log(params)
        let data = {
          x: params.name,
          y: params.value
        }
        let dateStr = data.x;
        let dateList = dateStr.split('-');
        console.log(dateList);
        _this.barStartTime = dateList[0].replace(/\//g,'-');
        _this.barEndTime = dateList[1].replace(/\//g,'-');
        //console.log(data);
        _this.dialogVisible = true;
        
      });
    },

    //柱状图
    drawBar() {
      if(this.dialogVisible){
        var myBar = echarts.init(document.getElementById("bar"));

        let data = [];

        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'POST',
          url: '/industryData/getBarChart',
          data: {
            lineno:this.queryForm.equipNo,
            userId:this.currentUserId,
            startTime:this.barStartTime,
            endTime:this.barEndTime
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
      }
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

    open(){
      this.$nextTick(() => {
      //  执行echarts方法
        this.drawBar()
      })
    },
    //当dialog关闭时
    handleClose(){
      this.dialogVisible = false;
    },

    changeChart(){
      this.drawGraph();
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

        this.drawGraph();
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
