import jwt from 'jsonwebtoken';
import config from './src/config/environment.js';

const token = jwt.sign({userId: 1}, config.jwt.secret, {expiresIn: '1h'});
console.log('Token:', token);