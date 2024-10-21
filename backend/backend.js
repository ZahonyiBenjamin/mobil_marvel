const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
app.use(express.static('kepek'))
var connection

function kapcsolat()
{
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'marvel_szavazas'
    })
    
    connection.connect()
}


app.get('/filmek', (req, res) => {
    kapcsolat()

    connection.query(`
        SELECT * FROM film
        `, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log(rows)
            res.status(200).send(rows)
        }
    })

    connection.end() 
})

app.post('/szavazas', (req, res) => {
    kapcsolat()

    connection.query(`
        INSERT INTO szavazat VALUES(null, ${req.body.szavazat_film})
        `, (err, rows, fields) => {
        if (err)
        {
            console.log("Hiba")
            console.log(err)
            res.status(500).send("Hiba")
        }
        else{
            console.log("Sikeres szavazás.")
            res.status(200).send("Sikeres szavazás.")
        }
    })

    connection.end() 
})







app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})