import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { elizaLogger } from "@elizaos/core";

// JWT secret should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "eliza-wallet-auth-secret";

export interface AuthenticatedRequest extends Request {
    walletAddress?: string;
}

export function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json({ error: "Authentication token is required" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            walletAddress: string;
        };
        req.walletAddress = decoded.walletAddress;
        next();
    } catch (error) {
        elizaLogger.error(`Authentication error: ${error.message}`);
        return res.status(401).json({ error: "Invalid authentication token" });
    }
}
