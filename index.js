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

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if(error.name === 'CastError')
        return res.status(400).send({ error: 'malformatted id'})
}

app.get('/api/contacts', (req, res) => 
    Contact.find({})
        .then(contacts => res.json(contacts))    
)

app.get('/api/contacts/:id', (req, res, next) => {
    Contact.findById(req.params.id)
        .then(contact => {
            if(contact) 
                res.json(contact)
            else 
                res.status(404).end()            
        })
        .catch(error => next(error))
})

app.delete('/api/contacts/:id', (req, res, next) => {
    Contact.findByIdAndDelete(req.params.id)
        .then(result => 
            res.status(204).end())
        .catch(error => next(error))    
})

app.post('/api/contacts', (req, res, next) => {
   const body = req.body

    if(!body.name)
        return res.status(400).json({   // bad request
            error: 'name missing'
    })

    if(!body.number)
        return res.status(400).json({
            error: 'number missing'
    })

    const contact = new Contact({
        name: body.name,
        number: body.number
    })
    
    contact
      .save()
      .then(savedContact =>
        res.json(savedContact))
      .catch(error => next(error))
})

app.put('/api/contacts/:id', (req, res, next) => {
    const body = req.body

    const contact = {
        name: body.name,
        number: body.number
    }

    Contact.findByIdAndUpdate(req.params.id, contact, {new: true})
        .then(updatedContact => res.json(updatedContact))
        .catch(error => next(error))
})


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
