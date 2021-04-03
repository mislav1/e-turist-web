module.exports = {
    httpStatus: {
        BadRequest: 400,
        Unauthorized: 401,
        Forbidden: 403,
        NotFound: 404,
        InternalServerError: 500,
    },
    maxFileSize: 10 * 1024 * 1024,
    allowedExtensions: [".jpg", ".png", ".jpeg"]
}