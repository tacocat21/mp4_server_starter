var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
	name: {
		type:String,
		required:true },
	description: {type:String,
				  required: false},
	deadline: {type:Date,
				required: true},
	completed: {type:Boolean, default:false},
	//id
	assignedUser: {type: String, required:true},
	//name
	assignedUserName: {type: String, required:true},
	dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Task', TaskSchema);