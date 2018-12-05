import {CREATED, BAD_REQUEST, UNAUTHORIZED} from 'http-status-codes';
import * as loki from 'lokijs';
import * as express from 'express';
import * as basic from 'express-basic-auth';

let server = express();
server.use(express.json());

const port = 8000;

let title = "Weihnachtsfeier";
let location = "Naarn im Machlande";
let date = new Date(2018, 11, 25);

/*localhost:8000/party*/ 
server.get("/party", function(request, recieve){
  recieve.send({
    title: title,
    location: location,
    date: date
  });
});

let db = new loki("loki.json");
let guest = db.addCollection("guests");

server.get("/guests", function(request, recieve){
  recieve.send(guest.find());
});

server.post("/register", function(request, recieve){
  if(request.body.firstName || request.body.lastName){
    if(guest.count() >= 10){
      recieve.status(UNAUTHORIZED).send("Maximum amount of guests is already here");
    }else{
      const newDoc = guest.insert({firstName: request.body.firstname, lastName: request.body.lastName});
      recieve.status(CREATED).send("Guest succesfully created");
    }
  }else{
    recieve.status(BAD_REQUEST).send("Please insert your first- and lastname");
  }
});

server.listen(port, function(){
  console.log("API is listening on port ", [port])
});