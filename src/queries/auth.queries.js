module.exports = {
  GET_USER: `
        SELECT * FROM users WHERE email = ?
    `,
  CREATE_PROFILE: `
        INSERT INTO users (email, password, name, phone, gender)
        VALUES (?, ?, ?, ?, ?)
    `,
  UPDATE_PASSWORD: `
        UPDATE users 
        SET password = ?
        WHERE email = ?`,
};
