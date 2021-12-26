<template>
  <div class="home-container">
    <div class="home-content">
      <div style="margin-bottom: 10px">服务器配置信息</div>
      <el-form
        :label-position="labelPosition"
        label-width="140px"
        :inline="true"
        :model="formInline0"
        class="demo-form-inline"
      >
        <el-form-item label="服务器名" class="inputDeep">
          <el-input v-model="formInline0.serverName" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务器IP">
          <el-input v-model="formInline0.serverIP" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :label-position="labelPosition"
        label-width="140px"
        :inline="true"
        :model="formInline1"
        class="demo-form-inline"
      >
        <el-form-item label="服务器系统">
          <el-input v-model="formInline1.serverSys" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务器引擎">
          <el-input v-model="formInline1.serverEngine" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :label-position="labelPosition"
        label-width="140px"
        :inline="true"
        :model="formInline2"
        class="demo-form-inline"
      >
        <el-form-item label="内存配额">
          <el-input
            :label-position="labelPosition"
            label-width="140px"
            v-model="formInline2.memory"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="内存使用量">
          <el-input v-model="formInline2.memoryUsage" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :label-position="labelPosition"
        label-width="140px"
        :inline="true"
        :model="formInline3"
        class="demo-form-inline"
      >
        <el-form-item label="文件上传大小限制">
          <el-input v-model="formInline3.fileUploadLimit" disabled></el-input>
        </el-form-item>
        <el-form-item label="POST提交内容限制">
          <el-input v-model="formInline3.postLimit" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :label-position="labelPosition"
        label-width="140px"
        :inline="true"
        :model="formInline4"
        class="demo-form-inline"
      >
        <el-form-item label="脚本超时时间">
          <el-input v-model="formInline4.scriptTimeOut" disabled></el-input>
        </el-form-item>
        <el-form-item label="图形处理 GD Library">
          <el-input v-model="formInline4.GDLibrary" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { fetchUserData } from "@/api";

export default {
  name: "home",
  data() {
    return {
      labelPosition: "right",
      formInline0: {
        serverName: "cdate.sanyouco.com",
        serverIP: "60.191.72.227",
      },
      formInline1: {
        serverSys: "Linux",
        serverEngine: "nginx/1.12.2",
      },
      formInline2: {
        memory: "- -",
        memoryUsage: "0.5009Mb",
      },
      formInline3: {
        fileUploadLimit: "- -",
        postLimit: "- -",
      },
      formInline4: {
        scriptTimeOut: "- -S",
        GDLibrary: "支持",
      },
    };
  },
  methods: {},
};
</script>

<style>
.home-container {
  padding: 10px;
  padding-top: 5px;
}
.home-content {
  padding: 10px;
  border-radius: 5px;
  background: #fff;
}
</style>