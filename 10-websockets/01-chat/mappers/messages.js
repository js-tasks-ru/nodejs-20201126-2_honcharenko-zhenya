module.exports = function mapMessages(message) {
  return {
    id: message._id,
    date: message.date,
    text: message.text,
    user: message.user,
  };
};
