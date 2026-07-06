import { createVercelHandler } from '../src/vercelAdapter';

function createResponse() {
  return {
    headersSent: false,
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe('createVercelHandler', () => {
  it('validates once and connects before every Express handoff', async () => {
    const app = jest.fn();
    const connectDatabase = jest.fn().mockResolvedValue(undefined);
    const validateEnvironment = jest.fn();
    const handler = createVercelHandler({ app, connectDatabase, validateEnvironment });

    const firstResponse = createResponse();
    const secondResponse = createResponse();

    await handler({ url: '/api/v1/health' }, firstResponse);
    await handler({ url: '/api/v1/products' }, secondResponse);

    expect(validateEnvironment).toHaveBeenCalledTimes(1);
    expect(connectDatabase).toHaveBeenCalledTimes(2);
    expect(app).toHaveBeenCalledTimes(2);
    expect(app).toHaveBeenNthCalledWith(1, { url: '/api/v1/health' }, firstResponse);
    expect(app).toHaveBeenNthCalledWith(2, { url: '/api/v1/products' }, secondResponse);
  });

  it('returns a deployment configuration error when setup fails before Express handles the request', async () => {
    const app = jest.fn();
    const connectDatabase = jest.fn().mockRejectedValue(new Error('missing database'));
    const validateEnvironment = jest.fn();
    const handler = createVercelHandler({ app, connectDatabase, validateEnvironment });
    const response = createResponse();

    await handler({ url: '/api/v1/health' }, response);

    expect(app).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'SERVERLESS_BOOT_ERROR',
        message: 'The API could not start. Check the deployment environment variables.',
      },
    });
  });
});
