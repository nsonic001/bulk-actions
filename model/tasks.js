const mongoose = require('mongoose');
const __ = require('underscore');
const uuidv1 = require('uuid/v1');
const connection = config.db_conn;

var TaskSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    match: /^[a-f0-9\-]{36}/
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  modified: {
    type: Date,
    required: true,
    default: Date.now
  }
});

TaskSchema.pre('save', (next) => {
  if (this.isNew) {
    this.created = Date.now();
    this.modified = Date.now();
  }
  this.modified = Date.now();
  next();
});

TaskSchema.pre('update', (next) => {
  this.modified = Date.now();
  next();
});

var TaskModel = connection.model('tasks', TaskSchema);

module.exports = {
  create: (user) => {
    return new Promise(
      (resolve, reject) => {
        let task = new TaskModel({
          user_id: user.id
        });
        task.save(function(err, data) {
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        });
      }
    );
  },
  find: (id) => {
    return new Promise(
      (resolve, reject) => {
        TaskModel.findById(id, function(err, data) {
          console.log("in find", err, data);
          if (!err) {
            if (data)
              resolve(data);
            else {
              reject(data);
            }
          } else {
            reject(err);
          }
        });
      }
    );
  }
}