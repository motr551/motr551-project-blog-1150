console.log('./routes/authors.js')

require('dotenv').config();
const { verifyToken } = require('../middlewares/verifyToken');
const models = require('../models');
const validateInput = require('../middlewares/validateInput');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// TEST ONLY: GET '/' = '/author' (just to test api)
// router.get('/', (req, res)=>{
// 	res.json({
// 		"Test response to router.get('/'... in ./routes/author.js": "RestClient req: get /author/"
// 	})
// });


// TEST ONLY: get /author/logintest (just to test api)
router.get('/logintest', (req, res)=>{
	res.json({
		"TEST response to router.get('/logintest'... in ./routes/author.js": "RestClient req: GET /author/logintest"
	})
});

// Test post /author/logintest
router.post('/logintest', (req, res, next)=>{
	res.json({
		"TEST response to router.post('/logintest'... in ./routes/author.js": "RestClient req: POST /author/logintest"
	})
})

// POST '/register' = '/author/register'
router.post('/register', validateInput.validateAuthor, (req,res,next)=>{

	console.log("router.post('/register'")
	// Read new author data: username, password etc
	
	// "req.body.firstName": req.body.firstName,
	// "req.body.lastName": req.body.lastName,
	// "req.body.introduction": req.body.introduction,
	// "req.body.username": req.body.username,
	// "req.body.password": req.body.password
	
	// check if author already in Database
	models.Author.findOne({ 'username': req.body.username })
	.exec(function (err, author) {
		if (err) {
			return res.status(500);
		}
		if (req.errors) {
			return res.json({"Input Error": req.errors});
		}
		if (!author) {
			// As author not present, save/Register new author details

			// CREATE HASH PASSWORD
			bcrypt.hash(req.body.password, 10, function (hashPasswordCreateErr, hashedpassword) {
				if (hashPasswordCreateErr) {
					// original return res.sendStatus('500');
					return res.json({"err3": "router.put('/', verifyToken, val..Author,()=>)", "hashPasswordCompareErr": hashPasswordCompareErr});
				}
				// CREATE author Data model 
				const author = new models.Author({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					introduction: req.body.introduction,
					username: req.body.username,
					password: hashedpassword,
					// IT WILL HAVE NEW ID. Hence, this is not necessary: _id: authorDecoded.author._id,
				});
				// SAVE author in Database
				author.save(function (err) {
					if (err) {
						// original: return res.sendStatus('500');
						return res.json({"err4": "router.put('/', verifyToken, val..Author,()=>)"});
					};
					//res.redirect(`${req.baseUrl}/`);
					return res.json({
						"author.firstName": author.firstName,
						"author.lastName": author.lastName,
						"author.introduction": author.introduction,
						"author.username": author.username,
						"author.password": author.password
					
					});
				});
			});
		} else {
				// If author exists & password match, sign token
				bcrypt.compare(req.body.password, author.password, function (err, match) {
					if (!match) {
						return res.sendStatus(403).send("Usernam/Password did not match");
					}
					jwt.sign({ author }, process.env.JWT_SECRET_KEY, { expiresIn: 600 }, function (err, token) {
						res.json({
							"Registration": "NOTE! NOT NECESSARY AS USER EXISTS",
							"author.username": author.username,
							token
						});
					});
				});
		};		
	});
});		
	

	

// POST '/login' = '/author/login' and sign jsonWebToken
router.post('/login', (req, res, next)=>{
	// res.json({
	// 	"post test": "router.post /login worked"
	// })
	models.Author.findOne({ 'username': req.body.username, }).exec(function (err, author) {
		if (err) {
			return res.status(500);
		}
		if (!author) {
			return res.sendStatus(403);
		}
		bcrypt.compare(req.body.password, author.password, function (err, match) {
			if (!match) {
				return res.sendStatus(403).send("Usernam/Password did not match");
			}
			jwt.sign({ author, }, process.env.JWT_SECRET_KEY, function (err, token) {
				res.json({
					
					token
				});
			});
		});
	});	
})


