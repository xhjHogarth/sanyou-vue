<template>
  <div>
    <div class="container">
      <el-tabs
        class="container-left"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane label="文件列表" name="1"></el-tab-pane>
        <el-tab-pane label="上传文件" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <div style="display: flex; justify-content: space-between">
      <el-button type="danger" class="space">删除</el-button>
      <div>
        <el-select
          v-model="value"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" class="space">搜索</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="文件名" width="120" fixed=true>
        <template slot-scope="scope">{{ scope.row.file_name }}</template>
      </el-table-column>
      <el-table-column prop="uploader" label="上传者" width="120">
      </el-table-column>
      <el-table-column prop="file_size" label="文件大小" />
      <el-table-column prop="upload_time" label="上传时间" />
      <el-table-column prop="manage" label="管理" />
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage2"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="sizes, prev, pager, next"
        :total="1000"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "attachmanage",
  data() {
    return {
      activeName: "1",
      //关键词搜索
      options: [],
      value: [],
      list: [],
      loading: false,
      states: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
      id: 1,
      name: "",
      title: "",
      group: "",
      manage: "",
    };
  },
  mounted() {
    this.list = this.states.map((item) => {
      return { value: `value:${item}`, label: `label:${item}` };
    });
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
<style scoped>
.container {
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: lightgrey;
}
.container-left {
  margin-left: 10px;
  height: 56px;
  line-height: 56px;
}
.space {
  margin: 5px;
}
</style>
