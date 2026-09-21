const blacklist = new Set();

export const blacklistToken = (token) => {
  return blacklist.add(token);
};
export const isBlacklisted = (token) => {
  return blacklist.has(token);
};
