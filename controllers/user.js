import { handleError } from '../middleware/error.js';
import user from '../model/user.js';

export const getUser = async (req, res, next) => {
  try {
    const findUser = await user.findById(req.params.id);
    res.status(200).json(findUser);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await user.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, 'you can only update your own account'));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await user.findByIdAndDelete(req.params.id);
      await tweet.remove({ userId: req.params.id });
      res.status(200).json('User has been deleted');
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, 'you can only update your own account'));
  }
};

export const follow = async (req, res, next) => {
  try {
    const followUser = await user.findById(req.params.id);

    const currentUser = await user.findById(req.body.id);
    if (!followUser.followers.includes(req.params.id)) {
      await user.updateOne({
        $push: { followers: req.body.id },
      });

      await currentUser.updateOne({ $push: { following: req.params.id } });
    } else {
      res.status(403).json('you are follwing this user');
    }
    res.status(200).json('follwing the user');
  } catch (err) {
    next(err);
  }
};

export const unfollow = async (req, res, next) => {
  try {
    const followUser = await user.findById(req.params.id);

    const currentUser = await user.findById(req.body.id);
    if (currentUser.following.includes(req.params.id)) {
      await user.updateOne({
        $pull: { followers: req.body.id },
      });

      await currentUser.updateOne({ $pull: { following: req.params.id } });
    } else {
      res.status(403).json('you are not following this user');
    }
    res.status(200).json('unfollowing the user');
  } catch (err) {
    next(err);
  }
};
