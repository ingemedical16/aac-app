import { Body, Controller, Get, Param, Patch, Post, Delete } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';

@Controller('children')
export class ChildrenController {
  constructor(private service: ChildrenService) {}

  @Post(':userId')
  create(@Param('userId') userId: number, @Body() dto: CreateChildDto) {
    return this.service.create(dto, Number(userId));
  }

  @Get(':userId')
  findAll(@Param('userId') userId: number) {
    return this.service.findAllByUser(Number(userId));
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateChildDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }
}
