console.log('app.js')


//require('dotenv').config();
// Hide secret data with nconf
var nconf = require('nconf');
 
nconf.argv().env().file({ file: './project-blog-1150/config.json' });

const DB_USER = nconf.get("DB_USER");
const DB_PASSWORD = nconf.get("DB_PASSWORD");
const APP = nconf.get("DB_PASSWORD");
const STR1 = nconf.get("MONGODB_STR1");
const STR2 = nconf.get("MONGODB_STR2")
const STR3 = nconf.get("MONGODB_STR3")
const PORT = nconf.get("PORT");
const JWT_KEY = nconf.get("JWT_KEY");


const MONGODB_URI = 
	STR1+ 
	DB_USER+ ":" +
	DB_PASSWORD +
	STR2 +
	APP +
	STR3
;

module.exports = MONGODB_URI;

console.log("PORT: "+ PORT)
console.log("MONGODB_URI: "+ MONGODB_URI)

require('./config/mongo');
const express = require('express');

// require('dotenv').config();
// const PORT = process.env.PORT;
const routes = require('./routes');
const cors = require('cors');
// To understand what cors, cross-origin resource sharing, does, see:
// https://medium.com/@baphemot/understanding-cors-18ad6b478e2b

const app = express();

// require('./config/mongo');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));

// TEST ONLY: check GET / HTTP method works
app.get('/',(req, res)=>{
	res.json({ "message":
		"Test response to app.get('/'... in app.js Hello 1150 is a new rest api project"
	})
});

app.use('/posts', routes.post);
app.use('/author', routes.author);

app.use((err, req, res, next) => res.sendStatus(404).send("No middleware or routes found to execute!"));



app.listen(
	process.env.PORT,
	() => console.log(`Server started on port ${process.env.PORT}`)
);

console.log('app.js DONE')
