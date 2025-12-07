import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageAsset } from './image.entity';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ImageAsset])],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
