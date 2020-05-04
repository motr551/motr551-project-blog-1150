#! /usr/bin/env node

console.log('populateDB.js')
// Dotenv
require('dotenv').config();

const async = require('async');
const models = require('./models');
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let author;
let posts = [];
let comments = [];

function createAuthor(callback) {
	bcrypt.hash('nguyen', 10, function (err, hashedPassword) {
		if (err) {
			return callback(err, null);
		}
		author = new models.Author({
			firstName: 'Tracy',
			lastName: 'Nguyen',
			introduction: 'Hello World',
			username: 'tracy',
			password: hashedPassword,
		});
		author.save(function (err) {
			if (err) {
				return callback(err, null);
			}
			console.log('New User: ' + author);
			console.log('Login: with username=tracy and password=nguyen');
			return callback(null, author);
		});
	});
}

function commentCreate(body, post, name, callback) {
	let comment = new models.Comment({
		body,
		post,
		name,
	});
	comment.save(function (err) {
		if (err) {
			return callback(err, null);
		}
		console.log('New Comment: ' + comment);
		comments.push(comment);
		callback(null, comment);
	});
}

function postCreate(title, body, published, callback) {
	const post = new models.Post({
		title,
		body,
		published,
	});
	post.save(function (err) {
		if (err) {
			return callback(err, null);
		}
		console.log('New Post: ' + post);
		posts.push(post);
		callback(null, post);
	});
}

function createPosts(callback) {
	async.parallel([
		function (callback) {
			postCreate('Post 1','text 1', false, callback);
		},
		function (callback) {
			postCreate('Post 2','text 2', true, callback);
		},
		function (callback) {
			postCreate('Post 3','text 3', false, callback);
		},
		function (callback) {
			postCreate('Post 4','text 4', false, callback);
		},

	], callback);
}

function createComments(callback) {
	async.parallel(
		[
		function (callback) {
			commentCreate('Create: comment 1', posts[2]._id, 'Lovely Girl', callback);
		},

		function (callback) {
			commentCreate('Create: comment 2', posts[0]._id, 'Cool Boy', callback);
		},

		function (callback) {
			commentCreate('Create: comment 3', posts[1]._id, 'True Nerd', callback);
		},

		function (callback) {
			commentCreate('commentCreate: comment 4', posts[2]._id, 'Tricky Teacher', callback);
		},

	], callback);
}

async.series(
	[
	createPosts,
	createComments,
	createAuthor,
	], function (err, results) {
		if (err) {
			console.log('FINAL ERR: ' + err);
		} else {
			console.log('DATA GENERATED!');
		}
		mongoose.connection.close();
	}
);

