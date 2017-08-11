console.log("[DB] Attempting Conenction..");
var mongoose = require('mongoose');

var db_conn = mongoose.createConnection(config.db.tasks);

console.log("[Mongo Bulk Action] Attempting Conenction..");
db_conn.on('error', console.error.bind(console, '[Mongo Bulk Action] Error: '));
db_conn.once('open', function callback() {
  console.log("[Mongo Bulk Action] Connected..");
});

if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'staging') {
  mongoose.set('debug', true);
}

config.db_conn = db_conn;

module.exports = {
  db_conn: db_conn,
};