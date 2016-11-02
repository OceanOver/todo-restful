var $ = require('jquery');
var _ = require('lodash');
var Handlebars = require('handlebars');
var Cookies = require('js-cookie');
var toastr = require('toastr');

exports.initMain = function() {
    var token = 'Bearer ' + Cookies.get('token');
    $.ajaxSetup({
        headers: {
            'Authorization': token
        }
    });

    //toastr option
    toastr.options = {
        "closeButton": true,
        "newestOnTop": false,
        "positionClass": "toast-bottom-right",
        "timeOut": "3000"
    }

    var todoContent = {
        list: []
    }
    var filterIndex = '0'; //默认为0:全部 1:未完成 2:已完成
    var progress = $.AMUI.progress;
    var item = $('#list-item').html();
    var itemTemplate = Handlebars.compile(item);

    function reloadData() {
        for (var i = 0; i < todoContent.list.length; i++) {
            todoContent.list[i].tag = i;
        }
        var html = itemTemplate(todoContent);
        $('.content-main').html(html);

        $('.close-icon').click(function(event) {
            /* Act on the event */
            eventAction.delete(event.target);
        });

        $('.itemClear').click(function(event) {
            /* Act on the event */
            eventAction.clear(event.target);
        });

        // modify item
        $('.todos-content-textInput').keydown(function(event) {
            if (event.keyCode === 13) {
                eventAction.modifyItem(event.target);
            }
        });
        // focusout
        $('.todos-content-textInput').focusout(function(event) {
            /* Act on the event */
            eventAction.modifyFocusout(event.target);
        });

        $.post("/items/itemLeft", function(data) {
            progress.done();
            var info = '剩0项';
            if (data.state === 1000) {
                info = '剩' + data.count + '项';
                $('.remain-item').html(info);
            }
        });
    }

    var eventAction = {
        list: function(type) {
            progress.start();
            $.post("/items/list", {
                type: type
            }, function(data) {
                progress.done();
                console.log(data);
                if (data.state === 1001) {
                    toastr.warning(data.msg);
                } else if (data.state === 1000) {
                    todoContent.list = data.list;
                    reloadData();
                }
            });
        },
        add: function() {
            var inputContent = $('.todos-title-textInput').val();
            if (inputContent.length > 0) {
                progress.start();
                $.post("/items/addItem", {
                    content: inputContent
                }, function(data) {
                    progress.done();
                    console.log(data);
                    if (data.state === 1000) {
                        todoContent.list.push(data.item);
                        $('.todos-title-textInput').val('');
                        reloadData();
                    } else {
                        // alert fail
                        toastr.warning('添加失败');
                    }
                });
            }
        },
        delete: function(button) {
            progress.start();
            var tag = $(button).attr('tag');
            var itemId = todoContent.list[tag]._id;
            $.post("/items/deleteItem", {
                id: itemId
            }, function(data) {
                progress.done();
                if (data.state === 1000) {
                    _.pullAt(todoContent.list, [tag]);
                    reloadData();
                } else {
                    // alert fail
                    toastr.warning('删除失败');
                }
            });
        },
        clear: function(checkbox) {
            var tag = $(checkbox).attr('tag');
            var itemId = todoContent.list[tag]._id;
            var completed = todoContent.list[tag].completed;
            completed = !completed;
            progress.start();
            $.post("/items/clearItem", {
                id: itemId,
                completed: completed
            }, function(data) {
                progress.done();
                if (data.state === 1000) {
                    if (filterIndex === '1' || filterIndex === '2') {
                        _.pullAt(todoContent.list, [tag]);
                    } else {
                        todoContent.list[tag].completed = completed;
                    }
                    reloadData();
                } else {
                    toastr.warning('请求完成任务 失败');
                }
            });
        },
        clearAll: function() {
            if (todoContent.list.length === 0) {
                return;
            }
            progress.start();
            var completed = true;
            if (filterIndex === '1') {
                if (todoContent.list.length === 0) {
                    completed = false;
                } else {
                    completed = true;
                }
            } else if (filterIndex === '2') {
                if (todoContent.list.length === 0) {
                    completed = true;
                } else {
                    completed = false;
                }
            } else {
                if (todoContent.list.length === 0) {
                    return;
                }
                var count = todoContent.list.length;
                for (var i = 0; i < count; i++) {
                    var completed_all = todoContent.list[i].completed;
                    if (!completed_all) {
                        break;
                    }
                    if (i === count - 1) {
                        completed = false;
                    }
                }
            }
            $.post("/items/clearAll", {
                completed: completed
            }, function(data) {
                progress.done();
                if (data.state === 1000) {
                    if (filterIndex === '1' || filterIndex === '2') {
                        eventAction.list(filterIndex);
                    } else {
                        var count = todoContent.list.length;
                        for (var i = 0; i < count; i++) {
                            todoContent.list[i].completed = completed;
                        }
                        reloadData();
                    }
                } else {
                    toastr.warning('请求完成全部任务 失败');
                }
            });
        },
        deleteCompleted: function() {
            var count = 0;
            for (var i = 0; i < todoContent.list.length; i++) {
                var completed = todoContent.list[i].completed;
                if (completed === true) {
                    count++;
                }
            }
            if (count === 0) {
                toastr.info('暂无已完成的任务');
                return;
            }
            progress.start();
            $.post("/items/deleteComplete", function(data) {
                progress.done();
                if (data.state === 1000) {
                    var deleteIndexs = [];
                    for (var i = 0; i < todoContent.list.length; i++) {
                        var completed = todoContent.list[i].completed;
                        if (completed === true) {
                            deleteIndexs.push(i);
                        }
                    }
                    _.pullAt(todoContent.list, deleteIndexs);
                    reloadData();
                } else {
                    toastr.warning('删除已完成全部任务 失败');
                }
            });
        },
        filterList: function(button) {
            $('.state-item').removeClass('am-active');
            $(button).addClass('am-active');
            // 0:all 1:active 2:completed
            var type = 0;
            var buttonIndex = $(button).attr('buttonIndex');
            type = buttonIndex;
            if (filterIndex === buttonIndex) {
                return;
            }
            filterIndex = buttonIndex;
            progress.start();
            $.post("/items/list", {
                type: type
            }, function(data) {
                progress.done();
                if (data.state === 1000) {
                    todoContent.list = [];
                    todoContent.list = data.list;
                    reloadData()
                } else if (data.state === 1001) {
                    toastr.warning(data.msg);
                }
            });
        },
        modifyItem: function(input) {
            var modifiedInfo = $(input).val();
            var tag = $(input).attr('tag');
            if (modifiedInfo && modifiedInfo === todoContent.list[tag].content) {
                return;
            }
            progress.start();
            $.post("/items/modifyItem", {
                id: todoContent.list[tag]._id,
                content: modifiedInfo
            }, function(data) {
                console.log(data);
                progress.done();
                if (data.state === 1000) {
                    todoContent.list[tag].content = modifiedInfo;
                    reloadData()
                } else {
                    toastr.warning('修改失败');
                }
            });
        },
        modifyFocusout: function(input) {
            var tag = $(input).attr('tag');
            $(input).val(todoContent.list[tag].content);
        }
    }

    var App = {
        createNew: function() {
            var app = {};
            app.list = function() {
                eventAction.list();
            };
            app.bindEvent = function() {
                $('.content-header-add').click(function(event) {
                    /* Act on the event */
                    eventAction.add();
                });
                $('.todos-title-input').keydown(function(event) {
                    // add item
                    if (event.keyCode === 13) {
                        eventAction.add();
                    }
                });

                $('.close-icon').click(function(event) {
                    /* Act on the event */
                    eventAction.delete(event.target);
                });

                $('.itemClear').click(function(event) {
                    /* Act on the event */
                    eventAction.clear(event.target);
                });

                $('.content-header-all').click(function(event) {
                    /* Act on the event */
                    eventAction.clearAll();
                });

                $('.content-footer-delete').click(function(event) {
                    /* Act on the event */
                    eventAction.deleteCompleted();
                });

                // buttonIndex 1全部 2未完成 3已完成
                $('.state-item').click(function(event) {
                    /* Act on the event */
                    eventAction.filterList(event.target);
                });

                // modify item
                $('.todos-content-textInput').keydown(function(event) {
                    if (event.keyCode === 13) {
                        eventAction.modifyItem(event.target);
                    }
                });
                // focusout
                $('.todos-content-textInput').focusout(function(event) {
                    /* Act on the event */
                    eventAction.modifyFocusout(event.target);
                });
            }
            return app;
        }
    }

    var app = App.createNew();
    app.list();
    app.bindEvent();
}
