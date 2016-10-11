import $ from 'jquery';
let _selectMsg = '请选择节点',
    _delDeny = '根节点不能删除';

let _append = function({obj, node, data}) {
  obj.tree('append', {
    parent: node.target,
    data
  });
};

export let Tree = {
  treeObj: $('#tt'),
  url: '/json/tree',
  animate: 'true',
  initTree(params = {}) {
    let {url = this.url, animate = this.animate, method = 'get'} = params,
        tree = {
          url,
          animate,
          method,
          // 服务端改为单一路径时，以下方法可以取消
          // onBeforeExpand(node) {
          //   let options = $(this).tree('options');
          //   options.url = this.asynUrl;
          //   options.queryParams = {id: node.id, tier: node.attributes.tier};
          // },
          loadFilter(data) {
            if (typeof (data) === 'string') {
              data = eval('(' + data + ')');
            }
            return data;
          }
        };
    return tree;
  },
  // 新增后所呼叫的 callback
  // data = [{id,text}]
  addChild(obj = this.treeObj, data) {
    let node = this.getSelectNode(obj),
        params = {obj, node, data};
    _append(params);
  },
  // 增加兄弟结点
  addBro(obj = this.treeObj, data) {
    let child = this.getSelectNode(obj),
        node = this.getFather(child, obj),
        params = {obj, node, data};
    if (node) {
      _append(params);
    }
  },
  updateNode(obj = this.treeObj, name) {
    let node = this.getSelectNode(obj);
    node.text = name;
    $(obj).tree('update', node);
  },
  delNode(obj = this.treeObj) {
    let node = this.getSelectNode(obj),
        root = this.getRoot(obj),
        formData = {
          url: '/delTree',
          id: '1',
          success(data) {
            console.log('delNode CallBack');
            if (Dna.resolve(data)) {
              $(obj).tree('remove', node.target);
            }
          }
        };
    if (node.id === root.id) {
      Dna.showMsg({msg: _delDeny});
      return false;
    }
    $(obj).tree('remove', node.target);
    // Dna.del(formData);
  },
  getFather(node, obj = this.treeObj) {
    let father = $(obj).tree('getParent', node.target);
    return father;
  },
  getRoot(obj = this.treeObj) {
    let root = $(obj).tree('getRoot');
    return root;
  },
  getSelectNode(obj = this.treeObj) {
    let node = $(obj).tree('getSelected');

    if (node === null || node.length === 0) {
      Dna.showMsg({msg: _selectMsg});
      return false;
    }

    return node;
  }
};
