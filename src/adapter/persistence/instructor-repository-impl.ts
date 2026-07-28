import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstructorRepository } from '@/application/instructor/required/instructor-repository';
import { Instructor } from '@/domain/instructor/instructor';

@Injectable()
export class InstructorRepositoryImpl implements InstructorRepository {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
  ) {}
  async save(instructor: Instructor): Promise<Instructor> {
    return this.instructorRepository.save(instructor);
  }

  async findById(instructorId: number): Promise<Instructor | null> {
    return this.instructorRepository.findOneBy({
      _id: instructorId,
    } as any);
  }

  findByMemberId(memberId: number): Promise<Instructor | null> {
    return this.instructorRepository.findOne({
      where: { _member: { id: memberId } },
      relations: { _member: true },
    } as any);
  }
}
