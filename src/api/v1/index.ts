import express from 'express';

import type MessageResponse from '../../interfaces/MessageResponse';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
    res.status(200).json({
        message: 'API up and running :P',
    });
});

export default router;
