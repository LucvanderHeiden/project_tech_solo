const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true                  /* Door hier 'unique' aan toe te voegen geef ik aan dat er geen twee accounts met dezelfde username gemaakt kunnen worden.*/
    },
    email: {
        type: String,
        required: true,
        unique: true,                     /* Door hier 'required' aan toe te voegen geef ik aan dat dit veld verplicht is en dus ingevuld MOET worden. */
    },
    password: {
        type: String,
        required: true,
    },
    pc: {
        type: String,
    },
    playstation: {
        type: String,
    },
    xbox: {
        type: String,
    },
    fortnite: {
        type: String,
    },
    minecraft: {
        type: String,
    },
    gta: {
        type: String,
    },
    league: {
        type: String,
    },
    f1: {
        type: String,
    },
    valorant: {
        type: String,
    },
    rl: {
        type: String,
    },
    cod: {
        type: String,
    },
    fifa: {
        type: String,
    },
    stardew: {
        type: String,
    },
},
{collection: 'users'},       /* We geven aan dat deze informatie in de database in de collections genaamd users wordt opgeslagen. */
{timestamps: true})          /*Dit geeft automatische timestamps zodat we kunnen zien wanneer er data is toegevoegd/aangepast.*/

const User = mongoose.model('user', UserSchema)
module.exports = User