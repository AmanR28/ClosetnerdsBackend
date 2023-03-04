module.exports = {
  // Internal Server Errors : 500
  SYSTEM_FAILURE: {
    state: 'Failure',
    code: 'SYSTEM_FAILURE',
  },

  DATABASE_FAILURE: {
    state: 'Failure',
    code: 'DATABASE_FAILURE',
  },

  // Bad Request : 400
  MISSING_FIELD: {
    state: 'Failure',
    code: 'MISSING_FIELD',
  },

  INVALID_EMAIL: {
    state: 'Failure',
    code: 'INVALID_EMAIL',
  },

  BAD_REQUEST: {
    state: 'Failure',
    code: 'BAD_REQUEST',
  },

  // Conflict : 409
  DUPLICATE_FIELD: {
    state: 'Failure',
    code: 'DUPLICATE_FIELD',
  },

  // Not Found : 404
  NOT_FOUND: {
    state: 'Failure',
    code: 'NOT_FOUND',
  },

  // Unauthorized : 401
  UNAUTHORIZED: {
    state: 'Failure',
    code: 'UNAUTHORIZED',
  },

  NOT_REGISTERED: {
    state: 'Failure',
    code: 'NOT_REGISTERED',
  },

  INVALID_CREDENTIAL: {
    state: 'Failure',
    code: 'INVALID_CREDENTIAL',
  },

  INVALID_TOKEN: {
    state: 'Failure',
    code: 'INVALID_TOKEN',
  },
};
