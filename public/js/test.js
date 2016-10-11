import 'babel-polyfill';
import $ from 'jquery';
// import {} from './commons/core/enterToTab.js';
import {Dna} from './commons/core/DNA.js';
import {Tree} from './commons/core/tree.js';
import {LocalStorage} from './commons/core/localStore.js';
// let Dna = Dna;

// import {Message} from './commons/core/message.js';
// let Dna = new Message();
// import 'alert';
// require('./commons/jquery.ui.draggable.js');
// require('./commons/jquery.alerts.js');
// require("imports?jQuery=jquery!./commons/jquery.ui.draggable.js");
// require("imports?jQuery=jquery!./commons/jquery.alerts.js");
let test = Object.create(Dna);
Object.assign(test, {
  checkUrl: 'check',
  focusId: 'name',
  dataGrid: $('#dg'),
  beforeSubmit() {
    console.log('送出前的設定');
    return true;
  },
  validate() {
    let params = {
          obj: $("#name"),
          setting: {
            required: true,
            validType: ['symbol', 'space'],
            missingMessage: '名字不可為空'
          },
          len: 10
        },
        email = {
          obj: $('#email'),
          setting: {
            validType: 'email'
          },
          len: 30
        };
    this.vb(params);
    this.vb(email);
  },
  add(formdata) {
    console.log('新增');
    let params = {
      url: '/add',
      data: formdata
    };
    this.sendData(params);
  },
  edit(formdata) {
    console.log('編輯');
    let params = {
      url: '/add',
      data: formdata
    };
    this.sendData(params);
  },
  confirmOK() {
    Dna.showMsg('confirmCallOK1');
  },
  confirmNO() {
    Dna.showMsg('confirmCallNO');
  }
});

let params = {
      url: '/json/test',
      method: 'get',
      module: 'test'
    },
    initDG = test.initDG(params),
    leftDG = test.initDG({module: 'test'});

$("#dg").datagrid(initDG);
$("#leftGrid").datagrid(leftDG);
$("#rightGrid").datagrid(initDG);

// ComboGrid
// get initComboDG
let params2 = {
  url: '/json/cb',
  module: 'comboGrid',
  idField: 'code',
  textField: 'name',
  required: true,
  method: 'get'
};
let initCG = Dna.initComboDG(params2);
$("#cg").combogrid(initCG).textbox('addClearBtn', 'clearBtn fa fa-times');

// tree
let treeObj = Tree.initTree();
$("#tt").tree(treeObj);

let err = {status: 'error', msg: 'messageTest'},
    success = {status: 'success', msg: 'messageTest'},
    confirm = {status: 'confirm', msg: 'messageTest'};

// test.dAlert(success);
var dg = $('#dg'),
    cols = ['t2'];

$('#alert').on('click', function() {
  let returnStr = test.resolve(success);
  console.log('success:' + returnStr);
});
$('#confirm').on('click', function() {
  let returnStr = test.resolve(confirm);
  console.log(returnStr);
});
$('#error').on('click', function() {
  let returnStr = test.resolve(err);
  console.log('confirm:' + returnStr);
});
$('#hide').on('click', function() {
  test.hideCols(dg, cols);
});
$('#show').on('click', function() {
  test.showCols(dg, cols);
});

$('#insert').on('click', function() {
  // $('#ff').attr('action', 'add');
  $("#dlg").dialog('open');
  $("#dlg").dialog('center');
  // test.uploadButton($("#fb"));
  test.formStatus = 'add';
  // let check = test.checkUrl;
  test.formSet();
  test.validate();
  // test.pop(callback);
});

$('#update').on('click', function() {
  // $('#ff').attr('action', 'add');
  $("#dlg").dialog('open');
  test.uploadButton($("#fb"));
  test.formStatus = 'edit';

  test.formSet();
  test.validate();
  // test.pop(callback);
});

$('#del').on('click', function() {
  let formData = {
    id: 1,
    status: 0
  };
  test.del(formData);
});

$('#delBatch').on('click', function() {
  test.delBatch();
});

$('#shiftR').on('click', function() {
  test.shiftR();
});

$('#shiftL').on('click', function() {
  test.shiftL();
});
