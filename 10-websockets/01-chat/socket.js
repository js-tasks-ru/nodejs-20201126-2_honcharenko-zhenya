const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const {token} = socket.handshake.query;
    if (!token) {
      next(new Error('anonymous sessions are not allowed'));
      return;
    }
    const sessionDB = await Session.findOne({token}).populate('user');
    if (!sessionDB) {
      next(new Error('wrong or expired session token'));
      return;
    }
    socket.user = sessionDB.user;
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      const message = new Message({
        date: new Date(),
        text: msg,
        chat: socket.user._id,
        user: socket.user.displayName,
      });
      await message.save();
    });
  });

  return io;
}

module.exports = socket;
