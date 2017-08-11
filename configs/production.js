var config = {
  "host": "http://bulk-action-staging.aasaanjobs.com",
  "db": {
    "tasks": "mongodb://aasaan123:aasaan123@ds033673-a0.mongolab.com:33673,ds033673-a1.mongolab.com:33673/bulk-action-staging?replicaSet=rs-ds033673",
  },
  "redis": {
    "host": "127.0.0.1",
    "db": 2,
    "port": 6379
  },
  "api": "https://api.aasaanjobs.com"
};

module.exports = config;