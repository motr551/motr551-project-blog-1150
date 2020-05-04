console.log('./middlewares/validateInputs.js')

// Validate comment
const validateComment = function (req, res, next) {
	let body = req.body.body;
	let name = req.body.name;
	if (!body || !body.trim()) {
		req.errors = { body: 'Comment required', };
	} else {
		req.body.body = body.trim();
	}
	if (name) {
		req.body.name = name.trim();
	}
	next();
};

// Validate author
const validateAuthor = function (req, res, next) {
	let errors = {};
	if (!req.body.firstName || !req.body.firstName.trim()) {
		errors.firstName = 'First Name required';
	}
	if (!req.body.lastName || !req.body.lastName.trim()) {
		errors.lastName = 'Last Name required';
	}
	if (!req.body.username || !req.body.username.trim()) {
		errors.username = 'Username required';
	}
	if (!req.body.password) {
		errors.password = 'Password required';
	} else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(req.body.password)){
		errors.password = 'Password too weak. must contain at least 8 character, 1 digit, 1 uppercase and 1 lowercase.';
	}
	if (Object.entries(errors).length) {
		req.errors = errors;
	}
	next();
}
//
// NB:  see https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
// RegEx	Description
// ^: password string will start this way
// (?=.*[a-z]): string contains at least 1 lowercase alphabetical character
// (?=.*[A-Z]): string contains at least 1 uppercase alphabetical character
// (?=.*[0-9]): string contains at least 1 numeric character
// (?=.*[!@#\$%\^&\*]): string contains at least one special character, but we are escaping reserved RegEx characters to avoid conflict
// (?=.{8,}): string must be eight characters or longer
//
// USE following code
// var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
// var password = "aA0$cccc" 
// strongRegex.test(password)? "strong password" : "weak password"

module.exports = {
	validateAuthor,
	validateComment,
};

console.log('./middlewares/validateInputs.js DONE')