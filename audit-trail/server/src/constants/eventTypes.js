const constants = {
    USER_ROLES: {
        ADMIN: "admin",
        USER: "user"
    },

    HTTP_STATUS: {
        SUCCESS: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
    },

    MESSAGES: {
        SUCCESS: "Operation successful",
        UNAUTHORIZED: "Unauthorized access",
        SERVER_ERROR: "Internal server error"
    }
};
module.exports = constants;
