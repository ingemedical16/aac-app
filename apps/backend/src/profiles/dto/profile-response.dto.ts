import { ProfileType } from "../../common/enums/profileType.enum";

export class ProfileResponseDto {
  id!: string;
  name!: string;
  type!: ProfileType;

  preferredLanguages!: string[];
 

  childId?: string | null;

  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}