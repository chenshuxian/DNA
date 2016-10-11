/*
  Module: Columns,
  Create: 2016/07/17,
  Auther: chenshuxian
  說明: 此模塊主要提共 datagrid 相關所有欄位集合。
*/
// 共用 function
let _status = function() {},
    _operation = function() {},
    _show = function() {},
    _remark = function(value) {
      let remark = `<span class='easyui-tooltip' data-value='${value}'>${value}</span>`;
      return remark;
    };

// 欄位集合區
export let Columns = {
  test() {
    let cols = [
      [
        {field: "ck", checkbox: true, width: 20},
        {title: "操作项目", field: "name"},
        {title: "status", field: "status"},
        {title: "操作类型", field: "t2"},
        {title: "操作内容", field: "t3",
          formatter: value => _remark(value)},
        {title: "操作人", field: "t4", width: 50}
      ]
    ];
    return cols;
  },
  comboGrid() {
    let cols = [[
      {field: 'code', title: 'Code', width: 60},
      {field: 'name', title: 'Name', width: 60},
      {field: 'addr', title: 'Addr', width: 60},
      {field: 'col4', title: 'Col4', width: 60}
    ]];
    return cols;
  }
};
