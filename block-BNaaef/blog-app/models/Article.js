const mongoose = require('mongoose');
let slug=require("slugger");
let Schema = mongoose.Schema;

let articleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags:[{type:String}],
  pages:{type:Number},
  likes: { type: Number, default: 0 },
  
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  userId:{type:Schema.Types.ObjectId,ref:"User"},
  author: { type: String, required: true },
});

articleSchema.methods.slug=function(){
return slugger(this.title,"-")
}
module.exports=mongoose.model("Article",articleSchema)