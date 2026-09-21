import User from "../model/usersModel.js";

export const findByEmail = (email) => {
  return User.findOne({ email });
};

export const findById = (id) => {
  return User.findById(id);
};
