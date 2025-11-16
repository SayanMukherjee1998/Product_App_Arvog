// key: userId => refreshToken
const store = new Map();

exports.saveRefreshToken = (userId, token) => {
  store.set(userId.toString(), token);
};

exports.getRefreshToken = (userId) => {
  return store.get(userId.toString());
};

exports.deleteRefreshToken = (userId) => {
  store.delete(userId.toString());
};
