import $ from 'jquery';
import {CONST as CO} from './const.js';
// import {Message} from './message.js';
let popdiv = $(`#${CO.BASES.POPDIV}`);

let _AddOrEdit = function() {
      console.log(`${this.formStatus} 送出成功`);
      let form = $("#ff"),
          formData = this.getFormData(form);
      if (this.formStatus === 'add') {
        this.add(formData);
      } else {
        this.edit(formData);
      }
    },
    // 预设新增及修改成功后呼叫的方法
    _defSuccess = function(data) {
      if (this.resolve(data)) {
        console.log('hide popdiv 修改完成');
        // hide popdiv
        // datagrid reload
      } else {
        // 取消确认按钮锁定
      }
    },
    // 预设删除成功的 callback
    _delSuccess = function(data) {
      console.log('删除成功 callback');
      // if (this.resolve(data)) {
      //   this.dataGrid.datagrid('reload');
      // }
    },
    // 预设修改状态成功的 callback
    _staSuccess = function(data) {
      console.log('状态修改成功 callback');
    };

let DataControl = {
  // form 表单的事件绑定
  formSet() {
    let beforeCheck = this.beforeCheck;
    let formObj = {
      onSubmit: param => {
        // do some check
        // return false to prevent submit;
        let v = $("#ff").form('enableValidation').form('validate');
        if (v) {
          if (beforeCheck) {
            return this.beforeSubmit();
          }
          return true;
        }
        return v;
      },
      success: () => {
        _AddOrEdit.call(this);
      }
    };

    $('#ff').form(formObj);
  },
  // 清除表單空白
  trimForm(formData) {
    $.each(formData, (i, item) => {
      formData[i].value = $.trim(item.value);
    });
    return formData;
  },
  // <>空白等特殊字符取代
  strReplace(str) {
    let replaceStr = /[<>&"\s]/g;
    return str.replace(replaceStr, function(c) {
      return {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', ' ': '&nbsp;'}[c];
    });
  },
  // 去除重覆陣列資料
  dedupe(array) {
    return Array.from(new Set(array));
  },
  // 檔案上傳 button
  // obj: elmentID, mult: false 決定是否上傳多個檔
  uploadButton(obj, mult = false) {
    $(obj).filebox({
      buttonText: '上传',
      multiple: mult,
      width: 200
    });
  },
  /*
    toolTip 綁定
    obj: 綁定對象
    val: 綁定內容
  */
  setToolTip(obj, val) {
    $(obj).tooltip({
      content: `<span>${val}</span>`,
      onShow: function() {
        $(this).tooltip('tip').css({
          backgroundColor: '#fff',
          borderColor: '#666'
        });
      }
    });
  },
  /*
    载入彈出框资料
    params: {
      url,
      data,
      focusId,
      width,
      hight,
    }
    callback: 開啟後要執行的任務
  */
  pop(params, cb) {
    params.width = 400;
    popdiv.load(
      params.url,
      params.data,
      function() {
        this.validate();
        this.formSet();
        if (typeof cb === 'function') {
          cb();
        }
        // 将视窗弹出
        this.dailog(params);
      }
    );
  },

  /*
    彈出框
    取得相对物件的高和宽
  */
  dailog(params) {
    var popIndex = 100000,
        width = params.width ? params.width : 440,
        winH = $(window).height(),
        popObj = popdiv.find('.pop-container'),
        popH = popObj.height(),
        marginTop = (winH - popH) / 4;

    if (!(popdiv.find('.pop-shadow').length > 0)) {
      popdiv.append('<div class="pop-shadow"></div>');
    }
    popdiv.css({zIndex: popIndex}).fadeIn(100);

    popObj.css({
      width: width + 'px',
      marginTop: marginTop + 'px'
    });
  },
  /*
    送出资料方法
    可自行定义成功的 callback
    ajaxData = {
      url: 后台对映路径
      type: POST
      data: 后台 req 的 data
      success: 可以由端自行定义或用预设
    }
  */
  sendData(ajaxData) {
    let {url, type = CO.BASES.POST, data, success = false} = ajaxData,
        action = this.formStatus;
    $.ajax({
      url,
      type,
      data,
      success: data => {
        if (success) {
          success(data);
          // hidePop
        } else {
          if (action === 'del') {
            _delSuccess.call(this, data);
          }
          if (action === 'status') {
            _staSuccess.call(this, data);
          } else {
            _defSuccess.call(this, data);
          }
        }
      }
    });
  },

  // 取得去除前后空白的formdata
  getFormData(form) {
    return this.trimForm($(form).serializeArray());
  },

  concatMsg(items) {
    let msg = '';
    $.each(items, (k, v) => {
      msg += `[${v}],`;
    });
    return msg.substring(0, msg.length - 1);
  },

  includes(arr, value) {
    return arr.includes(value);
  }

};

export {DataControl};
