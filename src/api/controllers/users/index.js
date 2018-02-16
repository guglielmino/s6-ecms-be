import express from 'express';
import usersTransformers from './usersTransformer';
import logger from '../../../common/logger';

export default function (app, middlewares, { usersProvider }) {
  const router = express.Router();

  app.use('/api/users', router);

  router.post('/:userId', middlewares, (req, res) => {
    const user = req.body;
    const userId = req.params.userId;

    usersProvider.updateByUserId(userId, usersTransformers(user))
      .then((result) => {
        if (result) {
          res.sendStatus(200);
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        logger.log('error', err);
        res.sendStatus(500);
      });
  });
}
