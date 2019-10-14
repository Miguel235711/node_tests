const express = require('express');
//import models from './models'
const mongo = require('mongodb');
const assert = require('assert');
//import models, { connectDb } from './models';
//const models,{connectDB} = require('./models');
const app = express();
const person = require('./models/person.js');
//const router = express.Router();

app.set('view engine','ejs');///ejs view engine
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/insertPerson',function(req,res){
    /*mongo.connect(myURL,(err,db)=>{
        assert.equal(null,err);
        var cursor = db.collection('user-data').find();
        cursor.forEach((doc,err)=>{
            assert(null,err);
            console.log('answer'+doc);
        });
        /*console.log('connection successfully stablished');
        db.collection('user-data').insertOne(req.body,(err,result)=>{
            asssert.equal(null,error);  
            db.close();
        });     
    });*/
    ///push in data base collection user_data
    var newPerson = new person({name:req.body.name,age:req.body.age});
    person.findOne({name:newPerson.name},(err,alreadyInsidePerson)=>{
        if(err){
            console.log('internal error, person will not be pushed');
            res.status(500).send('internal error, person will not be pushed');
        }else{
            if(!alreadyInsidePerson){
                console.log('good to push');
                newPerson.save((err)=>{
                    if(err){
                       console.log('ERROR!!!:'+err); 
                    }else{
                        console.log('succesfully added');
                    }
                });
                console.log("request processed");
                res.send("Success");
            }else{
                console.log('repeated one');
                res.status(500).send('repeated one');
                //res.send('repeated');
            }
        }
    });
});
app.delete('/api/deletePerson',(req,res)=>{///receive name in body
    console.log('Debugging '+req.body.name);
    person.findOne({name:req.body.name},(err,foundPerson)=>{
        if(err){
            ///internal error 
            console.log('internal error, while searching person with name" '+req.body.name);
            res.status(500).send('internal error, while searching person with name" '+req.body.name);
        }else{
            ///no internal error so far
            if(!foundPerson){
                ///person no found
                console.log('person no found');
                res.status(500).send('person no found');
            }else{
                ///person found, erase it
                person.deleteOne({name:req.body.name},(err)=>{
                    if(err){
                        console.log('internal error, while deleting person with name'+req.body.name);
                    }else{
                        res.send("Success");
                    }
                });
            }
        }
    });
});
///Load View Engine 
///Home route
app.get('/',function(req,res){
    //res.render('test.ejs',{name:'miguel',age:19});
    ///retrieve data from data base
    person.find({},(err,allPeople)=>{
        if(err){
            console.log('error retrieving data base');
            res.type('html').status(500);
            res.send('Error:'+err);
        }else{ 
            if(allPeople.length==0){
                console.log('No people initially');
            }
            ///render
            res.render('test.ejs',{people:allPeople});
        }
    });
});

///start server
app.listen(3000,function(){
    console.log('Server started on port 3000');
});

///connect to Mongo DB database
/*connectDb().then(async () => {
    ///clear data base content
    await Promise.all([
        models.person.deleteMany({})
    ]);
    ///listen to data base port
    app.listen(process.env.PORT, () =>
      console.log(`Example app listening on port ${process.env.PORT}!`),
    );
});*/
