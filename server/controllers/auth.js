import user from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { handleError } from '../middleware/error.js';

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new user({ ...req.body, password: hash });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT);
    const { password, ...othersData } = newUser._doc;
    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json(othersData);
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const foundUser = await user.findOne({ username: req.body.username });
    if (!foundUser) return next(handleError(404, 'user not found'));

    const isCorrect = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );
    if (!isCorrect) return next(handleError(401, 'incorrect password'));

    const token = jwt.sign({ id: foundUser._id }, process.env.JWT);
    const { password, ...othersData } = foundUser._doc;
    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json(othersData);
  } catch (err) {
    next(err);
  }
};
