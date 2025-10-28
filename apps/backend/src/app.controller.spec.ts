import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('api/hello', () => {
    it('should return message payload', () => {
      const response = appController.getHello();
      expect(response).toHaveProperty(
        'message',
        'Hello from the NestJS backend!',
      );
      expect(response).toHaveProperty('timestamp');
    });
  });
});