// GET '/' = '/author'
router.get('/', verifyToken, function (req, res, next) {
	if (!req.token) {
		models.Author.findOne({}, 'firstName lastName introduction').exec(function (err, author) {
			if (err) {
				return res.sendStatus('500');
			}
			if (!author) {
				return res.sendStatus('404');
			}
			return res.json(author);
		});
		return;
	}

	jwt.verify(req.token, process.env.JWT_SECRET_KEY, function (err, authorDecoded) {
		if (err) {
			// original:return res.sendStatus('403');
			return res.json({"err1": "router.get('/', verifyToken,()=>)", authorDecoded});
		}
		models.Author.findById(authorDecoded.author._id).exec(function (err, author) {
			if (err) {
				// original: return res.sendStatus('500');
				return res.json({"err2": "router.get('/', verifyToken,()=>)"});
			}
			if (!author) {
				// original: return res.sendStatus('403');
				return res.json({"err3": "router.get('/', verifyToken,()=>)"});
			}
			return res.json(authorDecoded);
		});
	});
});

/** There are no need to CREATE author
router.post('/', function (req, res, next) {
	bcrypt.hash(req.body.password, 10, function (err, hashedpassword) {
		if (err) {
			return res.sendStatus('500');
		}
		const author = new models.Author({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			introduction: req.body.introduction,
			username: req.body.username,
			password: hashedpassword,
		});

		author.save(function (err) {
			if (err) {
				return res.status('500').send('Oops!');
			}
			res.redirect(`${req.baseUrl}/`);
		});
	});
});
*/

// TEST: put '/puttest' = '/author/puttest,
router.put('/puttest',(req, res)=>{
	let body = req.body;
	res.json({
		"request": "router.put /puttest",
		"req.body": req.body,
		"req.headers['authorization']": req.headers['authorization'],
		"req.params": req.params,
		"req.query": req.query
	})
})



// PUT '/' = '/author'. That is UPDATE author info
router.put('/', verifyToken, validateInput.validateAuthor, function (req, res, next) {
	jwt.verify(req.token, process.env.JWT_SECRET_KEY, function (err, authorDecoded) {
		if (err) {
			// original: return res.sendStatus('403');
			return res.json({"err1": "router.put('/', verifyToken, val..Author,()=>)", "err": err});
		}
		if (req.errors) {
			// original: return res.status('422').json(req.errors);
			return res.json({"err2": "router.put('/', verifyToken, val..Author,()=>)", "req.errors": req.errors});
		}
		bcrypt.hash(req.body.password, 10, function (hashPasswordCreateErr, hashedpassword) {
			if (hashPasswordCreateErr) {
				// original return res.sendStatus('500');
				return res.json({"err3": "router.put('/', verifyToken, val..Author,()=>)", "hashPasswordCompareErr": hashPasswordCompareErr});
			}

			const author = new models.Author({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				introduction: req.body.introduction,
				username: req.body.username,
				password: hashedpassword,
				_id: authorDecoded.author._id,
			});

			models.Author.findByIdAndUpdate(authorDecoded.author._id, author, {}, function (err, updatedAuthor) {
				if (err) {
					// original: return res.sendStatus('500');
					return res.json({"err4": "router.put('/', verifyToken, val..Author,()=>)"});
				}
				//res.redirect(`${req.baseUrl}/`);
				res.json({
					"updatedAuthor.firstName": updatedAuthor.firstName,
					"updatedAuthor.lastName": updatedAuthor.lastName,
					"updatedAuthor.introduction": updatedAuthor.introduction,
					"updatedAuthor.username": updatedAuthor.username,
					"updatedAuthor.password": updatedAuthor.password
				
				});
			});
		});
	});
});

module.exports = router;

console.log('./routes/authors.js DONE')
