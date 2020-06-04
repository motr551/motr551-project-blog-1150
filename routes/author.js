console.log('./routes/authors.js')

//require('dotenv').config();
const {JWT_SECRET_KEY} = require("../config/envconf.js")
const { verifyToken } = require('../middlewares/verifyToken');
const models = require('../models');
const validateInput = require('../middlewares/validateInput');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// TEST ONLY: get /author/logintest (just to test api)
router.get('/logintest', (req, res)=>{
	res.json({
		"getTestResponse": "RestClient req: GET /author/logintest"
	})
});

// Test post /author/:logintest
router.post('/:readwrite/logintest', (req, res, next)=>{
	res.json({
	"req.body =": req.body,
	"request.headers =" : req.headers,
	"req.params=" : req.params,
	"req.query =" : req.query,
	})
})

// Test post /author/registration
router.post("/registration", validateInput.validateAuthor, (req, res, next)=>{
	
	// used for testing only
	//**************

	// res.json({
	// "req.body =": req.body,
	// "request.headers =" : req.headers,
	// "req.params=" : req.params,
	// "req.query =" : req.query,
	// })

	// check if author already in Database
	models.Author.findOne({ 'username': req.body.username })
	.exec(function (err, author) {
		if (err) {
			return res.status(500).send('Internal Server Error: Retry or call support');
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
						"Registration": "New Account",
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
					// jwt expires in 60*60*24*3 3days
					// or expiresIn: '3d'
					jwt.sign({ author }, process.env.JWT_SECRET_KEY, { expiresIn: 60*60*24*3 }, function (err, token) {
						res.json({
							"Registration": "NOTE! NOT NECESSARY AS USER EXISTS",
							"author.username": author.username,
							token,
							"tokenValidity" : "3 days"
						});
					});
				});
		};		
	});	
})


// POST '/register' = '/author/register'
// router.post('/register', validateInput.validateAuthor, (req,res,next)=>{

// 	console.log("router.post('/register'")
		
// 	// check if author already in Database
// 	models.Author.findOne({ 'username': req.body.username })
// 	.exec(function (err, author) {
// 		if (err) {
// 			return res.status(500);
// 		}
// 		if (req.errors) {
// 			return res.json({"Input Error": req.errors});
// 		}
// 		if (!author) {
// 			// As author not present, save/Register new author details

// 			// CREATE HASH PASSWORD
// 			bcrypt.hash(req.body.password, 10, function (hashPasswordCreateErr, hashedpassword) {
// 				if (hashPasswordCreateErr) {
// 					// original return res.sendStatus('500');
// 					return res.json({"err3": "router.put('/', verifyToken, val..Author,()=>)", "hashPasswordCompareErr": hashPasswordCompareErr});
// 				}
// 				// CREATE author Data model 
// 				const author = new models.Author({
// 					firstName: req.body.firstName,
// 					lastName: req.body.lastName,
// 					introduction: req.body.introduction,
// 					username: req.body.username,
// 					password: hashedpassword,
// 					// IT WILL HAVE NEW ID. Hence, this is not necessary: _id: authorDecoded.author._id,
// 				});
// 				// SAVE author in Database
// 				author.save(function (err) {
// 					if (err) {
// 						// original: return res.sendStatus('500');
// 						return res.json({"err4": "router.put('/', verifyToken, val..Author,()=>)"});
// 					};
// 					//res.redirect(`${req.baseUrl}/`);
// 					return res.json({
// 						"author.firstName": author.firstName,
// 						"author.lastName": author.lastName,
// 						"author.introduction": author.introduction,
// 						"author.username": author.username,
// 						"author.password": author.password
					
// 					});
// 				});
// 			});
// 		} else {
// 				// If author exists & password match, sign token
// 				bcrypt.compare(req.body.password, author.password, function (err, match) {
// 					if (!match) {
// 						return res.sendStatus(403).send("Usernam/Password did not match");
// 					}
// 					jwt.sign({ author }, process.env.JWT_SECRET_KEY, { expiresIn: 600 }, function (err, token) {
// 						res.json({
// 							"Registration": "NOTE! NOT NECESSARY AS USER EXISTS",
// 							"author.username": author.username,
// 							token
// 						});
// 					});
// 				});
// 		};		
// 	});
// });		
	

// Test post /author/registration
router.post("/login", (req, res, next)=>{
	
	// used for testing only
	//**************

	// res.json({
	// 	"req.body =": req.body,
	// 	"request.headers =" : req.headers,
	// 	"req.params=" : req.params,
	// 	"req.query =" : req.query,
	// })

	models.Author.findOne({ 'username': req.body.username, })
	.exec( function (err, author) {
		if (err) {
			// res.sendStatus(500) =
			// res.status(500).send('Internal Server Error')
			return res.status(500).send('Internal Server Error: repeat login or contact support');
		}
		if (!author) {
			// res.sendStatus(403) =
			// res.status(403).send('Forbidden')
			return res.status(403).send('Forbidden: user not found');
		}
		bcrypt.compare(req.body.password, author.password, function (err, match) {
			if (!match) {
				return res.send(403).send("Usernam/Password did not match");
			}
			jwt.sign({ author, }, process.env
			.JWT_SECRET_KEY, { expiresIn: '3d' }, function (err, token) {
				console.log("token: "+token )
				res.json({
					"NewTokenIssued": "Save taken in local file",
					
					token,
					"TokenExpireIn": "3 days",

				});
			});
		});
	});

});	


