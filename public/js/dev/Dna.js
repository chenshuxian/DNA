webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Dna = undefined;
	
	var _message = __webpack_require__(1);
	
	var _dataControl = __webpack_require__(4);
	
	var _dataGrid = __webpack_require__(5);
	
	var _validate = __webpack_require__(7);
	
	var _tree = __webpack_require__(8);
	
	var _comboGrid = __webpack_require__(9);
	
	var _const = __webpack_require__(3);
	
	__webpack_require__(10);
	
	__webpack_require__(11);
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _tip = '这是父节点中的方法，请在子节点中新增',
	    _delBatch = '请选择要删除的数据',
	    _delStatus = _const.CONST.STATUS.DEL,
	    _addStatus = _const.CONST.STATUS.ADD,
	    _editStatus = _const.CONST.STATUS.EDIT,
	
	//  _delBatchStatus = CONST.STATUS.DELBATCH,
	_setBefore = '请于子页面中加入',
	    _delDisable = '当选中记录启用，不允许删除!',
	    _delCheck = '是否删除当前纪录?',
	    _statusCheck = '状态启用中禁止编辑',
	    _searchStr = '查询字串中不可以有 $ 字号';
	
	(0, _jquery2.default)('#site-content').tabs({
	  fit: true
	});
	
	var Dna = {
	  formStatus: null,
	  beforeCheck: true,
	  preId: 'core',
	  url: {
	    add: _setBefore + 'addUrl',
	    edit: _setBefore + 'editUrl',
	    pop: _setBefore + 'popUrl',
	    check: _setBefore + 'checkUrl',
	    status: _setBefore + 'statusUrl',
	    del: _setBefore + 'delUrl',
	    delBatch: _setBefore + 'delBatchUrl',
	    pageList: _setBefore + 'pageListUrl'
	  },
	  callback: {
	    add: function add() {
	      console.log('addCallBack');
	    },
	    edit: function edit(formData) {
	      console.log('editCallBack');
	      console.log(formData);
	    },
	    view: function view() {
	      console.log('viewCallBack');
	    }
	  },
	  popData: {
	    add: { opType: _addStatus },
	    edit: { opType: _editStatus }
	  },
	  popWidth: 400,
	  status: 0,
	  sort: 0,
	  dels: new Set(),
	  adds: new Set(),
	  localStore: [],
	  formData: [],
	  form: _const.CONST.BASES.FORM,
	  searchTip: _const.CONST.SEARCHTIP.COMMON,
	  fieldName: null,
	  // 设置页面初始状态
	  init: function init() {
	    var _this = this;
	
	    var preId = this.preId,
	        that = this;
	    // 设置查询栏中的提示字串
	    this.setSearchStr();
	    // datagrid 自适应
	    (0, _jquery2.default)(window).on('resize', function () {
	      _this.dgAdjust();
	    });
	    /* 状态搜索 */
	    (0, _jquery2.default)('.' + preId + '-status-selector li').on('click', function () {
	      (0, _jquery2.default)('#' + preId + 'StatusSpan').html((0, _jquery2.default)(this).html());
	      (0, _jquery2.default)('.' + preId + '-status-selector li.selected').removeClass('selected');
	      var flg = (0, _jquery2.default)(this).is('.selected');
	      (0, _jquery2.default)(this).addClass(function () {
	        return flg ? '' : 'selected';
	      });
	
	      that.status = (0, _jquery2.default)(this).attr("el-value");
	      that.search();
	    });
	
	    /* 排序 */
	    (0, _jquery2.default)('.' + preId + '-sort-selector li').on('click', function () {
	      (0, _jquery2.default)('#' + preId + 'SortSpan').html((0, _jquery2.default)(this).html());
	      (0, _jquery2.default)('.' + preId + '-sort-selector li.selected').removeClass('selected');
	      var flg = (0, _jquery2.default)(this).is('.selected');
	      (0, _jquery2.default)(this).addClass(function () {
	        return flg ? '' : 'selected';
	      });
	
	      that.sort = (0, _jquery2.default)(this).attr('el-value');
	      that.search();
	    });
	
	    /* search Btn */
	    (0, _jquery2.default)('#' + preId + 'SearchBtn').on('click', function () {
	      _this.search();
	    });
	
	    (0, _jquery2.default)('#' + preId + 'Add').on('click', function () {
	      _this.commonPop(0, 'add');
	    });
	
	    // deleteBatch
	    (0, _jquery2.default)('#' + preId + 'DeleteBatch').on('click', function () {
	      _this.deleteBatch();
	    });
	  },
	
	  // 后台回传confim 后所要执行的方法
	  confirmOK: function confirmOK() {
	    console.log(_tip + ' confirmOK()');
	    return false;
	  },
	
	  // 后台回传confim 后所要执行的方法
	  confirmNO: function confirmNO() {
	    console.log(_tip + ' confirmNO()');
	    this.btnEnable();
	    return false;
	  },
	  validate: function validate() {
	    // 驗證設定，如果一個頁面中，
	    // 有多個不同子頁面的驗證，
	    // 可以在這進行設定。
	    console.log(_tip + ' validate()');
	    return false;
	  },
	  popDefaultParams: function popDefaultParams() {
	    return {
	      url: this.url.pop,
	      focusId: this.focusId,
	      popWidth: this.popWidth
	    };
	  },
	  commonPop: function commonPop() {
	    var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	    var status = arguments[1];
	    var formData = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	    var params = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	
	    console.log('commonPop setting');
	    var newParams = this.popDefaultParams();
	    newParams.callback = this.callback[status];
	    newParams.data = this.popData[status];
	    newParams.formData = formData;
	    Object.assign(newParams, params);
	    if (formData.status === 1) {
	      Dna.showMsg(_statusCheck);
	      return false;
	    }
	    this.index = index;
	    this.formStatus = status;
	    this.pop(newParams);
	  },
	
	  // addPop(params = {}) {
	  //   console.log('addPop setting');
	  //   let newParams = this.popDefaultParams();
	  //   newParams.callback = this.callback[_addStatus];
	  //   newParams.data = this.popData[_addStatus];
	  //   Object.assign(newParams, params);
	  //   this.formStatus = _addStatus;
	  //   this.pop(newParams);
	  // },
	  // editPop(formData) {
	  //   console.log('editPop setting');
	  //   /*
	  //     1.check status of rows
	  //     2.this.pop(params,this.editCallback);
	  //     2.set formStatus = edit
	  //     3.call editCallback
	  //   */
	  //   let newParams = this.popDefaultParams();
	  //   newParams.callback = this.callback[_editStatus];
	  //   newParams.data = this.popData[_editStatus];
	  //   newParams.formData = formData;
	  //   if (formData.status === 1) {
	  //     Dna.showMsg(_statusCheck);
	  //     return false;
	  //   }
	  //   this.formStatus = _editStatus;
	  //   this.pop(newParams);
	  // },
	  // viewPop() {
	  //   console.log('viewPop setting');
	  // },
	  // viewCallBack() {
	  //   console.log('${_tip} viewCallBack()');
	  // },
	  del: function del() {
	    var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	    var delParams = arguments[1];
	    var id = delParams.id;
	    var _delParams$status = delParams.status;
	    var status = _delParams$status === undefined ? 0 : _delParams$status;
	    var _delParams$url = delParams.url;
	    var url = _delParams$url === undefined ? this.url.del : _delParams$url;
	    var success = delParams.success;
	    var params = {
	      msg: _delCheck,
	      sendData: {
	        url: url,
	        data: { id: id },
	        success: success
	      }
	    };
	
	    this.rowIndexs = index;
	    if (status === 1) {
	      this.showMsg(_delDisable);
	      return false;
	    }
	
	    this.formStatus = _delStatus;
	    this.jConfirm(params);
	  },
	  delBatch: function delBatch() {
	    var _this2 = this;
	
	    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var _params$url = params.url;
	    var url = _params$url === undefined ? this.url.delBatch : _params$url;
	    var _params$tipName = params.tipName;
	    var tipName = _params$tipName === undefined ? 'name' : _params$tipName;
	    var ids = [];
	    var indexs = [];
	    var names = [];
	    var data = void 0;
	    var ajaxData = void 0;
	    var checkItems = this.checkAll(this.dataGrid);
	    if (checkItems.length === 0) {
	      this.showMsg(_delBatch);
	      return false;
	    }
	    // 取得删除id或提示的字段
	    _jquery2.default.each(checkItems, function (index, item) {
	      if (item.status === '1') {
	        names.push(item[tipName]);
	      } else {
	        indexs.push(_this2.dataGrid.datagrid('getRowIndex', item));
	        ids.push(item.stringId);
	      }
	    });
	
	    if (names.length > 0) {
	      var msg = this.concatMsg(names);
	      this.showMsg({ msg: '名称' + msg + '启用状态，不允许删除!' });
	      return false;
	    }
	    this.rowIndexs = indexs;
	    this.formStatus = _delStatus;
	    data = { ids: ids.join(',') };
	    ajaxData = {
	      msg: _delCheck,
	      sendData: {
	        url: url,
	        data: data
	      }
	    };
	    this.jConfirm(ajaxData);
	  },
	
	
	  // 查询时所需的参数数据
	  searchParams: function searchParams() {
	    var preId = arguments.length <= 0 || arguments[0] === undefined ? this.preId : arguments[0];
	
	    var params = {
	      searchStr: _jquery2.default.trim((0, _jquery2.default)('#' + preId + 'SearchStr').val()),
	      status: this.status,
	      sort: this.sort
	    };
	    return params;
	  },
	  search: function search() {
	    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var _params$dataGrid = params.dataGrid;
	    var dataGrid = _params$dataGrid === undefined ? this.dataGrid : _params$dataGrid;
	    var _params$searchObj = params.searchObj;
	    var searchObj = _params$searchObj === undefined ? this.searchParams() : _params$searchObj;
	
	    if (searchObj.searchStr.includes('$')) {
	      this.showMsg(_searchStr);
	    } else {
	      dataGrid.datagrid('load', searchObj);
	    }
	  },
	
	
	  // 设置查询栏位中的提示字段及focus
	  setSearchStr: function setSearchStr() {
	    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var _params$preId = params.preId;
	    var preId = _params$preId === undefined ? this.preId : _params$preId;
	    var _params$str = params.str;
	    var str = _params$str === undefined ? this.searchTip : _params$str;
	    var _params$obj = params.obj;
	    var obj = _params$obj === undefined ? (0, _jquery2.default)('#' + preId + 'SearchStr') : _params$obj;
	
	
	    obj.attr("placeholder", str);
	    obj.tooltip({
	      content: "<span style='color:#000000'>" + str + "</span>",
	      onShow: function onShow() {
	        (0, _jquery2.default)(this).tooltip('tip').css({
	          backgroundColor: '#fff',
	          borderColor: '#666'
	        });
	      }
	    });
	    obj.focus();
	  }
	};
	Object.assign(Dna, _dataControl.DataControl, _message.Message, _dataGrid.DataGrid, _validate.Validate, _comboGrid.ComboGrid);
	window.Dna = Dna;
	window.Tree = _tree.Tree;
	window.$ = _jquery2.default;
	exports.Dna = Dna;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Message = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; // import 'babel-polyfill';
	
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _const = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _title = '提示',
	    _slideMsg = function _slideMsg(obj) {
	  var msg = obj.msg;
	  var _obj$title = obj.title;
	  var title = _obj$title === undefined ? _title : _obj$title;
	
	  _jquery2.default.messager.show({
	    title: title,
	    msg: msg,
	    timeout: 2000,
	    showType: 'slide'
	  });
	};
	
	var Message = exports.Message = {
	  resolve: function resolve(obj) {
	    // obj = JSON.parse(obj);
	    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
	      obj = JSON.parse(obj);
	    }
	    var _obj = obj;
	    var status = _obj.status;
	
	
	    switch (status) {
	      case _const.CONST.BASES.SUCCESS:
	        _slideMsg(obj);
	        return true;
	      case _const.CONST.BASES.ERR:
	        this.showMsg(obj);
	        return false;
	      case _const.CONST.BASES.CONF:
	        // obj.callback = this.confirm;
	        this.jConfirm(obj);
	        break;
	      // return false;
	      default:
	        break;
	    }
	  },
	  showMsg: function showMsg(obj) {
	    if (typeof obj === 'string') {
	      obj = { msg: obj };
	    }
	    var _obj2 = obj;
	    var _obj2$title = _obj2.title;
	    var title = _obj2$title === undefined ? _title : _obj2$title;
	    var msg = _obj2.msg;
	    var callback = _obj2.callback;
	
	    _jquery2.default.messager.alert(title, msg, callback);
	  },
	  jConfirm: function jConfirm(obj) {
	    var _this = this;
	
	    var _obj$title2 = obj.title;
	    var title = _obj$title2 === undefined ? _title : _obj$title2;
	    var msg = obj.msg;
	    var _obj$sendData = obj.sendData;
	    var sendData = _obj$sendData === undefined ? {} : _obj$sendData;
	
	    _jquery2.default.messager.confirm(title, msg, function (r) {
	      if (r) {
	        _this.confirmOK(sendData);
	      } else {
	        _this.confirmNO();
	      }
	    });
	  }
	};

