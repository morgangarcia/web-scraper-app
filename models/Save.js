const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SaveSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
    },
    byLine: {
        type: String,

    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});
const Save = mongoose.model("Save", SaveSchema);

module.exports = Save;