
import crypto from 'crypto';

export function generateResetToken(){
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 30 * 60 * 1000);
    return{
        token,
        expires
    };
}