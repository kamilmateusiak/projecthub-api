var mongoose = require('mongoose');

exports.getUserId = function (req, res) {
	if (typeof req.headers['user-id'] !== 'undefined') {
		return mongoose.Types.ObjectId(req.headers['user-id']).toString();
	}
	return '';
};