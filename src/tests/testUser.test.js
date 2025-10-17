import User from "../models/User.js";
import MongodbConnection from "../config/MongodbConnection.js";

const db = new MongodbConnection();

async function testModel() {
    await db.connect();

    try {
        const newUser = new User({
            fullName: "dounia",
            email: "dounia@gmail.com",
            password: "password123"
        });
        await newUser.save();
        console.log("user saved,", newUser);
        const users = await User.find();
        console.log("list of users: ", users);
    } catch (error) {
        console.log("error: ", error.message);
    }
}

testModel();