// This file now only contains permission helpers. 
// Authentication is handled by userAuthMiddleware.js and ownerAuthMiddleware.js

const verifyAdmin = (req, res, next) => {
    // Requires req.user to be set by userAuthMiddleware
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied: Admins only' });
    }
};

export { verifyAdmin };
export default verifyAdmin;

