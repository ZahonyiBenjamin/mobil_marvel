const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('kepek'));

function kapcsolat() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'marvel_szavazas'
    });
    
    connection.connect((err) => {
        if (err) {
            console.error('Hiba a kapcsolódáskor:', err);
            return null; // Ha nem sikerül a kapcsolat, visszatérünk null-lal
        }
    });
    
    return connection; // Visszatér a kapcsolat objektummal
}

app.get('/filmek', (req, res) => {
    const connection = kapcsolat();
    if (!connection) {
        return res.status(500).send('Kapcsolódási hiba');
    }

    connection.query('SELECT * FROM film', (err, rows, fields) => {
        if (err) {
            console.error('Hiba a lekérdezés során:', err);
            return res.status(500).send('Hiba a lekérdezés során');
        }
        console.log(rows);
        res.status(200).send(rows);
    });

    connection.end((err) => {
        if (err) {
            console.error('Hiba a kapcsolat lezárásakor:', err);
        }
    });
});

app.post('/szavazas', (req, res) => {
    const connection = kapcsolat();
    if (!connection) {
        return res.status(500).send('Kapcsolódási hiba');
    }

    const szavazatFilm = connection.escape(req.body.szavazat_film); // Használjunk escape-t a bemeneti adatok biztonságáért

    connection.query(`INSERT INTO szavazat VALUES (null, ${szavazatFilm})`, (err, rows, fields) => {
        if (err) {
            console.error('Hiba a beszúrás során:', err);
            return res.status(500).send('Hiba a beszúrás során');
        }
        console.log('Sikeres szavazás.');
        res.status(200).send('Sikeres szavazás.');
    });

    connection.end((err) => {
        if (err) {
            console.error('Hiba a kapcsolat lezárásakor:', err);
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
