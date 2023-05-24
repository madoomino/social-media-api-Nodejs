import { connect } from "mongoose";

// MongoDB ( obvious -_- )

export const connectDB = async (uri: any) => {
  connect(uri).then(() => console.log("CONNECTED DB"));
};
