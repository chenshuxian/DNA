import $ from 'jquery';
import {Columns} from './columns.js';
export let ComboGrid = {
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
  initComboDG(params) {
    let {
      url, panelWidth = 450, idField, textField,
      required = false, validType = ['combogrid'],
      method = 'post', validateOnBlur = true, module} = params,
        init = {
          panelWidth,
          idField,
          textField,
          required,
          validType,
          validateOnBlur,
          err: Dna.err,
          method,
          url,
          columns: Columns[module](),
          onLoadSuccess: function(data) {
            if (data.rows.source !== 'local') {
              this.localStore = data;
            }
          },
          onClickRow: function(index, row) {
            // $(this).combogrid().textbox('setValue', row.code);
          },
          onChange: function(newValue, oldValue) {
            var dgData = this.localStore.rows,
                dg = $(this).combogrid('grid'),
                filterArr = [],
                checkValue = $(this).combogrid('getText'),
                key = window.event;

            // 取得上下键的keyCode
            if (key) {
              key = key.keyCode;
            }
            // console.log(`${$(this).combogrid('getText')} : ${key}`);
            // 若為上下鍵時不進行过滤资料
            if (key < 37 || key > 40 || !key) {
              this.filterData = false;
              for (let v of dgData.values()) {
                let arr = Object.values(v);
                for (let a of arr.values()) {
                  if (a.includes(checkValue)) {
                    if (a === checkValue) {
                      this.filterData = true;
                    }
                    filterArr.push(v);
                    break;
                  }
                }
              }
              // 修改 grid 载入资料
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
