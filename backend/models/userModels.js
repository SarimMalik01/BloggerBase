const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    userName:{type:String ,required:true,min:4 , unique:true},
    password:{type:String , required:true}
});

const UserModel=mongoose.model('User',UserSchema);

module.exports=UserModel;