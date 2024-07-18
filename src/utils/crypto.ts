import 'server-only'

import crypto from 'crypto';

export interface EncryptedData {
    iv: string;
    cipherText: string;
    authTag: string;
}

const ALGORITHM = 'aes-256-gcm';
const ENV_SECRET_KEY = process.env.SECRET_KEY;

if (!ENV_SECRET_KEY) {
    throw new Error('SECRET_KEY environment variable is not set');
}

const SECRET_KEY = generateSHA256Key(ENV_SECRET_KEY)

// Function to generate SHA-256 hash
function generateSHA256Key(input: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
}


export const encrypt = (data: string): EncryptedData => {
    const iv = crypto.randomBytes(12); // Generate a new IV for each encryption (12 bytes for GCM)
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag().toString('base64');
    return {
        iv: iv.toString('base64'),
        cipherText: encrypted,
        authTag: authTag
    };
};

export const decrypt = (iv: string, encryptedData: string, authTag: string): string => {
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
