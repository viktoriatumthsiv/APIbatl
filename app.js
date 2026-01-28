const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = './dates.json';

const readDates = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeDates = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// GET /dates - Отримати всі
app.get('/dates', (req, res) => res.json(readDates()));

// GET /dates/upcoming - Найближчі
app.get('/dates/upcoming', (req, res) => {
    const dates = readDates();
    const today = new Date().toISOString().split('T')[0];
    const upcoming = dates.filter(d => d.date >= today).sort((a,b) => new Date(a.date) - new Date(b.date));
    res.json(upcoming);
});

// POST /dates - Додати нову
app.post('/dates', (req, res) => {
    const dates = readDates();
    const newDate = { id: uuidv4(), ...req.body };
    dates.push(newDate);
    writeDates(dates);
    res.status(201).json(newDate);
});

// DELETE /dates/:id - Видалити
app.delete('/dates/:id', (req, res) => {
    let dates = readDates();
    dates = dates.filter(d => d.id !== req.params.id);
    writeDates(dates);
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));