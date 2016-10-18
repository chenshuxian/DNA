import $ from 'jquery';
import {CONST as CO} from './const.js';
// import {Message} from './message.js';
let popDiv = $(`#${CO.BASES.POPDIV}`),
    // form = CO.BASES.FORM,
    submitBtn = CO.BASES.SUBMITBTN,
    _tip = '这是父节点中的方法，请在子节点中新增',
    _delBatch = '请选择要删除的数据',
    _delStatus = CO.STATUS.DEL,
    _delDisable = '当选中记录启用，不允许删除!',
    _delCheck = '是否删除当前纪录?';

/*****************************************************************************
*
*私有函数区块
*
*******************************************************************************/
let
    // 预設送出成功后呼叫的方法
    _defaultSuccess = {
      add(data, dg = this.dataGrid) {
        if (this.resolve(data)) {
          console.log('hide popdiv 新增完成');
          // hide popdiv
          var rowData = this.toJson(data);
          this.popHide();
          // datagrid insertRow
          let row = this.formJson;
          row.id = rowData.id;
          row.status = 0;
          row.stringId = rowData.id;
          dg.datagrid('insertRow', {index: 0, row});
        } else {
          // 取消确认按钮锁定
          this.btnEnable();
        }
      },
      edit(data, dg = this.dataGrid) {
        if (this.resolve(data)) {
          console.log('hide popdiv 修改完成');
          // hide popdiv
          this.popHide();
          // datagrid updateRow
          let row = this.formJson,
              index = this.index;
          dg.datagrid('updateRow', {index, row});
        } else {
          // 取消确认按钮锁定
          this.btnEnable();
        }
      },
      // 预设删除成功的 callback
      del(data, dg = this.dataGrid) {
        console.log('删除成功 callback');
        if (this.resolve(data)) {
          let index = this.delIndexs,
              v = 0;
          for (let i of index.values()) {
            if (v > 0) {
              i -= 1;
            }
            dg.datagrid('deleteRow', i);
            v++;
          }
          this.delIndexs.clear();
        }
      },
      // 预设修改状态成功的 callback
      status(data, dg = this.dataGrid) {
        console.log('状态修改成功 callback');
        let index = this.index,
            status = this.statusId;
        if (this.resolve(data)) {
          dg.datagrid('updateRow', {
            index: index,
            row: {status}
          });
          this.parentStatus = status;
        } else {
          dg.datagrid('refreshRow', index);
        }
      }
    };

