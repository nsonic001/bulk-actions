const TaskModel = require('./../model/tasks');
const ResourceModel = require('./../model/resources');
const RecruitService = require('./../service/recruit');
const __ = require('underscore');
module.exports = {
  mark_absent: (user, token, application_ids) => {
    // console.log("in mark_absent service", user, token, application_ids);
    return new Promise(
      (resolve, reject) => {
        // console.log("in mark_absent service", user, token, application_ids);
        TaskModel.create(user).then(
          data => {
            console.log("task created", data.toObject({ getters: true, virtuals: false })._id);
            var task_id = data.toObject({ getters: true, virtuals: false })._id;
            var promises = [];
            console.log("hereeeeeee 0 : ", task_id);
            __.each(application_ids, function(id) {
              console.log("in underscore each", id);
              promises.push(ResourceModel.create(task_id, id, token, config.employer.actions.mark_absent, config.entity.employer, 'application'));
            });
            console.log("hereeeeeee", task_id);
            Promise.all(promises).then(resources => {
              console.log("all resources registered");
            });
            console.log("task resolve", task_id);
            resolve({ task_id: task_id, application_ids: application_ids });
          }).catch(
          err => {
            reject(err);
          }
        );
      }
    );
  },
}