const { resolve } = require("path");
const { createReadStream } = require("fs");
const Endpoints = require("./Endpoints");
const OwOError = require("./OwOError");
const request = require("superagent");
const Promise = require("bluebird");

class OwOClient {
  constructor(key) {
    this.key = key;
  }

  upload(path) {
	let files = (path instanceof Array) ? path : new Array(path)
	for(let index in files){
		files[index] = createReadStream(files[index]);
	}
    return new Promise((resolve, reject) => {
      const req = request.post(Endpoints.upload(this.key))
        .field("files[]", files)
        .end((err, res) => {
          if (err) return void reject(new OwOError(err.message, req, res));
          resolve(res.body);
        });
    });
  }

  shorten(url) {
    return new Promise((resolve, reject) => {
      const req = request.get(Endpoints.shorten(this.key, url))
        .end((err, res) => {
          if (err) return void reject(new OwOError(err.message, req, res));
          resolve(res.text);
        });
    });
  }
}

module.exports = OwOClient;