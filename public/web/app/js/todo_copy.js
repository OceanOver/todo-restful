'use strict';

var $ = require('jquery');
var _ = require('lodash');
var Handlebars = require('handlebars');

$(function() {
    var progress = $.AMUI.progress;
    var item = $('#list-item').html();
    var itemTemplate = Handlebars.compile(item);
    var content = {
        list: [{
            content: '这是一条测试数据1',
            tag: 0,
            completed:true
        }, {
            content: '这是一条测试数据2',
            tag: 1,
            completed:false
        }, {
            content: '这是一条测试数据3',
            tag: 2,
            completed:false
        }, {
            content: '这是一条测试数据4',
            tag: 3,
            completed:false
        }]
    };
    var itemHtml = itemTemplate(content);
    $('.content-main').html(itemHtml);

    var bindEvent = function(content) {
        for (var i = 0; i < content.list.length; i++) {
            content.list[i].tag = i;
        }
        console.log(content);
        var itemHtml = itemTemplate(content);
        $('.content-main').html(itemHtml);
        $('.close-icon').click(function(event) {
            eventAction.delete(event.target);
        });
    };

    var eventAction = {
        add:function() {
            progress.start();
            progress.done();
            console.log(123);
            var inputContent = $('.todos-title-textInput').val();
            if (inputContent.length > 0) {
                var item = {content:inputContent,tag:0};
                content.list.push(item);
                $('.todos-title-textInput').val('');
                bindEvent(content);
            }
        },
        delete: function(button) {
            progress.start();
            progress.done();
            var tag = $(button).attr('tag');
            _.pullAt(content.list, [tag]);
            progress.done();
            bindEvent(content);
        },
        clear:function(checkbox){
            var tag = $(checkbox).attr('tag');
            var completed = content.list[tag].completed;
            completed = !completed;
            content.list[tag].completed = completed;
            console.log(content);
        }
    };

    $('.close-icon').click(function(event) {
        /* Act on the event */
        eventAction.delete(this);
    });

    $('.content-header-add').click(function(event) {
        /* Act on the event */
        eventAction.add();
    });

    $('.itemClear').click(function(event) {
        /* Act on the event */
        eventAction.clear(this);
    });

    $('.content-header-all').click(function(event) {
        /* Act on the event */

    });
});
