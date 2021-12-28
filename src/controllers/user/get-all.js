const { userModel } = require("../../models/user");

module.exports = (request, response) => {
    const pagination = {
        offset: 0,
        limit: 10
    }
    if (request.query.page && request.query.itemsPerPage) {
        pagination.offset = (request.query.page - 1) * request.query.itemsPerPage,
            pagination.limit = parseInt(request.query.itemsPerPage)
    }

    userModel
        .find()     // Obtiene toda la lista de usuarios sin filtro
        .select('-email -password -mfaEnabled -mfaSecret')  // Omision de campos
        .skip(pagination.offset)
        .limit(pagination.limit)
        .then(users => {
            userModel
                .count()
                .then(count => {
                    const meta = {
                        count
                    }
                    // Responde con los usuarios y el numero de usuarios
                    response.status(200).json({
                        meta,
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