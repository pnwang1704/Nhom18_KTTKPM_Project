import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import type { NextFunction, Response } from "express";
import { RequestWithUser } from "./request-with-user.interface";

@Injectable()
export class UserPayloadMiddleware implements NestMiddleware {
  use(req: RequestWithUser, _res: Response, next: NextFunction) {
    const header = req.headers["x-user-payload"] || req.headers["x_user_payload"];

    if (!header) {
      throw new UnauthorizedException("Unauthorized: Missing user payload");
    }

    try {
      const payload = typeof header === "string" ? JSON.parse(header) : header;
      if (!payload || !payload.userId) {
        throw new UnauthorizedException("Unauthorized: Invalid user payload");
      }

      req.user = {
        userId: String(payload.userId),
        email: payload.email ? String(payload.email) : undefined,
        role: payload.role ? String(payload.role) : undefined,
      };
      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Bad Request: Invalid X-User-Payload header");
    }
  }
}