// router.post('/login', (req, res, next)=>{
// 	console.log('post => /author/login')
	// res.json({
	// 	"post test": "router.post /login worked"
	// })
	// models.Author.findOne({ 'username': req.body.username, }).exec(function (err, author) {
	// 	if (err) {
	// 		return res.status(500);
	// 	}
	// 	if (!author) {
	// 		return res.sendStatus(403);
	// 	}
	// 	bcrypt.compare(req.body.password, author.password, function (err, match) {
	// 		if (!match) {
	// 			return res.sendStatus(403).send("Usernam/Password did not match");
	// 		}
	// 		jwt.sign({ author, }, process.env.JWT_SECRET_KEY, function (err, token) {
	// 			res.json({
					
	// 				token
	// 			});
	// 		});
	// 	});
	// });	
// })


// GET '/' = '/author' 31may20 11255555
router.get('/', verifyToken, function (req, res, next) {
	if (!req.token) {
		models.Author.findOne({}, 'firstName lastName introduction').exec(function (err, author) {
			if (err) {
				return res.status('500').send('Internal Server Error: Retry or call support');
			}
			if (!author) {
				return res.status('404').send('Not Found: user account does not exist');
			}
			return res.json(author);
		});
		return;
	}

	jwt.verify(req.token, process.env.JWT_SECRET_KEY, function (err, authorDecoded) {
		if (err) {
			return res.status('403').send('Forbidden: retry or call support');
			//return res.json({"err1": "router.get('/', verifyToken,()=>)", authorDecoded});
		}
		models.Author.findById(authorDecoded.author._id).exec(function (err, author) {
			if (err) {
				return res.status('500').send('Internal Server Error: retry or call support');
				//return res.json({"err2": "router.get('/', verifyToken,()=>)"});
			}
			if (!author) {
				return res.status('403').send('Not Found: token incorrect');
				//return res.json({"err3": "router.get('/', verifyToken,()=>)"});
			}
			return res.json(authorDecoded);
		});
	});
});


// TEST: put '/puttest' = '/author/puttest,
router.put('/:putid/puttest',(req, res)=>{

	// used for testing only
	//**************
	
	res.json({
		"req.body =": req.body,
		"request.headers =" : req.headers,
		"req.params=" : req.params,
		"req.query =" : req.query,
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
					original: return res.sendStatus('500').send('Internal server error: Retry or call support put to /author/ failed');
					//return res.json({"err4": "router.put('/', verifyToken, val..Author,()=>)"});
				}
				if (!updatedAuthor){
					return res.status(404).send('Not Found: user not in DB/token incorrect,so update not possible');
				}
				//res.redirect(`${req.baseUrl}/`);
				res.json({
					"updatedAuthor.firstName": req.body.firstName,
					"updatedAuthor.lastName": req.body.lastName,
					"updatedAuthor.introduction": req.body.introduction,
					"updatedAuthor.username": req.body.username,
					"updatedAuthor.password": req.body.password
				
				});
			});
		});
	});
});

// # DELETE: html method to delete author
// # delete the a user given username and password
// # 31may20 18:36
router.delete('/test', (req, res, next)=>{

	//Test only to see the data received
	res.json({
		"req.body": req.body,
		"req.headers": req.headers,
		"req.params": req.params,
		"req.query": req.query,
	})

})

// # DELETE: html method to actually
// # delete the a user given username and password
// # 31may20 18:36
router.delete('/', (req, res, next)=>{

	// Test only to see the data received
	//let reqBody,reqHeaders,reqParams,reqQuery;
	let [reqBody,reqHeaders,reqParams,reqQuery]=
		[req.body, req.headers, req.Params, req.Query];
	// res.json({
	// 	"req.body": reqBody,
	// 	"req.headers": reqHeaders,
	// 	"req.params": reqParams,
	// 	"req.query": reqQuery,
	// })

	//check username exists
	models.Author.findOne({'username': req.body.username}).exec( (err, author)=>{
		console.log('user/author found?')
		if (err) {
			console.log('Error: finding user/author')
			return res.status(500).send('Internal Server error: Retry or call support')
		}
		if (!author){
			console.log(req.body.username +": user does not exist")
			return res.status(404).send('Not Found: user not DB');
		}
		// Author/user does exist. 
		// Check if the associated password is correct
		bcrypt.compare( req.body.password, author.password, (err, match)=>{
			if (err) {
				console.log('Error occured re-login to delete account');
				return res.status(500).send('Internal Server error: Retry or call support')
			} 
			if (!match) {
				console.log('password is incorrect, ac can not be deleted')
				return res.status(404).send('Not Found: access denied, password incorrect')
			} 
			// Author/user does exist & 
			// password matches. So, 
			//  DELETE ACCOUNT
			models.Author.findByIdAndDelete(author._id, (err)=>{
				if (err) {
					console.log('Error: account not deleted')
					return res.status(500).send('Internal Server Error: Retry or call support')
				}
				console.log('account deleted:'+ author.username)
				res.status(200).send('OK: account deleted')
			});
		});
	});
});


module.exports = router;

console.log('./routes/authors.js DONE')
