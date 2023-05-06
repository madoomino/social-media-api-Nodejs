const { connect } = require("mongoose");

// MongoDB ( obvious -_- )

exports.connectDb = async (uri) => {
  connect(uri).then(() => console.log("CONNECTED DB"));
};
