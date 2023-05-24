import { StatusCodes } from "http-status-codes";
import User from "../users/UserModel";

export const getUserData = async (req: any, res: any) => {
  // # checking for id existence in url
  const { id } = req.params;

  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "No user id provided",
    });
  }
  try {
    // # checking if there's a user with id
    const user = await User.findOne({ _id: id }).select(
      "username firstName lastName -_id"
    );
    // - not found? return invalid msg
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Invalid user id",
      });
    }
    // - found? return user data
    return res.status(StatusCodes.ACCEPTED).json(user);
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};
