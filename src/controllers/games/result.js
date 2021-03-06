const { gameModel } = require('../../models/game')

module.exports = (request, response) => {
    gameModel
        .findOne({ _id: request.params.id })
        .then(game => {

            game.movesWinners = []  // Limpia el array de ganadores para que no se acumulen los push con cada peticion
            let choicePlayerOne
            let choicePlayerTwo

            // Define el ganador en cada jugada y empuja el id del ganador al array de ganadores
            for (let i = 0; i <= 2; i++) {

                // En cada jugador, setea un objeto dependiendo de la jugada
                if (game.playerOneMoves[i] === 1) {
                    choicePlayerOne = { id: 1, name: 'rock', losesTo: 2 }
                } else if (game.playerOneMoves[i] === 2) {
                    choicePlayerOne = { id: 2, name: 'paper', losesTo: 3 }
                } else if (game.playerOneMoves[i] === 3) {
                    choicePlayerOne = { id: 3, name: 'scissors', losesTo: 1 }
                }
                if (game.playerTwoMoves[i] === 1) {
                    choicePlayerTwo = { id: 1, name: 'rock', losesTo: 2 }
                } else if (game.playerTwoMoves[i] === 2) {
                    choicePlayerTwo = { id: 2, name: 'paper', losesTo: 3 }
                } else if (game.playerTwoMoves[i] === 3) {
                    choicePlayerTwo = { id: 3, name: 'scissors', losesTo: 1 }
                }

                // Pushes al array de ganadores, si hay empate, empuja 0
                if (choicePlayerOne && choicePlayerTwo) {
                    if (choicePlayerOne.losesTo === choicePlayerTwo.id) {
                        game.movesWinners.push(game.playerTwoId)
                    } else if (choicePlayerTwo.losesTo === choicePlayerOne.id) {
                        game.movesWinners.push(game.playerOneId)
                    } else if (choicePlayerOne.id === choicePlayerTwo.id) {
                        game.movesWinners.push(0)
                    } 
                }

                // Si los jugadores ya jugaron 3 veces, significa que el juego termino.
                // Pasa el completed a true para que en la UI no permita continuar con dicho juego
                if (game.playerOneMoves.length >= 3 && game.playerTwoMoves.length >= 3) {
                    game.completed = true
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