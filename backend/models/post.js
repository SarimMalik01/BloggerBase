const mongoose=require("mongoose")
const {model,Schema}=mongoose;

const PostSchema=new mongoose.Schema({
    title:String,
    summary:String,
    content:String,
    tagsString:String,
    cover:String,
    isDraft:Boolean,
    author:{type:Schema.Types.ObjectId ,ref:'User'},
},
{
    timestamps:true
});

const postModel=model('Post',PostSchema);

module.exports=postModel;