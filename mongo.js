const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fsopen2024:${password}@fsopen.mgyktpq.mongodb.net/contactsApp?retryWrites=true&w=majority&appName=fsopen`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactsSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactsSchema)

if(process.argv.length === 3) // ... niin hae tietokannasta
Contact.find({}).then(res => {
    res.forEach(c => {
        console.log(c)
    })
    mongoose.connection.close()
})

if(process.argv.length>3){
    if(process.argv.length != 5){
        console.log('Invalid arguments!')
        console.log('DB password, name and contact number of a contact required')
        process.exit(1)
    }

    // tallentaa tietokantaan
    const contact = new Contact({
        name: `${process.argv[3]}`,
        number: `${process.argv[4]}`
    })

    contact.save().then(res => {
        console.log(`added ${process.argv[3]} ${process.argv[4]} to contacts`)
        mongoose.connection.close()
    }) 
}


