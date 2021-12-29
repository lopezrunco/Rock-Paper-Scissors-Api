const { gameModel } = require('../../models/game')

module.exports = (request, response) => {

    // Definicion de una paginacion por defecto
    const pagination = {
        offset: 0,
        limit: 9
    }
    // Si vienen valores de paginacion se asignan, si no, se usan los valores por defecto
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    // Busca los juegos que no esten completados y que uno de los ids de jugadores coincida con el usuario logueado
    gameModel
        .find({
            $and: [
                {
                    $or: [
                        { playerOneId: request.user.id },
                        { playerTwoId: request.user.id }
                    ]
                }, { completed: false }
            ]
        })
        .select('-playerOneMoves, -playerTwoMoves, -movesWinners,')  // Omision de campos
        .skip(pagination.offset)
        .limit(pagination.limit)
        .then(games => {
            gameModel
                .count()    // Cuenta la coleccion entera
                .then(count => {
                    const meta = {
                        count
                    }
                    // Responde con los juegos y el numero de juegos
                    response.status(200).json({
                        meta,
                        games
                    })
                }).catch(error => {
                    console.error(error)
                    response.status(500).json({
                        message: 'Error trying to list the games'
                    })
                })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to list the games'
            })
        })

}