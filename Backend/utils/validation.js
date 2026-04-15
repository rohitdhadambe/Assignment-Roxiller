const validateName = (name) => {
    // Min 20, Max 60 characters
    if (name.length < 20 || name.length > 60) return false;
    return true;
};

const validateEmail = (email) => {
    // Standard email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateAddress = (address) => {
    // Max 400 characters
    if (address.length > 400) return false;
    return true;
};

const validatePassword = (password) => {
    // 8-16 characters
    if (password.length < 8 || password.length > 16) return false;
    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    // At least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    return true;
};

module.exports = { validateName, validateEmail, validateAddress, validatePassword };