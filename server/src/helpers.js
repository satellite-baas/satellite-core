const fs = require('fs');

const getFiles = (dir, baseDir = dir, files_) => {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);

  for (let idx = 0; idx < files.length; idx += 1) {
    const name = dir + '/' + files[idx];
    const stats = fs.statSync(name);

    if (stats.isDirectory()) {
      getFiles(name, baseDir, files_);
    } else {
      const thisFile = {
        name: stripPathPrefix(name, baseDir),
        size: stats.size,
        modified: stats.mtime,
      };
      files_.push(thisFile);
    }
  }

  return files_;
};

const extractTokenFromBearer = (str) => {
  const parts = str.split(' ');
  return parts.length == 2 ? parts[1] : '';
};

const stripPathPrefix = (str, prefix) => {
  const pattern = `${prefix}/`;
  const re = new RegExp(pattern);
  return str.replace(pattern, '');
};

module.exports = {
  getFiles,
  extractTokenFromBearer,
};
