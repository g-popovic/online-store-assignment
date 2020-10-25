function authUser(req, res, next) {
	if (req.user == null) return res.sendStatus(401);
	next();
}

function authRole(role) {
	return (req, res, next) => {
		if (req.user == null || req.user.role !== role) return res.sendStatus(403);
		next();
	};
}

module.exports = {
	authUser,
	authRole
};
