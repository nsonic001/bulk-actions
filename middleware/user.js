const RecruitService = require('./../service/recruit');
module.exports = {
  authorize: (req, res, next) => {
    var token = req.headers['authorization'];
    console.log("req", token);
    RecruitService.getUser(token).then(
      user => {
        console.log("authorize user", user, token);
        req.user = user;
        req.token = token;
        next();
      }).catch(
      err => {
        res.status(err.statusCode || 500).json(err || {});
      }
    );
  }
}