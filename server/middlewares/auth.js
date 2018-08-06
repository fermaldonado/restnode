const jwt = require('jsonwebtoken');

// =================================
// Verify Token
// =================================
let verifyToken = (req, res, next) => {

	let token = req.get('token');

	jwt.verify( token,  process.env.SEED, (err, decoded) => {
		if(err){
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token is not valid'
				}
			});
		}

		req.usuario = decoded.usuario;
		next();
	});
};

// =================================
// Verify Admin Role
// =================================
let verifyAdminRole = (req, res, next) => {
	let user = req.usuario;

	if(user.role !== 'ADMIN_ROLE'){
		return res.status(401).json({
			ok: false,
			err: {
				message: 'Invalid user role'
			}
		});
	}

	next();
};
module.exports = {
	verifyToken,
	verifyAdminRole
};
