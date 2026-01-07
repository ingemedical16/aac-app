import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child } from './child.entity';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';
import { Profile } from '../profiles/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Child,Profile])],
  providers: [ChildrenService],
  controllers: [ChildrenController],
})
export class ChildrenModule {}
