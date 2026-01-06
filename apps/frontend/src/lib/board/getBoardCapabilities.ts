import { UserRole } from "@/types/auth";
import { Profile } from "@/types/userProfile";
import { BoardCapabilities } from "@/types/boardCapabilities";

export function getBoardCapabilities(
  userRole: UserRole,
  profile: Profile
): BoardCapabilities {
  // Adult patient using his own board
  if (profile.role === "adult") {
    return {
      canEditVocabulary: false,
      canAddTiles: false,
      canRemoveTiles: false,
      canViewStats: false,
      canChangeSettings: true,
    };
  }

  // Child profile
  if (profile.role === "child") {
    // Parent or professional supervising
    if (userRole === "PARENT" || userRole === "PROFESSIONAL") {
      return {
        canEditVocabulary: true,
        canAddTiles: true,
        canRemoveTiles: true,
        canViewStats: true,
        canChangeSettings: true,
      };
    }

    // Child using alone
    return {
      canEditVocabulary: false,
      canAddTiles: false,
      canRemoveTiles: false,
      canViewStats: false,
      canChangeSettings: false,
    };
  }

  // Fallback safe mode
  return {
    canEditVocabulary: false,
    canAddTiles: false,
    canRemoveTiles: false,
    canViewStats: false,
    canChangeSettings: false,
  };
}