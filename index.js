const express = require('express');
const ejs = require('ejs');
const request = require('request-promise-native');

const logger = require('./logger');
const morgan = require('./morgan');

const fetch = (uri) => request({
    uri,
    method: 'GET',
    json: true
});

const server = express();
server.use(morgan);
server.get('/metrics', async (req, res) => {
    try {
        const address = req.query.address;
        if (!address) {
            throw new Error('No address provided!');
        }

        const [
            generalStats,
            validatorStats,
        ] = await Promise.all([
            fetch('https://api-sentinel.cosmostation.io/v1/status'),
            fetch(`https://api-sentinel.cosmostation.io/v1/staking/validator/${address}`),
        ]);

        logger.debug({
            generalStats,
            validatorStats,
        }, 'Data received');

        const data = await ejs.renderFile('./response.ejs', {
            generalStats,
            validatorStats,
            address,
        });
        res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
        res.end(data);
    } catch (err) {
        logger.error(err, 'Getting stats error');
        res.status(500).end(err.message);
    }
});

const port = 3032;
logger.info(`Server listening to ${port}, metrics exposed on /metrics endpoint`);
server.listen(port);
