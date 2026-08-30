import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import type { Handler, NextFunction, Request, Response } from "express";

let cachedHandler: Handler | null = null;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.init();

  return app.getHttpAdapter().getInstance();
}

export default async function handler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }

  return cachedHandler(req, res, next);
}
