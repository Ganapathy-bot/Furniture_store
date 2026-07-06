import { logger } from './utils/logger';

type ExpressLikeApp = (req: any, res: any) => void;

type VercelHandlerDependencies = {
  app: ExpressLikeApp;
  connectDatabase: () => Promise<void>;
  validateEnvironment: () => void;
};

type ServerlessRequest = Record<string, unknown>;
type ServerlessResponse = {
  headersSent?: boolean;
  status: (code: number) => ServerlessResponse;
  json: (body: unknown) => ServerlessResponse;
};

export function createVercelHandler({
  app,
  connectDatabase,
  validateEnvironment,
}: VercelHandlerDependencies) {
  let hasValidatedEnvironment = false;

  return async function vercelHandler(
    req: ServerlessRequest,
    res: ServerlessResponse
  ): Promise<void> {
    try {
      if (!hasValidatedEnvironment) {
        validateEnvironment();
        hasValidatedEnvironment = true;
      }

      await connectDatabase();
      app(req, res);
    } catch (error) {
      logger.error('Failed to initialize Vercel API function', { error });

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: {
            code: 'SERVERLESS_BOOT_ERROR',
            message: 'The API could not start. Check the deployment environment variables.',
          },
        });
      }
    }
  };
}
