const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.request.query;
  let searchQuery = {};
  if (query) {
    searchQuery = {$text: {$search: query}};
  }
  const products = await Product.find(searchQuery);
  ctx.body = {products};
};
