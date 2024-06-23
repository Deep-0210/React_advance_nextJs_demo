import mongoose from 'mongoose'

export const dbConnect = async () => {
    try {
        const isConnected = await mongoose.connect(`mongodb://127.0.0.1:27017/todo`).then(() => {
            console.log("Database connected....")
            return true
        }).catch((err) => {
            console.log(err)
            return false
        })

        return isConnected;
    } catch (error) {
        console.log(error)
        return false
    }
}
