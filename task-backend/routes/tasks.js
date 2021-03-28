const express = require('express');
const router = express.Router();
const Tasks = require("../models/task");
const multer = require('multer');
const verifyToken = require("./verifyToken.js");
var url = require('url');
var fs = require('fs');
const path = require('path');

//multer upload code==
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now()+'-' + file.originalname)
  }
});
const upload = multer({ storage: storage });


/* GET all task listing. */
router.get('/',verifyToken, function(req, res, next) {
  var perPage = 5;
  var page = req.param('page');
  var userId = req.param('userId');
  var query_search = {}
  var ObjectID = require("mongodb").ObjectID
  if(userId){
    //adds an object if userId exists
    query_search.userId = ObjectID(userId)  
  }
  var skip = '';
  if(!page) {
    page = 1;
  }else if(page > 1){
    skip = perPage * (page-1)
  }
  // console.log(query_search);
  Tasks.find()
  .lean()
  .limit(perPage)
  .skip(skip)
  .sort({
      creationDate: 1
  })
  .exec()
  .then(tasks => {  
  Tasks.count().exec(function (err, count) {
    if (!tasks)
      return res.json({
        success: false,
        message: "tasks could not be found."
      });
      //map to append server link to doc name
      tasks.map(function (obj) { 
        obj.docUrl  = 'http//'+ req.hostname+':'+process.env.PORT +'/'+ obj.document ;
      });
    return res.json({ success: true, tasks, current_page: page,last_page: Math.ceil(count/perPage), total_pages:Math.ceil(count/perPage), total: count, per_page: perPage,first_page_url:"",from:"",last_page_url:"",next_page_url:"",path:"",prev_page_url:"",to:"" });
  })
})
  .catch(err => {
    console.log(err);
    return res.json({ success: false, message: "tasks could not be found." });
  });
});

//create a new task and authorize token
router.post('/createTask',verifyToken, upload.single('filename'), (req, res, next) => {
  var doc_name = "";
  if(req.file){
      doc_name =  req.file.filename;
  }
  var obj = {
      taskName: req.body.taskName,
      creationDate: new Date(),
      document:  doc_name,
      subtasks : req.body.subtasks,
      userId : req.body.userId,
      remark : req.body.remark,
      taskStatus : "Pending"
  }
  Tasks.create(obj, (err, item) => {
    console.log(obj);
      if (err) {
          console.log(err);
      }
      else {
          item.save();
          res.json({
            success: true,
            message: "Task created successfully."
          });
      }
  });
});

//doc upload
router.post('/uploadDoc',verifyToken,upload.single('filename'), (req, res, next) => {
  var doc_name = "";
  if(req.file){
     doc_name = 'http//'+ req.hostname+':'+process.env.PORT +'/'+ req.file.filename;
    // doc_name = fs.readFileSync(path.join(__dirname + '/public/' + req.file.filename));
  }
    res.json({
      success: true,
      message: "Doc uploaded successfully.",
      doc_name 
    });
});


//update status of task
router.post("/updateTaskStatus", (req, res) => {
  var ObjectID = require("mongodb").ObjectID
  Tasks.find({ '_id': ObjectID(req.body.taskId)}, function (err, docs) {
    console.log(docs);
    if (docs && docs !== undefined && docs.length !== 0) {
      taskId = docs[0]._id;
    }
    if (taskId !== undefined) {
      Tasks.update({_id: ObjectID(req.body.taskId)}, { taskStatus: req.body.status}, {}, function (err, task) {
        console.log('task', task);
        if (err !== null) {
          console.log(err);
          return res.json({
            success: false,
            message: err
          });
        }
        return res.json({ success: true, task: task });
      });

    } else {
      return res.json({ success: false, message: "No task found" });s
    }
  });
});

//fetch data for the chart 
router.get('/fetchGraphData', (req, res )=>{
  var date = new Date();
  //current month start date and end date
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  // console.log(firstDay, lastDay);
  Tasks.aggregate([
    { $match : { "creationDate" : { $gte: new Date(firstDay), $lt: new Date(lastDay)} } },
    {
      $group:
      {
          _id:
          {
              day: { $dayOfMonth: "$creationDate" },
              month: { $month: "$creationDate" }, 
              year: { $year: "$creationDate" }
          }, 
          count: { $sum:1 },
          date: { $first: "$creationDate" }
      }
  },
  {
      $project:
      {
          date:
          {
              $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          count: 1,
          _id: 0
      }
  }
  ], function(err, tasksBydate) {
    // console.log(tasksBydate);
    res.send(tasksBydate)
  });
})

module.exports = router;
