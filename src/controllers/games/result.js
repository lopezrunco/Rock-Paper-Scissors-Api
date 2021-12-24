const { gameModel } = require('../../models/game')

module.exports = (request, response) => {

    gameModel
        .findOne({ _id: request.params.id })
        .then(game => {
            // Definir ganador
            for (let i = 0; i < 3; i++) {
                if (game.playerOneMoves[i].losesTo === game.playerTwoMoves[i].choice) {
                    console.log('Usuario one pierde --------------------------------------')
                    game.movesWinners.push(game.playerTwoId)
                } else if (game.playerTwoMoves[i].losesTo === game.playerOneMoves[i].choice) {
                    console.log('Usuario one gana ----------------------------------------')
                    game.movesWinners.push(game.playerOneId)
                } else if (game.playerOneMoves[i].choice === game.playerOneMoves[i].choice) {
                    console.log('Empate ----------------------------------------')
                }
            }

            game.save()

        }).then(() => {
            response.status(200).json({
                message: 'Estos son los resultados'
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error obteniendo resultados'
            })
        })
}