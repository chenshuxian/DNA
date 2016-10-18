import {Message} from './message.js';
import {DataControl} from './dataControl.js';
import {DataGrid} from './dataGrid.js';
import {Validate} from './validate.js';
import {Tree} from './tree.js';
import {ComboGrid} from './comboGrid.js';
import {CONST} from './const.js';
import {} from './enterToTab.js';
import {} from './onEvent.js';
import $ from 'jquery';
let _tip = '这是父节点中的方法，请在子节点中新增',
    _addStatus = CONST.STATUS.ADD,
    _editStatus = CONST.STATUS.EDIT,
    _viewStatus = CONST.STATUS.VIEW,
  //  _delBatchStatus = CONST.STATUS.DELBATCH,
    _setBefore = '请于子页面中加入',
    _statusCheck = '状态启用中禁止编辑',
    _searchStr = '查询字串中不可以有 $ 字号';

$('#site-content').tabs({
  fit: true
});

let Dna = {
  formStatus: null,
  beforeCheck: true,
  preId: 'core',
  url: {
    add: `${_setBefore}addUrl`,
    edit: `${_setBefore}editUrl`,
    pop: `${_setBefore}popUrl`,
    check: `${_setBefore}checkUrl`,
    status: `${_setBefore}statusUrl`,
    del: `${_setBefore}delUrl`,
    delBatch: `${_setBefore}delBatchUrl`,
    pageList: `${_setBefore}pageListUrl`
  },
  dg: {
    add: undefined,
    edit: undefined,
    status: undefined,
    delBatch: undefined
  },
  callback: {
    add() {
      console.log('addCallBack');
    },
    edit(formData) {
      console.log('editCallBack');
      console.log(formData);
    },
    view(formData) {
      console.log('viewCallBack');
    },
    status(data) {
      console.log('statusCallBack');
    }
  },
  popData: {
    add: {opType: _addStatus},
    edit: {opType: _editStatus},
    view: {opType: _viewStatus}
  },
  popWidth: 400,
  status: '',
  sort: '',
  dels: new Set(),
  adds: new Set(),
  localStore: [],
  formData: [],
  form: CONST.BASES.FORM,
  searchTip: CONST.SEARCHTIP.COMMON,
  fieldName: null,
  index: 0,       // row 栏位值
  parentStatus: 0,    // 父层表单状态记录
  delIndexs: new Set(),
  // 设置页面初始状态
  init() {
    let preId = this.preId,
        that = this;
    // 设置查询栏中的提示字串
    this.setSearchStr();
    // datagrid 自适应
    $(window).on('resize', () => {
      this.dgAdjust();
    });
    /* 状态搜索 */
    $(`.${preId}-status-selector li`).on('click', function() {
      $(`#${preId}StatusSpan`).html($(this).html());
      $(`.${preId}-status-selector li.selected`).removeClass('selected');
      var flg = $(this).is('.selected');
      $(this).addClass(function() {
        return flg ? '' : 'selected';
      });

      that.status = $(this).attr("el-value");
      that.search();
    });

    /* 排序 */
    $(`.${preId}-sort-selector li`).on('click', function() {
      $(`#${preId}SortSpan`).html($(this).html());
      $(`.${preId}-sort-selector li.selected`).removeClass('selected');
      var flg = $(this).is('.selected');
      $(this).addClass(function() {
        return flg ? '' : 'selected';
      });

      that.sort = $(this).attr('el-value');
      that.search();
    });

    /* search Btn */
    $(`#${preId}SearchBtn`).on('click', () => {
      this.search();
    });

    $(`#${preId}Add`).on('click', () => {
      this.commonPop('add');
    });

    // deleteBatch
    $(`#${preId}DeleteBatch`).on('click', () => {
      this.delBatch();
    });
  },
  // 后台回传confim 后所要执行的方法
  confirmOK(ajaxParams) {
    console.log(`${_tip} confirmOK()`);
    let sendCheck = {
      status: true,
      del: true
    };
    // 改变状态或删除
    if (sendCheck[this.formStatus]) {
      this.sendData(ajaxParams);
    }

    // return false;
  },
  // 后台回传confim 后所要执行的方法
  confirmNO() {
    console.log(`${_tip} confirmNO()`);
    let
        status = this.formStatus,
        dg = this.getDging(status);
    this.btnEnable();
    if (status === 'status') {
      dg.datagrid('refreshRow', this.index);
    }
    // return false;
  },
  validate() {
    // 驗證設定，如果一個頁面中，
    // 有多個不同子頁面的驗證，
    // 可以在這進行設定。
    console.log(`${_tip} validate()`);
    return false;
  },
  // popDefaultParams() {
  //   return {
  //     url: this.url.pop,
  //     focusId: this.focusId,
  //     popWidth: this.popWidth
  //   };
  // },
  commonPop(status, index = 0, formData = {}, params = {}) {
    console.log('commonPop setting');
    let newParams = {};
    newParams.url = this.url.pop;
    newParams.focusId = this.focusId;
    newParams.popWidth = this.popWidth;
    newParams.callback = this.callback[status];
    newParams.data = this.popData[status];
    newParams.formData = formData;
    Object.assign(newParams, params);
    if (Number(formData.status) === 1) {
      Dna.showMsg(_statusCheck);
      return false;
    }
    this.index = index;
    this.formStatus = status;
    this.pop(newParams);
  },
  // 查询时所需的参数数据
  searchParams(preId = this.preId) {
    let
    params = {
      searchStr: $.trim($(`#${preId}SearchStr`).val()),
      status: this.status,
      sort: this.sort
    };
    return params;
  },

  search(params = {}) {
    let {
      dataGrid = this.dataGrid,
      searchObj = this.searchParams()
    } = params;
    if (searchObj.searchStr.includes('$')) {
      this.showMsg(_searchStr);
    } else {
      dataGrid.datagrid('load', searchObj);
    }
  },

  // 设置查询栏位中的提示字段及focus
  setSearchStr(params = {}) {
    let {
      preId = this.preId,
      str = this.searchTip,
      obj = $(`#${preId}SearchStr`)
    } = params;

    obj.attr("placeholder", str);
    obj.tooltip({
      content: "<span style='color:#000000'>" + str + "</span>",
      onShow: function() {
        $(this).tooltip('tip').css({
          backgroundColor: '#fff',
          borderColor: '#666'
        });
      }
    });
    obj.focus();
  }
};
Object.assign(Dna, DataControl, Message, DataGrid, Validate, ComboGrid);
window.Dna = Dna;
window.Tree = Tree;
window.$ = $;
export {Dna};
