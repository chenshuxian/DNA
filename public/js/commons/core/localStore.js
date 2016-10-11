import $ from 'jquery';

let _RG = $('#rightGrid'),
    _LG = $('#leftGrid');

let _includes = function(store, id) {
  let i = 0;
  for (let item of store) {
    i++;
    if (item.stringId === id) {
      return {bool: true, index: i};
    }
    return {bool: false, index: i};
  }
};
export let LocalStorage = {
  // dg 载入成功后回传的资料存放于本地阵列
  store(data) {
    if (data.rows.source !== 'local') {
      Dna.localStore = [];
      Dna.localStore = data.rows;
    }
  },
  getStore() {
    return Dna.localStore;
  },
  // 添加资料到本地库
  // el: row
  addStore(el) {
    let store = this.getStore(),
        id = el.stringId,
        includes = _includes(store, id);
    if (!includes.bool) {
      store.push(el);
    }
  },
  delStore(el) {
    let store = this.getStore(),
        id = el.stringId,
        includes = _includes(store, id);
    if (includes.bool) {
      store.splice(includes.index, 1);
    }
  },
  /* 本地而资料查询
    store = Arr 本地资料阵列
    queryArr = Arr 查询栏位
    searchStr = string 查询字串
    combine = bool 组合查询
  */
  query(queryArr, searchStr, store = Dna.localStore, combine = false) {
    let qData = [],
        str = $.trim(searchStr);
    if (combine) {
      // 组合查询
    } else {
      if (searchStr) {
        for (let n of queryArr) {
          for (let item of store) {
            if (item[n].includes(str)) {
              qData.push(item);
            }
          }
        }
      } else {
        qData = store;
      }
      Dna.filter(qData);
    }
  },
  // 資料過濾，將右 grid 中已出現在左 grid 濾掉
  filter(store = Dna.localStore) {
    let lData = _LG.datagrid('getRows'),
        lLen = lData.length,
        sLen = store.length;

    for (let i = 0; i < lLen; i++) {
      for (let j = 0; j < sLen; j++) {
        if (lData[i].stringId === store[j].stringId) {
          store.splice(j, 1);
          sLen--;
          break;
        }
      }
    }

    store.sourece = 'local';
    _RG.datagrid('loadData', store);
  }
};
