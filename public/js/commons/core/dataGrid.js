/*
  Module: DataGrid,
  Create: 2016/07/17,
  Auther: chenshuxian
  說明: 此模塊主要提共 datagrid 相關 API。
*/
import $ from 'jquery';
import {Columns} from './columns.js';
import {CONST as CO} from './const.js';

let _limit = CO.LIMIT.SHIFTGRID,
    _limitMsg = `一次数据不可超过${_limit}笔!`,
    _addItem = '请选择要添加的项目';

let _total = function() {
      let total = $('#leftGrid').datagrid('getRows');
      $('#total').html(total.length);
    },
    _getGrid = function() {
      let params = {
        lg: $('#leftGrid'),
        rg: $('#rightGrid')
      };
      return params;
    },
    _dgLimit = function(limit, len) {
      if (limit > 30) {
        Dna.showMsg({msg: `目前勾选${len}笔，${_limitMsg}`});
      } else {
        Dna.showMsg({msg: _addItem});
      }
    },
    /*
      設定備註欄的 tooltip
    */
    _setDgTt = function() {
      let tooltip = $(this).datagrid('getPanel').find('.easyui-tooltip');
      if (tooltip) {
        tooltip.each(function() {
          let val = $(this)[0].getAttribute('data-value');
          Dna.setToolTip(this, val);
        });
      }
    };

export let DataGrid = {
  /*
    返回 datagrid 初始設定
    params:
    {
      url: 後台請求數據 url
      data: 請求時傳送的 querydata
      module: 模塊名，對映 columns 集群中的資料
      hideCols: 隱藏欄位陣列
      // dg: 建立 datagrid table 對象
      height: dg 高度
    }
  */
  initDG(params) {
    let {url, data, module, hideCols, height, method = 'post'} = params,
        init = {
          url,
          queryParams: data,
          columns: Columns[module](),
          height,
          fitColumns: true,
          method,
          // checkOnSelect: false,
          // selectOnCheck: false,
          // autoRowHeight: false,
          striped: true,
          pagination: true,
          scrollbarSize: 0,
          pageNumber: 1,
          pageSize: 10,
          onLoadSuccess: function(data) {
            // 第一行高亮
            Dna.highLight.call(this, 0);
            // 滑動條置頂
            Dna.scorllTop.call(this);
            // 設置備註的 tooltip
            _setDgTt.call(this);
            if (hideCols) {
              Dna.hideCols(this, hideCols);
            }
          },
          onClickRow: function(index, row) {
            Dna.highLight.call(this, index);
          }
        };
    return init;
  },

  highLight(index) {
    $(this).datagrid('highlightRow', Number(index));
  },

  //  params:
  //  dg = datagrid Object,
  //  array = hidden field of Columns
  hideCols(dg, arr) {
    for (let v of arr) {
      dg.datagrid('hideColumn', v);
    }
  },

  //  params:
  //  obj = datagrid Object,
  //  array = hidden field of Columns
  showCols(dg, arr) {
    for (let v of arr) {
      dg.datagrid('showColumn', v);
    }
  },

  // 向右移
  shiftR() {
    let GD = _getGrid(),
        dataL = GD.lg.datagrid('getSelections'),
        dataLen = dataL.length;
    if (dataLen > 0 && dataLen < _limit) {
      dataL.forEach(function(el, index) {
        let newRow = {index: 0, row: el},
            rowIndex = GD.lg.datagrid('getRowIndex', el),
            id = el.stringId;

        GD.lg.datagrid('deleteRow', rowIndex);
        GD.rg.datagrid('insertRow', newRow);

        // 判断是否新增到阵列中
        Dna.dels.add(id);
        // Dna.adds.delete(id);
        // 将右移资料加入本地资料库
        // Dna.addStore(el);
        // 总数显示
        // _total();
      });
    } else {
      _dgLimit(_limit, dataLen);
    }
  },

  // 向左移
  shiftL() {
    let GD = _getGrid(),
        dataR = GD.rg.datagrid('getSelections'),
        dataLen = dataR.length;
    if (dataLen > 0 && dataLen < _limit) {
      dataR.forEach(function(el, index) {
        let newRow = {index: 0, row: el},
            rowIndex = GD.rg.datagrid('getRowIndex', el),
            id = el.stringId;

        GD.rg.datagrid('deleteRow', rowIndex);
        GD.lg.datagrid('insertRow', newRow);

        // 判断是否新增到阵列中
        Dna.adds.add(id);
        // Dna.dels.delete(id);
        // 将左移资料从本地库中移除
        // Dna.delStore(el);
        // Dna.localStore.delete(id);
        // 总数显示
        // _total();
      });
    } else {
      _dgLimit(_limit, dataLen);
    }
  },

  /*
    返回所有勾選欄位資料
  */
  checkAll(obj) {
    return $(obj).datagrid('getChecked');
  },

  /*
    載入成功後 grid 排序
    改變工具欄的狀態
  */
  successSort() {
    // 找入成功，修改狀態
  },

  /*
    下拉滾動條置頂
  */
  scorllTop() {
    $(this).datagrid('scrollTo', 0);
  },

  /*
    dataGrid 頁面調整
  */
  dgAdjust(obj) {
    // 隨畫面調整大小
    let width = obj.parents('.panel').width(),
        height = obj.parents('.panel').height();
    obj.datagrid('resize', {
      width,
      height
    });
  }

};
