import express from 'express';
import firebase from '../services/firebase';

import { authAdminMiddleware } from '../middlewares/auth';

var router = express.Router();

/** GET: List all users */
router.get('/users', authAdminMiddleware, async function (_req, res, _next) {
  const listAllUsers = (nextPageToken) => {
    // prettier-ignore
    firebase.auth().listUsers(1000, nextPageToken).then(listUsersResult => {
      res.status(200).send(listUsersResult.users)
    }).catch(_err => {
      res.status(500)
    });
  };
  // Start listing users from the beginning, 1000 at a time.
  listAllUsers();
});

/** PUT: Enable a user by uid */
router.put('/users/:uid/enable', authAdminMiddleware, async function (req, res, _next) {
  // prettier-ignore
  firebase.auth().updateUser(req.params.uid, {disabled: false}).then(_userRecord => {
    res.status(200).send();
  }).catch(_err => {
    res.status(500).send();
  });
});

/** PUT: Disable a user by uid */
router.put('/users/:uid/disable', authAdminMiddleware, async function (req, res, _next) {
  // prettier-ignore
  firebase.auth().updateUser(req.params.uid, {disabled: true}).then(_userRecord => {
    res.status(200).send();
  }).catch(_err => {
    res.status(500).send();
  });
});

/** DELETE: Delete a user by uid */
router.delete('/users/:uid', authAdminMiddleware, async function (req, res, _next) {
  // prettier-ignore
  firebase.auth().deleteUser(req.params.uid).then(() => res.status(200)).catch(() => res.status(500))
});

/** PUT: Grant a user a role by role name and uid */
router.put('/roles/grant/:role/:uid', authAdminMiddleware, async function (req, res, _next) {
  // prettier-ignore
  firebase.auth().setCustomUserClaims(req.params.uid, {role: req.params.role}).then(_user => {
    // Invalidate the user's current tokens as permissions may have changed
    firebase.auth().revokeRefreshTokens(req.params.uid).catch((_err => res.status(500).send()))
    res.status(200).send()
    
  }).catch(_err => {
    res.status(500).send()
  });
});

/** PUT: Remove a role from a user by role name and uid */
router.put('/roles/revoke/:role/:uid', authAdminMiddleware, async function (req, res, _next) {
  // prettier-ignore
  firebase.auth().setCustomUserClaims(req.params.uid, {role: 'user'}).then(_user => {
    // Invalidate the user's current tokens as permissions may have changed
    firebase.auth().revokeRefreshTokens(req.params.uid).catch((_err => res.status(500).send()))
    res.status(200).send()
  }).catch(_err => {
    res.status(500).send()
  });
});

module.exports = router;
