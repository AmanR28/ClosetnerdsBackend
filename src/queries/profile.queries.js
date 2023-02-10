module.exports = {
  SHOW_PROFILE: `
        SELECT * FROM profiles WHERE email = ?
    `,
  CREATE_PROFILE: `
        INSERT INTO profiles (email, name, phone, gender)
        VALUES (?, ?, ?, ?)
    `,
  UPDATE_PROFILE_MEASURE: `
        UPDATE profiles 
        SET measures = ?
        WHERE email = ?`,
  UPDATE_PROFILE_WEARS: `
        UPDATE profiles 
        SET wears = ?, subs = ?
        WHERE email = ?`,
  UPDATE_PROFILE_OCCASIONS: `
        UPDATE profiles 
        SET occasions = ?
        WHERE email = ?`,
  UPDATE_PROFILE_PRICES: `
        UPDATE profiles 
        SET prices = ?
        WHERE email = ?`,
  UPDATE_PROFILE_COLORS: `
        UPDATE profiles 
        SET colors = ?
        WHERE email = ?`,
  UPDATE_PROFILE_TYPE: `
        UPDATE profiles 
        SET type = ?
        WHERE email = ?`,
  UPDATE_PROFILE_BRANDS: `
        UPDATE profiles 
        SET brands = ?
        WHERE email = ?`,
  UPDATE_PROFILE_CELEBRITY: `
        UPDATE profiles 
        SET celebrity = ?
        WHERE email = ?`,
  UPDATE_PROFILE_SKIN: `
        UPDATE profiles 
        SET skin = ?
        WHERE email = ?`,
  UPDATE_PROFILE_PICTURE: `
        UPDATE profiles 
        SET picture = ?
        WHERE email = ?`,
  GET_MAIL_COUNT: `
        SELECT name, mailCount FROM profiles WHERE email = ?
    `,
  ADD_MAIL_COUNT: `
        UPDATE profiles 
        SET mailCount = mailCount+1
        WHERE email = ?`,
};
