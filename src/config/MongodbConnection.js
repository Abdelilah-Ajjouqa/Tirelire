import mongoose from "mongoose";

// const connectDb = async () => {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/tirelire');
//         console.log("MongoDb connected")
//     } catch (error) {
//         console.log("error: ", error.message);
//     }
// }

// export default connectDb;
class MongodbConnection {
    constructor(uri = 'mongodb://localhost:27017/tirelire') {
        this.uri = uri;
        this.isConnected = false;
    };

    async connect() {
        try {
            await mongoose.connect(this.uri);
            this.isConnected = true;
            console.log("MongoDb connected");
        } catch (error) {
            this.isConnected = false;
            console.log("error: ", error.message)
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log("disconnected");
        } catch (error) {
            console.log("errror: ", error.message)
        }
    }
}

export default MongodbConnection;