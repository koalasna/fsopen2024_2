const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL // palaa tähän vielä

console.log('connecting to ' , url)

mongoose.connect(url)
    .then(res => console.log('connected to MongoDB'))
    .catch(e => console.log('error conntection to MongoDB: ', e.message))
    
const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)

