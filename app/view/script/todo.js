import toastr from 'toastr'
import login from './login'
import register from './register'
import main from './main'


$(function() {
  //toastr option
  toastr.options = {
    'closeButton': true,
    'newestOnTop': false,
    'positionClass': 'toast-top-right',
    'timeOut': '2000'
  }
  const pageName = $('body')
    .attr('name')
  if (pageName === 'index') {
    login.bindEvent()
  } else if (pageName === 'register') {
    register.bindEvent()
  } else if (pageName === 'main') {
    main.initMain()
  }
})
