const mongoose = require("mongoose");

const atdSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref:"user"
    },
    atd: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
    },
    date: {
        type: String, // Store formatted date as a string
        default: () => {
            const now = new Date();
            return now.toISOString().split('T')[0]; // Store as 'YYYY-MM-DD'
        }
    },
    time: {
        type: String, // Store formatted time as a string
        default: () => {
            const now = new Date();
            return now.toTimeString().split(' ')[0]; // Store as 'HH:MM:SS'
        }
    },
    day: {
        type: String,
        default: () => {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[new Date().getDay()]; // Get the current day as a string
        }
    },
});

const Atd = mongoose.model('atd', atdSchema);

module.exports = Atd;
