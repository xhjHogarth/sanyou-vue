<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="padding-left: 10px">
      <el-tab-pane label="用户列表" name='allList'>
        <el-button class="btnAdd" size="small" type="primary" @click="dialogVisible = true;">添加用户</el-button>
        <el-button class="btnDelete" size="small" type="primary" @click="download()">用户资料下载</el-button>
        <el-button class="btnDelete" size="small" type="danger" @click="handleBatchDelete()">批量删除</el-button>
        

        <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
        <el-input v-model="queryForm.query" placeholder="" class="inputSearch" @keyup.enter.native="doSearch"></el-input>
        <el-select size="small" class="btnSearch" v-model="queryForm.queryLabel">
          <el-option 
            v-for="item in queryLabelList" 
            :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select size="small" class="btnSearch" v-model="queryForm.factoryId" filterable clearable placeholder="请选择厂家">
          <el-option 
            v-for="item in queryFactoryList" 
            :key="item.id" :label="item.factoryName" :value="item.id">
          </el-option>
        </el-select>
        <el-select size="small" class="btnSearch" v-model="queryForm.groupId" filterable clearable placeholder="请选择用户组">
          <el-option 
            v-for="item in queryGroupList" 
            :key="item.id" :label="item.groupName" :value="item.id">
          </el-option>
        </el-select>
        

        <el-table ref="multipleTable" tooltip-effect="dark" style="width: 100%" :data="tableData"
        :height="tableHeight" @selection-change="handleSelectionChange" >
          <el-table-column type="selection"></el-table-column>
          <el-table-column fixed prop="username" label="用户名" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="groupName" label="用户组" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="realname" label="姓名" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sexName" label="性别" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" label="手机号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="factoryName" label="所属厂家" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="subFactoryName" label="子厂家" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="depart" label="所属部门" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="position" label="职务" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="qq" label="QQ" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="wechat" label="微信" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="email" label="Email" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="administration" label="所属地区" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="address" label="详细地址" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="enableMark" label="启用/禁用" width="180" fixed="right">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enableMark" @change="changeStatus(scope.$index, scope.row)"
                active-color="#13ce66" :active-value="1"
                inactive-color="#ff4949" :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="manage" label="管理" width="180" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="分配设备查看权限" placement="top">
                <el-button size="mini" type="primary" class="el-icon-lock"
                @click="handleDistr(scope.$index, scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <el-button size="mini" type="primary" class="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button size="mini" type="danger" class="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="Number(totalCount)">
        </el-pagination>

        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%">
          <div class="el-dialog-div">
          <el-tabs v-model="activeName2" @tab-click="handleAddTabs">
            <el-tab-pane label="基本信息" name="basicInfo">
              <el-form :model="form" label-width="100px" size="small">
                <el-form-item label="用户名:">
                  <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="登录密码:">
                  <el-input v-model="form.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="用户组:">
                  <el-select v-model="form.groupId" filterable placeholder="请选择用户组">
                    <el-option 
                      v-for="item in groupList" 
                      :key="item.id" :label="item.groupName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="姓名:">
                  <el-input v-model="form.realname"></el-input>
                </el-form-item>
                <el-form-item label="性别:">
                  <el-select v-model="form.sex" placeholder="请选择性别">
                    <el-option 
                      v-for="item in genderList" 
                      :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所在厂家:">
                  <el-select v-model="form.factoryId" filterable @change="selectSubFactory" placeholder="请选择厂家">
                    <el-option 
                      v-for="item in factoryList" 
                      :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所在子厂家:">
                  <el-select v-model="form.subFactoryId" filterable placeholder="请选择子厂家">
                    <el-option 
                      v-for="item in subFactoryList" 
                      :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属部门:">
                  <el-input v-model="form.depart"></el-input>
                </el-form-item>
                <el-form-item label="职务:">
                  <el-input v-model="form.position"></el-input>
                </el-form-item>
                <el-form-item label="是否启用:">
                  <el-select v-model="form.enableMark">
                    <el-option 
                      v-for="item in statusList" 
                      :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="联系信息" name="concatInfo">
              <el-form :model="form" label-width="100px" size="small">
                <el-form-item label="手机号码:">
                  <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="Email:">
                  <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="QQ号码:">
                  <el-input v-model="form.qq"></el-input>
                </el-form-item>
                <el-form-item label="微信:">
                  <el-input v-model="form.wechat"></el-input>
                </el-form-item>
                <el-form-item label="省市区:">
                  <el-cascader :props="props" v-model="administration" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址:">
                  <el-input v-model="form.address"></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addUser()">提 交</el-button>
            <el-button @click="dialogVisible = false;cancel()">取 消</el-button>
          </span>
          </div>
        </el-dialog>

        <el-dialog title="用户编辑" :visible.sync="dialogVisible2" width="40%">
          <div class="el-dialog-div">
          <el-tabs v-model="activeName2" @tab-click="handleAddTabs">
            <el-tab-pane label="基本信息" name="basicInfo">
              <el-form :model="form" label-width="100px" size="small">
                <el-form-item label="用户名:">
                  <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="用户组:">
                  <el-select v-model="form.groupId" filterable placeholder="请选择用户组">
                    <el-option 
                      v-for="item in groupList" 
                      :key="item.id" :label="item.groupName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="姓名:">
                  <el-input v-model="form.realname"></el-input>
                </el-form-item>
                <el-form-item label="性别:">
                  <el-select v-model="form.sex" placeholder="请选择性别">
                    <el-option 
                      v-for="item in genderList" 
                      :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所在厂家:">
                  <el-select v-model="form.factoryId" filterable @change="selectSubFactory" placeholder="请选择厂家">
                    <el-option 
                      v-for="item in factoryList" 
                      :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所在子厂家:">
                  <el-select v-model="form.subFactoryId" filterable placeholder="请选择子厂家">
                    <el-option 
                      v-for="item in subFactoryList" 
                      :key="item.id" :label="item.factoryName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属部门:">
                  <el-input v-model="form.depart"></el-input>
                </el-form-item>
                <el-form-item label="职务:">
                  <el-input v-model="form.position"></el-input>
                </el-form-item>
                <el-form-item label="是否启用:">
                  <el-select v-model="form.enableMark">
                    <el-option 
                      v-for="item in statusList" 
                      :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="联系信息" name="concatInfo">
              <el-form :model="form" label-width="100px" size="small">
                <el-form-item label="手机号码:">
                  <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="Email:">
                  <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="QQ号码:">
                  <el-input v-model="form.qq"></el-input>
                </el-form-item>
                <el-form-item label="微信:">
                  <el-input v-model="form.wechat"></el-input>
                </el-form-item>
                <el-form-item label="省市区:">
                  <el-cascader :key="key" :props="props" v-model="administration" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址:">
                  <el-input v-model="form.address"></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editUser()">提 交</el-button>
            <el-button @click="dialogVisible2 = false;cancel()">取 消</el-button>
          </span>
          </div>
        </el-dialog>

        <el-dialog :title="equipTitle" :visible.sync="dialogVisible3" :before-close="cancel2" width="30%">
          <el-tree show-checkbox ref="tree"
            :data="equipData" node-key="id"
            :default-expanded-keys="expandedList"
            :default-checked-keys="checkedList"
            :props="defaultProps">
          </el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="assignEquip()">提 交</el-button>
            <el-button @click="cancel2()">关 闭</el-button>
          </span>
        </el-dialog>

      </el-tab-pane>
      <el-tab-pane label="已启用列表" name='enableList'>

        <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
        <el-input v-model="queryForm.query" placeholder="" class="inputSearch" @keyup.enter.native="doSearch"></el-input>
        <el-select size="small" class="btnSearch" v-model="queryForm.queryLabel">
          <el-option 
            v-for="item in queryLabelList" 
            :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select size="small" class="btnSearch" v-model="queryForm.factoryId" filterable clearable placeholder="请选择厂家">
          <el-option 
            v-for="item in queryFactoryList" 
            :key="item.id" :label="item.factoryName" :value="item.id">
          </el-option>
        </el-select>
        <el-select size="small" class="btnSearch" v-model="queryForm.groupId" filterable clearable placeholder="请选择用户组">
          <el-option 
            v-for="item in queryGroupList" 
            :key="item.id" :label="item.groupName" :value="item.id">
          </el-option>
        </el-select>

        <el-table ref="multipleTable" tooltip-effect="dark" style="width: 100%" :data="tableData"
        :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column fixed prop="username" label="用户名" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="groupName" label="用户组" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="realname" label="姓名" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sexName" label="性别" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" label="手机号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="factoryName" label="所属厂家" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="subFactoryName" label="子厂家" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="depart" label="所属部门" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="position" label="职务" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="qq" label="QQ" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="wechat" label="微信" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="email" label="Email" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="administration" label="所属地区" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="address" label="详细地址" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="enableMark" label="启用/禁用" width="180" fixed="right">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enableMark" @change="changeStatus(scope.$index, scope.row)"
                active-color="#13ce66" :active-value="1"
                inactive-color="#ff4949" :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="manage" label="管理" width="180" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="分配设备查看权限" placement="top">
                <el-button size="mini" type="primary" class="el-icon-lock"
                @click="handleDistr(scope.$index, scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <el-button size="mini" type="primary" class="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button size="mini" type="danger" class="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="Number(totalCount)">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="已禁用列表" name='unableList'>
        <el-button class="btnSearch" size="small" type="primary" @click="doSearch()" icon="el-icon-search">搜索</el-button>
        <el-input v-model="queryForm.query" placeholder="" class="inputSearch" @keyup.enter.native="doSearch"></el-input>
        <el-select size="small" class="btnSearch" v-model="queryForm.queryLabel">
          <el-option 
            v-for="item in queryLabelList" 
            :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select size="small" class="btnSearch" v-model="queryForm.factoryId" filterable clearable placeholder="请选择厂家">
          <el-option 
            v-for="item in queryFactoryList" 
            :key="item.id" :label="item.factoryName" :value="item.id">
          </el-option>
        </el-select>
        <el-select size="small" class="btnSearch" v-model="queryForm.groupId" filterable clearable placeholder="请选择用户组">
          <el-option 
            v-for="item in queryGroupList" 
            :key="item.id" :label="item.groupName" :value="item.id">
          </el-option>
        </el-select>

        <el-table ref="multipleTable" tooltip-effect="dark" style="width: 100%" :data="tableData"
        :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column fixed prop="username" label="用户名" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="groupName" label="用户组" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="realname" label="姓名" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sexName" label="性别" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" label="手机号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="factoryName" label="所属厂家" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="subFactoryName" label="子厂家" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="depart" label="所属部门" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="position" label="职务" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="qq" label="QQ" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="wechat" label="微信" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="email" label="Email" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="administration" label="所属地区" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="address" label="详细地址" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="enableMark" label="启用/禁用" width="180" fixed="right">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enableMark" @change="changeStatus(scope.$index, scope.row)"
                active-color="#13ce66" :active-value="1"
                inactive-color="#ff4949" :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="manage" label="管理" width="180" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="分配设备查看权限" placement="top">
                <el-button size="mini" type="primary" class="el-icon-lock"
                @click="handleDistr(scope.$index, scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <el-button size="mini" type="primary" class="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button size="mini" type="danger" class="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="Number(totalCount)">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    
