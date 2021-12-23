const { gameModel } = require('../../models/game')

module.exports = (request, response) => {
    const choices = [
        { "id": 1, "name": "rock", "losesTo": 2 },
        { "id": 2, "name": "paper", "losesTo": 3 },
        { "id": 3, "name": "scissors", "losesTo": 1 }
    ]
    const actualPlayer = request.user.id
    const playerChoice = request.body.choice

    console.log('---------------------------------------------------------------------')
    console.log(`Usuario: ${actualPlayer}. Eleccion: ${playerChoice}. Juego: ${request.params.id}`)
    console.log('---------------------------------------------------------------------')

    gameModel
        .findByIdAndUpdate({_id: request.params.id},
            { $push: { "playerTwoMoves": request.body.choice } } 
        )


        // .findOne({ _id: request.params.id })
        // .then(game => {

            

        //     // Matchea que usuario esta logueado y empuja la eleccion al array de jugadas correspondiente
        //     // if (actualPlayer === game.playerOneId) {
        //     //     const playerOneMove = playerChoice
        //     //     console.log('playerOneMove', playerOneMove)
        //     //     console.log('game.playerOneMoves', game.playerOneMoves)
        //     // } else {
        //     //     const playerTwoMove = playerChoice
        //     //     console.log('playerTwoMove', playerTwoMove)
        //     //     console.log('game.playerTwoMoves', game.playerTwoMoves)
        //     // }
        // })
        .then(() => {
            response.status(200).json({
                message: 'Listo!'
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error al intentar modificar el juego'
            })
        })
}