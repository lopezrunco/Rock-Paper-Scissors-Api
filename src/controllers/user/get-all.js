const { userModel } = require("../../models/user")
const { gameModel } = require('../../models/game')

module.exports = (request, response) => {
    const pagination = {
        offset: 0,
        limit: 30
    }
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    // Selecciona los juegos sin completar en los que participa el usuario logueado
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
        .select('playerOneId playerTwoId')
        .then(games => {

            // Mapea el array de juegos obtenidos y empuja los ids de los jugadores a un nuevo array
            let idsObtained = []
            games.map((game, index) => {
                idsObtained.push(games[index].playerOneId)
                idsObtained.push(games[index].playerTwoId)
            })

            // Obtiene los usuarios que no incluyen los ids del array
            userModel
                .find({ _id: { $nin: idsObtained } })
                .select('nickname id')
                .skip(pagination.offset)
                .limit(pagination.limit)
                .then(users => {
                    response.status(200).json({
                        users
                    })
                }).catch(error => {
                    console.error(error)
                    response.status(500).json({
                        message: 'Error trying to list the users'
                    })
                })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to list the users'
            })
        })
}