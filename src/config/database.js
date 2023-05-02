const { connect } = require("mongoose");

exports.connectDb = async (uri) => {
  connect(uri).then(() => console.log("CONNECTED DB"));
};
