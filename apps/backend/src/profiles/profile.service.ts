import {Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { I18nService } from "nestjs-i18n";import { Profile, Child } from "../entities";


@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    @InjectRepository(Child)
    private readonly childRepo: Repository<Child>,

    private readonly i18n: I18nService,
  ) {}

 
}