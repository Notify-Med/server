const mongoose = require('mongoose');

const receiverSchema = mongoose.Schema({
    status:{
        type: Boolean,
        required: true
    },
    notificationId:[{  //each language is related to only one user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
        index: true 
    }]

},
{timestamps: true} )

const Receiver = mongoose.model('Receiver',receiverSchema);
module.exports = Receiver;
