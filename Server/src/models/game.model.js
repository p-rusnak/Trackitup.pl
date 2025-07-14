const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ScoreSchema = mongoose.Schema(
    {
        user: {
            type: String,
            required: true
        },
        reviewer: {
            type: String,
            required: true
        },
        selection: {
            type: String,
            required: false
        }
    }
)
// const mockGame = {
//     id: 1,
//     name: "Hogwart's Legacy",
//     coverImg: 'https://image.api.playstation.com/vulcan/ap/rnd/202208/0921/dR9KJAKDW2izPbptHQbh3rnj.png',
//     developer: ['Avalanche Software', 'Portkey Games'],
//     publisher: ['Warner Bros. Interactive Entertainment'],
//     score: {user: '8.4', reviewer: '9', selection: '5'},
//     platforms: ['ps4, ps5, pc, xone, xsx'],
//     description: `LIVE THE UNWRITTEN - Hogwarts Legacy is an immersive, open-world action RPG set in the world first introduced in the Harry Potter books. Now you can take control of the action and be at the center of your own adventure in the wizarding world. Embark on a journey through familiar and new locations as you explore and discover fantastic beasts, customize your character and craft potions, master spell casting, upgrade talents, and become the wizard you want to be.
// Experience Hogwarts in the 1800s.Your character is a student who holds the key to an ancient secret that threatens to tear the wizarding world apart.You have received a late acceptance to the Hogwarts School of Witchcraft and Wizardry and soon discover that you are no ordinary student: you possess an unusual ability to perceive and master Ancient Magic.Only you can decide if you will protect this secret for the good of all, or yield to the temptation of more sinister magic.
// Discover the feeling of living at Hogwarts as you make allies, battle Dark wizards, and ultimately decide the fate of the wizarding world.Your legacy is what you make of it`
// }

const gameSchema = mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
        },
        coverImg: {
            type: String,
            required: true,
        },
        developer: {
            type: Array,
            required: true,
        },
        publisher: {
            type: Array,
            required: true,
        },
        score: {
            type: ScoreSchema,
            required: false,
        },
        platforms: {
            type: Array,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
);

// add plugin that converts mongoose to json
gameSchema.plugin(toJSON);
gameSchema.plugin(paginate);

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;