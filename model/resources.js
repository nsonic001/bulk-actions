const mongoose = require('mongoose');
const __ = require('underscore');
const connection = config.db_conn;
const helpers = require('./helpers');

const STATUS = {
  success: 'SU',
  failed: 'FA',
  registered: 'RE'
};
const ACTIONS = config.employer.actions;

const ENTITY = config.entity

const ResourceSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tasks' },
  resource_id: {
    type: String,
    required: true,
    trim: true
  },
  resource_type: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: __.values(STATUS)
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
  },
  error: {
    type: String
  },
  token: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: __.values(ACTIONS)
  },
  entity: {
    type: String,
    required: true,
    enum: __.values(ENTITY)
  },
});

ResourceSchema.pre('save', (next) => {
  if (this.isNew) {
    this.created = Date.now();
    this.modified = Date.now();
  }
  this.modified = Date.now();
  next();
});

ResourceSchema.post('save', (doc) => {
  console.log("called resource post save", doc.status, doc);
  if (doc.status === STATUS.registered) {
    helpers[doc.entity][doc.action](doc).then(
      data => {
        ResourceModelActions.markSuccess(doc._id);
      }
    ).catch(
      err => {
        ResourceModelActions.markError(doc._id, err);
      }
    );

  }
});

ResourceSchema.pre('update', (next) => {
  this.modified = Date.now();
  next();
});

var ResourceModel = connection.model('resources', ResourceSchema);

var markStatus = (resource_id, status, error, callback) => {
  return new Promise(
    (resolve, reject) => {
      var update_obj = { status: status };
      if (error) {
        update_obj.error = error;
      }
      console.log("mark STATUS", update_obj);
      ResourceModel.update({ resource_id: resource_id }, { $set: update_obj }, function(err, data) {
        console.log("mark status complete", err, data);
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    }
  );
};

var ResourceModelActions = {
  create: (task_id, resource_id, token, action, entity, resource_type) => {
    console.log("resource created start");
    return new Promise(
      (resolve, reject) => {
        let task = new ResourceModel({
          task_id: task_id,
          resource_id: resource_id,
          token: token,
          resource_type: resource_type,
          action: action,
          entity: entity,
          status: STATUS.registered
        });
        task.save(function(err, data) {
          console.log("resource created", err, data);
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        });
      }
    );
  },
  markSuccess: (resource_id) => {
    console.log("mark success", resource_id);
    return markStatus(resource_id, STATUS.success, null);
  },
  markError: (resource_id, error) => {
    console.log("mark Error ", resource_id, error);
    if (error && typeof(error) === 'object') {
      try {
        error = JSON.stringify(error);
      } catch (e) {
        console.error("Error while stringify error object");
        error = error.toString();
      }
    }
    return markStatus(resource_id, STATUS.failed, error);
  },
  find: (task_id) => {
    return new Promise(
      (resolve, reject) => {
        ResourceModel.find({ task_id: task_id }, function(err, data) {
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        });
      }
    );
  },
}

module.exports = ResourceModelActions;