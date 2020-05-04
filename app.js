console.log('app.js')

const express = require('express');
// require('dotenv').config();
// const PORT = process.env.PORT;
const routes = require('./routes');
const cors = require('cors');
// To understand what cors, cross-origin resource sharing, does, see:
// https://medium.com/@baphemot/understanding-cors-18ad6b478e2b

const app = express();

require('./config/mongo');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));

// TEST ONLY: check GET / HTTP method works
app.get('/',(req, res)=>{
	res.json({
		"Test response to app.get('/'... in app.js ": "Hello 1150 is a new rest api project"
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
