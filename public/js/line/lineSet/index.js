import $ from 'jquery';
import {CONST} from '../../commons/core/const.js';

let LS = Object.create(Dna);
let
    _preId = CONST.PREID.LS,
    _tableList = $(`#${_preId}List`),
    _hideCols = [],
    _data = Dna.searchParams(_preId),
    _module = 'LS',
    _focusId = 'name',
    _popArea = 480,
    _checkUrl = '/check',
    _editUrl = '/edit',
    _addUrl = '/add',
    _delUrl,
    _delBatUrl,
    _statusUrl,
    _popUrl = '/pop/lineSet',
    _pageListUrl = '/json/lineSet',
    _dgParams = {
      url: _pageListUrl,
      data: _data,
      module: _module,
      hideCols: _hideCols,
      tableList: _tableList,
      preId: _preId
    },
    _gridObj = Dna.initDG(_dgParams),
    _dataGrid = _tableList.datagrid(_gridObj);

Object.assign(LS, {
  preId: _preId,
  module: _module,
    // 设定pop弹出框的大小
  popArea: _popArea,
  focusId: _focusId,
  tableList: _tableList,
  url: {
    edit: _editUrl,
    add: _addUrl,
    del: _delUrl,
    status: _statusUrl,
    pop: _popUrl,
    pageList: _pageListUrl,
    delBatch: _delBatUrl,
    check: _checkUrl
  },
  dataGrid: _dataGrid,
  validate() {
    let params = [
      {
        obj: $('#name'),
        setting: {
          required: true
        },
        len: 30
      },
      {
        obj: $('#email'),
        setting: {
          required: true,
          validType: ['symbol', 'email'],
          missingMessage: 'must be email'
        },
        len: 20
      }
    ];
    Dna.vb(params);
  },
  confirmOK(params) {
    if (this.formStatus === 'del') {
      this.sendData(params);
    } else {
      console.log(this.formStatus);
      let params = {
        url: this.url[this.formStatus],
        data: this.formData
      };
      this.sendData(params);
    }
    // if (this.formStatus === 'edit') {
    //   console.log('checkEdit');
    //   let params = {
    //     url: this.editUrl,
    //     data: this.formData
    //   };
    //   this.sendData(params);
    // }
  }
});

LS.init();

window.LS = LS;
