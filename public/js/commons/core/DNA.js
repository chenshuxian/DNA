import {Message} from './message.js';
import {DataControl} from './dataControl.js';
import {DataGrid} from './dataGrid.js';
import {Validate} from './validate.js';
import {Tree} from './tree.js';
import {ComboGrid} from './comboGrid.js';
import {} from './enterToTab.js';
import $ from 'jquery';
let _tip = '这是父节点中的方法，请在子节点中新增',
    _delBatch = '请选择要删除的数据',
    _delStatus = 'del',
    _setBefore = 'please join ',
    _searchStr = '查询字串中不可以有 $ 字号';

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

let Dna = {
  formStatus: null,
  beforeCheck: false,
  delUrl: `${_setBefore}delUrl`,
  delBatchUrl: `${_setBefore}delBatchUrl`,
  dels: new Set(),
  adds: new Set(),
  dataCG: [],
  localStore: [],
  beforeSubmit() {
    /*
      送出前的各種設定，如
      url 更動，
      是前同名確認，
      多個子頁不同服務設定。
    */
    console.log(`${_tip} beforeSubmit()`);
    return true;
  },
  // 后台回传confim 后所要执行的方法
  confirmOK() {
    console.log(`${_tip} confirmOK()`);
    return false;
  },
  // 后台回传confim 后所要执行的方法
  confirmNO() {
    console.log(`${_tip} confirmNO()`);
    return false;
  },
  validate() {
    // 驗證設定，如果一個頁面中，
    // 有多個不同子頁面的驗證，
    // 可以在這進行設定。
    console.log(`${_tip} validate()`);
    return false;
  },
  addPop() {
    console.log('addPop setting');
  },
  addCallBack() {
    console.log(`${_tip} addCallBack()`);
    return false;
  },
  add() {
    console.log(`${_tip} add()`);
    return false;
  },
  editPop(formData) {
    console.log('editPop setting');
    /*
      1.check status of rows
      2.this.pop(params,this.editCallback);
      2.set formStatus = edit
      3.call editCallback
    */
  },
  editCallBack() {
    console.log('${_tip} editCallBack()');
    /*
      1.取得 fromData
      2.放到相对映的位置，利用 es6 解构函数取值
    */
  },
  edit() {
    console.log(`${_tip} edit()`);
    return false;
  },
  viewPop() {
    console.log('viewPop setting');
  },
  viewCallBack() {
    console.log('${_tip} viewCallBack()');
  },
  view() {
    console.log(`${_tip} view()`);
    return false;
  },
  del(formData) {
    let {id, status = 0, url = this.delUrl, success = false} = formData,
        params = {
          url,
          data: {id},
          success
        };

    if (status === 1) {
      this.showMsg({msg: '当选中记录启用，不允许删除!'});
      return false;
    }

    this.formStatus = _delStatus;
    $.messager.confirm('提示', '是否删除当前纪录?', r => {
      if (r) {
        this.sendData(params);
      }
    });
  },

  delBatch(params = {}) {
    let {url = this.delBatchUrl, tipName = 'name'} = params,
        ids = [],
        names = [],
        data,
        ajaxData,
        checkItems = this.checkAll(this.dataGrid);
    if (checkItems.length === 0) {
      this.showMsg({msg: _delBatch});
      return false;
    }
    // 取得删除id或提示的字段
    $.each(checkItems, (index, item) => {
      if (item.status === '1') {
        names.push(item[tipName]);
      } else {
        ids.push(item.stringId);
      }
    });

    if (names.length > 0) {
      let msg = this.concatMsg(names);
      this.showMsg({msg: `名称${msg}启用状态，不允许删除!`});
      return false;
    }

    this.formStatus = _delStatus;
    data = {ids: ids.join(',')};
    ajaxData = {
      url,
      data
    };
    $.messager.confirm('提示', '是否删除当前纪录?', r => {
      if (r) {
        this.sendData(ajaxData);
      }
    });
  },

  // 查询时所需的参数数据
  searchParams(preId) {
    let params = {
      searchStr: $.trim($(`#${preId}SearchStr`).val())
    };
    return params;
  },

  search(params) {
    if (params.searchStr.contains('$')) {
      this.showMsg({msg: _searchStr});
    } else {
      this.dataGrid.datagrid('load', params);
    }
  }
};
Object.assign(Dna, DataControl, Message, DataGrid, Validate, ComboGrid);
window.Dna = Dna;
window.Tree = Tree;
export {Dna};
