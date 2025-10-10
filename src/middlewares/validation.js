export const validateRegister = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            message: "All field are required"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long"
        });
    }

    next();
}

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    next();
}