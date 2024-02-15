const express = require('express')
const app = express()
app.use(express.json())

let contacts = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6123122"
    }
]

app.get('/api/contacts', (req, res) => res.json(contacts))

app.get('/info', (req, res) => 
    res.send(`
    <p>Phonebook has info for ${contacts.length} people</p>
    <h2>${new Date().toString()}</h2>`)
)

app.get('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id)
    const contact = contacts.find(c => c.id===id)
    contact
        ? res.json(contact)
        : res.status(404).end() // not found
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
    
    if(contacts.map(c=>c.name).includes(body.name))
        return res.status(400).json({
            error: 'name already exists'
    })

    const contact = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
    }
    
    contacts = contacts.concat(contact)
    res.json(contact)
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
