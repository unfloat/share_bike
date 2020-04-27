const router = require('express').Router();

const userRoutes = require('./user.route');
const eventRouter = require('./event.route');
const sliderRouter = require('./slider.route');
const bikeRouter = require('./bike.route');
const stationRouter = require('./station.route');

router.get('/', (req, res) => {
  res.send({
    success: true,
  });
});

router.use('/user', userRoutes);
router.use('/events', eventRouter);
router.use('/slider', sliderRouter);
router.use('/bikes', bikeRouter);
router.use('/stations', stationRouter);

module.exports = router;
