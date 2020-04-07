import Swal from 'sweetalert2'
import toastr from 'toastr'
import request from './request'
import _ from 'lodash'

export default {
  initMain: function() {
    let username = 'username'
    let todoContent = {
      list: []
    }
    let filterIndex = '0' //默认为0:全部 1:未完成 2:已完成
    const templateString = '{% for item in list %}\n' +
      '        <li class="row main-item">\n' +
      '            <div class="col-1 item-close">\n' +
      '                <label>\n' +
      '                    {% if item.completed %}\n' +
      '                        <input class="itemClear" type="checkbox" tag={{ item.tag }} checked>\n' +
      '                    {% else %}\n' +
      '                        <input class="itemClear" type="checkbox" tag={{ item.tag }}>\n' +
      '                    {% endif %}\n' +
      '                </label>\n' +
      '            </div>\n' +
      '            <div class="col-9 item-input">\n' +
      '                <input type="text" class="form-control todos-content-textInput"\n' +
      '                       value={{ item.content }} tag={{ item.tag }}>\n' +
      '            </div>\n' +
      '            <div class="col-2 item-delete">\n' +
      '                <span class="close-icon" tag={{ item.tag }}>&times;</span>\n' +
      '            </div>\n' +
      '        </div>\n' +
      '    {% endfor %}'
    nunjucks.configure({ autoescape: true })
    const template = nunjucks.compile(templateString)
    const itemTemplate = (data) => {
      const { list } = data
      const res = template.render({ list })
      return res
    }

    function reloadData() {
      for (let i = 0; i < todoContent.list.length; i++) {
        todoContent.list[i].tag = i
      }
      let html = itemTemplate(todoContent)
      $('.content-main')
        .html(html)

      $('.close-icon')
        .click(function(event) {
          /* Act on the event */
          eventAction.delete(event.target)
        })

      $('.itemClear')
        .click(function(event) {
          /* Act on the event */
          eventAction.clear(event.target)
        })

      // modify item
      $('.todos-content-textInput')
        .keydown(function(event) {
          if (event.keyCode === 13) {
            eventAction.modifyItem(event.target)
          }
        })
      // focusout
      $('.todos-content-textInput')
        .focusout(function(event) {
          /* Act on the event */
          eventAction.modifyFocusout(event.target)
        })

      request(true)
        .get('/item/statistics')
        .then(res => {
          console.log('获取统计信息')
          console.log(res.data)
          const { state, msg, data } = res.data
          if (state === 1000) {
            let info = '剩0项'
            if (data) {
              const { all, complete } = data
              const count = all - complete
              info = '剩' + count + '项'
              $('.remain-item')
                .html(info)
            }
          } else if (state === 1001) {
            toastr['info'](msg)
          }
        })
    }

    const eventAction = {
      list: function(type) {
        let url = `/item/list?type=${type}`
        console.log(url)
        request(true)
          .get(url)
          .then(res => {
            console.log(`request type ${type} items`)
            console.log(res.data)
            const { state, list } = res.data
            if (res.data.username !== username) {
              username = res.data.username
              $('.footer-username')
                .text(username)
            }
            if (state === 1000) {
              todoContent.list = list
              reloadData()
            } else {
              toastr['warning'](data.msg)
            }
          })
      },
      add: function() {
        const inputContent = $('.todos-title-textInput')
          .val()
        if (inputContent.length > 0) {
          request(true)
            .post('/item/addItem', {
              content: inputContent
            })
            .then(res => {
              console.log('add task')
              console.log(res.data)
              const { state, item } = res.data
              if (state === 1000) {
                todoContent.list.unshift(item)
                $('.todos-title-textInput')
                  .val('')
                reloadData()
              } else {
                // alert fail
                toastr['warning']('添加失败')
              }
            })
        }
      },
      delete: function(button) {
        const tag = $(button)
          .attr('tag')
        const itemId = todoContent.list[tag].id
        const url = `/item/deleteItem/${itemId}`
        request(true)
          .delete(url)
          .then(res => {
            const { state } = res.data
            if (state === 1000) {
              _.pullAt(todoContent.list, [tag])
              reloadData()
            } else {
              // alert fail
              toastr['warning']('删除失败')
            }
          })
      },
      clear: function(checkbox) {
        const tag = $(checkbox)
          .attr('tag')
        const itemId = todoContent.list[tag].id
        let completed = todoContent.list[tag].completed
        completed = !completed
        request(true)
          .post('/item/modifyItem', {
            id: itemId,
            completed: completed
          })
          .then(res => {
            const { state } = res.data
            if (state === 1000) {
              if (filterIndex === '1' || filterIndex === '2') {
                _.pullAt(todoContent.list, [tag])
              } else {
                todoContent.list[tag].completed = completed
              }
              reloadData()
            } else {
              toastr['warning']('标记任务完成失败')
            }
          })
      },
      clearAll: function() {
        if (todoContent.list.length === 0) {
          return
        }
        let completed = true
        if (filterIndex === '1') {
          completed = todoContent.list.length === 0
        } else if (filterIndex === '2') {
          completed = todoContent.list.length === 0
        } else {
          if (todoContent.list.length === 0) {
            return
          }
          const count = todoContent.list.length
          for (let i = 0; i < count; i++) {
            let completed_all = todoContent.list[i].completed
            if (!completed_all) {
              break
            }
            if (i === count - 1) {
              completed = false
            }
          }
        }
        request(true)
          .post('/item/clearAll', {
            completed,
            type: filterIndex
          })
          .then(res => {
            const { state } = res.data
            if (state === 1000) {
              if (filterIndex === '1' || filterIndex === '2') {
                eventAction.list(filterIndex)
              } else {
                const count = todoContent.list.length
                for (let i = 0; i < count; i++) {
                  todoContent.list[i].completed = completed
                }
                reloadData()
              }
            } else {
              toastr['warning']('修改失败')
            }
          })
      },
      deleteCompleted: function() {
        let count = 0
        for (let i = 0; i < todoContent.list.length; i++) {
          const completed = todoContent.list[i].completed
          if (completed === true) {
            count++
          }
        }
        if (count === 0) {
          toastr['info']('暂无已完成的任务')
          return
        }
        request(true)
          .delete('/item/deleteComplete')
          .then(res => {
            const { state } = res.data
            if (state === 1000) {
              let deleteIndexs = []
              for (let i = 0; i < todoContent.list.length; i++) {
                const completed = todoContent.list[i].completed
                if (completed === true) {
                  deleteIndexs.push(i)
                }
              }
              _.pullAt(todoContent.list, deleteIndexs)
              reloadData()
            } else {
              toastr['warning']('删除已完成全部任务失败')
            }
          })
      },
      filterList: function(button) {
        $('.state-item')
          .removeClass('active')
        $(button)
          .addClass('active')
        // type: 0 全部 1 未完成 2 已完成 3 已过期
        const buttonIndex = $(button)
          .attr('buttonIndex')
        if (filterIndex === buttonIndex) {
          return
        }
        filterIndex = buttonIndex
        this.list(buttonIndex)
      },
      modifyItem: function(input) {
        const modifiedInfo = $(input)
          .val()
        const tag = $(input)
          .attr('tag')
        if (modifiedInfo && modifiedInfo === todoContent.list[tag].content) {
          return
        }
        request(true)
          .post('/item/modifyItem', {
            id: todoContent.list[tag].id,
            content: modifiedInfo
          })
          .then(res => {
            const { state } = res.data
            if (state === 1000) {
              todoContent.list[tag].content = modifiedInfo
              reloadData()
            } else {
              toastr['warning']('修改失败')
            }
          })
      },
      modifyFocusout: function(input) {
        const tag = $(input)
          .attr('tag')
        $(input)
          .val(todoContent.list[tag].content)
      },
      logout: function() {
        //退出登录
        request(true)
          .post('/user/logout')
          .then(res => {
            console.log('退出账户登录')
            console.log(res.data)
            const { state, msg } = res.data
            if (state === 1000) {
              Swal({
                title: '已注销登录',
                type: 'success',
                confirmButtonText: 'OK'
              })
                .then(result => {
                  if (result.value) {
                    setTimeout(() => {
                      location.href = '/'
                    }, 1000)
                  }
                })
            } else {
              toastr['warning'](msg)
            }
          })
      }
    }

    const App = {
      createNew: function() {
        let app = {}
        app.list = function(type) {
          eventAction.list(type)
        }
        app.bindEvent = function() {
          $('.content-header-add')
            .click(function() {
              /* Act on the event */
              eventAction.add()
            })
          $('.todos-title-input')
            .keydown(function(event) {
              // add item
              if (event.keyCode === 13) {
                eventAction.add()
              }
            })

          $('.close-icon')
            .click(function(event) {
              /* Act on the event */
              eventAction.delete(event.target)
            })

          $('.itemClear')
            .click(function(event) {
              /* Act on the event */
              eventAction.clear(event.target)
            })

          $('.content-header-all')
            .click(function() {
              /* Act on the event */
              eventAction.clearAll()
            })

          $('.content-footer-delete')
            .click(function() {
              /* Act on the event */
              eventAction.deleteCompleted()
            })

          // buttonIndex 1全部 2未完成 3已完成
          $('.state-item')
            .click(function(event) {
              /* Act on the event */
              eventAction.filterList(event.target)
            })

          // modify item
          $('.todos-content-textInput')
            .keydown(function(event) {
              if (event.keyCode === 13) {
                eventAction.modifyItem(event.target)
              }
            })
          // focusout
          $('.todos-content-textInput')
            .focusout(function(event) {
              /* Act on the event */
              eventAction.modifyFocusout(event.target)
            })
          //logout
          $('.logout-icon')
            .click(function() {
              /* Act on the event */
              eventAction.logout()
            })
        }
        return app
      }
    }

    const app = App.createNew()
    app.list(0)
    app.bindEvent()
  }
}
