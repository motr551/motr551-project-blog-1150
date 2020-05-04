console.log('./models/index.js')

const Author = require('./author');
const Comment = require('./comment');
const Post = require('./post');

module.exports = {
	Author,
	Comment,
	Post,
};

console.log('./models/index.js DONE')