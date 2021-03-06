const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash')
const bcrypt = require('bcryptjs');
const SALT_LEN = 10
const secret = require('../../../config/config').secrets.jwt
 
var UserSchema = new mongoose.Schema({
 
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email'
        }
    },
    name: {
        type: String,
        default: ''
    },
    surname: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    roles: {
        type: Array,
        default: ['guest']
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
 
})

UserSchema.methods.toJSON = function () {
    var user = this
    var userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email', 'name', 'surname'])
}

UserSchema.methods.generateAuthToken = function () {
    var user = this
    var access = 'auth'
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, secret).toString()

    user.tokens.push({
        access,
        token
    })
    return user.save()
        .then(() => {
            return token
        })
}

UserSchema.statics.findByToken = function (token) {
    var User = this
    var decoded;

    try {
        decoded = jwt.verify(token, secret)
    } catch (e) {
        return Promise.reject()
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this
    return User.findOne({email})
        .then((user) => {
            if(!user) {
                return Promise.reject()
            } 
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    if(res) {
                        resolve(user)
                    } else {
                        reject()
                    }
                })
            })
        })
}

UserSchema.methods.removeToken = function (token) {
    var user = this
    return user.update({
        $pull: {
            tokens: { token }
        }
    })
}

UserSchema.pre('save', function (next) {
    var user = this

    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_LEN, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

module.exports = mongoose.model('user', UserSchema)
