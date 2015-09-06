var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {unique: true, type: String},
  password: {type: String},
  isActive:{type:Number,default:0},
  meta:{
    createAt:{type:Date,default:Date.now()},
    updateAt:{type:Date,default:Date.now()}
  }
});

UserSchema.index({email: 1});

UserSchema.statics = {};
mongoose.model('User', UserSchema);
