const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;
mongoose.connect("mongodb+srv://shivam122508:jogi%40123@cluster0.hvyzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const UserSchema = new Schema({
    name:String,
    username: String, // String is shorthand for {type: String}
    password: String,
 
  });
  const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

  const User=mongoose.model('User', UserSchema);
  const Account = mongoose.model('Account', accountSchema);

  module.exports={
    User,
    Account
  };
