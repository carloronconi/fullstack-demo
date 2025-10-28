import { ApiKey } from './api-key.guard';

describe('GreetingsGuard', () => {
  it('should be defined', () => {
    expect(new ApiKey()).toBeDefined();
  });
});
