const express = require('express');
const path = require('path');
const port =8000;

const db= require('./config/mongoose');
const Task = require('./models/task');

const app = express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded());

app.use(express.static('assets'));

var categories = ["Personal","Study","Work","Others"];

app.get('/',function(req,res){
    Task.find({},function(err,tasks){
        if(err){
            console.log('Error in fetching tasks from db');
            return;
        }

        return res.render('home',{
            task: tasks,
            category: categories
        });
    });
});

app.post('/create-task', function  (req,res){
    //Add the task in the db
    Task.create({
        name: req.body.name,
        category: req.body.category,
        dueDate: req.body.date,
        isComplete: false
    }, function(err,newTask){
        if(err){
            console.log('Error in creating task',err);
            return;
        }

        return res.redirect('back');
    });
});

app.post('/delete-task', function(req,res){
    let id = req.body.task;
    //To delete single task
    if(id.length==24){
        Task.findByIdAndDelete(id, function(err){
            if(err){
                console.log('Error in deleting an object from database');
                return;
            }
        });
        return res.redirect('back');
    }
    //To delete multiple tasks
    for (let i of id){
        Task.findByIdAndDelete(i, function(err){
            if(err){
                console.log('Error in deleting an object from database');
                return;
            }
        });
    }
    return res.redirect('back');
});

app.listen(port, function(err){
    if(err){
        console.log("Error in running the server ", err)
    }

    console.log("The express server is running on port: ",port);
})