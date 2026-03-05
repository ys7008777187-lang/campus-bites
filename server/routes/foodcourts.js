import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

// GET /api/foodcourts
router.get('/', (req, res) => {
    const courts = db.getAllFoodCourts();
    res.json(courts.map(c => ({
        ...c,
        storeCount: db.getStoresByCourt(c.id).length,
    })));
});

// GET /api/foodcourts/:id
router.get('/:id', (req, res) => {
    const court = db.getFoodCourt(req.params.id);
    if (!court) return res.status(404).json({ error: 'Food court not found' });

    const stores = db.getStoresByCourt(req.params.id).map(s => ({
        id: s.id, name: s.name, image: s.image, cuisine: s.cuisine,
        rating: s.rating, prepTime: s.prepTime, isOpen: s.isOpen,
    }));

    res.json({ ...court, stores });
});

export default router;
