import { handleError } from '../middleware/error.js';
import tweet from '../model/tweet.js';
import user from '../model/user.js';

export const createTweet = async (req, res, next) => {
  const newTweet = new tweet(req.body);
  try {
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    handleError(500, err);
  }
};

export const deleteTweet = async (req, res, next) => {
  try {
    const deletedTweet = await tweet.findById(req.params.id);
    if (deletedTweet.userId === req.body.id) {
      await tweet.deleteOne();
      res.status(200).json('tweet has been deleted');
    } else {
      handleError(500, err);
    }
  } catch (err) {
    handleError(500, err);
  }
};

export const likeOrDislike = async (req, res, next) => {
  try {
    const likeTweet = await tweet.findById(req.params.id);
    if (!likeTweet.likes.includes(req.body.id)) {
      await likeTweet.updateOne({ $push: { likes: req.body.id } });
      res.status(200).json('tweet has been liked');
    } else {
      await likeTweet.updateOne({ $pull: { likes: req.body.id } });
      res.status(200).json('tweet has been unliked');
    }
  } catch (err) {
    handleError(500, err);
  }
};

export const getAllTweets = async (req, res, next) => {
  try {
    const currentUser = await user.findById(req.params.id);
    const userTweets = await tweet.find({ userId: currentUser._id });
    const followersTweets = await Promise.all(
      currentUser.following.map((followerId) => {
        return tweet.find({ userId: followerId });
      })
    );
    res.status(200).json(userTweets.concat(...followersTweets));
  } catch (err) {
    handleError(500, err);
  }
};

export const getAllUserTweets = async (req, res, next) => {
  try {
    const userTweets = await tweet
      .find({ userId: req.params.id })
      .sort({ createTweet: -1 });
    res.status(200).json(userTweets);
  } catch (err) {
    handleError(500, err);
  }
};

export const getExploreTweets = async (req, res, next) => {
  try {
    const userTweets = await tweet
      .find({ likes: { $exists: true } })
      .sort({ likes: -1 });
    res.status(200).json(getExploreTweets);
  } catch (err) {
    handleError(500, err);
  }
};
