function CommonDao(model) {
  if (!model) {
    throw new Error('Model can not be null');
  }
  this.model = model;
  this.extends = {};
}

/**
 * 保存一组或单个数据
 * @param doc {}，[{}],[{},{}]
 * @param callback
 */
CommonDao.prototype.create = function (doc, callback) {
  this.model.create(doc, function (error) {
    if (error) return callback(error);
    return callback(null);
  });
};

/**
 * 根据id查询单个model
 * @param id String
 * @param callback
 */
CommonDao.prototype.getById = function (id, callback) {
  this.model.findOne({_id: id}, function (error, model) {
    if (error) return callback(error, null);
    return callback(null, model);
  });
};

/**
 *
 * @param query 查询条件{}
 * @param fileds 可选 指定查询字段['','']
 * @param opt 可选
 * @param callback
 */
CommonDao.prototype.getByQuery = function (query, fileds, opt, callback) {
  this.model.find(query, fileds, opt, function (error, model) {
    if (error) return callback(error, null);
    return callback(null, model);
  });
};

CommonDao.prototype.getAll = function (callback) {
  this.model.find({}, function (error, models) {
    if (error) return callback(error, null);
    return callback(null, models);
  });
};
/*
 CommonDao.prototype.getAllModelByOption = function (opt, callback) {
 CommonDao.getModelByQuery({},{},opt, callback);
 };
 */

CommonDao.prototype.delete = function (query, callback) {
  this.model.remove(query, function (error) {
    if (error) return callback(error);
    return callback(null);
  });
};

/**
 * 更新文档
 * @param conditions 筛选条件
 * @param update    更新内容
 * @param options   可选参数
 * @param callback
 */
CommonDao.prototype.update = function (conditions, update, options, callback) {
  this.model.update(conditions, update, options, function (error, model) {
    if (error) return callback(error);
    return callback(null, model);
  });
};

module.exports = CommonDao;
