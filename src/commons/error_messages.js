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
};
