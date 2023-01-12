const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const pfs = Promise.promisifyAll(fs);
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    var id = data;
    if (err) {
      throw ('Error over here');
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err, data) => {
        if (err) {
          console.log('Error Line 18: ', err);
        } else {
          callback(null, {id: id, text: text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  var results = [];
  var temp = '';
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      console.log('Hey theres an error ', err);
    } else {
      data.map((id, index)=>{
        temp = id.slice(0, 5);
        results.push({ id: temp, text: temp });
      });
      callback(null, results);
    }
  });
};

exports.readOne = (id, callback) => {
  var filename = `${exports.dataDir}` + '/' + `${id}.txt`;
  fs.readFile(filename, 'utf8', (err, text) => {
    if (err) {
      callback(1, 0);
    } else {
      callback(null, { id: id, text: text });
    }
  });
};

exports.update = (id, text, callback) => {
  var filename = `${exports.dataDir}` + '/' + `${id}.txt`;
  fs.readFile(filename, 'utf8', (err) => {
    if (err) {
      callback(1, 0);
    } else {
      fs.writeFile(filename, text, (err) => {
        if (err) {
          throw ('error writing counter');
        } else {
          callback(null, { id: id, text: text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filename = `${exports.dataDir}` + '/' + `${id}.txt`;
  fs.unlink(filename, (err) => {
    if (err) {
      callback(1, 0);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
// EXAMPLE 1
// return new Promise((resolve, reject) => {
//   let Fields = fs.readdir(
//     path.resolve(__dirname, "access"),
//     (err, files) => {
//       if (err) {
//         reject(err);
//         return;
//       } else {
//         files.map((file) => {
//           return file.split(".").slice(0, -1).join(".");
//         });
//       }
//     }
//   );
//   resolve(Fields);
// });
//--------------------------------------------------------
//EXAMPLE 2
// fs.promises.readdir(process.cwd())

//     // If promise resolved and
//     // data are fetched
//     .then(filenames => {
//         for (let filename of filenames) {
//             console.log(filename)
//         }
//     })

//     // If promise is rejected
//     .catch(err => {
//         console.log(err)
//     })