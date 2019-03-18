const oauthHost = 'http://139.199.224.230:7001'
const syllabusHost = 'http://139.199.224.230:7002'

const api = {
    login: oauthHost + '/oauth/login',  // 汕头大学账号账号密码验证
    authorize: oauthHost + '/oauth/authorize',   // 课程表Oauth授权
    stu_login: syllabusHost + '/user/stu_login',   // 课程表Oauth授权，重定向接口
    stu_getOauth: syllabusHost + '/user/get_oauth_data', // 获取查询认证信息
    user_info: syllabusHost + '/user/info',    // 查询用户信息
}

export { api }
