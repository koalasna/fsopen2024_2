require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', function (req, res) {return JSON.stringify(req.body)})

app.get('/api/contacts', (req, res) => 
    Contact.find({})
        .then(contacts => res.json(contacts))    
)

/*
app.get('/info', (req, res) => 
    res.send(`
    <p>Phonebook has info for ${contacts.length} people</p>
    <h2>${new Date().toString()}</h2>`)
) */

app.get('/api/contacts/:id', (req, res) => {
    Contact.findById(req.params.id).then(contact => 
        res.json(contact))
})

app.delete('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id)
    contacts = contacts.filter(c => c.id !== id)
    res.status(204).end()   // no content
})

app.post('/api/contacts', (req, res) => {
   const body = req.body

    if(!body.name)
        return res.status(400).json({   // bad request
            error: 'name missing'
    })

    if(!body.number)
        return res.status(400).json({
            error: 'number missing'
    })

/*    palaa tähän
    if(contacts.map(c=>c.name).includes(body.name))
        return res.status(400).json({
            error: 'name already exists'
    }) */

    const contact = new Contact({
        name: body.name,
        number: body.number
    })
    
    contact.save().then(savedContact =>
        res.json(savedContact))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
