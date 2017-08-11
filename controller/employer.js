const TaskModel = require('./../model/tasks');
const ResourceModel = require('./../model/resources');
const Service = require('./../service/employer');
module.exports = {
  getTask: (req, res, next) => {
    console.log("in getTask ",req.params.id);
    var task_id = req.params.id;
    TaskModel.find(task_id).then(
      data => {
        return ResourceModel.find(task_id);
      }
    ).then(
      data => {
        res.status(200).json(data);
      }
    ).catch(
      err => {
        console.log("task not found", err);
        var status = 404;
        if (err)
          status = 500;
        res.status(status).json(err || {});
      }
    );
  },
  markAbsent: (req, res, next) => {
    console.log("in mark_absent");
    var application_ids = req.body.application_ids;
    if (!application_ids || !Array.isArray(application_ids) || application_ids.length <= 0) {
      res.status(500).json({
        'application_ids': 'required'
      });
    } else {
      console.log("calling mark_absent service");
      Service.mark_absent(req.user, req.token, application_ids).then(
        data => {
          console.log("mark_absent task created", data);
          res.status(200).json(data);
        }).catch(
        err => {
          res.status(500).json(err || {});
        }
      );
    }

  }
}