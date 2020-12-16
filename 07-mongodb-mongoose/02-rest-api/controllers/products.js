const Product = require('../models/Product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.request.query;
  if (subcategory) {
    const products = await Product.find({subcategory});
    ctx.body = {products};
  } else {
    return next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  ctx.body = {products};
  return next();
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  const isValidId = ObjectId.isValid(id);
  if (!isValidId) {
    ctx.throw(400);
  }
  const product = await Product.findOne({_id: id});
  if (!product) {
    ctx.throw(404);
  }
  ctx.body = {product};
  return next();
};