</div>

</template>

<script>
export default {
  name: "userlist",
  data() {
    const _self = this;
    return {
      currentUserId:"",
      value:false,
      //表格高度
      tableHeight:500,
      //表格数据
      tableData:[],
      //分页
      currentPage:1,
      pageSize: 10,
      totalCount:0,
      //默认选中用户列表
      activeName: "allList",
      //添加用户
      dialogVisible:false,
      activeName2:"basicInfo",
      administration:[],
      form:{
        id:"",
        username:"",
        password:"",
        groupId:"",
        realname:"",
        sex:"",
        factoryId:"",
        subFactoryId:"",
        depart:"",
        position:"",
        enableMark:1,
        mobile:"",
        email:"",
        qq:"",
        wechat:"",
        province:"",
        city:"",
        area:"",
        address:"",
      },
      groupList:[],
      factoryList:[],
      subFactoryList:[],
      genderList:[{
        value:1,
        label:"保密"
      },{
        value:2,
        label:"男"
      },{
        value:3,
        label:"女"
      }],
      statusList:[{
        value:1,
        label:"启用"
      },{
        value:0,
        label:"禁用"
      }],
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node;
          let type = "";
          let pcode = "";
          if(level == 0)
            type = "province";
          else if(level == 1)
            type = "city";
          else if(level == 2)
            type = "district";

          if(level > 0)
            pcode = node.value;
          
          setTimeout(() => {
            _self.$axios.get('/administration/query?level=' + type + '&pcode=' + pcode)
            .then(res=>{
              if(res.data.status == 200){
                let data = res.data.data;
                const nodes = [];
                for(let i=0;i<data.length;i++){
                  nodes.push({
                    value: data[i].code,
                    label: data[i].name,
                    leaf: data[i].level == 'district'
                  });
                }
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(nodes);
              }
            });
          }, 1000);
        }
      },
      
      //搜索
      queryGroupList:[],
      queryFactoryList:[],
      queryForm:{
        query:"",
        groupId:"",
        factoryId:"",
        queryLabel:"username",
      },
      queryLabelList:[{
        value: "username",
        label: "用户名",
      },{
        value: "id",
        label: "用户编号",
      },{
        value: "realname",
        label: "姓名",
      },{
        value: "mobile",
        label: "手机号码",
      },{
        value: "email",
        label: "Email",
      },{
        value: "qq",
        label: "QQ",
      }],
      //编辑用户
      dialogVisible2:false,
      key:0,
      
      //分配设备权限
      dialogVisible3:false,
      equipTitle:"",
      userId:"",
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      expandedList:[],
      checkedList:[],
      equipData:[],
    };
  },

  methods: {
    //标签页
    handleClick(tab, event) {
      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      this.loadData(currentPage,pageSize);
    },
    handleAddTabs(tab, event){
      // console.log(tab);
      // console.log(event);
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    //搜索
    doSearch(){
      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      this.loadData(currentPage,pageSize);
    },
    //新增用户
    addUser(){
      let form = this.form;
      let username = form.username;
      let password = form.password;
      let groupId = form.groupId;
      let realname = form.realname;
      let sex = form.sex;
      let factoryId = form.factoryId;
      let subFactoryId = form.subFactoryId;
      let depart = form.depart;
      let position = form.position;
      let enableMark = form.enableMark;
      let mobile = form.mobile;
      let email = form.email;
      let qq = form.qq;
      let wechat = form.wechat;
      let province = "";
      let city = "";
      let area = "";
      let address = form.address;
      if(this.administration.length == 3){
        province = this.administration[0];
        city = this.administration[1];
        area = this.administration[2];
      }
      if(username == "" || username == NaN){
        this.$message({
          duration: 2000,
          message: '用户名不能为空!',
          type: 'warning'
        });
      }
      if(password == "" || password == NaN){
        this.$message({
          duration: 2000,
          message: '密码不能为空!',
          type: 'warning'
        });
      }
      if(groupId == "" || groupId == NaN){
        this.$message({
          duration: 2000,
          message: '请选择用户组!',
          type: 'warning'
        });
      }
      if(sex == "" || sex == NaN){
        sex = 1;
      }
      this.$axios({
        headers:{
          'userId':this.currentUserId
        },
        method: 'POST',
        url: '/user/add',
        data: {
          username:username,
          password:password,
          groupId:groupId,
          realname:realname,
          sex:sex,
          factoryId:factoryId,
          subFactoryId:subFactoryId,
          depart:depart,
          position:position,
          enableMark:enableMark,
          mobile:mobile,
          email:email,
          qq:qq,
          wechat:wechat,
          province:province,
          city:city,
          area:area,
          address:address
        }
      })
      .then(res => {
        if(res.data.status == 200){
          this.$message({
            duration: 2000,
            message: '添加成功!',
            type: 'success'
          });
          this.dialogVisible = false;

          this.administration=[],
          this.form={
            id:"",
            username:"",
            password:"",
            groupId:"",
            realname:"",
            sex:"",
            factoryId:"",
            subFactoryId:"",
            depart:"",
            position:"",
            enableMark:1,
            mobile:"",
            email:"",
            qq:"",
            wechat:"",
            province:"",
            city:"",
            area:"",
            address:"",
          };

          let currentPage = this.currentPage;
          let pageSize = this.pageSize;
          this.loadData(currentPage,pageSize);
        }else{
          this.$message({
            duration: 2000,
            message: res.data.msg,
            type: 'warning'
          });
        }

        
      });
    },
    //获取用户组数据
    getUserGroup(){
      this.$axios.get('/userGroup/getAll')
      .then(res => {
        this.groupList = res.data.data;
        this.queryGroupList = res.data.data;
      });
    },
    //获取厂家数据
    getFactory(){
      this.$axios.get('/factory/getAll')
      .then(res => {
        this.factoryList = res.data.data;
        this.queryFactoryList = res.data.data;
      });
    },
    selectSubFactory(value){
      this.$axios.get('/factory/querySubFactory?parentId=' + value)
      .then(res => {
        this.subFactoryList = res.data.data;
      });
    },
    //加载用户数据
    loadData: function(page, pageSize){
      let _this = this;
      
      if(page == null || page == NaN)
          page = 1;
      if(pageSize == null || pageSize == NaN)
          pageSize = 10;

      let queryForm = this.queryForm;
      if(this.activeName == "allList"){
        queryForm.enableMark = "";
      }
      else if(this.activeName == "enableList"){
        queryForm.enableMark = 1;
      }else if(this.activeName == "unableList"){
        queryForm.enableMark = 0;
      }
      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'POST',
        url:'/user/query?page=' + page + '&pageSize=' + pageSize,
        data:queryForm
      })
      .then(res => {
          if(res.data.status == 200){
            let data = res.data.data;
            _this.tableData = data.rows;
            _this.totalCount = data.records;
          }else if(res.data.status == 503){
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
    //删除
    handleDelete(index,row){
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          this.$axios({
            headers:{
              userId:this.currentUserId
            },
            method: 'POST',
            url: '/user/deleteUser',
            data: [{
                id: row.id,
                deleteMark: 1
            }]
          })
          .then(res => {
            if(res.data.status == 200){
                this.$message({
                    type: 'success',
                    duration: 2000,
                    message: '删除成功!'
                });
                let currentPage = this.currentPage;
                let pageSize = this.pageSize;
                this.loadData(currentPage,pageSize);
            }else{
                this.$message({
                    duration: 2000,
                    message: res.data.msg,
                    type: 'warning'
                });
            }
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          duration: 2000,
          message: '已取消删除'
        });          
      });
    },
    //启用/禁用
    changeStatus(index,row){
      let enableMark = row.enableMark;
      let msg = "";

      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'POST',
        url: '/user/enableOrUnEnableUser?userId=' + row.id + "&mark=" + row.enableMark,
      })
      .then(res=>{
        if(res.data.status==200){
          if(enableMark == 0){
            msg = "禁用成功!";
          }else{
            msg = "启用成功!";
          }
          this.$message({
              type: 'success',
              duration: 2000,
              message: msg
          });
          let currentPage = this.currentPage;
          let pageSize = this.pageSize;
          this.loadData(currentPage,pageSize);
        }else{
          if(enableMark == 0){
            enableMark = 1;
            msg = res.data.msg;
          }
          else{
            enableMark = 0;
            msg = res.data.msg;
          }
          
          this.$message({
            type: 'info',
            duration: 2000,
            message: msg
          });
          this.tableData[index].enableMark = enableMark;
        }
      });
    },
    //批量删除
    handleBatchDelete: function() {
        // console.log(this.multipleSelection);
        this.$confirm('此操作将批量删除用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let multipleSelection = this.multipleSelection;
            let deleteList = [];
            const length = multipleSelection.length;
            for(let i = 0;i<length;i++){
                let role = {
                    id: multipleSelection[i].id,
                    deleteMark: 1
                }
                deleteList.push(role);
            }
            this.$axios({
              headers:{
                userId:this.currentUserId
              },
              method: 'POST',
              url: '/user/deleteUser',
              data: deleteList
            })
            .then(res => {
              if(res.data.status == 200){
                this.$message({
                  type: 'success',
                  duration: 2000,
                  message: '删除成功!'
                });
                let currentPage = this.currentPage;
                let pageSize = this.pageSize;
                let query = this.keywords;
                this.loadData(query,currentPage,pageSize);
              }else{
                this.$message({
                    duration: 2000,
                    message: res.data.msg,
                    type: 'warning'
                });
              }
            });
        }).catch(() => {
            this.$message({
                type: 'info',
                duration: 2000,
                message: '已取消删除'
            });          
        });
    },
    //用户编辑
    handleEdit(index,row){
      this.activeName2="basicInfo";
      this.dialogVisible2 = true;
      
      this.selectSubFactory(row.factoryId);

      this.form.id = row.id;
      this.form.username = row.username;
      this.form.groupId = row.groupId;
      this.form.realname = row.realname;
      this.form.sex = row.sex;
      this.form.factoryId = row.factoryId;
      this.form.subFactoryId = row.subFactoryId;
      this.form.depart = row.depart;
      this.form.position = row.position;
      this.form.enableMark = row.enableMark;
      this.form.mobile = row.mobile;
      this.form.email = row.email;
      this.form.qq = row.qq;
      this.form.wechat = row.wechat;
      this.form.province = row.province;
      this.form.city = row.city;
      this.form.area = row.area;
      this.form.address = row.address;

      if(row.province != "" && row.province != null){
        this.administration.push(row.province);
      }
      if(row.city != "" && row.city != null){
        this.administration.push(row.city);
      }
      if(row.area != "" && row.area != null){
        this.administration.push(row.area);
      }
      this.key += 1;
    },
    editUser(){
      let form = this.form;
      let id = form.id;
      let username = form.username;
      let groupId = form.groupId;
      let realname = form.realname;
      let sex = form.sex;
      let factoryId = form.factoryId;
      let subFactoryId = form.subFactoryId;
      let depart = form.depart;
      let position = form.position;
      let enableMark = form.enableMark;
      let mobile = form.mobile;
      let email = form.email;
      let qq = form.qq;
      let wechat = form.wechat;
      let province = form.province;
      let city = form.city;
      let area = form.area;
      let address = form.address;
      if(username == "" || username == NaN){
        this.$message({
          duration: 2000,
          message: '用户名不能为空!',
          type: 'warning'
        });
      }
      if(groupId == "" || groupId == NaN){
        this.$message({
          duration: 2000,
          message: '请选择用户组!',
          type: 'warning'
        });
      }
      if(sex == "" || sex == NaN){
        sex = 1;
      }
      if(this.administration.length == 3){
        province = this.administration[0];
        city = this.administration[1];
        area = this.administration[2];
      }

      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'POST',
        url: '/user/updateUserInfo',
        data: [{
          id:id,
          username:username,
          groupId:groupId,
          realname:realname,
          sex:sex,
          factoryId:factoryId,
          subFactoryId:subFactoryId,
          depart:depart,
          position:position,
          enableMark:enableMark,
          mobile:mobile,
          email:email,
          qq:qq,
          wechat:wechat,
          province:province,
          city:city,
          area:area,
          address:address
        }]
      })
      .then(res => {
        if(res.data.status == 200){
          this.$message({
            duration: 2000,
            message: '修改成功!',
            type: 'success'
          });

          let currentPage = this.currentPage;
          let pageSize = this.pageSize;
          this.loadData(currentPage,pageSize);

        }else{
          this.$message({
            duration: 2000,
            message: res.data.msg,
            type: 'warning'
          });
        }
        this.cancel();
        this.dialogVisible2 = false;
      });
    },
    //取消
    cancel(){
      this.activeName2="basicInfo";
      this.administration=[],
      this.form={
        id:"",
        username:"",
        password:"",
        groupId:"",
        realname:"",
        sex:"",
        factoryId:"",
        subFactoryId:"",
        depart:"",
        position:"",
        enableMark:1,
        mobile:"",
        email:"",
        qq:"",
        wechat:"",
        province:"",
        city:"",
        area:"",
        address:"",
      };

    },
    //获取所有设备的数据
    getEquipment(){
      this.$axios.get("/equipment/getEquipmentTree")
      .then(res=>{
        //console.log(res);
        this.equipData = res.data.data;
      });
    },
    //分配设备权限
    handleDistr(index,row){
      this.equipTitle = "给【" + row.username + "】分配设备权限";
      this.dialogVisible3 = true;
      this.userId = row.id;

      let equipData = this.equipData;
      let expandedList = [];
      for(let i=0;i<equipData.length;i++){
        for(let j=0;j<equipData[i].children.length;j++){
          expandedList.push(equipData[i].children[j].id);
        }
      }
      this.expandedList = expandedList;
      
      this.checkedList = [];
      let checkedList = [];
      this.$axios.get("/equipment/getUserEquip?userId=" + row.id)
      .then(res=>{
        //console.log(res);
        if(res.data.status == 200){
          let data = res.data.data;
          for(let i=0;i<data.length;i++){
            checkedList.push(data[i].id);
          }
        }
        this.checkedList = checkedList;
      });

    },
    assignEquip(){
      //console.log(this.$refs.tree.getCheckedNodes());
      let checkList = this.$refs.tree.getCheckedNodes();
      let data = [];
      for(let i=0;i<checkList.length;i++){
        if(checkList[i].children == null){
          data.push({
            userId:this.userId,
            equipId:checkList[i].id
          });
        }
      }
      this.$axios({
        headers:{
          userId:this.currentUserId
        },
        method: 'POST',
        url: '/user/assignEquip?userId=' + this.userId,
        data: data
      })
      .then(res=>{
        //console.log(res);
        if(res.data.status == 200){
          this.$message({
            duration: 2000,
            message: '分配成功!',
            type: 'success'
          });
        }else{
          this.$message({
            duration: 2000,
            message: res.data.msg,
            type: 'warning'
          });
        }
      });
      this.dialogVisible3 = false;
      this.$refs.tree.setCheckedKeys([]);
    },
    cancel2(){
      this.dialogVisible3 = false;
      this.$refs.tree.setCheckedKeys([]);
    },
    //用户资料下载
    download(){
      let selected = this.multipleSelection;
      //console.log(selected);

      if(selected != undefined && selected != null && selected != NaN && selected.length > 0){
        let length = selected.length;
        let ids = "";
        for(let i=0;i<length;i++){
          ids += selected[i].id;
          if(i != length-1)
            ids += ",";
        }
        this.$axios({
          headers:{
            userId:this.currentUserId
          },
          method: 'GET',
          url: '/user/downloadUserInfo'
        })
        .then(res=>{
          if(res.data.status == 200){
            window.location.href = "http://60.191.72.227:8081/user/download?ids=" + ids;
            // window.location.href = "http://192.168.1.4:8081/user/download?ids=" + ids;
          }else{
            this.$message({
              duration: 2000,
              message: res.data.msg,
              type: 'warning'
            });
          }
        });
      }else{
        this.$message({
          duration: 2000,
          message: "请选择用户!",
          type: 'warning'
        });
      }
    },

  },

  created(){
    this.getUserGroup();
    this.getFactory();
    this.getEquipment();

    this.currentUserId = localStorage.getItem('id');

    let currentPage = this.currentPage;
    let pageSize = this.pageSize;
    this.loadData(currentPage,pageSize);
  },
  mounted(){
    this.$nextTick(() => {
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 280;
        window.onresize = () => {
            this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 280;
        };
    });
  },
};
</script>
<style scoped>
  .btnAdd {
    margin: 10px 10px;
    float: left;
  }
  .btnDelete {
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
  .el-dialog-div{
    height: 55vh;
    overflow: auto;
  }
</style>
