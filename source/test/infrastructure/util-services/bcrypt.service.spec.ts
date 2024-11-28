import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from '../../../src/auth/infrastructure/util-services/bcryptService';
import * as bcrypt from 'bcrypt';

describe('BcryptService', () => {
  let bcryptService: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    bcryptService = module.get<BcryptService>(BcryptService);
  });

  describe('hashPassword', () => {
    it('비밀번호가 주어지고, 해싱 요청을 했을 때, 해싱된 비밀번호를 반환한다', async () => {
      // Given
      const password = 'sample_password';
      const hashedPasswordMock = 'hashedPassword';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPasswordMock);

      // When
      const result = await bcryptService.hashPassword(password);

      // Then
      expect(result).toBe(hashedPasswordMock);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10); // saltrounds 확인
    });
  });

  describe('comparePassword', () => {
    it('원본 비밀번호와 해싱된 비밀번호가 주어지고, 비교를 했을 때, 비밀번호가 일치하면 true를 반환한다', async () => {
      // Given
      const password = 'secure_password';
      const hashedPassword = 'hashed_password';
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      // When
      const result = await bcryptService.comparePassword(
        password,
        hashedPassword,
      );

      // Then
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });
});
