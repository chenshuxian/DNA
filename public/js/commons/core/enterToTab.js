import $ from 'jquery';

$('*').on('keydown', 'input,a,select', function(e) {
  var self = $(this),
      form = self.parents('form:eq(0)'),
      focusable, next, tagName, tagId, regStr, regStr2, regStr3, regStr4;;

  if (e.keyCode === 13) {
    focusable = form.find('input,a,select,textarea').filter(':text:visible');
    next = focusable.eq(focusable.index(this) + 1);
    if (next.length) {
      checkDisabled(focusable, next);
      next.focus();
      next.select();
    } else {
      let tagId = self[0].id.toLowerCase(),
          regStr = /search/;
      // 判断是表单事件或查询事件
      if (regStr.test(tagId)) {
        $(`#${self[0].id}`).next().click();	// 查询事件触发
      } else {
        $("#editBtn").click();
      }
    }
    return false;
  }
});
// 跳过disabaled栏位
function checkDisabled(focusable, next) {
  if (next[0].disabled) {
    next = focusable.eq(focusable.index(next) + 1);
    checkDisabled(focusable, next);
  } else {
    next.focus();
    next.select();
    return false;
  }
}
