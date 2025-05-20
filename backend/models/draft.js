const mongoose=require("mongoose")
const {model,Schema}=mongoose;

const DraftSchema=new mongoose.Schema({
    title:String,
    summary:String,
    content:String,
    tagsString:String,
    cover:String,
    author:{type:Schema.Types.ObjectId ,ref:'User'},
},
{
    timestamps:true
});

const draftModel=model('Draft',DraftSchema);

module.exports=draftModel;