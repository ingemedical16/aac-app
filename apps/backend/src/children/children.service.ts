import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from './child.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private repo: Repository<Child>,
  ) {}

  create(dto: CreateChildDto, userId: number) {
    const child = this.repo.create({ ...dto, user: { id: userId } });
    return this.repo.save(child);
  }

  findAllByUser(userId: number) {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async update(id: number, dto: UpdateChildDto) {
    const child = await this.repo.findOne({ where: { id } });
    if (!child) throw new NotFoundException('child_not_found');
    Object.assign(child, dto);
    return this.repo.save(child);
  }

  async remove(id: number) {
    const child = await this.repo.findOne({ where: { id } });
    if (!child) throw new NotFoundException('child_not_found');
    return this.repo.delete(id);
  }
}
