const request = require('request');

var Recruit = {
  getUser: (token) => {
    let self = this;
    console.log("config.user", config.user);
    let options = {
      uri: config.api + config.user.get,
      method: 'GET',
      timeout: 300000,
      headers: {
        'Authorization': token,
        'Accept-Language': 'en'
      }
    };
    return Recruit.sendRequest(options);
  },
  sendRequest: (options) => {
    console.log("\n\nrequest sending\n\n", options);
    console.log("\n\n\n\n");
    if (options.headers) {
      options.headers['Content-Type'] = 'application/json';
    } else {
      options.headers = { 'Content-Type': 'application/json' };
    }
    return new Promise((resolve, reject) => {
      request(options, (err, msg, response) => {

        if (err) {
          if (err.code == "ETIMEDOUT") {
            return reject(408);
          };
          return reject(err);

        } else if (msg.statusCode >= 400 && msg.statusCode < 600) {
          try {
            response = JSON.parse(response);
          } catch (e) {}
          response.statusCode = msg.statusCode;
          return reject(response);

        } else if (msg.statusCode >= 200 && msg.statusCode < 400) {
          if (!response || response == "") {
            return reject({ statusCode: 404, type: "No data found" });
          } else {
            var jsonResponse = {};
            try {
              jsonResponse = JSON.parse(response);
            } catch (e) {
              console.log("\n\n Incorrect JSON : ", response);
              return reject(422);
            }

            if (jsonResponse['error'] || jsonResponse['error_code'] || jsonResponse['error_message']) {
              return reject(jsonResponse);
            } else {
              return resolve(jsonResponse);
            }
          }
        }
      });
    });

  }
}
module.exports = Recruit;