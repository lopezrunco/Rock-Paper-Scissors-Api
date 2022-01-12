const { gameModel } = require('../../models/game')

module.exports = (request, response) => {

    // Definicion de una paginacion por defecto
    const pagination = {
        offset: 0,
        limit: 10
    }
    // Si vienen valores de paginacion se asignan, si no, se usan los valores por defecto
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    // Busca los juegos completados donde uno de los ids de jugadores coincida con el usuario logueado
    gameModel
        .find({
            $and: [
                {
                    $or: [
                        { playerOneId: request.user.id },
                        { playerTwoId: request.user.id }
                    ]
                }, { completed: true }
            ]
        })
        .select('-completed')  // Omision de campos
        .skip(pagination.offset)
        .limit(pagination.limit)
        .then(games => {
            response.status(200).json({
                games
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to list the games'
            })
        })

}