let DataControl = {
  // form 表单的事件绑定
  formSet() {
    let beforeCheck = this.beforeCheck;
    let formObj = {
      onSubmit: param => {
        // do some check
        // return false to prevent submit;
        let v = $('form').form('enableValidation').form('validate');
        if (v) {
          if (beforeCheck) {
            return this.beforeSubmit();
          }
          return true;
        }
        return v;
      },
      success: () => {
        // console.log('submitsuccess');
        DataControl.btnDisable();
        this.route();
      }
    };
    console.log("formSet");
    $('form').form(formObj);
    // form.form(formObj);
  },
  beforeSubmit() {
    /*
      送出前的各種設定，如
      url 更動，
      是前同名確認，
      多個子頁不同服務設定。
    */
    console.log(`beforeSubmit()`);
    this.getFormData();
    this.getFormJson();
    return true;
  },
  /*
    状态修改
  */
  changeStatus(index, rowData, formStatus = 'status') {
    this.formStatus = formStatus;
    // this.beforeSubmit();
    let
        statusId = Number(rowData.status),
        status = {
          0: {msg: '是否启用当前记录?', ot: 'Enable'},
          1: {msg: '是否停用当前记录?', ot: 'Disable'}
        },
        sendData = {
          url: this.url[formStatus],
          data: {id: rowData.stringId, operationType: status[statusId].ot}
          // success: this.callback.status
        },
        obj = {
          msg: status[statusId].msg,
          sendData
        };

    // this.formData = 'status';
    this.index = index;
    this.statusId = statusId ? 0 : 1;

    this.jConfirm(obj);
  },
  del(formStatus = _delStatus, index = 0, delParams) {
    // this.beforeSubmit();
    let {stringId, status = 0, url = this.url[formStatus], success} = delParams,
        params = {
          msg: _delCheck,
          sendData: {
            url,
            data: {id: stringId},
            success
          }
        };

    this.delIndexs.add(index);
    if (Number(status) === 1) {
      this.showMsg(_delDisable);
      return false;
    }

    this.formStatus = formStatus;
    this.jConfirm(params);
  },
  delBatch(formStatus = 'delBatch', tipName = 'name') {
    let url = this.url[formStatus],
        dg = this.getDging(formStatus),
        ids = [],
        names = [],
        data,
        ajaxData,
        checkItems = this.checkAll(dg, _delBatch);
    if (checkItems) {
      // 取得删除id或提示的字段
      $.each(checkItems, (index, item) => {
        if (item.status === '1') {
          names.push(item[tipName]);
        } else {
          this.delIndexs.add(dg.datagrid('getRowIndex', item));
          ids.push(item.stringId);
        }
      });

      if (names.length > 0) {
        let msg = this.concatMsg(names);
        this.showMsg({msg: `名称${msg}启用状态，不允许删除!`});
        return false;
      }
      // this.rowIndexs = indexs;
      this.formStatus = formStatus;
      data = {ids: ids.join(',')};
      ajaxData = {
        msg: _delCheck,
        sendData: {
          url,
          data
        }
      };
      this.jConfirm(ajaxData);
    }
  },
  submit() {
    $('form').submit(function(event) {
      event.preventDefault();
    });
  },
  btnDisable() {
    $(`#${submitBtn}`).attr('disabled', true);
  },
  btnEnable() {
    $(`#${submitBtn}`).attr('disabled', false);
  },
  viewHide() {
    $("form input").attr("readonly", "readonly");
    $("form textarea").attr("readonly", "readonly");
    $(`#${submitBtn}`).hide();
  },
  popHide() {
    popDiv.hide();
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
    let replaceStr = /[<>&"\s]/g,
        repObj = {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', ' ': '&nbsp;'};
    return str.replace(replaceStr, function(c) {
      return repObj[c];
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
      height,
      callback: 開啟後要執行的任務
    }
  */
  pop(params) {
    let {
      url,
      data,
      focusId,
      callback,
      formData = {}
    } = params;
    popDiv.load(
      url,
      data,
      () => {
        // 将视窗弹出
        this.dailog(params);
        this.validate();
        this.formSet();

        $(`#${focusId}`).focus();
        if (typeof callback === 'function') {
          callback(formData);
        }
      }
    );
  },

  /*
    彈出框
    取得相对物件的高和宽
  */
  dailog(params) {
    var popIndex = 8900,
        width = params.popWidth ? params.popWidth : 440,
        winH = $(window).height(),
        popObj = popDiv.find('.pop-container'),
        popH = popObj.height(),
        marginTop = (winH - popH) / 4;

    if (!(popDiv.find('.pop-shadow').length > 0)) {
      popDiv.append('<div class="pop-shadow"></div>');
    }
    popDiv.css({zIndex: popIndex}).fadeIn(100);

    popObj.css({
      width: width + 'px',
      marginTop: marginTop + 'px'
    });
  },
  route() {
    console.log(`${_tip} route()`);
    let params = {
          url: this.url[this.formStatus],
          data: this.formData
        },
        checkUrl = this.url.check;

    if (checkUrl) {
      let checkParams = {
        url: checkUrl,
        data: params.data,
        success(data) {
          if (this.resolve(data)) {
            this.sendData(params);
          }
        }
      };
      this.sendData(checkParams);
    } else {
      this.sendData(params);
    }
    // return false;
  },
  // 批次加载
  addBatch(newParams = {}, dg = this.popDg) {
    let
        msg = '请选择要添加的选项',
        ids = Dna.checkAll(dg, msg),
        idA = Dna.getIds(ids),
        params = {
          url: this.url[this.formStatus],
          data: {ids: idA.join(',')},
          success(data, dg) {
            if (this.resolve(data)) {
              this.popHide();
              dg.datagrid('reload');
            } else {
              this.btnEnable();
            }
          }
        };

    // 添加 ids 额外的参数
    if (params) {
      Object.assign(params.data, newParams.data);
    }
    if (ids) {
      this.sendData(params);
    }
  },
  // 取得 id 阵列
  getIds(ids, str = 'stringId') {
    let idArr = [];
    $.each(ids, (index, item) => {
      idArr.push(item[str]);
    });
    return idArr;
  },
  /*
    送出资料方法
    可自行定义成功的 callback
    ajaxData = {
      url: 后台对映路径
      type: POST
      data: 后台 req 的 data
      success: 可以由呼叫端自行定义或用预设
    }
  */
  sendData(ajaxData) {
    let {url, type = CO.BASES.POST, data, success = false} = ajaxData,
        action = this.formStatus,
        dg = this.getDging(action);   // 取得对映的 dg
    $.ajax({
      url,
      type,
      data,
      success: data => {
        if (success) {
          success.call(this, data, dg);
        } else {
          if (action.includes('delBatch')) {
            action = 'del';
          }
          _defaultSuccess[action].call(this, data, dg);
        }
      }
    });
  },

  // 取得去除前后空白的formdata
  getFormData() {
    // let form = $(this.form);
    this.formData = this.trimForm($('form').serializeArray());
  },

  getFormJson() {
    this.formJson = $('form').serializeObject();
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
  },

  addTab(title, url) {
    var sc = $('#site-content');
    if (sc.tabs('exists', title)) {
      sc.tabs('select', title);
    } else {
      $.ajax({
        dataType: 'html',
        type: 'get',
        url,
        success: data => {
          sc.tabs('add', {
            title,
            content: data,
            closable: true
          });
          this.autoFillScreen();
        }
      });
    }
    this.autoFillScreen();
  },

  autoFillScreen() {
    var panel = $('#site-content > .tabs-panels'),
        height = $(window).height();
    panel.css({
      height: (height - 80) + 'px'
    });

    $('.main-frame').css({
      height: (height - 85) + 'px'
    });
  },

  toJson(obj) {
    if (typeof obj !== 'object') {
      obj = JSON.parse(obj);
    }
    return obj;
  }

};

export {DataControl};
