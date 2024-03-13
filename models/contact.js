const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

console.log('connecting to  DB')

mongoose.connect(url)
    .then(res => console.log('connected to MongoDB'))
    .catch(e => console.log('error conntection to MongoDB: ', e.message))

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: [true, 'Contact name required']
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: function(v) {
                return /\d{2,3}-\d{6,}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'Phone number is required']

    }
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)

