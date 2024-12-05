import "server-only"

import {cookies} from "next/headers";
import {decrypt} from "@/lib/crypto";
import {getClaims} from "@/lib/jwt";
import {IdentityContext, TokenClaims} from "@/types/types";


function getTokenFromCookie(): string {
    const cookieStore = cookies()
    const encryptedToken = cookieStore.get("token");
    if (!encryptedToken) {
        throw new Error("Could not find token in the cookie.")
    }
    const encryptedTokenParts = encryptedToken?.value.split(":");
    let token = decrypt(encryptedTokenParts[0], encryptedTokenParts[1], encryptedTokenParts[2]);
    // TODO: check token expiration; use refresh token to get new token if expired
    // const epoch = getClaims(token).exp as number; // in seconds
    // const tokenExpiryDate = new Date(epoch * 1000);
    // console.log("date: ", tokenExpiryDate)
    return token;
}

export default function identityContext(): IdentityContext {
    try {
        const token = getTokenFromCookie();
        const jwtClaims = getClaims(token)
        return {
            authenticated: true,
            token: token,
            tokenClaims: jwtClaims as TokenClaims
        }
    } catch (err) {
        console.log("## Unable to decrypt token or extract claims: ", err);
        return {
            authenticated: false,
            token: null,
            tokenClaims: null
        }
    }
}
