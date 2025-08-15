import { Router } from 'express';
import { Notification } from '../models/Notification.js';

export const notifications = Router();

notifications.get('/:userId', async (req, res, next) => {
  try {
    const list = await Notification.findAll({ where: { userId: req.params.userId }, order: [['createdAt', 'DESC']] });
    res.json(list);
  } catch (e) { next(e); }
});

notifications.post('/:userId/read-all', async (req, res, next) => {
  try {
    await Notification.update({ read: true }, { where: { userId: req.params.userId } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});
