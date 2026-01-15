import jwt from 'jsonwebtoken';
import User from '../../models/user/User.js';

const userAuth = async (req, res, next) => {
    // 1. Get token from header
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('\n🔑 [USER AUTH] Middleware Check');
        console.log('   Token decoded - User ID:', decoded.user.id);
        console.log('   Token decoded - Role:', decoded.user.role);

        // 3. Strictly find User in USER collection
        const user = await User.findById(decoded.user.id).select('-password');

        if (!user) {
            console.log('   ❌ User not found in User collection for ID:', decoded.user.id);
            return res.status(401).json({ msg: 'Token valid, but User profile not found.' });
        }

        console.log('   ✅ User found:', user.email, '| Role:', user.role);

        // 4. Verify role matches (prevent role confusion)
        if (decoded.user.role && decoded.user.role !== user.role) {
            console.log('   ⚠️ Role mismatch! Token:', decoded.user.role, '| DB:', user.role);
            return res.status(401).json({ msg: 'Role mismatch in token' });
        }

        // 5. Attach to request
        req.user = user;
        next();
    } catch (err) {
        console.log('   ❌ Token verification failed:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default userAuth;
