const router = require('express').Router();
const NotificationController = require('../controllers/NotificationController');

router.get('/', NotificationController.getNotifications);
router.post('/mentions/:bugId', NotificationController.mentionPeople);

module.exports = router;
