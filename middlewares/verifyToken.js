console.log('./middlewares/varifyToken.js')

exports.verifyToken = function (req, res, next) {
	const bearerHeader = req.headers.authorization;
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		req.token = bearer[1];
	}
	next();
};

console.log('./middlewares/varifyToken.js DONE')
