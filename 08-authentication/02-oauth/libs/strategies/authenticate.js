const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }
  let user = await User.findOne({email});
  if (!user) {
    user = new User({
      displayName,
      email,
    });
    const err = user.validateSync();
    if (err) {
      return done(err);
    }
    await user.save();
  }
  done(null, user);
};
