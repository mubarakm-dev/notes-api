import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { any } from 'joi';
import { DB } from '../database/database.module';


describe('UsersService', () => {
  let service: UsersService;
  let mockDb : any;



  beforeEach(async () => {

    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn(),
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: DB, useValue: mockDb }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });



  it('should return a user when find', async() => {
    mockDb.where.mockResolvedValue([{id: 1, email: 'test@example.com', name: 'Test User'}])
    const result = await service.findByEmail('test@example.com')
    expect(result).toEqual({id: 1, email: 'test@example.com', name: 'Test User'});
  });

  it('should return undefined if no user found', async()=>{
     mockDb.where.mockResolvedValue([])
     const result = await service.findByEmail('test@Example')
     expect(result).toBeUndefined();



  })

});
