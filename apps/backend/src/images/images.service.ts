import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageAsset } from './image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageAsset)
    private repo: Repository<ImageAsset>,
  ) {}

  create(dto: CreateImageDto) {
    const img = this.repo.create(dto);
    return this.repo.save(img);
  }

  findAll(lang: string) {
    return this.repo.find({ where: { lang } });
  }

  async update(id: number, dto: UpdateImageDto) {
    const img = await this.repo.findOne({ where: { id } });
    if (!img) throw new NotFoundException('image_not_found');

    Object.assign(img, dto);
    return this.repo.save(img);
  }

  async remove(id: number) {
    const img = await this.repo.findOne({ where: { id } });
    if (!img) throw new NotFoundException('image_not_found');

    return this.repo.delete(id);
  }
}
