var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ContactDetailSchema = new Schema({
        msisdn:{type:String,required:true},
        first_name:{type:String,required:true},
        last_name:{type:String,required:true},
        zip:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        email:{type:String,required:true}
    });

var GroupSchema = new Schema({
        name:{type:String},
        contacts:{type:[ContactDetailSchema]},
        add_date:{type:Date,required:false,default: Date.now
        }
    });


var UserSchema = new Schema({
        name: { type: String, required: true},
        groups:{type:[GroupSchema]},
        reg_date: { type: Date, default: Date.now },
        file_name:{type:String}
         });





var User = mongoose.model('User', UserSchema);
var Group = mongoose.model('Group', GroupSchema);
var ContactDetail = mongoose.model('ContactDetail', ContactDetailSchema);

module.exports = {
    User: User,
    Group: Group,
    ContactDetail: ContactDetail
};