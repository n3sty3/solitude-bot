const mongoose = require('mongoose');
const config = require('../config');
const pino = require('pino');

const logger = pino({ name: 'database' });

async function connectDatabase() {
    if (!config.mongoUri) {
        logger.error('MONGODB_URI is not set in .env file!');
        logger.error('Get your free cluster at mongodb.com/atlas');
        process.exit(1);
    }

    try {
        await mongoose.connect(config.mongoUri);
        logger.info('Connected to MongoDB Atlas');
    } catch (error) {
        logger.error({ err: error }, 'Failed to connect to MongoDB');
        process.exit(1);
    }

    mongoose.connection.on('error', (err) => {
        logger.error({ err }, 'MongoDB connection error');
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected, attempting reconnect...');
    });
}

module.exports = { connectDatabase };
