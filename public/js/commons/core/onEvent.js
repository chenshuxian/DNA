import $ from 'jquery';
import {DataControl} from './dataControl.js';

// 添加 textbox clesnBtn
$.extend($.fn.textbox.methods, {
  addClearBtn: function(jq, iconCls) {
    return jq.each(function() {
      var t = $(this);
      var opts = t.textbox('options');
      opts.icons = opts.icons || [];
      opts.icons.unshift({
        iconCls: iconCls,
        handler: function(e) {
          var cg = e.data.target;
          $(cg).textbox('clear').textbox('textbox').focus();
          var dg = $(cg).combogrid('grid');
          dg.datagrid('loadData', cg.localStore);
          $(this).css('visibility', 'hidden');
        }
      });
      t.textbox();
      if (!t.textbox('getText')) {
        t.textbox('getIcon', 0).css('visibility', 'hidden');
      }
      t.textbox('textbox').bind('keyup', function() {
        var icon = t.textbox('getIcon', 0);
        if ($(this).val()) {
          icon.css('visibility', 'visible');
        } else {
          icon.css('visibility', 'hidden');
        }
      });
    });
  }
});

$.fn.serializeObject = function() {
  var o = {},
      a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

/*
 * 屏蔽网页滚动
 * **/
var bodyScroll = function() {
  $('html,body').css({
    overflow: 'visible'
  });
  $("body,html").unbind("touchmove");
};

$(document).on('click', '.J_ClosePop', function(e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).parents('.pop').hide();
  bodyScroll();
});

$(window).on('resize', function() {
  DataControl.autoFillScreen();
});
$(document).on('mouseover', '.drop-down', function() {
  var li = $(this).children('.drop-down-menu').children().find('li');
  if (li.length > 0) {
    $(this).children('.drop-down-menu').show();
    $(this).addClass('active');
  }
});
$(document).on('mouseout', '.drop-down', function() {
  $(this).children('.drop-down-menu').hide();
  $(this).removeClass('active');
});

$(document).on('click', '.drop-down a', function() {
  $(this).parents('.drop-down-menu').hide();
});

let siteMenu = $('#site-menu');
/* 网站主菜单*/
$('.submenu-item', siteMenu).on('mouseover', function() {
  $(this).addClass('active').siblings().removeClass('active');
  var i = $(this).find('i[data-class]');
  i.addClass(i.attr('data-class'));
  $('#shadow').stop().fadeIn();
});
$('.submenu-item', siteMenu).on('mouseleave', function() {
  $(this).removeClass('active');
  var i = $(this).find('i[data-class]');
  i.removeClass(i.attr('data-class'));
  $('#shadow').stop().fadeOut();
});

$(document).on('click', '.main-content-header li', function() {
  var ul = $(this).closest("ul");
        // span = $(this).closest("div").prev();//取得父节的上一个兄弟节点

    // 将所有blue 清空
  ul.find("li").each(function() {
    if ($(this).hasClass("blue")) {
      $(this).removeClass("blue");
    }
  });

  $(this).addClass('blue');
});
/* 状态提示信息*/
$(document).on('click', '.status-switch.help-tips', function() {
  var checkStatus = $(this).find('input').prop('checked');
  if (checkStatus) {
    $(this).find('.help-tips-content').text('开启');
  } else {
    $(this).find('.help-tips-content').text('停用');
  }
});

$(document).on('mouseover', '.helpers', function(e) {
  var x = $(this).offset().left + 10,
      y = $(this).offset().top;
  $(this).children('.helpers-content').css({
    left: x + 'px',
    top: y + 'px'
  }).fadeIn(100);
});

$(document).on('mouseleave', '.helpers', function(e) {
  $(this).find('.helpers-content').fadeOut(100);
});

$(document).on('mouseover', function(e) {
  if ((e.target.tagName.toLowerCase() === 'span')) {
    if (!$(e.target).hasClass('helpers')) {
      if ($(e.target).find('i').length > 0) {
        var cls = $(e.target).find('i').attr('class').split('-')[1];
        $(e.target).find('i').addClass(cls + '-hover');
      }
    }
  }
});
//
$(document).on('mouseleave', 'a,span', function(e) {
  if ((e.target.tagName.toLowerCase() === 'span')) {
    if (!$(e.target).hasClass('helpers')) {
      if ($(this).find('i').length > 0) {
        var cls = $(this).find('i').attr('class').split('-')[1];
        $(this).find('i').removeClass(cls + '-hover');
      }
    }
  }
});
