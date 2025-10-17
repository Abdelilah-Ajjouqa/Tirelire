export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role !== 'Admin') {
        return res.status(403).json({
            message: 'Admin access required'
        });
    }
    next();
};

export const isOwnerOrAdmin = (req, res, next) => {
    const requestedUserId = req.params.userId;
    
    if (req.user.role !== 'Admin' && req.user._id.toString() !== requestedUserId) {
        return res.status(403).json({ 
            message: 'Access denied: You can only access your own data' 
        });
    }
    next();
};