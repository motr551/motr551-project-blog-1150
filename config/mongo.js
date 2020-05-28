console.log('./config/mongo.js')

// require('dotenv').config();

// console.log('-------------')
// console.log(process.env.MONGODB_URI);
// while ( typeof process.env.MONGODB_URI === 'undefined') {
//   console.log('wait')
//   for (let i=0; i<1000; i++)
//     if (i==999){
//       console.log(process.env.MONGODB_URI);
//       i =0;
//     }
// }

// console.log(process.env.MONGODB_URI);
// console.log('-------------')

// console.log(process.env.MONGODB_URI)

//const MONGODB_URI = require("../app.js");
//var nconf = require('nconf');

const mongoDB = process.env.MONGODB_URI;
const mongoose = require('mongoose');
//const mongoDB = nconf.get("MONGODB_URI")
//console.log(mongoDB)


mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

console.log('./config/mongo.js')
