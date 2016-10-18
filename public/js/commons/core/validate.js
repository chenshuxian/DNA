import $ from 'jquery';

let _err = (target, msg) => {
  let t = $(target);
  if (t.hasClass('form-control')) {
    t = t.parent();
  }
  let m = t.next('.error-message');
  if (!m.length) {
    m = $('<div class="error-message"></div>').insertAfter(t);
  }
  m.html(msg);
};

export let Validate = {
  dateToUnix(string) {
    var f = string.split(' ', 2),
        d = (f[0] ? f[0] : '').split('-', 3),
        t = (f[1] ? f[1] : '').split(':', 2);
    return (new Date(
    parseInt(d[0], 10) || null,
    (parseInt(d[1], 10) || 1) - 1,
    parseInt(d[2], 10) || null,
    parseInt(t[0], 10) || null,
    parseInt(t[1], 10) || null,
    parseInt(t[2], 10) || null
    )).getTime() / 1000;
  },
  dateCompare(startdate, enddate) {
    var starttimes = this.dateToUnix(startdate),
        endtimes = this.dateToUnix(enddate);

    if (starttimes > endtimes) {
      Dna.showMsg('开始日期需小于结束日期!');
      return false;
    }
    return true;
  },
  comboGrid(obj, msg, parentId, req) {
    var
        comboText = obj.getText(),
        require = true;

    if (req === 0 && comboText === "") {
      require = false;
    }
    if (require) {	// 必填
      if (comboText === "") {
        Dna.showMsg(`${msg}数据为空,，请从下拉列表中添加！`, function() {
          $(`#${parentId}input:text`).select();
        });
        return true;
      }
      if (!obj.checkValue(false) && obj.comboEditText !== comboText) {
        Dna.showMsg(`${msg}数据不存在,，请从下拉列表中添加！`, function() {
          $("#" + parentId + "input:text").select();
        });
        return true;
      }
    }
  },

/* comboGrid 编辑时进行验证
当编辑打开始进行栏位值验证
如为空代表已被停用，但是需要可以进行存储
若进来后有做修正动作时，且值有更动时，就需进行重新验证。
运用于 editCallBack 中
*/
  comboGridEdit(obj, inputName, id) {
    var comboText = obj.getText(),
        setText = `${comboText}(此选择已被停用)`;
  // 已被停用
    if (!obj.checkValue(false) && comboText !== "") {
      obj.setText(setText);
      $(`input[name='${inputName}']`).val(id);
      obj.comboEditText = setText;
    }
  },
  // 驗證綁定
  /*
  params ={
    obj: 綁定對象
    setting: 設定
    len: 長度
  }
  */
  vb(params) {
    let arr = Array.from(params);
    for (let [k, v] of arr.entries()) {
      let {obj, setting, len = 30} = v;
      setting.err = _err;
      $(obj).validatebox(setting);
      $(obj).attr('maxlength', len);
    }
  },

  err: _err
};

$.extend($.fn.validatebox.defaults.rules, {
  symbol: {
    validator: function(value) {
      var reg = /[<>|$]/;
      return !reg.test(value);
    },
    message: "本次输入中有特殊字符，请重新输入!"
  },
  authUser: {
    validator: function(value) {
      var reg = /^[A-Za-z0-9_]{1,14}$/;
      return reg.test(value);
    },
    message: "长6-20字符，可由数字、字母和下划线组成，字母不区分大小写!"
  },
	// 客户帐号创建
  customer: {
    validator: function(value) {
      value = value.toLowerCase();
      var reg = /^(?!.*admin)/;
      return reg.test(value);
    },
    message: "不能包含admin"
  },
  account: {
    validator: function(value) {
      value = value.toLowerCase();
      var reg = /^(?!(?:[\d_]*$))[A-Za-z0-9_]{4,20}$/;
      return reg.test(value);
    },
    message: "长4-20字符，可由数字、字母和下划线组成，字母不区分大小写!"
  },
  digits: {
    validator: function(value) {
      return /^([0-9])+\d*$/i.test(value);
    },
    message: "请输入数字"
  },
  telephone: {
    validator: function(value) {
      return /^[\d\s\-]+$/.test(value);
    },
    message: "可输入数字,-,空格"
  },
  blank: {
    validator: function(value) {
      return $.trim(value) !== '';
    },
    message: "不能只输入空格！"
  },
  ipFormat: {
    validator: function(value) {
      var reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
      return reg.test(value);
    },
    message: "请输入正确的IP地址"
  },
  password: {
    validator: function(value) {
      var reg = /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[!@#$%^&_])|(?=.*?[A-Za-z])(?=.*?[!@#$%^&_]))[\dA-Za-z!@#$%^&_]{6,20}$/;
      return reg.test(value);
    },
    message: "6-20个字符，字母、数字的组合!"
  },
  equalTo: {
    validator: function(value, param) {
      return $(param[0]).val() === value;
    },
    message: "字段不匹配"
  },
  numAndLetters: {
    validator: function(value) {
      var reg = /^[A-Za-z0-9]+$/;
      return reg.test(value);
    },
    message: "数字、字母的组合"
  },
  // 下拉是选单验证
  selectValueRequired: {
    validator: function(value, param) {
      return $(param[0]).find(`option:contains('${value}')`).val() !== '';
    },
    message: '下拉选框不可为空.'
  },
  english: {
    validator: function(value) {
      var reg = /^[A-Za-z]+$/;
      return reg.test(value);
    },
    message: "只能有字母"
  },
  upperCase: {
    validator: function(value) {
      var reg = /^[A-Z]+$/;
      return reg.test(value);
    },
    message: "只能为大写字母"
  },
  upperNum: {
    validator: function(value) {
      var reg = /^[A-Z|0-9]+$/;
      return reg.test(value);
    },
    message: "只能为大写字母和数字，请重新输入"
  },
  comboxtree: {
    validator: function(value, param) {
      var selVal = $("input[name=" + param[0] + "]").val();
      return Number(selVal) > 0;
    },
    message: "不可以空，请选择"
  },
  combogrid: {
    validator: function(value) {
      var selVal = this.parentElement.previousSibling.filterData;
      return selVal;
    },
    message: "輸入項目於下拉選單中沒有"
  },
  compareValue: {
    validator: function(value, param) {
      var selVal = $("input[name=" + param[0] + "]").val();
      return value > Number(selVal);
    },
    message: "起始年龄要小于结束年龄"
  },
// 中心信息项目对照数字验证，取到小数点第二位
  numberTwo: {
    validator: function(value) {
      var reg = /^[0-9]+(.[0-9]{1,2})?$/;
      return reg.test(value);
    },
    message: "只能为数字，小数点取到第二位"
  }
});
