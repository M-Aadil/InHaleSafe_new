
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000; // Use PORT environment variable or default to 8000
const connectionString = process.env.MONGODB_URI; // Use MONGODB_URI environment variable

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

const sensorDataSchema = new mongoose.Schema({
    CO: Number,
    CO2: Number,
    Temperature: Number,
    Pressure: Number,
    Humidity: Number,
    Gas: Number,
    AQI: Number,
    VOC: Number,
    Timestamp: String
}, { timestamps: true });

const SensorData = mongoose.model('SensorData', sensorDataSchema);

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.listen(port, function () {
    console.log("Server has been started at port " + port);
});

app.get('/sensor-data', async function (req, res) {
    try {
        const data = await SensorData.find({});
        res.json(data);
    } catch (err) {
        console.error("Error fetching sensor data:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/sensor-data', async function (req, res) {
    const jsonData = req.body;

    console.log("Received JSON data:", jsonData);

    try {
        const savedData = await SensorData.create(jsonData);
        res.json(savedData);
    } catch (err) {
        console.error("Error saving sensor data:", err);
        res.status(500).json({ error: 'Failed to save sensor data' });
    }
});



