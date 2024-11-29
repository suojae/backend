import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../src/auth/infrastructure/repositories/user.repository';
import { UserDAO } from '../../../src/auth/infrastructure/dao/user.dao';
import { CacheAsideService } from '../../../src/auth/infrastructure/db-services/cache-aside.service';
import { BcryptService } from '../../../src/auth/infrastructure/util-services/bcryptService';
import { UserEntity } from '../../../src/auth/domain/user.entity';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let cacheAsideService: jest.Mocked<CacheAsideService<UserDAO>>;
  let bcryptService: jest.Mocked<BcryptService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: CacheAsideService,
          useValue: {
            saveData: jest.fn(),
            getData: jest.fn(),
            updateData: jest.fn(),
            deleteData: jest.fn(),
          },
        },
        {
          provide: BcryptService,
          useValue: {
            hashPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    cacheAsideService = module.get(CacheAsideService);
    bcryptService = module.get(BcryptService);
  });

  describe('save', () => {
    it('사용자가 있으면, 저장 요청 시, 데이터가 저장된다', async () => {
      // Given
      const userEntity = new UserEntity();
      userEntity.id = 'uuid';
      userEntity.nickname = 'username';
      userEntity.password = 'password';

      const hashedPassword = 'hashed_password';
      const userDAO = new UserDAO();
      userDAO.uuid = 'uuid';
      userDAO.nickname = 'username';
      userDAO.character_id = 'dog';
      userDAO.hashed_password = hashedPassword;

      bcryptService.hashPassword.mockResolvedValue(hashedPassword);
      cacheAsideService.saveData.mockResolvedValue(userDAO);

      // When
      const result = await userRepository.save(userEntity);

      // Then
      expect(bcryptService.hashPassword).toHaveBeenCalledWith('password');
      expect(cacheAsideService.saveData).toHaveBeenCalledWith(
        `user:uuid`,
        expect.any(UserDAO),
      );
      expect(result).toEqual(UserEntity.fromDAO(userDAO));
    });
  });

  describe('findById', () => {
    it('유저 아이디가 있으면, 조회 요청 시, 유저 데이터가 반환된다', async () => {
      // Given
      const uuid = 'uuid';
      const userDAO = new UserDAO();
      userDAO.uuid = 'uuid';
      userDAO.nickname = 'username';
      userDAO.character_id = 'dog';
      userDAO.hashed_password = 'hashed_password';

      cacheAsideService.getData.mockResolvedValue(userDAO);

      // When
      const result = await userRepository.findById(uuid);

      // Then
      expect(cacheAsideService.getData).toHaveBeenCalledWith(
        `user:${uuid}`,
        uuid as any,
      );
      expect(result).toEqual(UserEntity.fromDAO(userDAO));
    });

    it('유저 아이디가 없으면, 조회 요청 시, null이 반환된다', async () => {
      // Given
      const uuid = 'uuid';

      cacheAsideService.getData.mockResolvedValue(null);

      // When
      const result = await userRepository.findById(uuid);

      // Then
      expect(cacheAsideService.getData).toHaveBeenCalledWith(
        `user:${uuid}`,
        uuid as any,
      );
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('유저 아이디가 있으면, 업데이트 요청 시, 데이터가 수정된다', async () => {
      // Given
      const uuid = 'uuid';
      const currentDAO = new UserDAO();
      currentDAO.uuid = uuid;
      currentDAO.nickname = 'username';
      currentDAO.character_id = 'dog';
      currentDAO.hashed_password = 'hashed_password';

      const partialUser = { nickname: 'new_username' };

      cacheAsideService.getData.mockResolvedValue(currentDAO);
      cacheAsideService.updateData.mockResolvedValue();

      // When
      await userRepository.update(uuid, partialUser);

      // Then
      expect(cacheAsideService.getData).toHaveBeenCalledWith(
        `user:${uuid}`,
        uuid as any,
      );
      expect(cacheAsideService.updateData).toHaveBeenCalledWith(
        `user:${uuid}`,
        uuid as any,
        expect.any(UserDAO),
      );
    });

    it('유저 아이디가 없으면, 업데이트 요청 시, 에러가 발생한다', async () => {
      // Given
      const uuid = 'uuid';
      const partialUser = { nickname: 'new_username' };

      cacheAsideService.getData.mockResolvedValue(null);

      // When &Then
      await expect(userRepository.update(uuid, partialUser)).rejects.toThrow(
        'User not found',
      );
      expect(cacheAsideService.getData).toHaveBeenCalledWith(
        `user:${uuid}`,
        uuid as any,
      );
    });
  });

  describe('delete', () => {
    it('유저 아이디가 있으면, 삭제 요청 시, 데이터가 삭제된다', async () => {
      // Given
      const uuid = 'uuid';

      cacheAsideService.deleteData.mockResolvedValue();

      // When
      await userRepository.delete(uuid);

      // Then
      expect(cacheAsideService.deleteData).toHaveBeenCalledWith(
        `user:${uuid}`,
        uuid as any,
      );
    });
  });
});
