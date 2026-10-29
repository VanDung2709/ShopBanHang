const express = require('express');
const mongoose = require('mongoose');
const { requireLogin, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const TZ = 'Asia/Ho_Chi_Minh';
const part = (op) => ({ [op]: { date: '$createdAt', timezone: TZ } });

// GET /api/stats/revenue?by=month  hoặc  ?by=day
router.get('/revenue', requireLogin, requireAdmin, async (req, res) => {
  try {
    const byDay = req.query.by === 'day';

    const groupId = { year: part('$year'), month: part('$month') };
    const sort = { '_id.year': 1, '_id.month': 1 };
    if (byDay) {
      groupId.day = part('$dayOfMonth');
      sort['_id.day'] = 1;
    }

    const result = await mongoose.connection.collection('orders').aggregate([
      { $match: { status: 'completed' } },
      { $group: {
          _id: groupId,
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
      } },
      { $sort: sort },
    ]).toArray();

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;