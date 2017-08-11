const RecruitService = require('./../service/recruit');
const ENTITY = config.entity;
const ER_ACTION = config.employer.actions;
module.exports = {
  ER: {
    MA: (resource) => {
      console.log("mark absent resource", resource);
      return new Promise((resolve, reject) => {
        let self = this;
        let resource_doc = resource.toObject({ getters: true, virtuals: false });
        let options = {
          uri: config.api + config.employer.end_points.application + resource_doc.resource_id + config.employer.end_points.mark_absent,
          method: 'PATCH',
          timeout: 300000,
          headers: {
            'Authorization': resource_doc.token,
            'Accept-Language': 'en'
          },
          body: JSON.stringify({})
        };
        RecruitService.sendRequest(options).then(
          data => {
            console.log("mark absent success");
            resolve(data);
          }).catch(
          err => {
            console.log("mark absent failed");
            reject(err);
          }
        );
      });
    }
  }
}