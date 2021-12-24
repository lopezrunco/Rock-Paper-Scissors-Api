const { gameModel } = require('../../models/game')

module.exports = (request, response) => {
    gameModel
        .findOne({ _id: request.params.id })
        .then(game => {

            // Limpia el array de ganadores para que no se acumulen los push con cada peticion
            game.movesWinners = []

            // Define el ganador en cada jugada y empuja el id del ganador al array de ganadores
            for (let i = 0; i < 3; i++) {
                if (game.playerOneMoves[i].losesTo === game.playerTwoMoves[i].choice) {
                    game.movesWinners.push(game.playerTwoId)
                } else if (game.playerTwoMoves[i].losesTo === game.playerOneMoves[i].choice) {
                    game.movesWinners.push(game.playerOneId)
                } else if (game.playerOneMoves[i].choice === game.playerOneMoves[i].choice) {
                    console.log('Manejar empate ----------------------------------------')
                }
            }
            game.save()

            response.status(200).json({
                message: 'Game results:',
                game
            })
            
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error obteniendo resultados'
            })
        })
}