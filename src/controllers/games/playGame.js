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
        .findOne({ _id: request.params.id })
        .then(game => {

            // Matchea que usuario esta logueado y empuja la eleccion al array de jugadas correspondiente
            if (actualPlayer === game.playerOneId) {
                const playerOneMove = playerChoice
                console.log('playerOneMove', playerOneMove)
                console.log('game.playerOneMoves', game.playerOneMoves)
            } else {
                const playerTwoMove = playerChoice
                console.log('playerTwoMove', playerTwoMove)
                console.log('game.playerTwoMoves', game.playerTwoMoves)

                

                // game.set([request.body.choice])
                // game.save()
            }

            // game.update({
            //     // $push: {playerTwoMoves: playerTwoMove}
            //     completed: false
            // })

            game.set(completed = false)
            game.save()
            


            // game.playerTwoMoves.set(playerTwoMove)

            // game.save().then(() => {
            //     response.status(200).end() 
            // })

            // game.playerTwoMoves.push(1)
            // game.save()
            // console.log('game.playerTwoMoves', game.playerTwoMoves)

        }).then(() => {

            response.status(200).json({
                message: 'Listo!'
            })

            // Definir el ganador de la jugada

            // Chequeo de que usuario es cual
            // if (request.user.id === game.playerOneId) {
            //     const actualPlayerOne = request.user.id
            //     const secondPlayerTwo = game.playerTwoId
            //     const secondUserChoice = game.playerTwoMoves[0]
            // } else if (request.user.id === game.playerTwoId) {
            //     const actualPlayerTwo = request.user.id
            //     const secondPlayerOne = game.playerOneId
            //     const secondUserChoice = game.playerOneMoves[0]
            // } else {
            //     console.log('No coincide ningun usuario')
            // }
            
            // console.log('SECOND USER CHOICE: ', game.playerTwoMoves[0])
            // console.log('Eleccion del 2do usuario en la BD: ', secondUserChoice)
            // console.log('SECOND USER CHOICE: ', actualPlayerTwo)


            // Define el ganador de la juagda
            // if (actualPlayerChoice.losesTo === secondUserChoice) {
            //     // Usuario actual pierde
            //     console.log('Usuario actual pierde')
            //     const game = request.params.id
            //     const losser = request.user.id
            // } else if (secondUserChoice.losesTo === actualPlayerChoice) {
            //     // Usuario actual gana
            //     console.log('Usuario actual gana')
            //     const game = request.params.id
            //     const winner = request.user.id
            // } else if (secondUserChoice === actualPlayerChoice) {
            //     console.log('Draw')
            // }

            // Dependiendo del ganador, empuja el id del elemento jugado en el array de jugadas
            // En ambos casos empuja el id del ganador en el array de ganadores
            // if (actualPlayer = playerOneId) {
            //     playerOneMoves.push(actualPlayerChoice)
            //     movesWinners.push(actualPlayer)
            // } else {
            //     playerTwoMoves.push(actualPlayerChoice)
            //     movesWinners.push(actualPlayer)
            // }

            // Determinar ganador del juego despues de tres partidas jugadas
            // if (movesWinners.length === 3) {
            //     const findWinner = (movesWinners) => {
            //         movesWinners.filter((item, index) => arr.indexOf(item) !== index)
            //         const winner = findWinner(movesWinners) // Output: id que se repite
            //     }
            //     game.winnerId = winner
            //     game.completed = true
            // }

        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error al intentar modificar el juego'
            })
        })
}