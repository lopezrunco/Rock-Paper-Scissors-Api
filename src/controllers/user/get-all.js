const { userModel } = require("../../models/user")
const { gameModel } = require('../../models/game')

module.exports = (request, response) => {
    // const pagination = {
    //     offset: 0,
    //     limit: 12
    // }
    // if (request.query.page && request.query.itemsPerPage) {
    //     pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
    //         pagination.limit = parseInt(request.query.itemsPerPage)
    // }

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

            let idsObtained = []
            games.map((game, index) => {
                idsObtained.push(games[index].playerOneId)
                idsObtained.push(games[index].playerTwoId)
            })


            userModel
                // .find({ _id: { $nin: [games.playerOneId, games.playerTwoId, '61e7f3a359b3467a62e217b2'] } })
                .find({ _id: { $nin: idsObtained } })
                .select('nickname')
                .then(users => {
                    response.status(20git branch
                        0).json({
                        users
                    })
                })
        })

    // userModel
    //     .find({
    //         $and: [
    //             { _id: {$ne: request.user.id} } // Obtiene todos los usuarios menos el que esta logueado
    //         ]
    //     })
    //     .select('-email -password -mfaEnabled -mfaSecret')  // Omision de campos
    //     .skip(pagination.offset)
    //     .limit(pagination.limit)
    //     .then(users => {
    //         userModel
    //             .count()
    //             .then(count => {
    //                 const meta = {
    //                     count
    //                 }
    //                 // Responde con los usuarios y el numero de usuarios
    //                 response.status(200).json({
    //                     meta,
    //                     users
    //                 })
    //             }).catch(error => {
    //                 console.error(error)
    //                 response.status(500).json({
    //                     message: 'Error trying to list the users'
    //                 })
    //             })
    //     }).catch(error => {
    //         console.error(error)
    //         response.status(500).json({
    //             message: 'Error trying to list the users'
    //         })
    //     })
}