import jwt from 'jsonwebtoken';
import User from '../../models/user/User.js';
import Owner from '../../models/owner/Owner.js';

const anyAuth = async (req, res, next) => {
    // 1. Get token
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check User collection first
        let authenticatedEntity = await User.findById(decoded.user.id).select('-password');

        // 4. If not in User, check Owner collection
        if (!authenticatedEntity) {
            authenticatedEntity = await Owner.findById(decoded.user.id).select('-password');
        }

        if (!authenticatedEntity) {
            return res.status(401).json({ msg: 'Token valid, but associated profile not found.' });
        }

        // 5. Attach to req.user
        req.user = authenticatedEntity;
        next();
    } catch (err) {
        console.error("Auth Error:", err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default anyAuth;
