let mongoose=require("mongoose");
let Schema=mongoose.Schema;

let userSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    images :String

})
module.exports=mongoose.model("User",userSchema)