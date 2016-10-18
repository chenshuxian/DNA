/*
  Module: Columns,
  Create: 2016/07/17,
  Auther: chenshuxian
  說明: 此模塊主要提共 datagrid 相關所有欄位集合。
*/
// 共用 function
let
    _status = function(v, r, i, o) {
      let rd = Dna.strReplace(JSON.stringify(r)),
          statusObj = {
            0: {str: '停用', checked: ''},
            1: {str: '启用', checked: 'checked'},
            37: {str: '待分发'},
            38: {str: '待签收'},
            39: {str: '已签收'},
            301: {str: '已退单'}
          },
          str = `<span class='helpers'><div class='status-switch'><input type='checkbox' name='status'
          ${statusObj[v].checked} onchange=${o}.changeStatus(${i},${rd})><i></i></div><i class='helpers-content'>${statusObj[v].str}</i></span>`;

      if (!Dna.authArr.status) {
        str = statusObj[v].str;
      }

      return str;
    },
    _operation = function(v, r, i, o, status = {edit: 'edit', del: 'del'}) {
      var str = "",
          rd = Dna.strReplace(JSON.stringify(r));

      if (Dna.authArr.edit) {
        str = `<div class='option-group-inline'>
         <span onclick=${o}.commonPop('${status.edit}',${i},${rd})>
         <i class='icon icon-page'></i>编辑</span>`;
      }
      if (Dna.authArr.del) {
        str += `<span onclick=${o}.del('${status.del}',${i},${rd})>
         <i class=\"icon-trash\"></i>删除</span></div>`;
      }

      return str;
    },
    _view = function(v, r, i, o) {
      var rd = Dna.strReplace(JSON.stringify(r)),
          str = `<a onclick=${o}.commonPop('view',${i},${rd})>${v}</a>`;
      return str;
    },
    _remark = function(value) {
      let remark = `<span class='easyui-tooltip' data-value='${value}'>${value}</span>`;
      return remark;
    };

// 欄位集合區
// function 名称为 preId
export let Columns = {
  // 线路设置
  ls() {
    var
        obj = 'LS',
        _columns = [[
          {field: "ck", checkbox: true, width: 30},
          {title: "id", field: "id", width: 30},
          {title: "编码", field: "codeNo", width: 30, formatter: (value, row, index) => {
            return _view(value, row, index, obj);
          }},
          {title: "名称", field: "name", flex: 1, width: 60},
          {title: "助记符", field: "fastCode", width: 150},
          {title: "顺序号", field: "displayOrder", width: 50},
          {title: "备注", field: "memo", width: 150},
          {title: "状态", field: "status", formatter: (value, row, index) => {
            return _status(value, row, index, obj);
          }},
          {title: "操作", field: "opt", width: 40, formatter: (value, row, index) => {
            return _operation(value, row, index, obj);
          }}
        ]];
    return _columns;
  },
  // 线路机构分配
  loa() {
    var
      _columns = [[
        {title: "编码", field: "codeNo", width: 30},
        {title: "名称", field: "name", flex: 1, width: 60},
        {title: "备注", field: "memo", width: 150, formatter: value => {
          return _remark(value);
        }}
      ]];
    return _columns;
  },
  loa2() {
    var
        obj = 'LOA',
        _columns = [[
          {field: "ck", checkbox: true, width: 30},
          {title: "编码", field: "codeNo", width: 30},
          {title: "名称", field: "name", flex: 1, width: 60},
          {title: "地址", field: "address", width: 150},
          {title: "操作", field: "opt", width: 100, align: "center",
            formatter: function(value, row, index) {
              return _operation(value, row, index, obj);
            }
          }
        ]];
    return _columns;
  }
};
