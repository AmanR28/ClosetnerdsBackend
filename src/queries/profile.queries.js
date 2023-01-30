module.exports = {
    SHOW_PROFILE: `
        SELECT * FROM profiles WHERE email = ?
    `,
    CREATE_PROFILE: `
        INSERT INTO profiles (email, name, phone, gender)
        VALUES (?, ?, ?, ?)`,

    UPDATE_PROFILE_MEASURE: `
        UPDATE profiles 
        SET bust = ?, waist = ?, hip = ?, length = ?
        WHERE email = ?`,
    UPDATE_PROFILE_WEARS: `
        UPDATE profiles 
        SET wear = ?, sub = ?
        WHERE email = ?`,
    UPDATE_PROFILE_OCCASION: `
        UPDATE profiles 
        SET occasion1 = ?, occasion2 = ?, occasion3 = ?
        WHERE email = ?`,
    UPDATE_PROFILE_PRICES: `
        UPDATE profiles 
        SET price1 = ?, price2 = ?, price3 = ?
        WHERE email = ?`,
    UPDATE_PROFILE_COLORS: `
        UPDATE profiles 
        SET color1 = ?, color2 = ?, color3 = ?
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
};
