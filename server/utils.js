import User from './models/Users.js';

function generateKey(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

export async function generateUniqueInviteKey() {
    let key;
    let exists = true;

    while (exists) {
        key = generateKey();
        exists = await User.exists({ inviteKey: key });
    }

    return key;
}
