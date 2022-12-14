const pg = require('pg');
const config = require(process.env.CONFIG_FILE_PATH);
const logger = require('../log');
const pool = new pg.Pool(config.database.nucleusDb);

pool.on('error', function(err, client) {
	// if an error is encountered by a client while it sits idle in the pool
	// the pool itself will emit an error event with both the error and
	// the client which emitted the original error
	// this is a rare occurrence but can happen if there is a network partition
	// between your application and the database, the database restarts, etc.
	// and so you might want to handle it and at least log it out
	logger.error('idle client error', err.message, err.stack);
});

//export the execute method for passing queries to the pool
module.exports.query = function(text, values, callback) {
	return pool.query(text, values, callback);
};

// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = function(callback) {
	return pool.connect(callback);
};
