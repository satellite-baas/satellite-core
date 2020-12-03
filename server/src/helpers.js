const fs = require('fs');

const getFiles = (dir, files_) => {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);

  for (let idx = 0; idx < files.length; idx += 1) {
    const name = dir + '/' + files[idx];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }

  return files_;
};

module.exports = {
  getFiles,
};
