import toastr from 'toastr'
import Swal from 'sweetalert2'
import request from './request'
import { local_save } from './store'

export default {
  bindEvent: function() {
    // login
    $('.login-button')
      .click(function() {
        /* replace whitespace with '' */
        const username = $('.login-username')
          .val()
          .replace(/(^\s+)|(\s+$)/g, '')
        const password = $('.login-password')
          .val()
          .replace(/(^\s+)|(\s+$)/g, '')
        let alertMsg
        if (!username || username.length === 0) {
          alertMsg = '请输入用户名'
        } else if (!password || password.length === 0) {
          alertMsg = '请输入密码'
        }
        if (alertMsg) {
          toastr['warning'](alertMsg)
          return
        }
        $('.login-button')
          .addClass('disabled')
        request()
          .post('/user/login', {
            username, password
          })
          .then(res => {
            const { state, msg, data } = res.data
            console.log('请求登录')
            console.log(res.data)
            if (state === 1000) {
              let { token, expire } = data
              expire = parseInt(expire) * 1000
              local_save('access_token', token, expire)
              Swal({
                title: '登陆成功',
                type: 'success',
                confirmButtonText: 'OK'
              })
                .then(result => {
                  if (result.value) {
                    setTimeout(() => {
                      location.href = '/main'
                    }, 1000)
                  }
                })
            } else if (state === 1001) {
              Swal(msg)
            }
            $('.login-button')
              .removeClass('disabled')
          })
      })
  }
}


