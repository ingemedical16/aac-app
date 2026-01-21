import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from '../entities/child.entity';
@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private repo: Repository<Child>,
  ) {}

}
