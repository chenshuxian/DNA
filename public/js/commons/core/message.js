// import 'babel-polyfill';
import $ from 'jquery';
import {CONST as CO} from 'const';

let _title = '提示',
    _slideMsg = function(obj) {
      let {msg, title = _title} = obj;
      $.messager.show({
        title,
        msg,
        timeout: 2000,
        showType: 'slide'
      });
    };

export let Message = {
  resolve(obj) {
    // obj = JSON.parse(obj);
    if (obj === "") {
      return true;
    }
    // if (typeof obj !== 'object') {
    //   obj = JSON.parse(obj);
    // }
    obj = Dna.toJson(obj);
    let {status} = obj;

    switch (status) {
    case CO.BASES.SUCCESS:
      _slideMsg(obj);
      return true;
    case CO.BASES.ERR:
      this.showMsg(obj);
      this.delIndexs.clear();
      Dna.btnEnable();
      return false;
    case CO.BASES.CONF:
      // obj.callback = this.confirm;
      this.jConfirm(obj);
      break;
      // return false;
    default:
      return true;
    }
  },

  showMsg(obj) {
    if (typeof (obj) === 'string') {
      obj = {msg: obj};
    }
    let {title = _title, msg, callback} = obj;
    $.messager.alert(title, msg, callback);
  },
  jConfirm(obj) {
    let {title = _title, msg, sendData = {}} = obj;
    $.messager.confirm(title, msg, r => {
      if (r) {
        this.confirmOK(sendData);
      } else {
        this.confirmNO();
      }
    });
  }
};
