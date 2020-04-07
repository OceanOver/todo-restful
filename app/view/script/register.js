import Swal from 'sweetalert2'
import request from './request'

export default {
    bindEvent: function () {
        $('.register-button').click(function () {
            /* Act on the event */
            const username = $('.register-username').val().replace(/(^\s+)|(\s+$)/g, '')
            const password = $('.register-password').val().replace(/(^\s+)|(\s+$)/g, '')
            const confirmPas = $('.register-confirm').val().replace(/(^\s+)|(\s+$)/g, '')
            if (!username || username.length === 0) {
                return
            }
            if (!password || password.length === 0) {
                return
            }
            if (confirmPas !== password) {
                $('.group-register-confirm').addClass('am-form-warning')
                $('.register-confirm').attr('placeholder', '密码输入不一致')
                $('.register-confirm').val('')
                return
            }
            request().post('/user/register', {
                username: username,
                password: password
            }).then(res => {
                const {state, msg} = res.data
                /*optional stuff to do after success */
                if (state === 1000) {
                    Swal('注册成功').then(result => {
                        if (result.value) {
                            setTimeout(() => {
                                location.href = '/'
                            }, 500)
                        }
                    })
                } else if (state === 1001) {
                    Swal(msg)
                }
            })
        })

        $('.register-confirm').focus(function () {
            /* Act on the event */
            if ($('.group-register-confirm').hasClass('am-form-warning')) {
                $('.group-register-confirm').removeClass('am-form-warning')
                $('.register-confirm').attr('placeholder', '输入密码')
            }
        })
    }
}