/***/ },
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DataControl = undefined;
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _const = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// import {Message} from './message.js';
	var popDiv = (0, _jquery2.default)('#' + _const.CONST.BASES.POPDIV),
	
	// form = CO.BASES.FORM,
	submitBtn = _const.CONST.BASES.SUBMITBTN,
	    _tip = '这是父节点中的方法，请在子节点中新增';
	
	var
	// 预設送出成功后呼叫的方法
	_defaultSuccess = {
	  add: function add(data) {
	    if (this.resolve(data)) {
	      console.log('hide popdiv 新增完成');
	      // hide popdiv
	      this.popHide();
	      // datagrid insertRow
	      var row = this.formData;
	      this.dataGrid.datagrid('insertRow', { index: 0, row: row });
	    } else {
	      // 取消确认按钮锁定
	      this.btnEnable();
	    }
	  },
	  edit: function edit(data) {
	    if (this.resolve(data)) {
	      console.log('hide popdiv 修改完成');
	      // hide popdiv
	      this.popHide();
	      // datagrid updateRow
	      var row = this.formData,
	          index = this.index;
	      this.dataGrid.datagrid('updateRow', { index: index, row: row });
	    } else {
	      // 取消确认按钮锁定
	      this.btnEnable();
	    }
	  },
	
	  // 预设删除成功的 callback
	  del: function del(data) {
	    console.log('删除成功 callback');
	    // if (this.resolve(data)) {
	    //   this.dataGrid.datagrid('reload');
	    // }
	    var index = this.rowIndexs;
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	      for (var _iterator = index.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var i = _step.value;
	
	        this.dataGrid.dataGrid('deleteRow', i);
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }
	  },
	
	  // 预设修改状态成功的 callback
	  status: function status(data) {
	    console.log('状态修改成功 callback');
	  }
	};
	
	var DataControl = {
	  // form 表单的事件绑定
	
	  formSet: function formSet() {
	    var _this = this;
	
	    var beforeCheck = this.beforeCheck;
	    var formObj = {
	      onSubmit: function onSubmit(param) {
	        // do some check
	        // return false to prevent submit;
	        var v = (0, _jquery2.default)('form').form('enableValidation').form('validate');
	        if (v) {
	          if (beforeCheck) {
	            return _this.beforeSubmit();
	          }
	          return true;
	        }
	        return v;
	      },
	      success: function success() {
	        // console.log('submitsuccess');
	        DataControl.btnDisable();
	        _this.route();
	      }
	    };
	    console.log("formSet");
	    (0, _jquery2.default)('form').form(formObj);
	    // form.form(formObj);
	  },
	  beforeSubmit: function beforeSubmit() {
	    /*
	      送出前的各種設定，如
	      url 更動，
	      是前同名確認，
	      多個子頁不同服務設定。
	    */
	    console.log('beforeSubmit()');
	    this.getFormData();
	    return true;
	  },
	  submit: function submit() {
	    (0, _jquery2.default)('form').submit(function (event) {
	      event.preventDefault();
	    });
	  },
	  btnDisable: function btnDisable() {
	    (0, _jquery2.default)('#' + submitBtn).attr('disabled', true);
	  },
	  btnEnable: function btnEnable() {
	    (0, _jquery2.default)('#' + submitBtn).attr('disabled', false);
	  },
	  popHide: function popHide() {
	    popDiv.hide();
	  },
	
	  // 清除表單空白
	  trimForm: function trimForm(formData) {
	    _jquery2.default.each(formData, function (i, item) {
	      formData[i].value = _jquery2.default.trim(item.value);
	    });
	    return formData;
	  },
	
	  // <>空白等特殊字符取代
	  strReplace: function strReplace(str) {
	    var replaceStr = /[<>&"\s]/g;
	    return str.replace(replaceStr, function (c) {
	      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', ' ': '&nbsp;' }[c];
	    });
	  },
	
	  // 去除重覆陣列資料
	  dedupe: function dedupe(array) {
	    return Array.from(new Set(array));
	  },
	
	  // 檔案上傳 button
	  // obj: elmentID, mult: false 決定是否上傳多個檔
	  uploadButton: function uploadButton(obj) {
	    var mult = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	    (0, _jquery2.default)(obj).filebox({
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
	  setToolTip: function setToolTip(obj, val) {
	    (0, _jquery2.default)(obj).tooltip({
	      content: '<span>' + val + '</span>',
	      onShow: function onShow() {
	        (0, _jquery2.default)(this).tooltip('tip').css({
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
	  pop: function pop(params) {
	    var _this2 = this;
	
	    var url = params.url;
	    var data = params.data;
	    var focusId = params.focusId;
	    var callback = params.callback;
	    var _params$formData = params.formData;
	    var formData = _params$formData === undefined ? {} : _params$formData;
	
	    popDiv.load(url, data, function () {
	      // 将视窗弹出
	      _this2.dailog(params);
	      _this2.validate();
	      _this2.formSet();
	
	      (0, _jquery2.default)('#' + focusId).focus();
	      if (typeof callback === 'function') {
	        callback(formData);
	      }
	    });
	  },
	
	
	  /*
	    彈出框
	    取得相对物件的高和宽
	  */
	  dailog: function dailog(params) {
	    var popIndex = 8900,
	        width = params.width ? params.width : 440,
	        winH = (0, _jquery2.default)(window).height(),
	        popObj = popDiv.find('.pop-container'),
	        popH = popObj.height(),
	        marginTop = (winH - popH) / 4;
	
	    if (!(popDiv.find('.pop-shadow').length > 0)) {
	      popDiv.append('<div class="pop-shadow"></div>');
	    }
	    popDiv.css({ zIndex: popIndex }).fadeIn(100);
	
	    popObj.css({
	      width: width + 'px',
	      marginTop: marginTop + 'px'
	    });
	  },
	  route: function route() {
	    console.log(_tip + ' route()');
	    var params = {
	      url: this.url[this.formStatus],
	      data: this.formData,
	      dataGrid: this.dataGrid
	    },
	        checkUrl = this.url.check;
	
	    if (checkUrl) {
	      var checkParams = {
	        url: checkUrl,
	        data: params.data,
	        success: function success(data) {
	          this.resolve(data);
	        }
	      };
	      this.sendData(checkParams);
	    } else {
	      this.sendData(params);
	    }
	    // return false;
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
	  sendData: function sendData(ajaxData) {
	    var _this3 = this;
	
	    var url = ajaxData.url;
	    var _ajaxData$type = ajaxData.type;
	    var type = _ajaxData$type === undefined ? _const.CONST.BASES.POST : _ajaxData$type;
	    var data = ajaxData.data;
	    var _ajaxData$success = ajaxData.success;
	    var _success = _ajaxData$success === undefined ? false : _ajaxData$success;
	    var action = this.formStatus;
	    _jquery2.default.ajax({
	      url: url,
	      type: type,
	      data: data,
	      success: function success(data) {
	        if (_success) {
	          _success.call(_this3, data);
	        } else {
	          _defaultSuccess[action].call(_this3, data);
	        }
	      }
	    });
	  },
	
	
	  // 取得去除前后空白的formdata
	  getFormData: function getFormData() {
	    // let form = $(this.form);
	    this.formData = this.trimForm((0, _jquery2.default)('form').serializeArray());
	  },
	  concatMsg: function concatMsg(items) {
	    var msg = '';
	    _jquery2.default.each(items, function (k, v) {
	      msg += '[' + v + '],';
	    });
	    return msg.substring(0, msg.length - 1);
	  },
	  includes: function includes(arr, value) {
	    return arr.includes(value);
	  },
	  addTab: function addTab(title, url) {
	    var _this4 = this;
	
	    var sc = (0, _jquery2.default)('#site-content');
	    if (sc.tabs('exists', title)) {
	      sc.tabs('select', title);
	    } else {
	      _jquery2.default.ajax({
	        dataType: 'html',
	        type: 'get',
	        url: url,
	        success: function success(data) {
	          sc.tabs('add', {
	            title: title,
	            content: data,
	            closable: true
	          });
	          _this4.autoFillScreen();
	        }
	      });
	    }
	    this.autoFillScreen();
	  },
	  autoFillScreen: function autoFillScreen() {
	    var panel = (0, _jquery2.default)('#site-content > .tabs-panels'),
	        height = (0, _jquery2.default)(window).height();
	    panel.css({
	      height: height - 80 + 'px'
	    });
	
	    (0, _jquery2.default)('.main-frame').css({
	      height: height - 85 + 'px'
	    });
	  }
	};
	
	exports.DataControl = DataControl;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DataGrid = undefined;
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _columns = __webpack_require__(6);
	
	var _const = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _limit = _const.CONST.LIMIT.SHIFTGRID,
	    _limitMsg = '一次数据不可超过' + _limit + '笔!',
	    _addItem = '请选择要添加的项目'; /*
	                              Module: DataGrid,
	                              Create: 2016/07/17,
	                              Auther: chenshuxian
	                              說明: 此模塊主要提共 datagrid 相關 API。
	                            */
	
	
	var _total = function _total() {
	  var total = (0, _jquery2.default)('#leftGrid').datagrid('getRows');
	  (0, _jquery2.default)('#total').html(total.length);
	},
	    _getGrid = function _getGrid() {
	  var params = {
	    lg: (0, _jquery2.default)('#leftGrid'),
	    rg: (0, _jquery2.default)('#rightGrid')
	  };
	  return params;
	},
	    _dgLimit = function _dgLimit(limit, len) {
	  if (limit > 30) {
	    Dna.showMsg({ msg: '目前勾选' + len + '笔，' + _limitMsg });
	  } else {
	    Dna.showMsg({ msg: _addItem });
	  }
	},
	
	/*
	  設定備註欄的 tooltip
	*/
	_setDgTt = function _setDgTt() {
	  var tooltip = (0, _jquery2.default)(this).datagrid('getPanel').find('.easyui-tooltip');
	  if (tooltip) {
	    tooltip.each(function () {
	      var val = (0, _jquery2.default)(this)[0].getAttribute('data-value');
	      Dna.setToolTip(this, val);
	    });
	  }
	};
	
	var DataGrid = exports.DataGrid = {
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
	
	  initDG: function initDG(params) {
	    var url = params.url;
	    var data = params.data;
	    var module = params.module;
	    var hideCols = params.hideCols;
	    var _params$height = params.height;
	    var height = _params$height === undefined ? (0, _jquery2.default)('#site-content').height() - 95 : _params$height;
	    var _params$method = params.method;
	    var method = _params$method === undefined ? 'post' : _params$method;
	    var init = {
	      url: url,
	      queryParams: data,
	      columns: _columns.Columns[module](),
	      height: height,
	      fitColumns: true,
	      method: method,
	      // checkOnSelect: false,
	      // selectOnCheck: false,
	      // autoRowHeight: false,
	      striped: true,
	      pagination: true,
	      scrollbarSize: 0,
	      pageNumber: 1,
	      pageSize: 10,
	      onLoadSuccess: function onLoadSuccess(data) {
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
	      onClickCell: function onClickCell(index, field, value) {
	        Dna.fieldName = field;
	      },
	      onClickRow: function onClickRow(index, row) {
	        Dna.highLight.call(this, index);
	      }
	    };
	    return init;
	  },
	  highLight: function highLight(index) {
	    (0, _jquery2.default)(this).datagrid('highlightRow', Number(index));
	  },
	
	
	  //  params:
	  //  dg = datagrid Object,
	  //  array = hidden field of Columns
	  hideCols: function hideCols(dg, arr) {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	      for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var v = _step.value;
	
	        dg.datagrid('hideColumn', v);
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }
	  },
	
	
	  //  params:
	  //  obj = datagrid Object,
	  //  array = hidden field of Columns
	  showCols: function showCols(dg, arr) {
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;
	
	    try {
	      for (var _iterator2 = arr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	        var v = _step2.value;
	
	        dg.datagrid('showColumn', v);
	      }
	    } catch (err) {
	      _didIteratorError2 = true;
	      _iteratorError2 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion2 && _iterator2.return) {
	          _iterator2.return();
	        }
	      } finally {
	        if (_didIteratorError2) {
	          throw _iteratorError2;
	        }
	      }
	    }
	  },
	
	
	  // 向右移
	  shiftR: function shiftR() {
	    var GD = _getGrid(),
	        dataL = GD.lg.datagrid('getSelections'),
	        dataLen = dataL.length;
	    if (dataLen > 0 && dataLen < _limit) {
	      dataL.forEach(function (el, index) {
	        var newRow = { index: 0, row: el },
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
	  shiftL: function shiftL() {
	    var GD = _getGrid(),
	        dataR = GD.rg.datagrid('getSelections'),
	        dataLen = dataR.length;
	    if (dataLen > 0 && dataLen < _limit) {
	      dataR.forEach(function (el, index) {
	        var newRow = { index: 0, row: el },
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
	  checkAll: function checkAll(obj) {
	    return (0, _jquery2.default)(obj).datagrid('getChecked');
	  },
	
	
	  /*
	    載入成功後 grid 排序
	    改變工具欄的狀態
	  */
	  successSort: function successSort() {
	    // 找入成功，修改狀態
	  },
	
	
	  /*
	    下拉滾動條置頂
	  */
	  scorllTop: function scorllTop() {
	    (0, _jquery2.default)(this).datagrid('scrollTo', 0);
	  },
	
	
	  /*
	    dataGrid 頁面調整
	  */
	  dgAdjust: function dgAdjust() {
	    var table = arguments.length <= 0 || arguments[0] === undefined ? this.dataGrid : arguments[0];
	
	    // 隨畫面調整大小
	    var width = table.parents('.tabs-panels').width() - 40,
	        height = table.parents('.tabs-panels').height() - 70;
	    table.datagrid('resize', {
	      width: width,
	      height: height
	    });
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*
	  Module: Columns,
	  Create: 2016/07/17,
	  Auther: chenshuxian
	  說明: 此模塊主要提共 datagrid 相關所有欄位集合。
	*/
	// 共用 function
	var _status = function _status() {},
	    _operation = function _operation() {},
	    _show = function _show() {},
	    _remark = function _remark(value) {
	  var remark = "<span class='easyui-tooltip' data-value='" + value + "'>" + value + "</span>";
	  return remark;
	};
	
	// 欄位集合區
	var Columns = exports.Columns = {
	  LS: function LS() {
	    var _columns = [[{ field: "ck", checkbox: true, width: 30 }, { title: "编码", field: "codeNo", width: 30 }, { title: "名称", field: "name", flex: 1, width: 60 }, { title: "助记符", field: "fastCode", width: 150 }, { title: "顺序号", field: "displayOrder", width: 50 }, { title: "备注", field: "memo", width: 150 }, { title: "状态", field: "status" }, { title: "操作", field: "opt", width: 40 }]];
	    return _columns;
	  },
	  comboGrid: function comboGrid() {
	    var cols = [[{ field: 'code', title: 'Code', width: 60 }, { field: 'name', title: 'Name', width: 60 }, { field: 'addr', title: 'Addr', width: 60 }, { field: 'col4', title: 'Col4', width: 60 }]];
	    return cols;
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var require;'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Validate = undefined;
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _err = function _err(target, msg) {
	  var t = (0, _jquery2.default)(target);
	  if (t.hasClass('textbox-text')) {
	    t = t.parent();
	  }
	  var m = t.next('.error-message');
	  if (!m.length) {
	    m = (0, _jquery2.default)('<div class="error-message"></div>').insertAfter(t);
	  }
	  m.html(msg);
	};
	
	var Validate = exports.Validate = {
	  dateToUnix: function dateToUnix(string) {
	    var f = string.split(' ', 2),
	        d = (f[0] ? f[0] : '').split('-', 3),
	        t = (f[1] ? f[1] : '').split(':', 2);
	    return new Date(parseInt(d[0], 10) || null, (parseInt(d[1], 10) || 1) - 1, parseInt(d[2], 10) || null, parseInt(t[0], 10) || null, parseInt(t[1], 10) || null, parseInt(t[2], 10) || null).getTime() / 1000;
	  },
	  dateCompare: function dateCompare(startdate, enddate) {
	    var starttimes = this.dateToUnix(startdate),
	        endtimes = this.dateToUnix(enddate);
	
	    if (starttimes > endtimes) {
	      Dna.showMsg('开始日期需小于结束日期!');
	      return false;
	    }
	    return true;
	  },
	  comboGrid: function comboGrid(obj, msg, parentId, req) {
	    var comboText = obj.getText(),
	        require = true;
	
	    if (req === 0 && comboText === "") {
	      require = false;
	    }
	    if (require) {
	      // 必填
	      if (comboText === "") {
	        Dna.showMsg(msg + '数据为空,，请从下拉列表中添加！', function () {
	          (0, _jquery2.default)('#' + parentId + 'input:text').select();
	        });
	        return true;
	      }
	      if (!obj.checkValue(false) && obj.comboEditText !== comboText) {
	        Dna.showMsg(msg + '数据不存在,，请从下拉列表中添加！', function () {
	          (0, _jquery2.default)("#" + parentId + "input:text").select();
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
	  comboGridEdit: function comboGridEdit(obj, inputName, id) {
	    var comboText = obj.getText(),
	        setText = comboText + '(此选择已被停用)';
	    // 已被停用
	    if (!obj.checkValue(false) && comboText !== "") {
	      obj.setText(setText);
	      (0, _jquery2.default)('input[name=\'' + inputName + '\']').val(id);
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
	  vb: function vb(params) {
	    var obj = params.obj;
	    var setting = params.setting;
	    var _params$len = params.len;
	    var len = _params$len === undefined ? 30 : _params$len;
	
	    setting.err = _err;
	    (0, _jquery2.default)(obj).validatebox(setting);
	    (0, _jquery2.default)(obj).attr('maxlength', len);
	  },
	
	
	  err: _err
	};
	
	_jquery2.default.extend(_jquery2.default.fn.validatebox.defaults.rules, {
	  symbol: {
	    validator: function validator(value) {
	      var reg = /[<>|$]/;
	      return !reg.test(value);
	    },
	    message: "本次输入中有特殊字符，请重新输入!"
	  },
	  authUser: {
	    validator: function validator(value) {
	      var reg = /^[A-Za-z0-9_]{1,14}$/;
	      return reg.test(value);
	    },
	    message: "长6-20字符，可由数字、字母和下划线组成，字母不区分大小写!"
	  },
	  // 客户帐号创建
	  customer: {
	    validator: function validator(value) {
	      value = value.toLowerCase();
	      var reg = /^(?!.*admin)/;
	      return reg.test(value);
	    },
	    message: "不能包含admin"
	  },
	  account: {
	    validator: function validator(value) {
	      value = value.toLowerCase();
	      var reg = /^(?!(?:[\d_]*$))[A-Za-z0-9_]{4,20}$/;
	      return reg.test(value);
	    },
	    message: "长4-20字符，可由数字、字母和下划线组成，字母不区分大小写!"
	  },
	  digits: {
	    validator: function validator(value) {
	      return (/^([0-9])+\d*$/i.test(value)
	      );
	    },
	    message: "请输入数字"
	  },
	  telephone: {
	    validator: function validator(value) {
	      return (/^[\d\s\-]+$/.test(value)
	      );
	    },
	    message: "可输入数字,-,空格"
	  },
	  blank: {
	    validator: function validator(value) {
	      return _jquery2.default.trim(value) !== '';
	    },
	    message: "不能只输入空格！"
	  },
	  ipFormat: {
	    validator: function validator(value) {
	      var reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
	      return reg.test(value);
	    },
	    message: "请输入正确的IP地址"
	  },
	  password: {
	    validator: function validator(value) {
	      var reg = /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[!@#$%^&_])|(?=.*?[A-Za-z])(?=.*?[!@#$%^&_]))[\dA-Za-z!@#$%^&_]{6,20}$/;
	      return reg.test(value);
	    },
	    message: "6-20个字符，字母、数字的组合!"
	  },
	  equalTo: {
	    validator: function validator(value, param) {
	      return (0, _jquery2.default)(param[0]).val() === value;
	    },
	    message: "字段不匹配"
	  },
	  numAndLetters: {
	    validator: function validator(value) {
	      var reg = /^[A-Za-z0-9]+$/;
	      return reg.test(value);
	    },
	    message: "数字、字母的组合"
	  },
	  // 下拉是选单验证
	  selectValueRequired: {
	    validator: function validator(value, param) {
	      return (0, _jquery2.default)(param[0]).find('option:contains(\'' + value + '\')').val() !== '';
	    },
	    message: '下拉选框不可为空.'
	  },
	  english: {
	    validator: function validator(value) {
	      var reg = /^[A-Za-z]+$/;
	      return reg.test(value);
	    },
	    message: "只能有字母"
	  },
	  upperCase: {
	    validator: function validator(value) {
	      var reg = /^[A-Z]+$/;
	      return reg.test(value);
	    },
	    message: "只能为大写字母"
	  },
	  upperNum: {
	    validator: function validator(value) {
	      var reg = /^[A-Z|0-9]+$/;
	      return reg.test(value);
	    },
	    message: "只能为大写字母和数字，请重新输入"
	  },
	  comboxtree: {
	    validator: function validator(value, param) {
	      var selVal = (0, _jquery2.default)("input[name=" + param[0] + "]").val();
	      return Number(selVal) > 0;
	    },
	    message: "不可以空，请选择"
	  },
	  combogrid: {
	    validator: function validator(value) {
	      var selVal = this.parentElement.previousSibling.filterData;
	      return selVal;
	    },
	    message: "輸入項目於下拉選單中沒有"
	  },
	  compareValue: {
	    validator: function validator(value, param) {
	      var selVal = (0, _jquery2.default)("input[name=" + param[0] + "]").val();
	      return value > Number(selVal);
	    },
	    message: "起始年龄要小于结束年龄"
	  },
	  // 中心信息项目对照数字验证，取到小数点第二位
	  numberTwo: {
	    validator: function validator(value) {
	      var reg = /^[0-9]+(.[0-9]{1,2})?$/;
	      return reg.test(value);
	    },
	    message: "只能为数字，小数点取到第二位"
	  }
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Tree = undefined;
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _selectMsg = '请选择节点',
	    _delDeny = '根节点不能删除';
	
	var _append = function _append(_ref) {
	  var obj = _ref.obj;
	  var node = _ref.node;
	  var data = _ref.data;
	
	  obj.tree('append', {
	    parent: node.target,
	    data: data
	  });
	};
	
	var Tree = exports.Tree = {
	  treeObj: (0, _jquery2.default)('#tt'),
	  url: '/json/tree',
	  animate: 'true',
	  initTree: function initTree() {
	    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var _params$url = params.url;
	    var url = _params$url === undefined ? this.url : _params$url;
	    var _params$animate = params.animate;
	    var animate = _params$animate === undefined ? this.animate : _params$animate;
	    var _params$method = params.method;
	    var method = _params$method === undefined ? 'get' : _params$method;
	    var tree = {
	      url: url,
	      animate: animate,
	      method: method,
	      // 服务端改为单一路径时，以下方法可以取消
	      // onBeforeExpand(node) {
	      //   let options = $(this).tree('options');
	      //   options.url = this.asynUrl;
	      //   options.queryParams = {id: node.id, tier: node.attributes.tier};
	      // },
	      loadFilter: function loadFilter(data) {
	        if (typeof data === 'string') {
	          data = eval('(' + data + ')');
	        }
	        return data;
	      }
	    };
	    return tree;
	  },
	
	  // 新增后所呼叫的 callback
	  // data = [{id,text}]
	  addChild: function addChild() {
	    var obj = arguments.length <= 0 || arguments[0] === undefined ? this.treeObj : arguments[0];
	    var data = arguments[1];
	
	    var node = this.getSelectNode(obj),
	        params = { obj: obj, node: node, data: data };
	    _append(params);
	  },
	
	  // 增加兄弟结点
	  addBro: function addBro() {
	    var obj = arguments.length <= 0 || arguments[0] === undefined ? this.treeObj : arguments[0];
	    var data = arguments[1];
	
	    var child = this.getSelectNode(obj),
	        node = this.getFather(child, obj),
	        params = { obj: obj, node: node, data: data };
	    if (node) {
	      _append(params);
	    }
	  },
	  updateNode: function updateNode() {
	    var obj = arguments.length <= 0 || arguments[0] === undefined ? this.treeObj : arguments[0];
	    var name = arguments[1];
	
	    var node = this.getSelectNode(obj);
	    node.text = name;
	    (0, _jquery2.default)(obj).tree('update', node);
	  },
	  delNode: function delNode() {
	    var obj = arguments.length <= 0 || arguments[0] === undefined ? this.treeObj : arguments[0];
	
	    var node = this.getSelectNode(obj),
	        root = this.getRoot(obj),
	        formData = {
	      url: '/delTree',
	      id: '1',
	      success: function success(data) {
	        console.log('delNode CallBack');
	        if (Dna.resolve(data)) {
	          (0, _jquery2.default)(obj).tree('remove', node.target);
	        }
	      }
	    };
	    if (node.id === root.id) {
	      Dna.showMsg({ msg: _delDeny });
	      return false;
	    }
	    (0, _jquery2.default)(obj).tree('remove', node.target);
	    // Dna.del(formData);
	  },
	  getFather: function getFather(node) {
	    var obj = arguments.length <= 1 || arguments[1] === undefined ? this.treeObj : arguments[1];
	
	    var father = (0, _jquery2.default)(obj).tree('getParent', node.target);
	    return father;
	  },
	  getRoot: function getRoot() {
	    var obj = arguments.length <= 0 || arguments[0] === undefined ? this.treeObj : arguments[0];
	
	    var root = (0, _jquery2.default)(obj).tree('getRoot');
	    return root;
	  },
	  getSelectNode: function getSelectNode() {
	    var obj = arguments.length <= 0 || arguments[0] === undefined ? this.treeObj : arguments[0];
	
	    var node = (0, _jquery2.default)(obj).tree('getSelected');
	
	    if (node === null || node.length === 0) {
	      Dna.showMsg({ msg: _selectMsg });
	      return false;
	    }
	
	    return node;
	  }
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ComboGrid = undefined;
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _columns = __webpack_require__(6);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ComboGrid = exports.ComboGrid = {
	  /*
	    返回 comboGird 初始設定
	    params:
	    {
	      panelWidth: grid呈現框的寬度 number
	      idField: 下拉框的 value 对映栏 string
	      textField: 下拉框显示文字对映栏 string
	      required: 是否为必填
	      validType: 验证类别，阵列对映 validatebox 中提供的验证名称
	      validateOnBlur: onBlur 时进行验证 bool
	      method: ajax 方法
	      url: 后台服务路径,
	      module: 对映 columns 中的方法名
	    }
	  */
	
	  initComboDG: function initComboDG(params) {
	    var url = params.url;
	    var _params$panelWidth = params.panelWidth;
	    var panelWidth = _params$panelWidth === undefined ? 450 : _params$panelWidth;
	    var idField = params.idField;
	    var textField = params.textField;
	    var _params$required = params.required;
	    var required = _params$required === undefined ? false : _params$required;
	    var _params$validType = params.validType;
	    var validType = _params$validType === undefined ? ['combogrid'] : _params$validType;
	    var _params$method = params.method;
	    var method = _params$method === undefined ? 'post' : _params$method;
	    var _params$validateOnBlu = params.validateOnBlur;
	    var validateOnBlur = _params$validateOnBlu === undefined ? true : _params$validateOnBlu;
	    var module = params.module;
	    var init = {
	      panelWidth: panelWidth,
	      idField: idField,
	      textField: textField,
	      required: required,
	      validType: validType,
	      validateOnBlur: validateOnBlur,
	      err: Dna.err,
	      method: method,
	      url: url,
	      columns: _columns.Columns[module](),
	      onLoadSuccess: function onLoadSuccess(data) {
	        if (data.rows.source !== 'local') {
	          this.localStore = data;
	        }
	      },
	      onClickRow: function onClickRow(index, row) {
	        // $(this).combogrid().textbox('setValue', row.code);
	      },
	      onChange: function onChange(newValue, oldValue) {
	        var dgData = this.localStore.rows,
	            dg = (0, _jquery2.default)(this).combogrid('grid'),
	            filterArr = [],
	            checkValue = (0, _jquery2.default)(this).combogrid('getText'),
	            key = window.event;
	
	        // 取得上下键的keyCode
	        if (key) {
	          key = key.keyCode;
	        }
	        // console.log(`${$(this).combogrid('getText')} : ${key}`);
	        // 若為上下鍵時不進行过滤资料
	        if (key < 37 || key > 40 || !key) {
	          this.filterData = false;
	          var _iteratorNormalCompletion = true;
	          var _didIteratorError = false;
	          var _iteratorError = undefined;
	
	          try {
	            for (var _iterator = dgData.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	              var v = _step.value;
	
	              var arr = Object.values(v);
	              var _iteratorNormalCompletion2 = true;
	              var _didIteratorError2 = false;
	              var _iteratorError2 = undefined;
	
	              try {
	                for (var _iterator2 = arr.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                  var a = _step2.value;
	
	                  if (a.includes(checkValue)) {
	                    if (a === checkValue) {
	                      this.filterData = true;
	                    }
	                    filterArr.push(v);
	                    break;
	                  }
	                }
	              } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	              } finally {
	                try {
	                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                    _iterator2.return();
	                  }
	                } finally {
	                  if (_didIteratorError2) {
	                    throw _iteratorError2;
	                  }
	                }
	              }
	            }
	            // 修改 grid 载入资料
	          } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	              }
	            } finally {
	              if (_didIteratorError) {
	                throw _iteratorError;
	              }
	            }
	          }
	
	          filterArr.source = 'local';
	          dg.datagrid('loadData', filterArr);
	        } else {
	          this.filterData = true;
	        }
	      }
	    };
	    return init;
	  }
	};
	window.CG = ComboGrid;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(0, _jquery2.default)('*').on('keydown', 'input,a,select', function (e) {
	  var self = (0, _jquery2.default)(this),
	      form = self.parents('form:eq(0)'),
	      focusable,
	      next,
	      regStr;
	
	  if (e.keyCode === 13) {
	    focusable = form.find('input,a,select,textarea').filter(':visible');
	    next = focusable.eq(focusable.index(this) + 1);
	    if (next.length) {
	      checkDisabled(focusable, next);
	      next.focus();
	      next.select();
	    } else if (next.context) {
	      var tagId = next.context.id.toLowerCase(),
	          _regStr = /search/;
	      // 判断是表单事件或查询事件
	      if (_regStr.test(tagId)) {
	        (0, _jquery2.default)('#' + next.context.id).next().click(); // 查询事件触发
	      } else {
	        (0, _jquery2.default)("#editBtn").click();
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

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _dataControl = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// 添加 textbox clesnBtn
	_jquery2.default.extend(_jquery2.default.fn.textbox.methods, {
	  addClearBtn: function addClearBtn(jq, iconCls) {
	    return jq.each(function () {
	      var t = (0, _jquery2.default)(this);
	      var opts = t.textbox('options');
	      opts.icons = opts.icons || [];
	      opts.icons.unshift({
	        iconCls: iconCls,
	        handler: function handler(e) {
	          var cg = e.data.target;
	          (0, _jquery2.default)(cg).textbox('clear').textbox('textbox').focus();
	          var dg = (0, _jquery2.default)(cg).combogrid('grid');
	          dg.datagrid('loadData', cg.localStore);
	          (0, _jquery2.default)(this).css('visibility', 'hidden');
	        }
	      });
	      t.textbox();
	      if (!t.textbox('getText')) {
	        t.textbox('getIcon', 0).css('visibility', 'hidden');
	      }
	      t.textbox('textbox').bind('keyup', function () {
	        var icon = t.textbox('getIcon', 0);
	        if ((0, _jquery2.default)(this).val()) {
	          icon.css('visibility', 'visible');
	        } else {
	          icon.css('visibility', 'hidden');
	        }
	      });
	    });
	  }
	});
	
	/*
	 * 屏蔽网页滚动
	 * **/
	var bodyScroll = function bodyScroll() {
	  (0, _jquery2.default)('html,body').css({
	    overflow: 'visible'
	  });
	  (0, _jquery2.default)("body,html").unbind("touchmove");
	};
	
	(0, _jquery2.default)(document).on('click', '.J_ClosePop', function (e) {
	  e.preventDefault();
	  e.stopPropagation();
	  (0, _jquery2.default)(this).parents('.pop').hide();
	  bodyScroll();
	});
	
	(0, _jquery2.default)(window).on('resize', function () {
	  _dataControl.DataControl.autoFillScreen();
	});
	(0, _jquery2.default)(document).on('mouseover', '.drop-down', function () {
	  var li = (0, _jquery2.default)(this).children('.drop-down-menu').children().find('li');
	  if (li.length > 0) {
	    (0, _jquery2.default)(this).children('.drop-down-menu').show();
	    (0, _jquery2.default)(this).addClass('active');
	  }
	});
	(0, _jquery2.default)(document).on('mouseout', '.drop-down', function () {
	  (0, _jquery2.default)(this).children('.drop-down-menu').hide();
	  (0, _jquery2.default)(this).removeClass('active');
	});
	
	(0, _jquery2.default)(document).on('click', '.drop-down a', function () {
	  (0, _jquery2.default)(this).parents('.drop-down-menu').hide();
	});
	
	var siteMenu = (0, _jquery2.default)('#site-menu');
	/* 网站主菜单*/
	(0, _jquery2.default)('.submenu-item', siteMenu).on('mouseover', function () {
	  (0, _jquery2.default)(this).addClass('active').siblings().removeClass('active');
	  var i = (0, _jquery2.default)(this).find('i[data-class]');
	  i.addClass(i.attr('data-class'));
	  (0, _jquery2.default)('#shadow').stop().fadeIn();
	});
	(0, _jquery2.default)('.submenu-item', siteMenu).on('mouseleave', function () {
	  (0, _jquery2.default)(this).removeClass('active');
	  var i = (0, _jquery2.default)(this).find('i[data-class]');
	  i.removeClass(i.attr('data-class'));
	  (0, _jquery2.default)('#shadow').stop().fadeOut();
	});
	
	(0, _jquery2.default)(document).on('click', '.main-content-header li', function () {
	  var ul = (0, _jquery2.default)(this).closest("ul");
	  // span = $(this).closest("div").prev();//取得父节的上一个兄弟节点
	
	  // 将所有blue 清空
	  ul.find("li").each(function () {
	    if ((0, _jquery2.default)(this).hasClass("blue")) {
	      (0, _jquery2.default)(this).removeClass("blue");
	    }
	  });
	
	  (0, _jquery2.default)(this).addClass('blue');
	});

/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvY29tbW9ucy9jb3JlL0ROQS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvY29tbW9ucy9jb3JlL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2NvbW1vbnMvY29yZS9kYXRhQ29udHJvbC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvY29tbW9ucy9jb3JlL2RhdGFHcmlkLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9jb21tb25zL2NvcmUvY29sdW1ucy5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvY29tbW9ucy9jb3JlL3ZhbGlkYXRlLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9jb21tb25zL2NvcmUvdHJlZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvY29tbW9ucy9jb3JlL2NvbWJvR3JpZC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvY29tbW9ucy9jb3JlL2VudGVyVG9UYWIuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2NvbW1vbnMvY29yZS9vbkV2ZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUNBLEtBQUksT0FBTyxvQkFBWDtBQUFBLEtBQ0ksWUFBWSxXQURoQjtBQUFBLEtBRUksYUFBYSxhQUFNLE1BQU4sQ0FBYSxHQUY5QjtBQUFBLEtBR0ksYUFBYSxhQUFNLE1BQU4sQ0FBYSxHQUg5QjtBQUFBLEtBSUksY0FBYyxhQUFNLE1BQU4sQ0FBYSxJQUovQjtBQUFBOztBQU1JLGNBQWEsVUFOakI7QUFBQSxLQU9JLGNBQWMsZ0JBUGxCO0FBQUEsS0FRSSxZQUFZLFdBUmhCO0FBQUEsS0FTSSxlQUFlLFdBVG5CO0FBQUEsS0FVSSxhQUFhLGdCQVZqQjs7QUFZQSx1QkFBRSxlQUFGLEVBQW1CLElB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QixRQUFuQixFQUE2QixFQUE3QixDQUFnQyxZQUFoQyxFQUE4QyxZQUFXO0FBQ3ZELHlCQUFFLElBQUYsRUFBUSxXQUFSLENBQW9CLFFBQXBCO0FBQ0EsT0FBSSxJQUFJLHNCQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsZUFBYixDQUFSO0FBQ0EsS0FBRSxXQUFGLENBQWMsRUFBRSxJQUFGLENBQU8sWUFBUCxDQUFkO0FBQ0EseUJBQUUsU0FBRixFQUFhLElBQWIsR0FBb0IsT0FBcEI7QUFDRCxFQUxEOztBQU9BLHVCQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF3Qix5QkFBeEIsRUFBbUQsWUFBVztBQUM1RCxPQUFJLEtBQUssc0JBQUUsSUFBRixFQUFRLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBVDs7OztBQUlBLE1BQUcsSUFBSCxDQUFRLElBQVIsRUFBYyxJQUFkLENBQW1CLFlBQVc7QUFDNUIsU0FBSSxzQkFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQixNQUFqQixDQUFKLEVBQThCO0FBQzVCLDZCQUFFLElBQUYsRUFBUSxXQUFSLENBQW9CLE1BQXBCO0FBQ0Q7QUFDRixJQUpEOztBQU1BLHlCQUFFLElBQUYsRUFBUSxRQUFSLENBQWlCLE1BQWpCO0FBQ0QsRUFaRCxFIiwiZmlsZSI6IkRuYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi9tZXNzYWdlLmpzJztcbmltcG9ydCB7RGF0YUNvbnRyb2x9IGZyb20gJy4vZGF0YUNvbnRyb2wuanMnO1xuaW1wb3J0IHtEYXRhR3JpZH0gZnJvbSAnLi9kYXRhR3JpZC5qcyc7XG5pbXBvcnQge1ZhbGlkYXRlfSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcbmltcG9ydCB7VHJlZX0gZnJvbSAnLi90cmVlLmpzJztcbmltcG9ydCB7Q29tYm9HcmlkfSBmcm9tICcuL2NvbWJvR3JpZC5qcyc7XG5pbXBvcnQge0NPTlNUfSBmcm9tICcuL2NvbnN0LmpzJztcbmltcG9ydCB7fSBmcm9tICcuL2VudGVyVG9UYWIuanMnO1xuaW1wb3J0IHt9IGZyb20gJy4vb25FdmVudC5qcyc7XG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xubGV0IF90aXAgPSAn6L+Z5piv54i26IqC54K55Lit55qE5pa55rOV77yM6K+35Zyo5a2Q6IqC54K55Lit5paw5aKeJyxcbiAgICBfZGVsQmF0Y2ggPSAn6K+36YCJ5oup6KaB5Yig6Zmk55qE5pWw5o2uJyxcbiAgICBfZGVsU3RhdHVzID0gQ09OU1QuU1RBVFVTLkRFTCxcbiAgICBfYWRkU3RhdHVzID0gQ09OU1QuU1RBVFVTLkFERCxcbiAgICBfZWRpdFN0YXR1cyA9IENPTlNULlNUQVRVUy5FRElULFxuICAvLyAgX2RlbEJhdGNoU3RhdHVzID0gQ09OU1QuU1RBVFVTLkRFTEJBVENILFxuICAgIF9zZXRCZWZvcmUgPSAn6K+35LqO5a2Q6aG16Z2i5Lit5Yqg5YWlJyxcbiAgICBfZGVsRGlzYWJsZSA9ICflvZPpgInkuK3orrDlvZXlkK/nlKjvvIzkuI3lhYHorrjliKDpmaQhJyxcbiAgICBfZGVsQ2hlY2sgPSAn5piv5ZCm5Yig6Zmk5b2T5YmN57qq5b2VPycsXG4gICAgX3N0YXR1c0NoZWNrID0gJ+eKtuaAgeWQr+eUqOS4reemgeatoue8lui+kScsXG4gICAgX3NlYXJjaFN0ciA9ICfmn6Xor6LlrZfkuLLkuK3kuI3lj6/ku6XmnIkgJCDlrZflj7cnO1xuXG4kKCcjc2l0ZS1jb250ZW50JykudGFicyh7XG4gIGZpdDogdHJ1ZVxufSk7XG5cbmxldCBEbmEgPSB7XG4gIGZvcm1TdGF0dXM6IG51bGwsXG4gIGJlZm9yZUNoZWNrOiB0cnVlLFxuICBwcmVJZDogJ2NvcmUnLFxuICB1cmw6IHtcbiAgICBhZGQ6IGAke19zZXRCZWZvcmV9YWRkVXJsYCxcbiAgICBlZGl0OiBgJHtfc2V0QmVmb3JlfWVkaXRVcmxgLFxuICAgIHBvcDogYCR7X3NldEJlZm9yZX1wb3BVcmxgLFxuICAgIGNoZWNrOiBgJHtfc2V0QmVmb3JlfWNoZWNrVXJsYCxcbiAgICBzdGF0dXM6IGAke19zZXRCZWZvcmV9c3RhdHVzVXJsYCxcbiAgICBkZWw6IGAke19zZXRCZWZvcmV9ZGVsVXJsYCxcbiAgICBkZWxCYXRjaDogYCR7X3NldEJlZm9yZX1kZWxCYXRjaFVybGAsXG4gICAgcGFnZUxpc3Q6IGAke19zZXRCZWZvcmV9cGFnZUxpc3RVcmxgXG4gIH0sXG4gIGNhbGxiYWNrOiB7XG4gICAgYWRkKCkge1xuICAgICAgY29uc29sZS5sb2coJ2FkZENhbGxCYWNrJyk7XG4gICAgfSxcbiAgICBlZGl0KGZvcm1EYXRhKSB7XG4gICAgICBjb25zb2xlLmxvZygnZWRpdENhbGxCYWNrJyk7XG4gICAgICBjb25zb2xlLmxvZyhmb3JtRGF0YSk7XG4gICAgfSxcbiAgICB2aWV3KCkge1xuICAgICAgY29uc29sZS5sb2coJ3ZpZXdDYWxsQmFjaycpO1xuICAgIH1cbiAgfSxcbiAgcG9wRGF0YToge1xuICAgIGFkZDoge29wVHlwZTogX2FkZFN0YXR1c30sXG4gICAgZWRpdDoge29wVHlwZTogX2VkaXRTdGF0dXN9XG4gIH0sXG4gIHBvcFdpZHRoOiA0MDAsXG4gIHN0YXR1czogMCxcbiAgc29ydDogMCxcbiAgZGVsczogbmV3IFNldCgpLFxuICBhZGRzOiBuZXcgU2V0KCksXG4gIGxvY2FsU3RvcmU6IFtdLFxuICBmb3JtRGF0YTogW10sXG4gIGZvcm06IENPTlNULkJBU0VTLkZPUk0sXG4gIHNlYXJjaFRpcDogQ09OU1QuU0VBUkNIVElQLkNPTU1PTixcbiAgZmllbGROYW1lOiBudWxsLFxuICAvLyDorr7nva7pobXpnaLliJ3lp4vnirbmgIFcbiAgaW5pdCgpIHtcbiAgICBsZXQgcHJlSWQgPSB0aGlzLnByZUlkLFxuICAgICAgICB0aGF0ID0gdGhpcztcbiAgICAvLyDorr7nva7mn6Xor6LmoI/kuK3nmoTmj5DnpLrlrZfkuLJcbiAgICB0aGlzLnNldFNlYXJjaFN0cigpO1xuICAgIC8vIGRhdGFncmlkIOiHqumAguW6lFxuICAgICQod2luZG93KS5vbigncmVzaXplJywgKCkgPT4ge1xuICAgICAgdGhpcy5kZ0FkanVzdCgpO1xuICAgIH0pO1xuICAgIC8qIOeKtuaAgeaQnOe0oiAqL1xuICAgICQoYC4ke3ByZUlkfS1zdGF0dXMtc2VsZWN0b3IgbGlgKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICQoYCMke3ByZUlkfVN0YXR1c1NwYW5gKS5odG1sKCQodGhpcykuaHRtbCgpKTtcbiAgICAgICQoYC4ke3ByZUlkfS1zdGF0dXMtc2VsZWN0b3IgbGkuc2VsZWN0ZWRgKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgIHZhciBmbGcgPSAkKHRoaXMpLmlzKCcuc2VsZWN0ZWQnKTtcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmbGcgPyAnJyA6ICdzZWxlY3RlZCc7XG4gICAgICB9KTtcblxuICAgICAgdGhhdC5zdGF0dXMgPSAkKHRoaXMpLmF0dHIoXCJlbC12YWx1ZVwiKTtcbiAgICAgIHRoYXQuc2VhcmNoKCk7XG4gICAgfSk7XG5cbiAgICAvKiDmjpLluo8gKi9cbiAgICAkKGAuJHtwcmVJZH0tc29ydC1zZWxlY3RvciBsaWApLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgJChgIyR7cHJlSWR9U29ydFNwYW5gKS5odG1sKCQodGhpcykuaHRtbCgpKTtcbiAgICAgICQoYC4ke3ByZUlkfS1zb3J0LXNlbGVjdG9yIGxpLnNlbGVjdGVkYCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICB2YXIgZmxnID0gJCh0aGlzKS5pcygnLnNlbGVjdGVkJyk7XG4gICAgICAkKHRoaXMpLmFkZENsYXNzKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZmxnID8gJycgOiAnc2VsZWN0ZWQnO1xuICAgICAgfSk7XG5cbiAgICAgIHRoYXQuc29ydCA9ICQodGhpcykuYXR0cignZWwtdmFsdWUnKTtcbiAgICAgIHRoYXQuc2VhcmNoKCk7XG4gICAgfSk7XG5cbiAgICAvKiBzZWFyY2ggQnRuICovXG4gICAgJChgIyR7cHJlSWR9U2VhcmNoQnRuYCkub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5zZWFyY2goKTtcbiAgICB9KTtcblxuICAgICQoYCMke3ByZUlkfUFkZGApLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuY29tbW9uUG9wKDAsICdhZGQnKTtcbiAgICB9KTtcblxuICAgIC8vIGRlbGV0ZUJhdGNoXG4gICAgJChgIyR7cHJlSWR9RGVsZXRlQmF0Y2hgKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLmRlbGV0ZUJhdGNoKCk7XG4gICAgfSk7XG4gIH0sXG4gIC8vIOWQjuWPsOWbnuS8oGNvbmZpbSDlkI7miYDopoHmiafooYznmoTmlrnms5VcbiAgY29uZmlybU9LKCkge1xuICAgIGNvbnNvbGUubG9nKGAke190aXB9IGNvbmZpcm1PSygpYCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvLyDlkI7lj7Dlm57kvKBjb25maW0g5ZCO5omA6KaB5omn6KGM55qE5pa55rOVXG4gIGNvbmZpcm1OTygpIHtcbiAgICBjb25zb2xlLmxvZyhgJHtfdGlwfSBjb25maXJtTk8oKWApO1xuICAgIHRoaXMuYnRuRW5hYmxlKCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICB2YWxpZGF0ZSgpIHtcbiAgICAvLyDpqZforYnoqK3lrprvvIzlpoLmnpzkuIDlgIvpoIHpnaLkuK3vvIxcbiAgICAvLyDmnInlpJrlgIvkuI3lkIzlrZDpoIHpnaLnmoTpqZforYnvvIxcbiAgICAvLyDlj6/ku6XlnKjpgJnpgLLooYzoqK3lrprjgIJcbiAgICBjb25zb2xlLmxvZyhgJHtfdGlwfSB2YWxpZGF0ZSgpYCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBwb3BEZWZhdWx0UGFyYW1zKCkge1xuICAgIHJldHVybiB7XG4gICAgICB1cmw6IHRoaXMudXJsLnBvcCxcbiAgICAgIGZvY3VzSWQ6IHRoaXMuZm9jdXNJZCxcbiAgICAgIHBvcFdpZHRoOiB0aGlzLnBvcFdpZHRoXG4gICAgfTtcbiAgfSxcbiAgY29tbW9uUG9wKGluZGV4ID0gMCwgc3RhdHVzLCBmb3JtRGF0YSA9IHt9LCBwYXJhbXMgPSB7fSkge1xuICAgIGNvbnNvbGUubG9nKCdjb21tb25Qb3Agc2V0dGluZycpO1xuICAgIGxldCBuZXdQYXJhbXMgPSB0aGlzLnBvcERlZmF1bHRQYXJhbXMoKTtcbiAgICBuZXdQYXJhbXMuY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrW3N0YXR1c107XG4gICAgbmV3UGFyYW1zLmRhdGEgPSB0aGlzLnBvcERhdGFbc3RhdHVzXTtcbiAgICBuZXdQYXJhbXMuZm9ybURhdGEgPSBmb3JtRGF0YTtcbiAgICBPYmplY3QuYXNzaWduKG5ld1BhcmFtcywgcGFyYW1zKTtcbiAgICBpZiAoZm9ybURhdGEuc3RhdHVzID09PSAxKSB7XG4gICAgICBEbmEuc2hvd01zZyhfc3RhdHVzQ2hlY2spO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5mb3JtU3RhdHVzID0gc3RhdHVzO1xuICAgIHRoaXMucG9wKG5ld1BhcmFtcyk7XG4gIH0sXG4gIC8vIGFkZFBvcChwYXJhbXMgPSB7fSkge1xuICAvLyAgIGNvbnNvbGUubG9nKCdhZGRQb3Agc2V0dGluZycpO1xuICAvLyAgIGxldCBuZXdQYXJhbXMgPSB0aGlzLnBvcERlZmF1bHRQYXJhbXMoKTtcbiAgLy8gICBuZXdQYXJhbXMuY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrW19hZGRTdGF0dXNdO1xuICAvLyAgIG5ld1BhcmFtcy5kYXRhID0gdGhpcy5wb3BEYXRhW19hZGRTdGF0dXNdO1xuICAvLyAgIE9iamVjdC5hc3NpZ24obmV3UGFyYW1zLCBwYXJhbXMpO1xuICAvLyAgIHRoaXMuZm9ybVN0YXR1cyA9IF9hZGRTdGF0dXM7XG4gIC8vICAgdGhpcy5wb3AobmV3UGFyYW1zKTtcbiAgLy8gfSxcbiAgLy8gZWRpdFBvcChmb3JtRGF0YSkge1xuICAvLyAgIGNvbnNvbGUubG9nKCdlZGl0UG9wIHNldHRpbmcnKTtcbiAgLy8gICAvKlxuICAvLyAgICAgMS5jaGVjayBzdGF0dXMgb2Ygcm93c1xuICAvLyAgICAgMi50aGlzLnBvcChwYXJhbXMsdGhpcy5lZGl0Q2FsbGJhY2spO1xuICAvLyAgICAgMi5zZXQgZm9ybVN0YXR1cyA9IGVkaXRcbiAgLy8gICAgIDMuY2FsbCBlZGl0Q2FsbGJhY2tcbiAgLy8gICAqL1xuICAvLyAgIGxldCBuZXdQYXJhbXMgPSB0aGlzLnBvcERlZmF1bHRQYXJhbXMoKTtcbiAgLy8gICBuZXdQYXJhbXMuY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrW19lZGl0U3RhdHVzXTtcbiAgLy8gICBuZXdQYXJhbXMuZGF0YSA9IHRoaXMucG9wRGF0YVtfZWRpdFN0YXR1c107XG4gIC8vICAgbmV3UGFyYW1zLmZvcm1EYXRhID0gZm9ybURhdGE7XG4gIC8vICAgaWYgKGZvcm1EYXRhLnN0YXR1cyA9PT0gMSkge1xuICAvLyAgICAgRG5hLnNob3dNc2coX3N0YXR1c0NoZWNrKTtcbiAgLy8gICAgIHJldHVybiBmYWxzZTtcbiAgLy8gICB9XG4gIC8vICAgdGhpcy5mb3JtU3RhdHVzID0gX2VkaXRTdGF0dXM7XG4gIC8vICAgdGhpcy5wb3AobmV3UGFyYW1zKTtcbiAgLy8gfSxcbiAgLy8gdmlld1BvcCgpIHtcbiAgLy8gICBjb25zb2xlLmxvZygndmlld1BvcCBzZXR0aW5nJyk7XG4gIC8vIH0sXG4gIC8vIHZpZXdDYWxsQmFjaygpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnJHtfdGlwfSB2aWV3Q2FsbEJhY2soKScpO1xuICAvLyB9LFxuICBkZWwoaW5kZXggPSAwLCBkZWxQYXJhbXMpIHtcbiAgICBsZXQge2lkLCBzdGF0dXMgPSAwLCB1cmwgPSB0aGlzLnVybC5kZWwsIHN1Y2Nlc3N9ID0gZGVsUGFyYW1zLFxuICAgICAgICBwYXJhbXMgPSB7XG4gICAgICAgICAgbXNnOiBfZGVsQ2hlY2ssXG4gICAgICAgICAgc2VuZERhdGE6IHtcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgIGRhdGE6IHtpZH0sXG4gICAgICAgICAgICBzdWNjZXNzXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgdGhpcy5yb3dJbmRleHMgPSBpbmRleDtcbiAgICBpZiAoc3RhdHVzID09PSAxKSB7XG4gICAgICB0aGlzLnNob3dNc2coX2RlbERpc2FibGUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuZm9ybVN0YXR1cyA9IF9kZWxTdGF0dXM7XG4gICAgdGhpcy5qQ29uZmlybShwYXJhbXMpO1xuICB9LFxuICBkZWxCYXRjaChwYXJhbXMgPSB7fSkge1xuICAgIGxldCB7dXJsID0gdGhpcy51cmwuZGVsQmF0Y2gsIHRpcE5hbWUgPSAnbmFtZSd9ID0gcGFyYW1zLFxuICAgICAgICBpZHMgPSBbXSxcbiAgICAgICAgaW5kZXhzID0gW10sXG4gICAgICAgIG5hbWVzID0gW10sXG4gICAgICAgIGRhdGEsXG4gICAgICAgIGFqYXhEYXRhLFxuICAgICAgICBjaGVja0l0ZW1zID0gdGhpcy5jaGVja0FsbCh0aGlzLmRhdGFHcmlkKTtcbiAgICBpZiAoY2hlY2tJdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuc2hvd01zZyhfZGVsQmF0Y2gpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyDlj5blvpfliKDpmaRpZOaIluaPkOekuueahOWtl+autVxuICAgICQuZWFjaChjaGVja0l0ZW1zLCAoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtLnN0YXR1cyA9PT0gJzEnKSB7XG4gICAgICAgIG5hbWVzLnB1c2goaXRlbVt0aXBOYW1lXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleHMucHVzaCh0aGlzLmRhdGFHcmlkLmRhdGFncmlkKCdnZXRSb3dJbmRleCcsIGl0ZW0pKTtcbiAgICAgICAgaWRzLnB1c2goaXRlbS5zdHJpbmdJZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IG1zZyA9IHRoaXMuY29uY2F0TXNnKG5hbWVzKTtcbiAgICAgIHRoaXMuc2hvd01zZyh7bXNnOiBg5ZCN56ewJHttc2d95ZCv55So54q25oCB77yM5LiN5YWB6K645Yig6ZmkIWB9KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5yb3dJbmRleHMgPSBpbmRleHM7XG4gICAgdGhpcy5mb3JtU3RhdHVzID0gX2RlbFN0YXR1cztcbiAgICBkYXRhID0ge2lkczogaWRzLmpvaW4oJywnKX07XG4gICAgYWpheERhdGEgPSB7XG4gICAgICBtc2c6IF9kZWxDaGVjayxcbiAgICAgIHNlbmREYXRhOiB7XG4gICAgICAgIHVybCxcbiAgICAgICAgZGF0YVxuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5qQ29uZmlybShhamF4RGF0YSk7XG4gIH0sXG5cbiAgLy8g5p+l6K+i5pe25omA6ZyA55qE5Y+C5pWw5pWw5o2uXG4gIHNlYXJjaFBhcmFtcyhwcmVJZCA9IHRoaXMucHJlSWQpIHtcbiAgICBsZXRcbiAgICBwYXJhbXMgPSB7XG4gICAgICBzZWFyY2hTdHI6ICQudHJpbSgkKGAjJHtwcmVJZH1TZWFyY2hTdHJgKS52YWwoKSksXG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgc29ydDogdGhpcy5zb3J0XG4gICAgfTtcbiAgICByZXR1cm4gcGFyYW1zO1xuICB9LFxuXG4gIHNlYXJjaChwYXJhbXMgPSB7fSkge1xuICAgIGxldCB7XG4gICAgICBkYXRhR3JpZCA9IHRoaXMuZGF0YUdyaWQsXG4gICAgICBzZWFyY2hPYmogPSB0aGlzLnNlYXJjaFBhcmFtcygpXG4gICAgfSA9IHBhcmFtcztcbiAgICBpZiAoc2VhcmNoT2JqLnNlYXJjaFN0ci5pbmNsdWRlcygnJCcpKSB7XG4gICAgICB0aGlzLnNob3dNc2coX3NlYXJjaFN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFHcmlkLmRhdGFncmlkKCdsb2FkJywgc2VhcmNoT2JqKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8g6K6+572u5p+l6K+i5qCP5L2N5Lit55qE5o+Q56S65a2X5q615Y+KZm9jdXNcbiAgc2V0U2VhcmNoU3RyKHBhcmFtcyA9IHt9KSB7XG4gICAgbGV0IHtcbiAgICAgIHByZUlkID0gdGhpcy5wcmVJZCxcbiAgICAgIHN0ciA9IHRoaXMuc2VhcmNoVGlwLFxuICAgICAgb2JqID0gJChgIyR7cHJlSWR9U2VhcmNoU3RyYClcbiAgICB9ID0gcGFyYW1zO1xuXG4gICAgb2JqLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBzdHIpO1xuICAgIG9iai50b29sdGlwKHtcbiAgICAgIGNvbnRlbnQ6IFwiPHNwYW4gc3R5bGU9J2NvbG9yOiMwMDAwMDAnPlwiICsgc3RyICsgXCI8L3NwYW4+XCIsXG4gICAgICBvblNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHRoaXMpLnRvb2x0aXAoJ3RpcCcpLmNzcyh7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjNjY2J1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvYmouZm9jdXMoKTtcbiAgfVxufTtcbk9iamVjdC5hc3NpZ24oRG5hLCBEYXRhQ29udHJvbCwgTWVzc2FnZSwgRGF0YUdyaWQsIFZhbGlkYXRlLCBDb21ib0dyaWQpO1xud2luZG93LkRuYSA9IERuYTtcbndpbmRvdy5UcmVlID0gVHJlZTtcbndpbmRvdy4kID0gJDtcbmV4cG9ydCB7RG5hfTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vcHVibGljL2pzL2NvbW1vbnMvY29yZS9ETkEuanNcbiAqKi8iLCIvLyBpbXBvcnQgJ2JhYmVsLXBvbHlmaWxsJztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQge0NPTlNUIGFzIENPfSBmcm9tICdjb25zdCc7XG5cbmxldCBfdGl0bGUgPSAn5o+Q56S6JyxcbiAgICBfc2xpZGVNc2cgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIGxldCB7bXNnLCB0aXRsZSA9IF90aXRsZX0gPSBvYmo7XG4gICAgICAkLm1lc3NhZ2VyLnNob3coe1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgbXNnLFxuICAgICAgICB0aW1lb3V0OiAyMDAwLFxuICAgICAgICBzaG93VHlwZTogJ3NsaWRlJ1xuICAgICAgfSk7XG4gICAgfTtcblxuZXhwb3J0IGxldCBNZXNzYWdlID0ge1xuICByZXNvbHZlKG9iaikge1xuICAgIC8vIG9iaiA9IEpTT04ucGFyc2Uob2JqKTtcbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAgIG9iaiA9IEpTT04ucGFyc2Uob2JqKTtcbiAgICB9XG4gICAgbGV0IHtzdGF0dXN9ID0gb2JqO1xuXG4gICAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICBjYXNlIENPLkJBU0VTLlNVQ0NFU1M6XG4gICAgICBfc2xpZGVNc2cob2JqKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgQ08uQkFTRVMuRVJSOlxuICAgICAgdGhpcy5zaG93TXNnKG9iaik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgY2FzZSBDTy5CQVNFUy5DT05GOlxuICAgICAgLy8gb2JqLmNhbGxiYWNrID0gdGhpcy5jb25maXJtO1xuICAgICAgdGhpcy5qQ29uZmlybShvYmopO1xuICAgICAgYnJlYWs7XG4gICAgICAvLyByZXR1cm4gZmFsc2U7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSxcblxuICBzaG93TXNnKG9iaikge1xuICAgIGlmICh0eXBlb2YgKG9iaikgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvYmogPSB7bXNnOiBvYmp9O1xuICAgIH1cbiAgICBsZXQge3RpdGxlID0gX3RpdGxlLCBtc2csIGNhbGxiYWNrfSA9IG9iajtcbiAgICAkLm1lc3NhZ2VyLmFsZXJ0KHRpdGxlLCBtc2csIGNhbGxiYWNrKTtcbiAgfSxcbiAgakNvbmZpcm0ob2JqKSB7XG4gICAgbGV0IHt0aXRsZSA9IF90aXRsZSwgbXNnLCBzZW5kRGF0YSA9IHt9fSA9IG9iajtcbiAgICAkLm1lc3NhZ2VyLmNvbmZpcm0odGl0bGUsIG1zZywgciA9PiB7XG4gICAgICBpZiAocikge1xuICAgICAgICB0aGlzLmNvbmZpcm1PSyhzZW5kRGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbmZpcm1OTygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9wdWJsaWMvanMvY29tbW9ucy9jb3JlL21lc3NhZ2UuanNcbiAqKi8iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IHtDT05TVCBhcyBDT30gZnJvbSAnLi9jb25zdC5qcyc7XG4vLyBpbXBvcnQge01lc3NhZ2V9IGZyb20gJy4vbWVzc2FnZS5qcyc7XG5sZXQgcG9wRGl2ID0gJChgIyR7Q08uQkFTRVMuUE9QRElWfWApLFxuICAgIC8vIGZvcm0gPSBDTy5CQVNFUy5GT1JNLFxuICAgIHN1Ym1pdEJ0biA9IENPLkJBU0VTLlNVQk1JVEJUTixcbiAgICBfdGlwID0gJ+i/meaYr+eItuiKgueCueS4reeahOaWueazle+8jOivt+WcqOWtkOiKgueCueS4reaWsOWinic7XG5cbmxldFxuICAgIC8vIOmihOioremAgeWHuuaIkOWKn+WQjuWRvOWPq+eahOaWueazlVxuICAgIF9kZWZhdWx0U3VjY2VzcyA9IHtcbiAgICAgIGFkZChkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc29sdmUoZGF0YSkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnaGlkZSBwb3BkaXYg5paw5aKe5a6M5oiQJyk7XG4gICAgICAgICAgLy8gaGlkZSBwb3BkaXZcbiAgICAgICAgICB0aGlzLnBvcEhpZGUoKTtcbiAgICAgICAgICAvLyBkYXRhZ3JpZCBpbnNlcnRSb3dcbiAgICAgICAgICBsZXQgcm93ID0gdGhpcy5mb3JtRGF0YTtcbiAgICAgICAgICB0aGlzLmRhdGFHcmlkLmRhdGFncmlkKCdpbnNlcnRSb3cnLCB7aW5kZXg6IDAsIHJvd30pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIOWPlua2iOehruiupOaMiemSrumUgeWumlxuICAgICAgICAgIHRoaXMuYnRuRW5hYmxlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBlZGl0KGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzb2x2ZShkYXRhKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdoaWRlIHBvcGRpdiDkv67mlLnlrozmiJAnKTtcbiAgICAgICAgICAvLyBoaWRlIHBvcGRpdlxuICAgICAgICAgIHRoaXMucG9wSGlkZSgpO1xuICAgICAgICAgIC8vIGRhdGFncmlkIHVwZGF0ZVJvd1xuICAgICAgICAgIGxldCByb3cgPSB0aGlzLmZvcm1EYXRhLFxuICAgICAgICAgICAgICBpbmRleCA9IHRoaXMuaW5kZXg7XG4gICAgICAgICAgdGhpcy5kYXRhR3JpZC5kYXRhZ3JpZCgndXBkYXRlUm93Jywge2luZGV4LCByb3d9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyDlj5bmtojnoa7orqTmjInpkq7plIHlrppcbiAgICAgICAgICB0aGlzLmJ0bkVuYWJsZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8g6aKE6K6+5Yig6Zmk5oiQ5Yqf55qEIGNhbGxiYWNrXG4gICAgICBkZWwoZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZygn5Yig6Zmk5oiQ5YqfIGNhbGxiYWNrJyk7XG4gICAgICAgIC8vIGlmICh0aGlzLnJlc29sdmUoZGF0YSkpIHtcbiAgICAgICAgLy8gICB0aGlzLmRhdGFHcmlkLmRhdGFncmlkKCdyZWxvYWQnKTtcbiAgICAgICAgLy8gfVxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnJvd0luZGV4cztcbiAgICAgICAgZm9yIChsZXQgaSBvZiBpbmRleC52YWx1ZXMoKSkge1xuICAgICAgICAgIHRoaXMuZGF0YUdyaWQuZGF0YUdyaWQoJ2RlbGV0ZVJvdycsIGkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8g6aKE6K6+5L+u5pS554q25oCB5oiQ5Yqf55qEIGNhbGxiYWNrXG4gICAgICBzdGF0dXMoZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZygn54q25oCB5L+u5pS55oiQ5YqfIGNhbGxiYWNrJyk7XG4gICAgICB9XG4gICAgfTtcblxubGV0IERhdGFDb250cm9sID0ge1xuICAvLyBmb3JtIOihqOWNleeahOS6i+S7tue7keWumlxuICBmb3JtU2V0KCkge1xuICAgIGxldCBiZWZvcmVDaGVjayA9IHRoaXMuYmVmb3JlQ2hlY2s7XG4gICAgbGV0IGZvcm1PYmogPSB7XG4gICAgICBvblN1Ym1pdDogcGFyYW0gPT4ge1xuICAgICAgICAvLyBkbyBzb21lIGNoZWNrXG4gICAgICAgIC8vIHJldHVybiBmYWxzZSB0byBwcmV2ZW50IHN1Ym1pdDtcbiAgICAgICAgbGV0IHYgPSAkKCdmb3JtJykuZm9ybSgnZW5hYmxlVmFsaWRhdGlvbicpLmZvcm0oJ3ZhbGlkYXRlJyk7XG4gICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgaWYgKGJlZm9yZUNoZWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iZWZvcmVTdWJtaXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgICB9LFxuICAgICAgc3VjY2VzczogKCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VibWl0c3VjY2VzcycpO1xuICAgICAgICBEYXRhQ29udHJvbC5idG5EaXNhYmxlKCk7XG4gICAgICAgIHRoaXMucm91dGUoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnNvbGUubG9nKFwiZm9ybVNldFwiKTtcbiAgICAkKCdmb3JtJykuZm9ybShmb3JtT2JqKTtcbiAgICAvLyBmb3JtLmZvcm0oZm9ybU9iaik7XG4gIH0sXG4gIGJlZm9yZVN1Ym1pdCgpIHtcbiAgICAvKlxuICAgICAg6YCB5Ye65YmN55qE5ZCE56iu6Kit5a6a77yM5aaCXG4gICAgICB1cmwg5pu05YuV77yMXG4gICAgICDmmK/liY3lkIzlkI3norroqo3vvIxcbiAgICAgIOWkmuWAi+WtkOmggeS4jeWQjOacjeWLmeioreWumuOAglxuICAgICovXG4gICAgY29uc29sZS5sb2coYGJlZm9yZVN1Ym1pdCgpYCk7XG4gICAgdGhpcy5nZXRGb3JtRGF0YSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBzdWJtaXQoKSB7XG4gICAgJCgnZm9ybScpLnN1Ym1pdChmdW5jdGlvbihldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcbiAgfSxcbiAgYnRuRGlzYWJsZSgpIHtcbiAgICAkKGAjJHtzdWJtaXRCdG59YCkuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcbiAgfSxcbiAgYnRuRW5hYmxlKCkge1xuICAgICQoYCMke3N1Ym1pdEJ0bn1gKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgfSxcbiAgcG9wSGlkZSgpIHtcbiAgICBwb3BEaXYuaGlkZSgpO1xuICB9LFxuICAvLyDmuIXpmaTooajllq7nqbrnmb1cbiAgdHJpbUZvcm0oZm9ybURhdGEpIHtcbiAgICAkLmVhY2goZm9ybURhdGEsIChpLCBpdGVtKSA9PiB7XG4gICAgICBmb3JtRGF0YVtpXS52YWx1ZSA9ICQudHJpbShpdGVtLnZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZm9ybURhdGE7XG4gIH0sXG4gIC8vIDw+56m655m9562J54m55q6K5a2X56ym5Y+W5LujXG4gIHN0clJlcGxhY2Uoc3RyKSB7XG4gICAgbGV0IHJlcGxhY2VTdHIgPSAvWzw+JlwiXFxzXS9nO1xuICAgIHJldHVybiBzdHIucmVwbGFjZShyZXBsYWNlU3RyLCBmdW5jdGlvbihjKSB7XG4gICAgICByZXR1cm4geyc8JzogJyZsdDsnLCAnPic6ICcmZ3Q7JywgJyYnOiAnJmFtcDsnLCAnXCInOiAnJnF1b3Q7JywgJyAnOiAnJm5ic3A7J31bY107XG4gICAgfSk7XG4gIH0sXG4gIC8vIOWOu+mZpOmHjeimhumZo+WIl+izh+aWmVxuICBkZWR1cGUoYXJyYXkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFycmF5KSk7XG4gIH0sXG4gIC8vIOaqlOahiOS4iuWCsyBidXR0b25cbiAgLy8gb2JqOiBlbG1lbnRJRCwgbXVsdDogZmFsc2Ug5rG65a6a5piv5ZCm5LiK5YKz5aSa5YCL5qqUXG4gIHVwbG9hZEJ1dHRvbihvYmosIG11bHQgPSBmYWxzZSkge1xuICAgICQob2JqKS5maWxlYm94KHtcbiAgICAgIGJ1dHRvblRleHQ6ICfkuIrkvKAnLFxuICAgICAgbXVsdGlwbGU6IG11bHQsXG4gICAgICB3aWR0aDogMjAwXG4gICAgfSk7XG4gIH0sXG4gIC8qXG4gICAgdG9vbFRpcCDntoHlrppcbiAgICBvYmo6IOe2geWumuWwjeixoVxuICAgIHZhbDog57aB5a6a5YWn5a65XG4gICovXG4gIHNldFRvb2xUaXAob2JqLCB2YWwpIHtcbiAgICAkKG9iaikudG9vbHRpcCh7XG4gICAgICBjb250ZW50OiBgPHNwYW4+JHt2YWx9PC9zcGFuPmAsXG4gICAgICBvblNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHRoaXMpLnRvb2x0aXAoJ3RpcCcpLmNzcyh7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjNjY2J1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgLypcbiAgICDovb3lhaXlvYjlh7rmoYbotYTmlplcbiAgICBwYXJhbXM6IHtcbiAgICAgIHVybCxcbiAgICAgIGRhdGEsXG4gICAgICBmb2N1c0lkLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBjYWxsYmFjazog6ZaL5ZWf5b6M6KaB5Z+36KGM55qE5Lu75YuZXG4gICAgfVxuICAqL1xuICBwb3AocGFyYW1zKSB7XG4gICAgbGV0IHtcbiAgICAgIHVybCxcbiAgICAgIGRhdGEsXG4gICAgICBmb2N1c0lkLFxuICAgICAgY2FsbGJhY2ssXG4gICAgICBmb3JtRGF0YSA9IHt9XG4gICAgfSA9IHBhcmFtcztcbiAgICBwb3BEaXYubG9hZChcbiAgICAgIHVybCxcbiAgICAgIGRhdGEsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIC8vIOWwhuinhueql+W8ueWHulxuICAgICAgICB0aGlzLmRhaWxvZyhwYXJhbXMpO1xuICAgICAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgICAgIHRoaXMuZm9ybVNldCgpO1xuXG4gICAgICAgICQoYCMke2ZvY3VzSWR9YCkuZm9jdXMoKTtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNhbGxiYWNrKGZvcm1EYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH0sXG5cbiAgLypcbiAgICDlvYjlh7rmoYZcbiAgICDlj5blvpfnm7jlr7nnianku7bnmoTpq5jlkozlrr1cbiAgKi9cbiAgZGFpbG9nKHBhcmFtcykge1xuICAgIHZhciBwb3BJbmRleCA9IDg5MDAsXG4gICAgICAgIHdpZHRoID0gcGFyYW1zLndpZHRoID8gcGFyYW1zLndpZHRoIDogNDQwLFxuICAgICAgICB3aW5IID0gJCh3aW5kb3cpLmhlaWdodCgpLFxuICAgICAgICBwb3BPYmogPSBwb3BEaXYuZmluZCgnLnBvcC1jb250YWluZXInKSxcbiAgICAgICAgcG9wSCA9IHBvcE9iai5oZWlnaHQoKSxcbiAgICAgICAgbWFyZ2luVG9wID0gKHdpbkggLSBwb3BIKSAvIDQ7XG5cbiAgICBpZiAoIShwb3BEaXYuZmluZCgnLnBvcC1zaGFkb3cnKS5sZW5ndGggPiAwKSkge1xuICAgICAgcG9wRGl2LmFwcGVuZCgnPGRpdiBjbGFzcz1cInBvcC1zaGFkb3dcIj48L2Rpdj4nKTtcbiAgICB9XG4gICAgcG9wRGl2LmNzcyh7ekluZGV4OiBwb3BJbmRleH0pLmZhZGVJbigxMDApO1xuXG4gICAgcG9wT2JqLmNzcyh7XG4gICAgICB3aWR0aDogd2lkdGggKyAncHgnLFxuICAgICAgbWFyZ2luVG9wOiBtYXJnaW5Ub3AgKyAncHgnXG4gICAgfSk7XG4gIH0sXG4gIHJvdXRlKCkge1xuICAgIGNvbnNvbGUubG9nKGAke190aXB9IHJvdXRlKClgKTtcbiAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICAgIHVybDogdGhpcy51cmxbdGhpcy5mb3JtU3RhdHVzXSxcbiAgICAgICAgICBkYXRhOiB0aGlzLmZvcm1EYXRhLFxuICAgICAgICAgIGRhdGFHcmlkOiB0aGlzLmRhdGFHcmlkXG4gICAgICAgIH0sXG4gICAgICAgIGNoZWNrVXJsID0gdGhpcy51cmwuY2hlY2s7XG5cbiAgICBpZiAoY2hlY2tVcmwpIHtcbiAgICAgIGxldCBjaGVja1BhcmFtcyA9IHtcbiAgICAgICAgdXJsOiBjaGVja1VybCxcbiAgICAgICAgZGF0YTogcGFyYW1zLmRhdGEsXG4gICAgICAgIHN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgIHRoaXMucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHRoaXMuc2VuZERhdGEoY2hlY2tQYXJhbXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbmREYXRhKHBhcmFtcyk7XG4gICAgfVxuICAgIC8vIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgLypcbiAgICDpgIHlh7rotYTmlpnmlrnms5VcbiAgICDlj6/oh6rooYzlrprkuYnmiJDlip/nmoQgY2FsbGJhY2tcbiAgICBhamF4RGF0YSA9IHtcbiAgICAgIHVybDog5ZCO5Y+w5a+55pig6Lev5b6EXG4gICAgICB0eXBlOiBQT1NUXG4gICAgICBkYXRhOiDlkI7lj7AgcmVxIOeahCBkYXRhXG4gICAgICBzdWNjZXNzOiDlj6/ku6XnlLHlkbzlj6vnq6/oh6rooYzlrprkuYnmiJbnlKjpooTorr5cbiAgICB9XG4gICovXG4gIHNlbmREYXRhKGFqYXhEYXRhKSB7XG4gICAgbGV0IHt1cmwsIHR5cGUgPSBDTy5CQVNFUy5QT1NULCBkYXRhLCBzdWNjZXNzID0gZmFsc2V9ID0gYWpheERhdGEsXG4gICAgICAgIGFjdGlvbiA9IHRoaXMuZm9ybVN0YXR1cztcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsLFxuICAgICAgdHlwZSxcbiAgICAgIGRhdGEsXG4gICAgICBzdWNjZXNzOiBkYXRhID0+IHtcbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICBzdWNjZXNzLmNhbGwodGhpcywgZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2RlZmF1bHRTdWNjZXNzW2FjdGlvbl0uY2FsbCh0aGlzLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8vIOWPluW+l+WOu+mZpOWJjeWQjuepuueZveeahGZvcm1kYXRhXG4gIGdldEZvcm1EYXRhKCkge1xuICAgIC8vIGxldCBmb3JtID0gJCh0aGlzLmZvcm0pO1xuICAgIHRoaXMuZm9ybURhdGEgPSB0aGlzLnRyaW1Gb3JtKCQoJ2Zvcm0nKS5zZXJpYWxpemVBcnJheSgpKTtcbiAgfSxcblxuICBjb25jYXRNc2coaXRlbXMpIHtcbiAgICBsZXQgbXNnID0gJyc7XG4gICAgJC5lYWNoKGl0ZW1zLCAoaywgdikgPT4ge1xuICAgICAgbXNnICs9IGBbJHt2fV0sYDtcbiAgICB9KTtcbiAgICByZXR1cm4gbXNnLnN1YnN0cmluZygwLCBtc2cubGVuZ3RoIC0gMSk7XG4gIH0sXG5cbiAgaW5jbHVkZXMoYXJyLCB2YWx1ZSkge1xuICAgIHJldHVybiBhcnIuaW5jbHVkZXModmFsdWUpO1xuICB9LFxuXG4gIGFkZFRhYih0aXRsZSwgdXJsKSB7XG4gICAgdmFyIHNjID0gJCgnI3NpdGUtY29udGVudCcpO1xuICAgIGlmIChzYy50YWJzKCdleGlzdHMnLCB0aXRsZSkpIHtcbiAgICAgIHNjLnRhYnMoJ3NlbGVjdCcsIHRpdGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgZGF0YVR5cGU6ICdodG1sJyxcbiAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgIHVybCxcbiAgICAgICAgc3VjY2VzczogZGF0YSA9PiB7XG4gICAgICAgICAgc2MudGFicygnYWRkJywge1xuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBjb250ZW50OiBkYXRhLFxuICAgICAgICAgICAgY2xvc2FibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmF1dG9GaWxsU2NyZWVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmF1dG9GaWxsU2NyZWVuKCk7XG4gIH0sXG5cbiAgYXV0b0ZpbGxTY3JlZW4oKSB7XG4gICAgdmFyIHBhbmVsID0gJCgnI3NpdGUtY29udGVudCA+IC50YWJzLXBhbmVscycpLFxuICAgICAgICBoZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgcGFuZWwuY3NzKHtcbiAgICAgIGhlaWdodDogKGhlaWdodCAtIDgwKSArICdweCdcbiAgICB9KTtcblxuICAgICQoJy5tYWluLWZyYW1lJykuY3NzKHtcbiAgICAgIGhlaWdodDogKGhlaWdodCAtIDg1KSArICdweCdcbiAgICB9KTtcbiAgfVxuXG59O1xuXG5leHBvcnQge0RhdGFDb250cm9sfTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vcHVibGljL2pzL2NvbW1vbnMvY29yZS9kYXRhQ29udHJvbC5qc1xuICoqLyIsIi8qXG4gIE1vZHVsZTogRGF0YUdyaWQsXG4gIENyZWF0ZTogMjAxNi8wNy8xNyxcbiAgQXV0aGVyOiBjaGVuc2h1eGlhblxuICDoqqrmmI46IOatpOaooeWhiuS4u+imgeaPkOWFsSBkYXRhZ3JpZCDnm7jpl5wgQVBJ44CCXG4qL1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCB7Q29sdW1uc30gZnJvbSAnLi9jb2x1bW5zLmpzJztcbmltcG9ydCB7Q09OU1QgYXMgQ099IGZyb20gJy4vY29uc3QuanMnO1xuXG5sZXQgX2xpbWl0ID0gQ08uTElNSVQuU0hJRlRHUklELFxuICAgIF9saW1pdE1zZyA9IGDkuIDmrKHmlbDmja7kuI3lj6/otoXov4cke19saW1pdH3nrJQhYCxcbiAgICBfYWRkSXRlbSA9ICfor7fpgInmi6nopoHmt7vliqDnmoTpobnnm64nO1xuXG5sZXQgX3RvdGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdG90YWwgPSAkKCcjbGVmdEdyaWQnKS5kYXRhZ3JpZCgnZ2V0Um93cycpO1xuICAgICAgJCgnI3RvdGFsJykuaHRtbCh0b3RhbC5sZW5ndGgpO1xuICAgIH0sXG4gICAgX2dldEdyaWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBwYXJhbXMgPSB7XG4gICAgICAgIGxnOiAkKCcjbGVmdEdyaWQnKSxcbiAgICAgICAgcmc6ICQoJyNyaWdodEdyaWQnKVxuICAgICAgfTtcbiAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfSxcbiAgICBfZGdMaW1pdCA9IGZ1bmN0aW9uKGxpbWl0LCBsZW4pIHtcbiAgICAgIGlmIChsaW1pdCA+IDMwKSB7XG4gICAgICAgIERuYS5zaG93TXNnKHttc2c6IGDnm67liY3li77pgIkke2xlbn3nrJTvvIwke19saW1pdE1zZ31gfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEbmEuc2hvd01zZyh7bXNnOiBfYWRkSXRlbX0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgLypcbiAgICAgIOioreWumuWCmeiou+ashOeahCB0b29sdGlwXG4gICAgKi9cbiAgICBfc2V0RGdUdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRvb2x0aXAgPSAkKHRoaXMpLmRhdGFncmlkKCdnZXRQYW5lbCcpLmZpbmQoJy5lYXN5dWktdG9vbHRpcCcpO1xuICAgICAgaWYgKHRvb2x0aXApIHtcbiAgICAgICAgdG9vbHRpcC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGxldCB2YWwgPSAkKHRoaXMpWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpO1xuICAgICAgICAgIERuYS5zZXRUb29sVGlwKHRoaXMsIHZhbCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbmV4cG9ydCBsZXQgRGF0YUdyaWQgPSB7XG4gIC8qXG4gICAg6L+U5ZueIGRhdGFncmlkIOWIneWni+ioreWumlxuICAgIHBhcmFtczpcbiAgICB7XG4gICAgICB1cmw6IOW+jOWPsOiri+axguaVuOaTmiB1cmxcbiAgICAgIGRhdGE6IOiri+axguaZguWCs+mAgeeahCBxdWVyeWRhdGFcbiAgICAgIG1vZHVsZTog5qih5aGK5ZCN77yM5bCN5pigIGNvbHVtbnMg6ZuG576k5Lit55qE6LOH5paZXG4gICAgICBoaWRlQ29sczog6Zqx6JeP5qyE5L2N6Zmj5YiXXG4gICAgICAvLyBkZzog5bu656uLIGRhdGFncmlkIHRhYmxlIOWwjeixoVxuICAgICAgaGVpZ2h0OiBkZyDpq5jluqZcbiAgICB9XG4gICovXG4gIGluaXRERyhwYXJhbXMpIHtcbiAgICBsZXQge1xuICAgICAgdXJsLFxuICAgICAgZGF0YSxcbiAgICAgIG1vZHVsZSxcbiAgICAgIGhpZGVDb2xzLFxuICAgICAgaGVpZ2h0ID0gJCgnI3NpdGUtY29udGVudCcpLmhlaWdodCgpIC0gOTUsXG4gICAgICBtZXRob2QgPSAncG9zdCd9ID0gcGFyYW1zLFxuICAgICAgICBpbml0ID0ge1xuICAgICAgICAgIHVybCxcbiAgICAgICAgICBxdWVyeVBhcmFtczogZGF0YSxcbiAgICAgICAgICBjb2x1bW5zOiBDb2x1bW5zW21vZHVsZV0oKSxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgZml0Q29sdW1uczogdHJ1ZSxcbiAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgLy8gY2hlY2tPblNlbGVjdDogZmFsc2UsXG4gICAgICAgICAgLy8gc2VsZWN0T25DaGVjazogZmFsc2UsXG4gICAgICAgICAgLy8gYXV0b1Jvd0hlaWdodDogZmFsc2UsXG4gICAgICAgICAgc3RyaXBlZDogdHJ1ZSxcbiAgICAgICAgICBwYWdpbmF0aW9uOiB0cnVlLFxuICAgICAgICAgIHNjcm9sbGJhclNpemU6IDAsXG4gICAgICAgICAgcGFnZU51bWJlcjogMSxcbiAgICAgICAgICBwYWdlU2l6ZTogMTAsXG4gICAgICAgICAgb25Mb2FkU3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgLy8g56ys5LiA6KGM6auY5LquXG4gICAgICAgICAgICBEbmEuaGlnaExpZ2h0LmNhbGwodGhpcywgMCk7XG4gICAgICAgICAgICAvLyDmu5Hli5Xmop3nva7poIJcbiAgICAgICAgICAgIERuYS5zY29ybGxUb3AuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIC8vIOioree9ruWCmeiou+eahCB0b29sdGlwXG4gICAgICAgICAgICBfc2V0RGdUdC5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgaWYgKGhpZGVDb2xzKSB7XG4gICAgICAgICAgICAgIERuYS5oaWRlQ29scyh0aGlzLCBoaWRlQ29scyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkNsaWNrQ2VsbDogZnVuY3Rpb24oaW5kZXgsIGZpZWxkLCB2YWx1ZSkge1xuICAgICAgICAgICAgRG5hLmZpZWxkTmFtZSA9IGZpZWxkO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25DbGlja1JvdzogZnVuY3Rpb24oaW5kZXgsIHJvdykge1xuICAgICAgICAgICAgRG5hLmhpZ2hMaWdodC5jYWxsKHRoaXMsIGluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgcmV0dXJuIGluaXQ7XG4gIH0sXG5cbiAgaGlnaExpZ2h0KGluZGV4KSB7XG4gICAgJCh0aGlzKS5kYXRhZ3JpZCgnaGlnaGxpZ2h0Um93JywgTnVtYmVyKGluZGV4KSk7XG4gIH0sXG5cbiAgLy8gIHBhcmFtczpcbiAgLy8gIGRnID0gZGF0YWdyaWQgT2JqZWN0LFxuICAvLyAgYXJyYXkgPSBoaWRkZW4gZmllbGQgb2YgQ29sdW1uc1xuICBoaWRlQ29scyhkZywgYXJyKSB7XG4gICAgZm9yIChsZXQgdiBvZiBhcnIpIHtcbiAgICAgIGRnLmRhdGFncmlkKCdoaWRlQ29sdW1uJywgdik7XG4gICAgfVxuICB9LFxuXG4gIC8vICBwYXJhbXM6XG4gIC8vICBvYmogPSBkYXRhZ3JpZCBPYmplY3QsXG4gIC8vICBhcnJheSA9IGhpZGRlbiBmaWVsZCBvZiBDb2x1bW5zXG4gIHNob3dDb2xzKGRnLCBhcnIpIHtcbiAgICBmb3IgKGxldCB2IG9mIGFycikge1xuICAgICAgZGcuZGF0YWdyaWQoJ3Nob3dDb2x1bW4nLCB2KTtcbiAgICB9XG4gIH0sXG5cbiAgLy8g5ZCR5Y+z56e7XG4gIHNoaWZ0UigpIHtcbiAgICBsZXQgR0QgPSBfZ2V0R3JpZCgpLFxuICAgICAgICBkYXRhTCA9IEdELmxnLmRhdGFncmlkKCdnZXRTZWxlY3Rpb25zJyksXG4gICAgICAgIGRhdGFMZW4gPSBkYXRhTC5sZW5ndGg7XG4gICAgaWYgKGRhdGFMZW4gPiAwICYmIGRhdGFMZW4gPCBfbGltaXQpIHtcbiAgICAgIGRhdGFMLmZvckVhY2goZnVuY3Rpb24oZWwsIGluZGV4KSB7XG4gICAgICAgIGxldCBuZXdSb3cgPSB7aW5kZXg6IDAsIHJvdzogZWx9LFxuICAgICAgICAgICAgcm93SW5kZXggPSBHRC5sZy5kYXRhZ3JpZCgnZ2V0Um93SW5kZXgnLCBlbCksXG4gICAgICAgICAgICBpZCA9IGVsLnN0cmluZ0lkO1xuXG4gICAgICAgIEdELmxnLmRhdGFncmlkKCdkZWxldGVSb3cnLCByb3dJbmRleCk7XG4gICAgICAgIEdELnJnLmRhdGFncmlkKCdpbnNlcnRSb3cnLCBuZXdSb3cpO1xuXG4gICAgICAgIC8vIOWIpOaWreaYr+WQpuaWsOWinuWIsOmYteWIl+S4rVxuICAgICAgICBEbmEuZGVscy5hZGQoaWQpO1xuICAgICAgICAvLyBEbmEuYWRkcy5kZWxldGUoaWQpO1xuICAgICAgICAvLyDlsIblj7Pnp7votYTmlpnliqDlhaXmnKzlnLDotYTmlpnlupNcbiAgICAgICAgLy8gRG5hLmFkZFN0b3JlKGVsKTtcbiAgICAgICAgLy8g5oC75pWw5pi+56S6XG4gICAgICAgIC8vIF90b3RhbCgpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9kZ0xpbWl0KF9saW1pdCwgZGF0YUxlbik7XG4gICAgfVxuICB9LFxuXG4gIC8vIOWQkeW3puenu1xuICBzaGlmdEwoKSB7XG4gICAgbGV0IEdEID0gX2dldEdyaWQoKSxcbiAgICAgICAgZGF0YVIgPSBHRC5yZy5kYXRhZ3JpZCgnZ2V0U2VsZWN0aW9ucycpLFxuICAgICAgICBkYXRhTGVuID0gZGF0YVIubGVuZ3RoO1xuICAgIGlmIChkYXRhTGVuID4gMCAmJiBkYXRhTGVuIDwgX2xpbWl0KSB7XG4gICAgICBkYXRhUi5mb3JFYWNoKGZ1bmN0aW9uKGVsLCBpbmRleCkge1xuICAgICAgICBsZXQgbmV3Um93ID0ge2luZGV4OiAwLCByb3c6IGVsfSxcbiAgICAgICAgICAgIHJvd0luZGV4ID0gR0QucmcuZGF0YWdyaWQoJ2dldFJvd0luZGV4JywgZWwpLFxuICAgICAgICAgICAgaWQgPSBlbC5zdHJpbmdJZDtcblxuICAgICAgICBHRC5yZy5kYXRhZ3JpZCgnZGVsZXRlUm93Jywgcm93SW5kZXgpO1xuICAgICAgICBHRC5sZy5kYXRhZ3JpZCgnaW5zZXJ0Um93JywgbmV3Um93KTtcblxuICAgICAgICAvLyDliKTmlq3mmK/lkKbmlrDlop7liLDpmLXliJfkuK1cbiAgICAgICAgRG5hLmFkZHMuYWRkKGlkKTtcbiAgICAgICAgLy8gRG5hLmRlbHMuZGVsZXRlKGlkKTtcbiAgICAgICAgLy8g5bCG5bem56e76LWE5paZ5LuO5pys5Zyw5bqT5Lit56e76ZmkXG4gICAgICAgIC8vIERuYS5kZWxTdG9yZShlbCk7XG4gICAgICAgIC8vIERuYS5sb2NhbFN0b3JlLmRlbGV0ZShpZCk7XG4gICAgICAgIC8vIOaAu+aVsOaYvuekulxuICAgICAgICAvLyBfdG90YWwoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZGdMaW1pdChfbGltaXQsIGRhdGFMZW4pO1xuICAgIH1cbiAgfSxcblxuICAvKlxuICAgIOi/lOWbnuaJgOacieWLvumBuOashOS9jeizh+aWmVxuICAqL1xuICBjaGVja0FsbChvYmopIHtcbiAgICByZXR1cm4gJChvYmopLmRhdGFncmlkKCdnZXRDaGVja2VkJyk7XG4gIH0sXG5cbiAgLypcbiAgICDovInlhaXmiJDlip/lvowgZ3JpZCDmjpLluo9cbiAgICDmlLnororlt6XlhbfmrITnmoTni4DmhYtcbiAgKi9cbiAgc3VjY2Vzc1NvcnQoKSB7XG4gICAgLy8g5om+5YWl5oiQ5Yqf77yM5L+u5pS554uA5oWLXG4gIH0sXG5cbiAgLypcbiAgICDkuIvmi4nmu77li5Xmop3nva7poIJcbiAgKi9cbiAgc2NvcmxsVG9wKCkge1xuICAgICQodGhpcykuZGF0YWdyaWQoJ3Njcm9sbFRvJywgMCk7XG4gIH0sXG5cbiAgLypcbiAgICBkYXRhR3JpZCDpoIHpnaLoqr/mlbRcbiAgKi9cbiAgZGdBZGp1c3QodGFibGUgPSB0aGlzLmRhdGFHcmlkKSB7XG4gICAgLy8g6Zqo55Wr6Z2i6Kq/5pW05aSn5bCPXG4gICAgbGV0IHdpZHRoID0gdGFibGUucGFyZW50cygnLnRhYnMtcGFuZWxzJykud2lkdGgoKSAtIDQwLFxuICAgICAgICBoZWlnaHQgPSB0YWJsZS5wYXJlbnRzKCcudGFicy1wYW5lbHMnKS5oZWlnaHQoKSAtIDcwO1xuICAgIHRhYmxlLmRhdGFncmlkKCdyZXNpemUnLCB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodFxuICAgIH0pO1xuICB9XG5cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3B1YmxpYy9qcy9jb21tb25zL2NvcmUvZGF0YUdyaWQuanNcbiAqKi8iLCIvKlxuICBNb2R1bGU6IENvbHVtbnMsXG4gIENyZWF0ZTogMjAxNi8wNy8xNyxcbiAgQXV0aGVyOiBjaGVuc2h1eGlhblxuICDoqqrmmI46IOatpOaooeWhiuS4u+imgeaPkOWFsSBkYXRhZ3JpZCDnm7jpl5zmiYDmnInmrITkvY3pm4blkIjjgIJcbiovXG4vLyDlhbHnlKggZnVuY3Rpb25cbmxldCBfc3RhdHVzID0gZnVuY3Rpb24oKSB7fSxcbiAgICBfb3BlcmF0aW9uID0gZnVuY3Rpb24oKSB7fSxcbiAgICBfc2hvdyA9IGZ1bmN0aW9uKCkge30sXG4gICAgX3JlbWFyayA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBsZXQgcmVtYXJrID0gYDxzcGFuIGNsYXNzPSdlYXN5dWktdG9vbHRpcCcgZGF0YS12YWx1ZT0nJHt2YWx1ZX0nPiR7dmFsdWV9PC9zcGFuPmA7XG4gICAgICByZXR1cm4gcmVtYXJrO1xuICAgIH07XG5cbi8vIOashOS9jembhuWQiOWNgFxuZXhwb3J0IGxldCBDb2x1bW5zID0ge1xuICBMUygpIHtcbiAgICB2YXIgX2NvbHVtbnMgPSBbW1xuICAgICAge2ZpZWxkOiBcImNrXCIsIGNoZWNrYm94OiB0cnVlLCB3aWR0aDogMzB9LFxuICAgICAge3RpdGxlOiBcIue8lueggVwiLCBmaWVsZDogXCJjb2RlTm9cIiwgd2lkdGg6IDMwfSxcbiAgICAgIHt0aXRsZTogXCLlkI3np7BcIiwgZmllbGQ6IFwibmFtZVwiLCBmbGV4OiAxLCB3aWR0aDogNjB9LFxuICAgICAge3RpdGxlOiBcIuWKqeiusOesplwiLCBmaWVsZDogXCJmYXN0Q29kZVwiLCB3aWR0aDogMTUwfSxcbiAgICAgIHt0aXRsZTogXCLpobrluo/lj7dcIiwgZmllbGQ6IFwiZGlzcGxheU9yZGVyXCIsIHdpZHRoOiA1MH0sXG4gICAgICB7dGl0bGU6IFwi5aSH5rOoXCIsIGZpZWxkOiBcIm1lbW9cIiwgd2lkdGg6IDE1MH0sXG4gICAgICB7dGl0bGU6IFwi54q25oCBXCIsIGZpZWxkOiBcInN0YXR1c1wifSxcbiAgICAgIHt0aXRsZTogXCLmk43kvZxcIiwgZmllbGQ6IFwib3B0XCIsIHdpZHRoOiA0MH1cbiAgICBdXTtcbiAgICByZXR1cm4gX2NvbHVtbnM7XG4gIH0sXG4gIGNvbWJvR3JpZCgpIHtcbiAgICBsZXQgY29scyA9IFtbXG4gICAgICB7ZmllbGQ6ICdjb2RlJywgdGl0bGU6ICdDb2RlJywgd2lkdGg6IDYwfSxcbiAgICAgIHtmaWVsZDogJ25hbWUnLCB0aXRsZTogJ05hbWUnLCB3aWR0aDogNjB9LFxuICAgICAge2ZpZWxkOiAnYWRkcicsIHRpdGxlOiAnQWRkcicsIHdpZHRoOiA2MH0sXG4gICAgICB7ZmllbGQ6ICdjb2w0JywgdGl0bGU6ICdDb2w0Jywgd2lkdGg6IDYwfVxuICAgIF1dO1xuICAgIHJldHVybiBjb2xzO1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9wdWJsaWMvanMvY29tbW9ucy9jb3JlL2NvbHVtbnMuanNcbiAqKi8iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuXG5sZXQgX2VyciA9ICh0YXJnZXQsIG1zZykgPT4ge1xuICBsZXQgdCA9ICQodGFyZ2V0KTtcbiAgaWYgKHQuaGFzQ2xhc3MoJ3RleHRib3gtdGV4dCcpKSB7XG4gICAgdCA9IHQucGFyZW50KCk7XG4gIH1cbiAgbGV0IG0gPSB0Lm5leHQoJy5lcnJvci1tZXNzYWdlJyk7XG4gIGlmICghbS5sZW5ndGgpIHtcbiAgICBtID0gJCgnPGRpdiBjbGFzcz1cImVycm9yLW1lc3NhZ2VcIj48L2Rpdj4nKS5pbnNlcnRBZnRlcih0KTtcbiAgfVxuICBtLmh0bWwobXNnKTtcbn07XG5cbmV4cG9ydCBsZXQgVmFsaWRhdGUgPSB7XG4gIGRhdGVUb1VuaXgoc3RyaW5nKSB7XG4gICAgdmFyIGYgPSBzdHJpbmcuc3BsaXQoJyAnLCAyKSxcbiAgICAgICAgZCA9IChmWzBdID8gZlswXSA6ICcnKS5zcGxpdCgnLScsIDMpLFxuICAgICAgICB0ID0gKGZbMV0gPyBmWzFdIDogJycpLnNwbGl0KCc6JywgMik7XG4gICAgcmV0dXJuIChuZXcgRGF0ZShcbiAgICBwYXJzZUludChkWzBdLCAxMCkgfHwgbnVsbCxcbiAgICAocGFyc2VJbnQoZFsxXSwgMTApIHx8IDEpIC0gMSxcbiAgICBwYXJzZUludChkWzJdLCAxMCkgfHwgbnVsbCxcbiAgICBwYXJzZUludCh0WzBdLCAxMCkgfHwgbnVsbCxcbiAgICBwYXJzZUludCh0WzFdLCAxMCkgfHwgbnVsbCxcbiAgICBwYXJzZUludCh0WzJdLCAxMCkgfHwgbnVsbFxuICAgICkpLmdldFRpbWUoKSAvIDEwMDA7XG4gIH0sXG4gIGRhdGVDb21wYXJlKHN0YXJ0ZGF0ZSwgZW5kZGF0ZSkge1xuICAgIHZhciBzdGFydHRpbWVzID0gdGhpcy5kYXRlVG9Vbml4KHN0YXJ0ZGF0ZSksXG4gICAgICAgIGVuZHRpbWVzID0gdGhpcy5kYXRlVG9Vbml4KGVuZGRhdGUpO1xuXG4gICAgaWYgKHN0YXJ0dGltZXMgPiBlbmR0aW1lcykge1xuICAgICAgRG5hLnNob3dNc2coJ+W8gOWni+aXpeacn+mcgOWwj+S6jue7k+adn+aXpeacnyEnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGNvbWJvR3JpZChvYmosIG1zZywgcGFyZW50SWQsIHJlcSkge1xuICAgIHZhclxuICAgICAgICBjb21ib1RleHQgPSBvYmouZ2V0VGV4dCgpLFxuICAgICAgICByZXF1aXJlID0gdHJ1ZTtcblxuICAgIGlmIChyZXEgPT09IDAgJiYgY29tYm9UZXh0ID09PSBcIlwiKSB7XG4gICAgICByZXF1aXJlID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChyZXF1aXJlKSB7XHQvLyDlv4XloatcbiAgICAgIGlmIChjb21ib1RleHQgPT09IFwiXCIpIHtcbiAgICAgICAgRG5hLnNob3dNc2coYCR7bXNnfeaVsOaNruS4uuepuizvvIzor7fku47kuIvmi4nliJfooajkuK3mt7vliqDvvIFgLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKGAjJHtwYXJlbnRJZH1pbnB1dDp0ZXh0YCkuc2VsZWN0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICghb2JqLmNoZWNrVmFsdWUoZmFsc2UpICYmIG9iai5jb21ib0VkaXRUZXh0ICE9PSBjb21ib1RleHQpIHtcbiAgICAgICAgRG5hLnNob3dNc2coYCR7bXNnfeaVsOaNruS4jeWtmOWcqCzvvIzor7fku47kuIvmi4nliJfooajkuK3mt7vliqDvvIFgLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKFwiI1wiICsgcGFyZW50SWQgKyBcImlucHV0OnRleHRcIikuc2VsZWN0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbi8qIGNvbWJvR3JpZCDnvJbovpHml7bov5vooYzpqozor4FcbuW9k+e8lui+keaJk+W8gOWni+i/m+ihjOagj+S9jeWAvOmqjOivgVxu5aaC5Li656m65Luj6KGo5bey6KKr5YGc55So77yM5L2G5piv6ZyA6KaB5Y+v5Lul6L+b6KGM5a2Y5YKoXG7oi6Xov5vmnaXlkI7mnInlgZrkv67mraPliqjkvZzml7bvvIzkuJTlgLzmnInmm7Tliqjml7bvvIzlsLHpnIDov5vooYzph43mlrDpqozor4HjgIJcbui/kOeUqOS6jiBlZGl0Q2FsbEJhY2sg5LitXG4qL1xuICBjb21ib0dyaWRFZGl0KG9iaiwgaW5wdXROYW1lLCBpZCkge1xuICAgIHZhciBjb21ib1RleHQgPSBvYmouZ2V0VGV4dCgpLFxuICAgICAgICBzZXRUZXh0ID0gYCR7Y29tYm9UZXh0fSjmraTpgInmi6nlt7LooqvlgZznlKgpYDtcbiAgLy8g5bey6KKr5YGc55SoXG4gICAgaWYgKCFvYmouY2hlY2tWYWx1ZShmYWxzZSkgJiYgY29tYm9UZXh0ICE9PSBcIlwiKSB7XG4gICAgICBvYmouc2V0VGV4dChzZXRUZXh0KTtcbiAgICAgICQoYGlucHV0W25hbWU9JyR7aW5wdXROYW1lfSddYCkudmFsKGlkKTtcbiAgICAgIG9iai5jb21ib0VkaXRUZXh0ID0gc2V0VGV4dDtcbiAgICB9XG4gIH0sXG4gIC8vIOmpl+itiee2geWumlxuICAvKlxuICBwYXJhbXMgPXtcbiAgICBvYmo6IOe2geWumuWwjeixoVxuICAgIHNldHRpbmc6IOioreWumlxuICAgIGxlbjog6ZW35bqmXG4gIH1cbiAgKi9cbiAgdmIocGFyYW1zKSB7XG4gICAgbGV0IHtvYmosIHNldHRpbmcsIGxlbiA9IDMwfSA9IHBhcmFtcztcbiAgICBzZXR0aW5nLmVyciA9IF9lcnI7XG4gICAgJChvYmopLnZhbGlkYXRlYm94KHNldHRpbmcpO1xuICAgICQob2JqKS5hdHRyKCdtYXhsZW5ndGgnLCBsZW4pO1xuICB9LFxuXG4gIGVycjogX2VyclxufTtcblxuJC5leHRlbmQoJC5mbi52YWxpZGF0ZWJveC5kZWZhdWx0cy5ydWxlcywge1xuICBzeW1ib2w6IHtcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVnID0gL1s8PnwkXS87XG4gICAgICByZXR1cm4gIXJlZy50ZXN0KHZhbHVlKTtcbiAgICB9LFxuICAgIG1lc3NhZ2U6IFwi5pys5qyh6L6T5YWl5Lit5pyJ54m55q6K5a2X56ym77yM6K+36YeN5paw6L6T5YWlIVwiXG4gIH0sXG4gIGF1dGhVc2VyOiB7XG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZyA9IC9eW0EtWmEtejAtOV9dezEsMTR9JC87XG4gICAgICByZXR1cm4gcmVnLnRlc3QodmFsdWUpO1xuICAgIH0sXG4gICAgbWVzc2FnZTogXCLplb82LTIw5a2X56ym77yM5Y+v55Sx5pWw5a2X44CB5a2X5q+N5ZKM5LiL5YiS57q/57uE5oiQ77yM5a2X5q+N5LiN5Yy65YiG5aSn5bCP5YaZIVwiXG4gIH0sXG5cdC8vIOWuouaIt+W4kOWPt+WIm+W7ulxuICBjdXN0b21lcjoge1xuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIHZhciByZWcgPSAvXig/IS4qYWRtaW4pLztcbiAgICAgIHJldHVybiByZWcudGVzdCh2YWx1ZSk7XG4gICAgfSxcbiAgICBtZXNzYWdlOiBcIuS4jeiDveWMheWQq2FkbWluXCJcbiAgfSxcbiAgYWNjb3VudDoge1xuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIHZhciByZWcgPSAvXig/ISg/OltcXGRfXSokKSlbQS1aYS16MC05X117NCwyMH0kLztcbiAgICAgIHJldHVybiByZWcudGVzdCh2YWx1ZSk7XG4gICAgfSxcbiAgICBtZXNzYWdlOiBcIumVvzQtMjDlrZfnrKbvvIzlj6/nlLHmlbDlrZfjgIHlrZfmr43lkozkuIvliJLnur/nu4TmiJDvvIzlrZfmr43kuI3ljLrliIblpKflsI/lhpkhXCJcbiAgfSxcbiAgZGlnaXRzOiB7XG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIC9eKFswLTldKStcXGQqJC9pLnRlc3QodmFsdWUpO1xuICAgIH0sXG4gICAgbWVzc2FnZTogXCLor7fovpPlhaXmlbDlrZdcIlxuICB9LFxuICB0ZWxlcGhvbmU6IHtcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gL15bXFxkXFxzXFwtXSskLy50ZXN0KHZhbHVlKTtcbiAgICB9LFxuICAgIG1lc3NhZ2U6IFwi5Y+v6L6T5YWl5pWw5a2XLC0s56m65qC8XCJcbiAgfSxcbiAgYmxhbms6IHtcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gJC50cmltKHZhbHVlKSAhPT0gJyc7XG4gICAgfSxcbiAgICBtZXNzYWdlOiBcIuS4jeiDveWPqui+k+WFpeepuuagvO+8gVwiXG4gIH0sXG4gIGlwRm9ybWF0OiB7XG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZyA9IC9eKCgyWzAtNF1cXGR8MjVbMC01XXxbMDFdP1xcZFxcZD8pXFwuKXszfSgyWzAtNF1cXGR8MjVbMC01XXxbMDFdP1xcZFxcZD8pJC87XG4gICAgICByZXR1cm4gcmVnLnRlc3QodmFsdWUpO1xuICAgIH0sXG4gICAgbWVzc2FnZTogXCLor7fovpPlhaXmraPnoa7nmoRJUOWcsOWdgFwiXG4gIH0sXG4gIHBhc3N3b3JkOiB7XG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZyA9IC9eKCg/PS4qP1xcZCkoPz0uKj9bQS1aYS16XSl8KD89Lio/XFxkKSg/PS4qP1shQCMkJV4mX10pfCg/PS4qP1tBLVphLXpdKSg/PS4qP1shQCMkJV4mX10pKVtcXGRBLVphLXohQCMkJV4mX117NiwyMH0kLztcbiAgICAgIHJldHVybiByZWcudGVzdCh2YWx1ZSk7XG4gICAgfSxcbiAgICBtZXNzYWdlOiBcIjYtMjDkuKrlrZfnrKbvvIzlrZfmr43jgIHmlbDlrZfnmoTnu4TlkIghXCJcbiAgfSxcbiAgZXF1YWxUbzoge1xuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24odmFsdWUsIHBhcmFtKSB7XG4gICAgICByZXR1cm4gJChwYXJhbVswXSkudmFsKCkgPT09IHZhbHVlO1xuICAgIH0sXG4gICAgbWVzc2FnZTogXCLlrZfmrrXkuI3ljLnphY1cIlxuICB9LFxuICBudW1BbmRMZXR0ZXJzOiB7XG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJlZyA9IC9eW0EtWmEtejAtOV0rJC87XG4gICAgICByZXR1cm4gcmVnLnRlc3QodmFsdWUpO1xuICAgIH0sXG4gICAgbWVzc2FnZTogXCLmlbDlrZfjgIHlrZfmr43nmoTnu4TlkIhcIlxuICB9LFxuICAvLyDkuIvmi4nmmK/pgInljZXpqozor4FcbiAgc2VsZWN0VmFsdWVSZXF1aXJlZDoge1xuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24odmFsdWUsIHBhcmFtKSB7XG4gICAgICByZXR1cm4gJChwYXJhbVswXSkuZmluZChgb3B0aW9uOmNvbnRhaW5zKCcke3ZhbHVlfScpYCkudmFsKCkgIT09ICcnO1xuICAgIH0sXG4gICAgbWVzc2FnZTogJ+S4i+aLiemAieahhuS4jeWPr+S4uuepui4nXG4gIH0sXG4gIGVuZ2xpc2g6IHtcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVnID0gL15bQS1aYS16XSskLztcbiAgICAgIHJldHVybiByZWcudGVzdCh2YWx1ZSk7XG4gICAgfSxcbiAgICBtZXNzYWdlOiBcIuWPquiDveacieWtl+avjVwiXG4gIH0sXG4gIHVwcGVyQ2FzZToge1xuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciByZWcgPSAvXltBLVpdKyQvO1xuICAgICAgcmV0dXJuIHJlZy50ZXN0KHZhbHVlKTtcbiAgICB9LFxuICAgIG1lc3NhZ2U6IFwi5Y+q6IO95Li65aSn5YaZ5a2X5q+NXCJcbiAgfSxcbiAgdXBwZXJOdW06IHtcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgcmVnID0gL15bQS1afDAtOV0rJC87XG4gICAgICByZXR1cm4gcmVnLnRlc3QodmFsdWUpO1xuICAgIH0sXG4gICAgbWVzc2FnZTogXCLlj6rog73kuLrlpKflhpnlrZfmr43lkozmlbDlrZfvvIzor7fph43mlrDovpPlhaVcIlxuICB9LFxuICBjb21ib3h0cmVlOiB7XG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbih2YWx1ZSwgcGFyYW0pIHtcbiAgICAgIHZhciBzZWxWYWwgPSAkKFwiaW5wdXRbbmFtZT1cIiArIHBhcmFtWzBdICsgXCJdXCIpLnZhbCgpO1xuICAgICAgcmV0dXJuIE51bWJlcihzZWxWYWwpID4gMDtcbiAgICB9LFxuICAgIG1lc3NhZ2U6IFwi5LiN5Y+v5Lul56m677yM6K+36YCJ5oupXCJcbiAgfSxcbiAgY29tYm9ncmlkOiB7XG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHNlbFZhbCA9IHRoaXMucGFyZW50RWxlbWVudC5wcmV2aW91c1NpYmxpbmcuZmlsdGVyRGF0YTtcbiAgICAgIHJldHVybiBzZWxWYWw7XG4gICAgfSxcbiAgICBtZXNzYWdlOiBcIui8uOWFpemgheebruaWvOS4i+aLiemBuOWWruS4reaykuaciVwiXG4gIH0sXG4gIGNvbXBhcmVWYWx1ZToge1xuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24odmFsdWUsIHBhcmFtKSB7XG4gICAgICB2YXIgc2VsVmFsID0gJChcImlucHV0W25hbWU9XCIgKyBwYXJhbVswXSArIFwiXVwiKS52YWwoKTtcbiAgICAgIHJldHVybiB2YWx1ZSA+IE51bWJlcihzZWxWYWwpO1xuICAgIH0sXG4gICAgbWVzc2FnZTogXCLotbflp4vlubTpvoTopoHlsI/kuo7nu5PmnZ/lubTpvoRcIlxuICB9LFxuLy8g5Lit5b+D5L+h5oGv6aG555uu5a+554Wn5pWw5a2X6aqM6K+B77yM5Y+W5Yiw5bCP5pWw54K556ys5LqM5L2NXG4gIG51bWJlclR3bzoge1xuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciByZWcgPSAvXlswLTldKyguWzAtOV17MSwyfSk/JC87XG4gICAgICByZXR1cm4gcmVnLnRlc3QodmFsdWUpO1xuICAgIH0sXG4gICAgbWVzc2FnZTogXCLlj6rog73kuLrmlbDlrZfvvIzlsI/mlbDngrnlj5bliLDnrKzkuozkvY1cIlxuICB9XG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vcHVibGljL2pzL2NvbW1vbnMvY29yZS92YWxpZGF0ZS5qc1xuICoqLyIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5sZXQgX3NlbGVjdE1zZyA9ICfor7fpgInmi6noioLngrknLFxuICAgIF9kZWxEZW55ID0gJ+agueiKgueCueS4jeiDveWIoOmZpCc7XG5cbmxldCBfYXBwZW5kID0gZnVuY3Rpb24oe29iaiwgbm9kZSwgZGF0YX0pIHtcbiAgb2JqLnRyZWUoJ2FwcGVuZCcsIHtcbiAgICBwYXJlbnQ6IG5vZGUudGFyZ2V0LFxuICAgIGRhdGFcbiAgfSk7XG59O1xuXG5leHBvcnQgbGV0IFRyZWUgPSB7XG4gIHRyZWVPYmo6ICQoJyN0dCcpLFxuICB1cmw6ICcvanNvbi90cmVlJyxcbiAgYW5pbWF0ZTogJ3RydWUnLFxuICBpbml0VHJlZShwYXJhbXMgPSB7fSkge1xuICAgIGxldCB7dXJsID0gdGhpcy51cmwsIGFuaW1hdGUgPSB0aGlzLmFuaW1hdGUsIG1ldGhvZCA9ICdnZXQnfSA9IHBhcmFtcyxcbiAgICAgICAgdHJlZSA9IHtcbiAgICAgICAgICB1cmwsXG4gICAgICAgICAgYW5pbWF0ZSxcbiAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgLy8g5pyN5Yqh56uv5pS55Li65Y2V5LiA6Lev5b6E5pe277yM5Lul5LiL5pa55rOV5Y+v5Lul5Y+W5raIXG4gICAgICAgICAgLy8gb25CZWZvcmVFeHBhbmQobm9kZSkge1xuICAgICAgICAgIC8vICAgbGV0IG9wdGlvbnMgPSAkKHRoaXMpLnRyZWUoJ29wdGlvbnMnKTtcbiAgICAgICAgICAvLyAgIG9wdGlvbnMudXJsID0gdGhpcy5hc3luVXJsO1xuICAgICAgICAgIC8vICAgb3B0aW9ucy5xdWVyeVBhcmFtcyA9IHtpZDogbm9kZS5pZCwgdGllcjogbm9kZS5hdHRyaWJ1dGVzLnRpZXJ9O1xuICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgbG9hZEZpbHRlcihkYXRhKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIChkYXRhKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgZGF0YSA9IGV2YWwoJygnICsgZGF0YSArICcpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgcmV0dXJuIHRyZWU7XG4gIH0sXG4gIC8vIOaWsOWinuWQjuaJgOWRvOWPq+eahCBjYWxsYmFja1xuICAvLyBkYXRhID0gW3tpZCx0ZXh0fV1cbiAgYWRkQ2hpbGQob2JqID0gdGhpcy50cmVlT2JqLCBkYXRhKSB7XG4gICAgbGV0IG5vZGUgPSB0aGlzLmdldFNlbGVjdE5vZGUob2JqKSxcbiAgICAgICAgcGFyYW1zID0ge29iaiwgbm9kZSwgZGF0YX07XG4gICAgX2FwcGVuZChwYXJhbXMpO1xuICB9LFxuICAvLyDlop7liqDlhYTlvJ/nu5PngrlcbiAgYWRkQnJvKG9iaiA9IHRoaXMudHJlZU9iaiwgZGF0YSkge1xuICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0U2VsZWN0Tm9kZShvYmopLFxuICAgICAgICBub2RlID0gdGhpcy5nZXRGYXRoZXIoY2hpbGQsIG9iaiksXG4gICAgICAgIHBhcmFtcyA9IHtvYmosIG5vZGUsIGRhdGF9O1xuICAgIGlmIChub2RlKSB7XG4gICAgICBfYXBwZW5kKHBhcmFtcyk7XG4gICAgfVxuICB9LFxuICB1cGRhdGVOb2RlKG9iaiA9IHRoaXMudHJlZU9iaiwgbmFtZSkge1xuICAgIGxldCBub2RlID0gdGhpcy5nZXRTZWxlY3ROb2RlKG9iaik7XG4gICAgbm9kZS50ZXh0ID0gbmFtZTtcbiAgICAkKG9iaikudHJlZSgndXBkYXRlJywgbm9kZSk7XG4gIH0sXG4gIGRlbE5vZGUob2JqID0gdGhpcy50cmVlT2JqKSB7XG4gICAgbGV0IG5vZGUgPSB0aGlzLmdldFNlbGVjdE5vZGUob2JqKSxcbiAgICAgICAgcm9vdCA9IHRoaXMuZ2V0Um9vdChvYmopLFxuICAgICAgICBmb3JtRGF0YSA9IHtcbiAgICAgICAgICB1cmw6ICcvZGVsVHJlZScsXG4gICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWxOb2RlIENhbGxCYWNrJyk7XG4gICAgICAgICAgICBpZiAoRG5hLnJlc29sdmUoZGF0YSkpIHtcbiAgICAgICAgICAgICAgJChvYmopLnRyZWUoJ3JlbW92ZScsIG5vZGUudGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgaWYgKG5vZGUuaWQgPT09IHJvb3QuaWQpIHtcbiAgICAgIERuYS5zaG93TXNnKHttc2c6IF9kZWxEZW55fSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgICQob2JqKS50cmVlKCdyZW1vdmUnLCBub2RlLnRhcmdldCk7XG4gICAgLy8gRG5hLmRlbChmb3JtRGF0YSk7XG4gIH0sXG4gIGdldEZhdGhlcihub2RlLCBvYmogPSB0aGlzLnRyZWVPYmopIHtcbiAgICBsZXQgZmF0aGVyID0gJChvYmopLnRyZWUoJ2dldFBhcmVudCcsIG5vZGUudGFyZ2V0KTtcbiAgICByZXR1cm4gZmF0aGVyO1xuICB9LFxuICBnZXRSb290KG9iaiA9IHRoaXMudHJlZU9iaikge1xuICAgIGxldCByb290ID0gJChvYmopLnRyZWUoJ2dldFJvb3QnKTtcbiAgICByZXR1cm4gcm9vdDtcbiAgfSxcbiAgZ2V0U2VsZWN0Tm9kZShvYmogPSB0aGlzLnRyZWVPYmopIHtcbiAgICBsZXQgbm9kZSA9ICQob2JqKS50cmVlKCdnZXRTZWxlY3RlZCcpO1xuXG4gICAgaWYgKG5vZGUgPT09IG51bGwgfHwgbm9kZS5sZW5ndGggPT09IDApIHtcbiAgICAgIERuYS5zaG93TXNnKHttc2c6IF9zZWxlY3RNc2d9KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vcHVibGljL2pzL2NvbW1vbnMvY29yZS90cmVlLmpzXG4gKiovIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCB7Q29sdW1uc30gZnJvbSAnLi9jb2x1bW5zLmpzJztcbmV4cG9ydCBsZXQgQ29tYm9HcmlkID0ge1xuICAvKlxuICAgIOi/lOWbniBjb21ib0dpcmQg5Yid5aeL6Kit5a6aXG4gICAgcGFyYW1zOlxuICAgIHtcbiAgICAgIHBhbmVsV2lkdGg6IGdyaWTlkYjnj77moYbnmoTlr6zluqYgbnVtYmVyXG4gICAgICBpZEZpZWxkOiDkuIvmi4nmoYbnmoQgdmFsdWUg5a+55pig5qCPIHN0cmluZ1xuICAgICAgdGV4dEZpZWxkOiDkuIvmi4nmoYbmmL7npLrmloflrZflr7nmmKDmoI8gc3RyaW5nXG4gICAgICByZXF1aXJlZDog5piv5ZCm5Li65b+F5aGrXG4gICAgICB2YWxpZFR5cGU6IOmqjOivgeexu+WIq++8jOmYteWIl+WvueaYoCB2YWxpZGF0ZWJveCDkuK3mj5DkvpvnmoTpqozor4HlkI3np7BcbiAgICAgIHZhbGlkYXRlT25CbHVyOiBvbkJsdXIg5pe26L+b6KGM6aqM6K+BIGJvb2xcbiAgICAgIG1ldGhvZDogYWpheCDmlrnms5VcbiAgICAgIHVybDog5ZCO5Y+w5pyN5Yqh6Lev5b6ELFxuICAgICAgbW9kdWxlOiDlr7nmmKAgY29sdW1ucyDkuK3nmoTmlrnms5XlkI1cbiAgICB9XG4gICovXG4gIGluaXRDb21ib0RHKHBhcmFtcykge1xuICAgIGxldCB7XG4gICAgICB1cmwsIHBhbmVsV2lkdGggPSA0NTAsIGlkRmllbGQsIHRleHRGaWVsZCxcbiAgICAgIHJlcXVpcmVkID0gZmFsc2UsIHZhbGlkVHlwZSA9IFsnY29tYm9ncmlkJ10sXG4gICAgICBtZXRob2QgPSAncG9zdCcsIHZhbGlkYXRlT25CbHVyID0gdHJ1ZSwgbW9kdWxlfSA9IHBhcmFtcyxcbiAgICAgICAgaW5pdCA9IHtcbiAgICAgICAgICBwYW5lbFdpZHRoLFxuICAgICAgICAgIGlkRmllbGQsXG4gICAgICAgICAgdGV4dEZpZWxkLFxuICAgICAgICAgIHJlcXVpcmVkLFxuICAgICAgICAgIHZhbGlkVHlwZSxcbiAgICAgICAgICB2YWxpZGF0ZU9uQmx1cixcbiAgICAgICAgICBlcnI6IERuYS5lcnIsXG4gICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgIHVybCxcbiAgICAgICAgICBjb2x1bW5zOiBDb2x1bW5zW21vZHVsZV0oKSxcbiAgICAgICAgICBvbkxvYWRTdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5yb3dzLnNvdXJjZSAhPT0gJ2xvY2FsJykge1xuICAgICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmUgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb25DbGlja1JvdzogZnVuY3Rpb24oaW5kZXgsIHJvdykge1xuICAgICAgICAgICAgLy8gJCh0aGlzKS5jb21ib2dyaWQoKS50ZXh0Ym94KCdzZXRWYWx1ZScsIHJvdy5jb2RlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBkZ0RhdGEgPSB0aGlzLmxvY2FsU3RvcmUucm93cyxcbiAgICAgICAgICAgICAgICBkZyA9ICQodGhpcykuY29tYm9ncmlkKCdncmlkJyksXG4gICAgICAgICAgICAgICAgZmlsdGVyQXJyID0gW10sXG4gICAgICAgICAgICAgICAgY2hlY2tWYWx1ZSA9ICQodGhpcykuY29tYm9ncmlkKCdnZXRUZXh0JyksXG4gICAgICAgICAgICAgICAga2V5ID0gd2luZG93LmV2ZW50O1xuXG4gICAgICAgICAgICAvLyDlj5blvpfkuIrkuIvplK7nmoRrZXlDb2RlXG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgIGtleSA9IGtleS5rZXlDb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYCR7JCh0aGlzKS5jb21ib2dyaWQoJ2dldFRleHQnKX0gOiAke2tleX1gKTtcbiAgICAgICAgICAgIC8vIOiLpeeCuuS4iuS4i+mNteaZguS4jemAsuihjOi/h+a7pOi1hOaWmVxuICAgICAgICAgICAgaWYgKGtleSA8IDM3IHx8IGtleSA+IDQwIHx8ICFrZXkpIHtcbiAgICAgICAgICAgICAgdGhpcy5maWx0ZXJEYXRhID0gZmFsc2U7XG4gICAgICAgICAgICAgIGZvciAobGV0IHYgb2YgZGdEYXRhLnZhbHVlcygpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFyciA9IE9iamVjdC52YWx1ZXModik7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYSBvZiBhcnIudmFsdWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChhLmluY2x1ZGVzKGNoZWNrVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhID09PSBjaGVja1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJEYXRhID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJBcnIucHVzaCh2KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIOS/ruaUuSBncmlkIOi9veWFpei1hOaWmVxuICAgICAgICAgICAgICBmaWx0ZXJBcnIuc291cmNlID0gJ2xvY2FsJztcbiAgICAgICAgICAgICAgZGcuZGF0YWdyaWQoJ2xvYWREYXRhJywgZmlsdGVyQXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZmlsdGVyRGF0YSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIHJldHVybiBpbml0O1xuICB9XG59O1xud2luZG93LkNHID0gQ29tYm9HcmlkO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9wdWJsaWMvanMvY29tbW9ucy9jb3JlL2NvbWJvR3JpZC5qc1xuICoqLyIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5cbiQoJyonKS5vbigna2V5ZG93bicsICdpbnB1dCxhLHNlbGVjdCcsIGZ1bmN0aW9uKGUpIHtcbiAgdmFyIHNlbGYgPSAkKHRoaXMpLFxuICAgICAgZm9ybSA9IHNlbGYucGFyZW50cygnZm9ybTplcSgwKScpLFxuICAgICAgZm9jdXNhYmxlLCBuZXh0LCByZWdTdHI7XG5cbiAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICBmb2N1c2FibGUgPSBmb3JtLmZpbmQoJ2lucHV0LGEsc2VsZWN0LHRleHRhcmVhJykuZmlsdGVyKCc6dmlzaWJsZScpO1xuICAgIG5leHQgPSBmb2N1c2FibGUuZXEoZm9jdXNhYmxlLmluZGV4KHRoaXMpICsgMSk7XG4gICAgaWYgKG5leHQubGVuZ3RoKSB7XG4gICAgICBjaGVja0Rpc2FibGVkKGZvY3VzYWJsZSwgbmV4dCk7XG4gICAgICBuZXh0LmZvY3VzKCk7XG4gICAgICBuZXh0LnNlbGVjdCgpO1xuICAgIH0gZWxzZSBpZiAobmV4dC5jb250ZXh0KSB7XG4gICAgICBsZXQgdGFnSWQgPSBuZXh0LmNvbnRleHQuaWQudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICByZWdTdHIgPSAvc2VhcmNoLztcbiAgICAgIC8vIOWIpOaWreaYr+ihqOWNleS6i+S7tuaIluafpeivouS6i+S7tlxuICAgICAgaWYgKHJlZ1N0ci50ZXN0KHRhZ0lkKSkge1xuICAgICAgICAkKGAjJHtuZXh0LmNvbnRleHQuaWR9YCkubmV4dCgpLmNsaWNrKCk7XHQvLyDmn6Xor6Lkuovku7bop6blj5FcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoXCIjZWRpdEJ0blwiKS5jbGljaygpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn0pO1xuLy8g6Lez6L+HZGlzYWJhbGVk5qCP5L2NXG5mdW5jdGlvbiBjaGVja0Rpc2FibGVkKGZvY3VzYWJsZSwgbmV4dCkge1xuICBpZiAobmV4dFswXS5kaXNhYmxlZCkge1xuICAgIG5leHQgPSBmb2N1c2FibGUuZXEoZm9jdXNhYmxlLmluZGV4KG5leHQpICsgMSk7XG4gICAgY2hlY2tEaXNhYmxlZChmb2N1c2FibGUsIG5leHQpO1xuICB9IGVsc2Uge1xuICAgIG5leHQuZm9jdXMoKTtcbiAgICBuZXh0LnNlbGVjdCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9wdWJsaWMvanMvY29tbW9ucy9jb3JlL2VudGVyVG9UYWIuanNcbiAqKi8iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IHtEYXRhQ29udHJvbH0gZnJvbSAnLi9kYXRhQ29udHJvbC5qcyc7XG5cbi8vIOa3u+WKoCB0ZXh0Ym94IGNsZXNuQnRuXG4kLmV4dGVuZCgkLmZuLnRleHRib3gubWV0aG9kcywge1xuICBhZGRDbGVhckJ0bjogZnVuY3Rpb24oanEsIGljb25DbHMpIHtcbiAgICByZXR1cm4ganEuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0ID0gJCh0aGlzKTtcbiAgICAgIHZhciBvcHRzID0gdC50ZXh0Ym94KCdvcHRpb25zJyk7XG4gICAgICBvcHRzLmljb25zID0gb3B0cy5pY29ucyB8fCBbXTtcbiAgICAgIG9wdHMuaWNvbnMudW5zaGlmdCh7XG4gICAgICAgIGljb25DbHM6IGljb25DbHMsXG4gICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICB2YXIgY2cgPSBlLmRhdGEudGFyZ2V0O1xuICAgICAgICAgICQoY2cpLnRleHRib3goJ2NsZWFyJykudGV4dGJveCgndGV4dGJveCcpLmZvY3VzKCk7XG4gICAgICAgICAgdmFyIGRnID0gJChjZykuY29tYm9ncmlkKCdncmlkJyk7XG4gICAgICAgICAgZGcuZGF0YWdyaWQoJ2xvYWREYXRhJywgY2cubG9jYWxTdG9yZSk7XG4gICAgICAgICAgJCh0aGlzKS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdC50ZXh0Ym94KCk7XG4gICAgICBpZiAoIXQudGV4dGJveCgnZ2V0VGV4dCcpKSB7XG4gICAgICAgIHQudGV4dGJveCgnZ2V0SWNvbicsIDApLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgIH1cbiAgICAgIHQudGV4dGJveCgndGV4dGJveCcpLmJpbmQoJ2tleXVwJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpY29uID0gdC50ZXh0Ym94KCdnZXRJY29uJywgMCk7XG4gICAgICAgIGlmICgkKHRoaXMpLnZhbCgpKSB7XG4gICAgICAgICAgaWNvbi5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGljb24uY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSk7XG5cbi8qXG4gKiDlsY/olL3nvZHpobXmu5rliqhcbiAqICoqL1xudmFyIGJvZHlTY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgJCgnaHRtbCxib2R5JykuY3NzKHtcbiAgICBvdmVyZmxvdzogJ3Zpc2libGUnXG4gIH0pO1xuICAkKFwiYm9keSxodG1sXCIpLnVuYmluZChcInRvdWNobW92ZVwiKTtcbn07XG5cbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuSl9DbG9zZVBvcCcsIGZ1bmN0aW9uKGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAkKHRoaXMpLnBhcmVudHMoJy5wb3AnKS5oaWRlKCk7XG4gIGJvZHlTY3JvbGwoKTtcbn0pO1xuXG4kKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICBEYXRhQ29udHJvbC5hdXRvRmlsbFNjcmVlbigpO1xufSk7XG4kKGRvY3VtZW50KS5vbignbW91c2VvdmVyJywgJy5kcm9wLWRvd24nLCBmdW5jdGlvbigpIHtcbiAgdmFyIGxpID0gJCh0aGlzKS5jaGlsZHJlbignLmRyb3AtZG93bi1tZW51JykuY2hpbGRyZW4oKS5maW5kKCdsaScpO1xuICBpZiAobGkubGVuZ3RoID4gMCkge1xuICAgICQodGhpcykuY2hpbGRyZW4oJy5kcm9wLWRvd24tbWVudScpLnNob3coKTtcbiAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgfVxufSk7XG4kKGRvY3VtZW50KS5vbignbW91c2VvdXQnLCAnLmRyb3AtZG93bicsIGZ1bmN0aW9uKCkge1xuICAkKHRoaXMpLmNoaWxkcmVuKCcuZHJvcC1kb3duLW1lbnUnKS5oaWRlKCk7XG4gICQodGhpcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xufSk7XG5cbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuZHJvcC1kb3duIGEnLCBmdW5jdGlvbigpIHtcbiAgJCh0aGlzKS5wYXJlbnRzKCcuZHJvcC1kb3duLW1lbnUnKS5oaWRlKCk7XG59KTtcblxubGV0IHNpdGVNZW51ID0gJCgnI3NpdGUtbWVudScpO1xuLyog572R56uZ5Li76I+c5Y2VKi9cbiQoJy5zdWJtZW51LWl0ZW0nLCBzaXRlTWVudSkub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkge1xuICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgdmFyIGkgPSAkKHRoaXMpLmZpbmQoJ2lbZGF0YS1jbGFzc10nKTtcbiAgaS5hZGRDbGFzcyhpLmF0dHIoJ2RhdGEtY2xhc3MnKSk7XG4gICQoJyNzaGFkb3cnKS5zdG9wKCkuZmFkZUluKCk7XG59KTtcbiQoJy5zdWJtZW51LWl0ZW0nLCBzaXRlTWVudSkub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcbiAgJCh0aGlzKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gIHZhciBpID0gJCh0aGlzKS5maW5kKCdpW2RhdGEtY2xhc3NdJyk7XG4gIGkucmVtb3ZlQ2xhc3MoaS5hdHRyKCdkYXRhLWNsYXNzJykpO1xuICAkKCcjc2hhZG93Jykuc3RvcCgpLmZhZGVPdXQoKTtcbn0pO1xuXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCAnLm1haW4tY29udGVudC1oZWFkZXIgbGknLCBmdW5jdGlvbigpIHtcbiAgdmFyIHVsID0gJCh0aGlzKS5jbG9zZXN0KFwidWxcIik7XG4gICAgICAgIC8vIHNwYW4gPSAkKHRoaXMpLmNsb3Nlc3QoXCJkaXZcIikucHJldigpOy8v5Y+W5b6X54i26IqC55qE5LiK5LiA5Liq5YWE5byf6IqC54K5XG5cbiAgICAvLyDlsIbmiYDmnIlibHVlIOa4heepulxuICB1bC5maW5kKFwibGlcIikuZWFjaChmdW5jdGlvbigpIHtcbiAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImJsdWVcIikpIHtcbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJibHVlXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgJCh0aGlzKS5hZGRDbGFzcygnYmx1ZScpO1xufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3B1YmxpYy9qcy9jb21tb25zL2NvcmUvb25FdmVudC5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=