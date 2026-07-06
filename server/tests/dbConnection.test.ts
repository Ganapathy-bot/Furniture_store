import mongoose from 'mongoose';
import { connectDB } from '../src/config/db';

jest.mock('mongoose', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
    connection: {
      on: jest.fn(),
      readyState: 0,
    },
  },
}));

const mockedMongoose = mongoose as unknown as {
  connect: jest.Mock;
  connection: {
    on: jest.Mock;
    readyState: number;
  };
};

describe('connectDB', () => {
  beforeEach(() => {
    mockedMongoose.connect.mockReset();
    mockedMongoose.connect.mockResolvedValue(mockedMongoose);
    mockedMongoose.connection.on.mockClear();
    mockedMongoose.connection.readyState = 0;
  });

  it('does not reconnect when mongoose is already connected', async () => {
    mockedMongoose.connection.readyState = 1;

    await connectDB();

    expect(mockedMongoose.connect).not.toHaveBeenCalled();
  });

  it('shares one connection attempt across concurrent calls', async () => {
    let resolveConnect!: () => void;
    const connected = new Promise<void>((resolve) => {
      resolveConnect = resolve;
    });

    mockedMongoose.connect.mockImplementationOnce(async () => {
      mockedMongoose.connection.readyState = 2;
      await connected;
      mockedMongoose.connection.readyState = 1;
      return mockedMongoose;
    });

    const first = connectDB();
    const second = connectDB();

    expect(mockedMongoose.connect).toHaveBeenCalledTimes(1);

    resolveConnect();
    await expect(Promise.all([first, second])).resolves.toEqual([undefined, undefined]);
  });
});
