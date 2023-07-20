const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: new Date(),
        required: true
    },
    senderId:{  
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true 
    },
    receiverId:[{  //each language is related to only one user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Receiver',
        index: true 
    }],

})

const Notification = mongoose.model('Notification',notificationSchema);
module.exports = Notification;
 