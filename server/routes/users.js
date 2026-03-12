const express = require('express');
const router = express.Router();
const User = require('../models/userr');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');


router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search ? { $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]} : {};

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort('-createdAt').skip(skip).limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      revenueResult,
      pendingOrders,
      recentOrders
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.find().sort('-createdAt').limit(5).populate('user', 'name email')
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      pendingOrders,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, { name, email, role, isActive }, { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'User deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
