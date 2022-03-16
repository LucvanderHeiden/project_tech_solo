const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true                   /* Door hier 'unique' aan toe te voegen geef ik aan dat er geen twee accounts met dezelfde username gemaakt kunnen worden.*/
    },
    email: {
        type: String,
        required: true,
        unique: true                    /* Door hier 'unique' aan toe te voegen geef ik aan dat er geen twee accounts met dezelfde username gemaakt kunnen worden.*/
    },
    password: {
        type: String,
        required: true
    },
    pc: {
        type: Boolean,
    },
    playstation: {
        type: Boolean,
    },
    xbox: {
        type: Boolean,
    },
    fortnite: {
        type: Boolean,
    },
    minecraft: {
        type: Boolean,
    },
    gta: {
        type: Boolean,
    },
    league: {
        type: Boolean,
    },
    f1: {
        type: Boolean,
    },
    valorant: {
        type: Boolean,
    },
    rl: {
        type: Boolean,
    },
    cod: {
        type: Boolean,
    },
    fifa: {
        type: Boolean,
    },
    stardew: {
        type: Boolean,
    },
},
{collection: 'users'},
{timestamps: true})          /*Dit geeft automatische timestamps zodat we kunnen zien wanneer er data is toegevoegd/aangepast.*/

const model = mongoose.model('user', UserSchema)
module.exports = model