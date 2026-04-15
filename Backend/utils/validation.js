const validatePassword = (password) => {
    // 8-16 characters
    if (password.length < 8 || password.length > 16) return false;
    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    // At least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    return true;
};

module.exports = { validatePassword };