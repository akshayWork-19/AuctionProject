import { Router } from 'express';
import { User } from '../models/User.js';

export const users = Router();

// simple create or get user by email (for testing/demo)
users.post('/', async (req, res, next) => {
  try {
    const { email, name, role } = req.body;
    let u = await User.findOne({ where: { email } });
    if (!u) u = await User.create({ email, name, role: role || 'buyer' });
    res.json(u);
  } catch (e) { next(e); }
});

users.get('/', async (req, res, next) => {
  try {
    const list = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json(list);
  } catch (e) { next(e); }
});
