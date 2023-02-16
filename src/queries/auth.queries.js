module.exports = {
  GET_USER_BY_EMAIL: `
        SELECT * FROM users WHERE email = ?
    `,
  GET_USER_BY_GOOGLE: `
        SELECT * FROM users WHERE google = ?
    `,
  GET_USER_BY_FACEBOOK: `
        SELECT * FROM users WHERE facebook = ?
    `,
  CREATE_PROFILE_BY_EMAIL: `
        INSERT INTO users (email, password, name)
        VALUES (?, ?, ?)
    `,
  CREATE_PROFILE_BY_GOOGLE: `
      INSERT INTO users (google, name)
      VALUES (?, ?)
  `,
  CREATE_PROFILE_BY_FACEBOOK: `
      INSERT INTO users (facebook, name)
      VALUES (?, ?)
  `,
  UPDATE_PASSWORD: `
        UPDATE users 
        SET password = ?
        WHERE email = ?`,
};
