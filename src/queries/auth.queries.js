module.exports = {
  GET_USER: `
        SELECT * FROM users WHERE email = ?
    `,
  CREATE_PROFILE: `
        INSERT INTO users (email, password, name, phone, gender)
        VALUES (?, ?, ?, ?, ?)
    `,
  CREATE_PROFILE_BY_GOOGLE: `
      INSERT INTO users (email, password, name, phone, gender, isGoogleAuth)
      VALUES (?, ?, ?, ?, ?, ?)
  `,
  UPDATE_PASSWORD: `
        UPDATE users 
        SET password = ?
        WHERE email = ?`,
};
