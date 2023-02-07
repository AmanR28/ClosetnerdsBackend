module.exports = {
  GET_USER: `
        SELECT * FROM users WHERE email = ?
    `,
  GET_USER_BY_ID: `
      SELECT * FROM users WHERE email = ?
  `,
  CREATE_PROFILE: `
        INSERT INTO users (email, password)
        VALUES (?, ?)
    `,
};
