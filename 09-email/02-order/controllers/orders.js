const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const order = new Order({
    product,
    phone,
    address,
    user: ctx.user._id,
  });
  const validationError = await order.validate();
  if (validationError) {
    ctx.throw(validationError);
  }
  await order.save();

  const productDB = await Product.find({_id: product});
  await sendMail({
    to: ctx.user.email,
    subject: 'Подтвердите почту',
    locals: {id: order._id, product: productDB},
    template: 'order-confirmation',
  });

  ctx.status = 201;
  ctx.body = {
    order: order._id,
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user._id});
  ctx.status = 200;
  ctx.body = {
    orders,
  };
};
