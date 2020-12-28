const Message = require('../models/Message');
const mapMessages = require('../mappers/messages');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({chat: ctx.user._id});
  ctx.body = {messages: messages.map(mapMessages)};
};
