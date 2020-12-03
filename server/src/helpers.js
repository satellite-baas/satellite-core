const fs = require('fs');

const getFiles = (dir, baseDir = dir, files_) => {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  const pattern = `${baseDir}/`;
  const re = new RegExp(pattern);

  for (let idx = 0; idx < files.length; idx += 1) {
    const name = dir + '/' + files[idx];
    const stats = fs.statSync(name);

    if (stats.isDirectory()) {
      getFiles(name, baseDir, files_);
    } else {
      const thisFile = {};
      thisFile.name = name.replace(pattern, '');
      thisFile.size = stats.size;
      thisFile.modified = stats.mtime;
      files_.push(thisFile);
    }
  }

  return files_;
};

module.exports = {
  getFiles,
};
