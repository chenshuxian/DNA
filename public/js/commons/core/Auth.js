/*
  Module: Auth,
  Create: 2016/09/28,
  Auther: chenshuxian
  說明: 权限验证。
  1为启用，0为停用
*/
import $ from 'jquery';

let Auth = {
  getAuthStr(preId) {
    let authStr = $("#authStr").val(),
        authArr = {
          add: 0,
          delBatch: 0,
          status: 0,
          edit: 0,
          del: 0
        },
        subModule = {
          ls() {
            if (!authStr.includes("31030104")) {
              Auth.addHide(preId);
            }
            if (!authStr.includes("31030105")) {
              Auth.delBatchHide(preId);
            }
            if (authStr.includes("31030101")) {
              authArr.status = 1;
            }
            if (authStr.includes("31030102")) {
              authArr.edit = 1;
            }
            if (authStr.includes("31030103")) {
              authArr.del = 1;
            }
            Dna.authArr = authArr;
          },
          // 线路机构分配2
          loa2() {
            if (!authStr.includes("31030201")) {
              Auth.addHide(preId);
            }
            if (authStr.includes("31030202")) {
              authArr.del = 1;
            }
            if (!authStr.includes("31030203")) {
              Auth.delBatchHide(preId);
            }
            Dna.authArr = authArr;
          }
        };
    if (subModule[preId]) {
      subModule[preId]();
    }
  },
  addHide(preId) {
    preId = Auth.getPreId(preId);
    $(`#${preId}Add`).hide();
  },
  delBatchHide(preId) {
    preId = Auth.getPreId(preId);
    $(`#${preId}DeleteBatch`).hide();
  },
  getPreId(preId) {
    preId = preId.substring(0, preId.length - 1);
    return preId;
  }
};

export {Auth};
