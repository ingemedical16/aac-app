import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { I18nService } from "nestjs-i18n";

import { Profile } from "../entities/profile.entity";
import { User } from "../entities/user.entity";
import { Child } from "../entities/child.entity";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileType } from "../common/enums/profileType.enum";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    @InjectRepository(Child)
    private readonly childRepo: Repository<Child>,

    private readonly i18n: I18nService,
  ) {}

  /* =========================
     CREATE
  ========================= */
  async create(
    user: User,
    dto: CreateProfileDto,
    lang = "en",
  ): Promise<Profile> {
    let child: Child | null = null;

    // ❌ INDIVIDUAL profile must NOT have child
    if (dto.type === ProfileType.INDIVIDUAL && dto.childId) {
      throw new BadRequestException(
        this.i18n.t("profile.child_not_allowed", { lang }),
      );
    }

    // ✅ CHILD profile must have valid child
    if (dto.type === ProfileType.CHILD) {
      if (!dto.childId) {
        throw new BadRequestException(
          this.i18n.t("profile.child_required", { lang }),
        );
      }

      child = await this.childRepo.findOne({
        where: {
          id: dto.childId,
          parent: { id: user.id },
        },
      });

      if (!child) {
        throw new NotFoundException(
          this.i18n.t("profile.child_not_found", { lang }),
        );
      }
    }

    const profile = this.profileRepo.create({
      owner: user,
      child,
      name: dto.name,
      type: dto.type,
      preferredLanguages: dto.preferredLanguages,
      highContrast: dto.highContrast ?? false,
      bigButtons: dto.bigButtons ?? false,
    });

    return this.profileRepo.save(profile);
  }

  /* =========================
     FIND ALL
  ========================= */
  async findAllByUser(user: User): Promise<Profile[]> {
    return this.profileRepo.find({
      where: {
        owner: { id: user.id },
        isActive: true,
      },
      relations: ["child"],
      order: { createdAt: "ASC" },
    });
  }

  /* =========================
     FIND ONE
  ========================= */
  async findOne(
    user: User,
    id: string,
    lang = "en",
  ): Promise<Profile> {
    const profile = await this.profileRepo.findOne({
      where: {
        id,
        owner: { id: user.id },
      },
      relations: ["child"],
    });

    if (!profile) {
      throw new NotFoundException(
        this.i18n.t("profile.profile_not_found", { lang }),
      );
    }

    return profile;
  }

  /* =========================
     UPDATE (SAFE)
  ========================= */
  async update(
    user: User,
    id: string,
    dto: UpdateProfileDto,
    lang = "en",
  ): Promise<Profile> {
    const profile = await this.findOne(user, id, lang);

    // ✅ Explicit allowed updates only
    if (dto.name !== undefined) {
      profile.name = dto.name;
    }

    if (dto.preferredLanguages !== undefined) {
      profile.preferredLanguages = dto.preferredLanguages;
    }

    if (dto.highContrast !== undefined) {
      profile.highContrast = dto.highContrast;
    }

    if (dto.bigButtons !== undefined) {
      profile.bigButtons = dto.bigButtons;
    }

    return this.profileRepo.save(profile);
  }

  /* =========================
     DEACTIVATE (SOFT DELETE)
  ========================= */
  async deactivate(
    user: User,
    id: string,
    lang = "en",
  ): Promise<void> {
    const profile = await this.findOne(user, id, lang);
    profile.isActive = false;
    await this.profileRepo.save(profile);
  }
}