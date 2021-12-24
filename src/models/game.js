const { model, Schema } = require('mongoose')

const gameSchema = new Schema({
    playerOneId: {
        type: String,
        required: true,
        trim: true
    },
    playerTwoId: {
        type: String,
        required: true,
        trim: true
    },
    playerOneMoves: {
        type: Array,
        default: []
    },
    playerTwoMoves: {
        type: Array,
        default: []
    },
    movesWinners: {
        type: Array,
        default: []
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    }
})

const gameModel = model('games', gameSchema)

module.exports = {
    gameSchema,
    gameModel
}