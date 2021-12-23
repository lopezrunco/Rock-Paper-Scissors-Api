const { gameModel } = require('../../models/game')

module.exports = (request, response) => {
    const actualPlayer = request.user.id
    const playerChoice = request.body

    gameModel
        .findOne({ _id: request.params.id })
        .then(game => {
            // Matchea que usuario esta logueado y de acuerdo a eso empuja la juagada al array de jugadas
            if (actualPlayer === game.playerOneId) {
                const playerOneMove = playerChoice
                game.playerOneMoves.push(playerOneMove)
            } else {
                const playerTwoMove = playerChoice
                game.playerTwoMoves.push(playerTwoMove)
            }
            game.save()

            // Definir ganador
            console.log('Definiendo ganador -------------------------------------------------------------')
            console.log('playerOneMoves', game.playerOneMoves)
            console.log('playerTwoMoves', game.playerTwoMoves)

            for (let getWinnerIndex = 0; getWinnerIndex < 3; getWinnerIndex++) {
                if (game.playerOneMoves[getWinnerIndex].losesTo === game.playerTwoMoves[getWinnerIndex].choice) {
                    console.log('Usuario one pierde --------------------------------------')
                } else if (game.playerTwoMoves[getWinnerIndex].losesTo === game.playerOneMoves[getWinnerIndex].choice) {
                    console.log('Usuario one gana ----------------------------------------')
                } else if (game.playerOneMoves[getWinnerIndex].choice === game.playerOneMoves[getWinnerIndex].choice) {
                    console.log('Empate ----------------------------------------')
                }
            }

        }).then(() => {
            response.status(200).json({
                message: 'Played!'
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to update the game'
            })
        })
}