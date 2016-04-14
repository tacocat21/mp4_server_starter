var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
	name: {
		type:String,
		required:true },
	description: {type:String,
				  required: false},
	deadline: {type:Date,
				required: false},
	completed: {type:Boolean, default:false},
	assignedUser: {type: String, required:false, default:""},
	assignedUserName: {type: String, required:false, default:"unassigned"},
	dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Task', TaskSchema);