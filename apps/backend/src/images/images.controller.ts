import { Body, Controller, Get, Param, Patch, Post, Delete } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private service: ImagesService) {}

  @Post()
  create(@Body() dto: CreateImageDto) {
    return this.service.create(dto);
  }

  @Get(':lang')
  findAll(@Param('lang') lang: string) {
    return this.service.findAll(lang);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateImageDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }
}
