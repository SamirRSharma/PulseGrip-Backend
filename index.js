const cors = require('cors');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, maxPoolSize: 10 });

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const dataDb = client.db('pg-db');
        const authDb = client.db('pg-auth-db');

        // Pass the database connections to the routes
        app.use('/auth', require('./routes/auth')(authDb));
        app.use('/data', require('./routes/data')(dataDb));

        // Base route
        app.get('/', (req, res) => {
            res.send('Hello World');
        });

        app.listen(process.env.PORT || 8080, () => {
            console.log(`Server is running on port ${process.env.PORT || 8080}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

connectToMongoDB();
