
// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Llama = require('./models/llama');
var User = require('./models/user');
var Task = require('./models/task');
var bodyParser = require('body-parser');
var router = express.Router();


//replace this with your Mongolab URL
mongoose.connect('mongodb://tyamamo2:tyamamo2@ds025449.mlab.com:25449/mp4_db');
//what am I supposed to do?

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);
 
// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});


//Add more routes here
var userRoute = router.route('/users');
	
userRoute.get(function(req, res){
	//implement query stuff
	var query = {};
	var sort = {name : 1}
	var select = {};
	var skip = 0;
	var limit = 0;
	var skip =0;
	var count= false;
	var request= req.query;
	if(request.where){
		query= JSON.parse(request.where);
		//console.log(request.where);
		
	}
	if(request.sort){
		sort = JSON.parse(request.sort);
	}
	if(request.select){
		select= JSON.parse(request.select);
	}
	if(request.skip){
		skip=request.skip;
	}
	if(request.limit){
		limit=request.limit;
	}
	if(request.count){
		count = request.count;
	}
	if(count){
	User.find(query).select(select).sort(sort).skip(skip).limit(limit).count(function(err, result){
		if(err||!result.length){
			res.status(404).json({message: "No users in database", data: []});
		}
		else{
			res.status(201).json({message: "OK", data: result});
		}
	});
	}
	else{
	User.find(query,function(err, result){
		if(err || !result.length){
			res.status(404).json({message: "No users in database", data: []});
		}
		else{
			res.status(201).json({message: "OK", data: result});
		}
	}).select(select).sort(sort).skip(skip).limit(limit);
	}
});

userRoute.post(function(req, res){
	if(!req.body.name&&!req.body.email){
		res.status(500).json({message:"Validation Error: A name is required! An email is required!", data:[]});
		return;
	}
	if(!req.body.email){
		res.status(500).json({message:"Validation Error: An email is required!", data:[]});
		return;
	}
	if(!req.body.name){
		res.status(500).json({message:"Validation Error: A name is required!", data:[]});
		return;
	}
	var user = new User();
	user.name = req.body.name;
	user.email= req.body.email;
	user.pendingTasks = req.body.pendingTasks;
	user.dateCreated = new Date();

	user.save(function(err){
		if(err){
			res.status(500).json({message:"Unable to save user", data:[]});
		}	
		else{
			res.status(200).json({message:"User created", data: user});	
		}
	});
//	res.json({message: "finished"});
});

userRoute.options(function(req, res){
      res.writeHead(200);
      res.end();
});

var userRouteId = router.route('/users/:userId');

userRouteId.get(function(req, res){
	User.findById(req.params.userId, function(err, users){
		if(err||!users){
			res.status(404).send({message: "User not found", data: []});
		}
		else{
			res.status(200).json({message: "OK", data: users});
		}
	})
});
userRouteId.put(function(req, res){
	User.findById(req.params.userId, function(err, users){
		if(err||!users){
			res.status(404).send({message: "User not found", data: []});
		}
		else{
			users.name= req.body.name;
			users.email=req.body.email;
			users.pendingTasks = req.body.pendingTasks;
			//users.dateCreated = new Date();
			users.save(function(err){
				if(err)
					res.status(500).json({message:"Unable to save user", data:[]});
				res.status(200).json({message: "OK", data: users});

			});
		}
	})
});
userRouteId.delete(function(req, res){
	User.remove({_id: req.params.userId}, function(err){
		if(err){
			res.status(404).send({message: "User not found", data: []});
		}
		else{
			res.status(200).json({message: "User deleted", data: [] });
		}
	});
});

var taskRoute = router.route('/tasks');	

taskRoute.get(function(req, res){
	var query = {};
	var sort = {name : 1}
	var select = {};
	var skip = 0;
	var limit = 0;
	var skip =0;
	var count= false;
	var request= req.query;
	if(request.where){
		query= JSON.parse(request.where);
	}
	if(request.sort){
		sort = JSON.parse(request.sort);
	}
	if(request.select){
		select= JSON.parse(request.select);
	}
	if(request.skip){
		skip=request.skip;
	}
	if(request.limit){
		limit=request.limit;
	}
	if(request.count){
		count = request.count;
	}
	if(count){
	Task.find(query).select(select).sort(sort).skip(skip).limit(limit).count(function(err, result){
		if(err){
			res.status(404).json({message: "No users in database", data: []});
		}
		else{
			res.status(200).json({message: "OK", data: result});
		}
	});
	}
	else{
	Task.find(query,function(err, result){
		if(err){
			res.status(404).json({message: "No users in database", data: []});
		}
		else{
			res.status(200).json({message: "OK", data: result});
		}
	}).select(select).sort(sort).skip(skip).limit(limit);

	}
});

taskRoute.post(function(req, res){

	var task = new Task();
//	console.log("gg");
	task.name = req.body.name;
	task.description= req.body.description;
	task.deadline = req.body.deadline;
	task.completed = req.body.completed;
	task.assignedUser = req.body.assignedUser;
	task.assignedUserName = req.body.assignedUserName;
	
	
	task.save(function(err, result){
		if(err){
			res.status(500).json({message: "Unable to save task", data:[]});

		}	
		else{
			res.status(200).json({message:"OK",data:result})
		}
	});
});

taskRoute.options(function(req, res){
	res.writeHead(200);
	res.end();
});

var taskRouteId = router.route('/tasks/:id');	
taskRouteId.get(function(req, res){
	Task.findById(req.params.id, function(err, tasks){
		if(err||!tasks){
			res.status(404).send({message: "Task not found", data: []});
		}
		else{
			res.status(200).json({message: "OK", data: tasks});
		}
	});
});

taskRouteId.put(function(req, res){
	Task.findById(req.params.id, function(err, task){
		if(err||!task){
//			res.status(500).send(err);
			res.status(404).send({message: "Unable to save task", data: []});
		}
		else{
			task.name= req.body.name;
			task.description=req.body.description;
			task.deadline = req.body.deadline;
			task.completed = req.body.completed;
			task.assignedUser = req.body.assignedUser;
			task.assignedUserName = req.body.assignedUserName;
			task.save(function(err){
				if(err)
					res.status(500).json({message: "Unable to find task", data:[]});
				res.status(200).json({message: "OK", data: task});
			});

		}
	});
});

taskRouteId.delete(function(req,res){
	
	Task.remove({_id: req.params.id}, function(err, result){
		if(err||!result.data){
			res.status(404).send({message: "User not found", data: []});
		}
		else{
			res.status(200).json({message: "OK", data: [] });
		}
	});
});

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
