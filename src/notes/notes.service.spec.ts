import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { NotFoundException } from '@nestjs/common';
import { DB } from '../database/database.module';

describe('NotesService', () => {
  let service: NotesService;
  let mockDb: any;


  beforeEach(async () => {

    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn(),
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService, {provide: DB, useValue: mockDb}],
    }).compile();

    service = module.get<NotesService>(NotesService);

  });

  it('should return a note when found', async () => {
    mockDb.where.mockResolvedValue([{ id: '1', title: 'Test Note', userId: 'user-1' }])
    const result = await service.findOne('1', 'user-1');
    expect(result).toEqual({ id: '1', title: 'Test Note', userId: 'user-1' });

  });

  it('should throw NotFoundException when no note is found', async()=>{
    mockDb.where.mockResolvedValue([]);
    await expect(service.findOne('nonexistent', 'user-1')).rejects.toThrow(NotFoundException)
  })
});

