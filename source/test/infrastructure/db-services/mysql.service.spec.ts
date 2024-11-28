import { MySQLService } from '../../../src/auth/infrastructure/db-services/mysql.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

describe('MySQLService', () => {
  let service: MySQLService<any>;
  let repository: jest.Mocked<Repository<any>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MySQLService,
        {
          provide: Repository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MySQLService<any>>(MySQLService);
    repository = module.get(Repository);
  });

  it('데이터베이스에 특정 ID 데이터가 존재할 때, 해당 ID로 데이터를 조회하면, 데이터를 반환한다', async () => {
    // Given
    const mockData = { id: 1, name: 'Test Entity' };
    repository.findOne.mockResolvedValue(mockData);

    // When
    const result = await service.findById(mockData.id);

    // Then
    expect(repository.findOne).toHaveBeenCalledWith(mockData.id);
    expect(result).toEqual(mockData);
  });

  it('저장할 데이터가 있을 때, 데이터를 저장하면, 저장된 데이터를 반환한다', async () => {
    // Given
    const mockEntity = { id: 1, name: 'Test Entity' };
    repository.save.mockResolvedValue(mockEntity);

    // When
    const result = await service.save(mockEntity);

    // Then
    expect(repository.save).toHaveBeenCalledWith(mockEntity);
    expect(result).toEqual(mockEntity);
  });

  it('업데이트할 ID와 데이터가 있을 때, 업데이트를 요청하면, 데이터가 업데이트 된다', async () => {
    // Given
    const mockEntity = { id: 1, name: 'Test Entity' };
    repository.update.mockResolvedValue({
      affected: 1,
      raw: {},
    } as any);

    // When
    await service.update(mockEntity.id, { name: 'Updated Entity' });

    // Then
    expect(repository.update).toHaveBeenCalledWith(mockEntity.id, {
      name: 'Updated Entity',
    });
  });

  it('삭제할 데이터 ID가 있을 때, 해당 ID로 삭제를 요청하면, 데이터가 삭제된다', async () => {
    // Given
    const mockId = 1;
    repository.delete.mockResolvedValue({} as any);

    // When
    await service.delete(mockId);

    // Then
    expect(repository.delete).toHaveBeenCalledWith(mockId);
  });
});
