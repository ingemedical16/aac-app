import { UserRole } from "@/types/auth";
import { Profile } from "@/types/userProfile";
import { BoardCapabilities } from "@/types/boardCapabilities";

export function getBoardCapabilities(
  userRole: UserRole,
  profile: Profile
): BoardCapabilities {
  // 👤 Individual usage (single patient)
  if (profile.usageMode === "single") {
    return {
      canEditVocabulary: userRole !== "PATIENT",
      canAddTiles: userRole !== "PATIENT",
      canRemoveTiles: userRole !== "PATIENT",
      canViewStats: userRole !== "PATIENT",
      canChangeSettings: true,
    };
  }

  // 👥 Group usage (school / therapy / class)
  if (profile.usageMode === "group") {
    return {
      canEditVocabulary:
        userRole === "PROFESSIONAL" || userRole === "ADMIN",
      canAddTiles:
        userRole === "PROFESSIONAL" || userRole === "ADMIN",
      canRemoveTiles:
        userRole === "PROFESSIONAL" || userRole === "ADMIN",
      canViewStats:
        userRole === "PROFESSIONAL" || userRole === "ADMIN",
      canChangeSettings:
        userRole === "PROFESSIONAL" || userRole === "ADMIN",
    };
  }

  // 🛑 Safe fallback
  return {
    canEditVocabulary: false,
    canAddTiles: false,
    canRemoveTiles: false,
    canViewStats: false,
    canChangeSettings: false,
  };
}