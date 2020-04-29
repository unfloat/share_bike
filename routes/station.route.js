const router = require('express').Router();
const { StationModel } = require('../models');
const passport = require('passport');
const { upload } = require('../utils/Uploader');

/* GET All Stations . 
@Route : stations/
*/
router.get('/', (req, res) => {
  StationModel.find()
    .populate('user')
    .sort('-date')
    .then((data) => {
      res.json(data);
    })
    // .catch((err) => res.send(err));
    .catch(error => {
      console.log('caught', error.message);
    });

});


/* GET Single Stations . 
@Route : stations/:id
*/
router.get('/:id', (req, res) => {
  const query = {
    _id: req.params.id,
  };

  StationModel.findOne(query)
    .populate('user')
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.send(err));
});

/* Add Station . 
@Route : stations/add + body {}
*/

router.post(
  '/add',
  upload.single('imageData'),
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    newStation = new StationModel({
      title: req.body.title,
      archived: false,
      alt: req.body.alt,
      lng: req.body.lng,
      image: req.file.path,
      user: req.body.user,
      numberOfBikesCapacity: req.body.numberOfBikesCapacity,
      numberOfBikesAvailable: req.body.numberOfBikesAvailable,
      etat: req.body.etat,
    });
    newStation
      .save()
      .then((station) => res.json(station))
      .catch((err) => res.status(400).json(err));
  }
);

/* UPDATE Single Station. 
@Route : stations/update/:id
*/
router.put(
  '/update/:id',
  upload.single('imageData'),
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const query = {
      _id: req.params.id,
    };

    let stationUpdated;
    if (req.file) {
      stationUpdated = {
        title: req.body.title,
        archived: false,
        image: req.file.path,
        alt: req.body.alt,
        lng: req.body.lng,
        user: req.body.user,
        numberOfBikesCapacity: req.body.numberOfBikesCapacity,
        numberOfBikesAvailable: req.body.numberOfBikesAvailable,
        bikes: [],
        etat: req.body.etat,
      };
    } else {
      stationUpdated = {
        title: req.body.title,
        archived: false,
        user: req.body.user,
        alt: req.body.alt,
        lng: req.body.lng,
        numberOfBikesCapacity: req.body.numberOfBikesCapacity,
        numberOfBikesAvailable: req.body.numberOfBikesAvailable,
        bikes: [],
        etat: req.body.etat,
      };
    }

    StationModel.findOneAndUpdate(
      query,
      {
        $set: stationUpdated,
      },
      { new: true }
    )
      .then((station) => res.json(station))
      .catch((err) => res.status(400).json(err));
  }
);

/* DELETE Single Station. 
@Route : stations/delete/:id
*/
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let query = {
      _id: req.params.id,
    };
    StationModel.deleteOne(query)
      .then((station) => res.json(station))
      .catch((err) => res.status(400).json(err));
  }
);

router.put('/archive/:id', (req, res) => {
  let query = {
    _id: req.params.id,
  };
  StationModel.findOneAndUpdate(
    query,
    {
      $set: { archived: true },
    },
    { new: true }
  )
    .then((station) => res.json(station))
    .catch((err) => res.status(400).json(err));
});

router.put('/unarchive/:id', (req, res) => {
  let query = {
    _id: req.params.id,
  };
  StationModel.findOneAndUpdate(
    query,
    {
      $set: { archived: false },
    },
    { new: true }
  )
    .then((station) => res.json(station))
    .catch((err) => res.status(400).json(err));
});

module.exports = router;
