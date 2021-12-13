const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: { type: String, required: [true, 'cannot be empty'] },
    lastName: { type: String, required: [true, 'cannot be empty'] },
    email: { type: String, required: [true, 'cannot be empty'], unique: true },
    password: { type: String, required: [true, 'cannot be empty'] },
});

//using 'pre' middleware before saving user credentials.
// 'pre' middleware and bcrypt are used to hash the password and save it in database.

userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => next(err));
});

//comparing the hash passwords
userSchema.methods.comparePassword = function (loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);