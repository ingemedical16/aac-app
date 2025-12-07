import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocab.dto';
import { UpdateVocabularyDto } from './dto/update-vocab.dto';

@Controller('vocab')
export class VocabularyController {
  constructor(private service: VocabularyService) {}

  @Post()
  create(@Body() dto: CreateVocabularyDto) {
    return this.service.create(dto);
  }

  @Get(':lang')
  findAll(@Param('lang') lang: string) {
    return this.service.findAll(lang);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateVocabularyDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }
}
