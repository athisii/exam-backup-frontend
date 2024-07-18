import "server-only"

import {decodeJwt} from "jose";
import {TokenClaims} from "@/types/types";

export function getClaims(token: string): TokenClaims {
    return decodeJwt(token);
}