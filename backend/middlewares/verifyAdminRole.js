const verifyAdminRole = (req, res, next) => {
    if (req.user.role != 'admin') {
        return res.status(403).send({ message: 'Require Admin Role' });
    }
    next();
};

module.exports = verifyAdminRole;