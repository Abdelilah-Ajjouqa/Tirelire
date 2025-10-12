import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (await User.find({ email })) {
            return res.status(400).json({
                message: "theree's already an account exit with this email"
            })
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password
        });

        await newUser.save();


        generateToken(user._id);

        res.status(201).json({
            message: "user created successfuly,",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        return res.status(400).json({
            message: "error",
            error: error.message
        })
    }
}