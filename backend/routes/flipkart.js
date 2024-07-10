const express = require('express');
const router = express.Router();
const { flipkartGet, flipkartAdd, flipkartDelete, flipkartRanking } = require('../middleware/flipkart.middleware');

const authenticateUser = (req, res, next) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(401).json({ message: 'User ID is required' });
    }
    req.userId = userId;
    next();
};

router.get('/:userId', authenticateUser,flipkartGet );

router.post('/', flipkartAdd);

router.delete('/:id', flipkartDelete);

router.post('/ranking', flipkartRanking);

module.exports = router;
