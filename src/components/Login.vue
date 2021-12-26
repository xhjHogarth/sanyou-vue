<template>
  <div class="login-vue" :style="bg">
    <div class="container">
      <p class="title">WELCOME</p>
      <div class="input-c">
        <Input prefix="ios-contact" v-model="account" placeholder="用户名" clearable @on-blur="verifyAccount" />
        <p class="error">{{accountError}}</p>
      </div>
      <div class="input-c">
        <Input type="password" v-model="pwd" prefix="md-lock" placeholder="密码" clearable @on-blur="verifyPwd"
        @keyup.enter.native="submit" />
        <p class="error">{{pwdError}}</p>
      </div>
      <Button class="register" type="primary" @click="dialogVisible = true;">注册</Button>
      <Button :loading="isShowLoading" class="submit" type="primary" @click="submit">登陆</Button>
      <!-- <p class="account"><span @click="register">注册账号</span> | <span @click="forgetPwd">忘记密码</span></p> -->
    </div>

    <el-dialog title="用户注册" :visible.sync="dialogVisible" width="20%" :before-close="cancel">
      <div class="el-dialog-div">
        <el-form :model="form" label-width="100px" size="small">
            <el-form-item label="用户名:">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="登录密码:">
              <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="register()">提 交</el-button>
          <el-button @click="dialogVisible = false;cancel()">取 消</el-button>
        </span>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      account: '',
      pwd: '',
      accountError: '',
      pwdError: '',
      isShowLoading: false,
      bg: {},
      dialogVisible:false,
      form:{
        username:"",
        password:""
      },
    }
  },
  created() {
    // this.bg.backgroundImage = 'url(' + require('../assets/imgs/bg0' + new Date().getDay() + '.jpg') + ')'
    this.bg.backgroundImage = 'url(' + require('../assets/imgs/home.png') + ')'
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  methods: {
    verifyAccount() {
      if (this.account == '' || this.account == NaN) {
        this.accountError = '账号为空!'
      } else {
        this.accountError = ''
      }
    },
    verifyPwd() {
      if (this.pwd == '' || this.pwd == NaN) {
        this.pwdError = '密码为空!'
      } else {
        this.pwdError = ''
      }
    },
    register() {
      //console.log("注册成功");
      let user = this.form;
      let username = user.username;
      let pwd = user.password;
      if(username == ""){
        this.$message({
          duration: 2000,
          message: "用户名不能为空!",
          type: 'warning'
        });
      }else if(pwd == ""){
        this.$message({
          duration: 2000,
          message: "密码不能为空!",
          type: 'warning'
        });
      }else{
        this.$axios({
          method: 'POST',
          url: '/user/register',
          data: {
            username: username,
            password: pwd
          }
        })
        .then(res => {
          if(res.data.status == 200){
            this.$message({
              duration: 2000,
              message: "注册成功!",
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
      }
      this.form={
        username:"",
        password:""
      }
      this.dialogVisible = false;
    },
    cancel(){
      this.dialogVisible = false;
      this.form={
        username:"",
        password:""
      }
    },
    forgetPwd() {

    },
    submit() {
        
      this.$axios({
        headers:{
          username: this.account
        },
        method: 'POST',
        url: '/user/login',
        data: {
            username: this.account,
            password: this.pwd
        }
      })
      .then(res=>{
        if(res.data.status == 200){
          this.isShowLoading = true
          // 登陆成功 设置用户信息
          localStorage.setItem('userImg', 'https://avatars3.githubusercontent.com/u/22117876?s=460&v=4')
          localStorage.setItem('username', res.data.data.username)
          localStorage.setItem('id', res.data.data.id)
          localStorage.setItem('token', res.data.data.session)
          this.$router.push({ path: this.redirect || '/' })
        }else{
          this.$message({
            duration: 2000,
            message: res.data.msg,
            type: 'warning'
          });
        }
      });
    },
  },
}
</script>

<style>
.login-vue {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-repeat:no-repeat;
    background-size:100%;
}
.login-vue .container {
    background: rgba(255, 255, 255, .5);
    width: 300px;
    text-align: center;
    border-radius: 10px;
    padding: 30px;
}
.login-vue .ivu-input {
    background-color: transparent;
    color: #fff;
    outline: #fff;
    border-color: #fff;
}
.login-vue ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: rgba(255, 255, 255, .8);
}
.login-vue :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: rgba(255, 255, 255, .8);
}
.login-vue ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: rgba(255, 255, 255, .8);
}
.login-vue :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgba(255, 255, 255, .8);
}
.login-vue .title {
    font-size: 16px;
    margin-bottom: 20px;
}
.login-vue .input-c {
    margin: auto;
    width: 200px;
}
.login-vue .error {
    color: red;
    text-align: left;
    margin: 5px auto;
    font-size: 12px;
    padding-left: 30px;
    height: 20px;
}
.login-vue .submit {
    width: 90px;
    margin-left: 5px;
}
.login-vue .register {
    width: 90px;
}
.login-vue .account {
    margin-top: 30px;
}
.login-vue .account span {
    cursor: pointer;
}
.login-vue .ivu-icon {
    color: #eee;
}
.login-vue .ivu-icon-ios-close-circle {
    color: #777;
}
.el-dialog{
  display: flex;
  flex-direction: column;
  margin:0 !important;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  /*height:600px;*/
  max-height:calc(100% - 30px);
  max-width:calc(100% - 30px);
}
.el-dialog .el-dialog__body{
  flex:1;
  overflow: auto;
}
</style>
