export const CONST = {
  BASES: {
    SUCCESS: 'success',
    ERR: 'error',
    CONF: 'confirm',
    POST: 'post',
    GET: 'get',
    POPDIV: 'popModal',
    FORM: 'InfoForm',
    SUBMITBTN: 'editBtn'
  },
  STATUS: {
    ADD: 'add',
    EDIT: 'edit',
    DEL: 'del',
    DELBATCH: 'delbatch',
    VIEW: 'view'
  },
  LIMIT: {
    SHIFTGRID: 30
  },
  PATH: {
    ROOT: __dirname
  },
  PREID: {
    LS: 'ls'
  },
  SEARCHTIP: {
    COMMON: "编码\\中文名称\\英文简称\\英文名称\\助记符",
    RESULTTYPE: "编码\\中文名称",     // 结果类型
    LOGICTABLE: "编码\\受检成份\\受检属性\\检验方法\\样本标识\\时间特征\\标本类型\\助记符",      // 罗辑编码表
    TEMPLATE: "编码\\模板名称",     // 中心报表,机构报表模板维护
    CENTERINSTR: "编码\\仪器名称\\仪器型号\\助记符",     // 中心仪器信息
    MED: "编码\\卫生机构代码\\所属地区\\中文名称\\中文地址\\联系人\\联系电话\\助记符",     // 医疗机构维护
    INDEPENDT: "编码\\所属地区\\中文名称\\中文地址\\联系人\\联系电话\\助记符",     // 独立实验室维护
    AREAMANAGEMENT: "编码\\中文名称\\中文地址\\联系人\\联系电话\\助记符",     // 区域管理机构维护
    USERMEANAGEMENT: "用户帐号\\用户名称",       // 用户管理
    ROLE: "编码\\名称",         // 角色管理
    LOG: "操作项目\\操作类型\\操作内容\\操作人"       // 中心日志管理
  }
};
