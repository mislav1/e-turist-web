module.exports = {
    httpStatus: {
        BadRequest: 400,
        Unauthorized: 401,
        Forbidden: 403,
        NotFound: 404,
        InternalServerError: 500,
        Success: 200
    },
    maxFileSize: 10 * 1024 * 1024,
    allowedExtensions: [".jpg", ".png", ".jpeg"],
    deletedUsersPassword: "Obrisan1@",
    deletedUsersEmail: "obrisani@korisnik.hr",
    deletedUsersName: "Obrisani Korisnik"
}