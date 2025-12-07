import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vocabulary } from './vocabulary.entity';
import { CreateVocabularyDto } from './dto/create-vocab.dto';
import { UpdateVocabularyDto } from './dto/update-vocab.dto';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private repo: Repository<Vocabulary>,
  ) {}

  create(dto: CreateVocabularyDto) {
    const vocab = this.repo.create(dto);
    return this.repo.save(vocab);
  }

  findAll(lang: string) {
    return this.repo.find({ where: { lang } });
  }

  async update(id: number, dto: UpdateVocabularyDto) {
    const vocab = await this.repo.findOne({ where: { id } });
    if (!vocab) throw new NotFoundException('vocab_not_found');
    Object.assign(vocab, dto);
    return this.repo.save(vocab);
  }

  async remove(id: number) {
    const vocab = await this.repo.findOne({ where: { id } });
    if (!vocab) throw new NotFoundException('vocab_not_found');
    return this.repo.delete(id);
  }
}
