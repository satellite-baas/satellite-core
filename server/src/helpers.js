const extractTokenFromBearer = (str) => {
  const parts = str.split(" ");
  return parts.length == 2 ? parts[1] : "";
};

module.exports = {
  extractTokenFromBearer,
};
