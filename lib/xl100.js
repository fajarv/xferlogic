export const XL100_TIERS = {
  MEMBER: {
    key: "member",
    label: "XL100 Member",
    minLicenses: 100,
    maxLicenses: 299,
    representativeLimit: 2,
  },
  GOLD: {
    key: "gold",
    label: "XL100 Gold",
    minLicenses: 300,
    maxLicenses: 499,
    representativeLimit: 4,
  },
  ELITE: {
    key: "elite",
    label: "XL100 Elite",
    minLicenses: 500,
    maxLicenses: null,
    representativeLimit: 6,
  },
};

export function getXL100Tier(licenseCount) {
  const count = Number(licenseCount);
  if (!Number.isFinite(count) || count < 100) return null;
  if (count >= 500) return XL100_TIERS.ELITE;
  if (count >= 300) return XL100_TIERS.GOLD;
  return XL100_TIERS.MEMBER;
}

export const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "needs_info",
  "approved",
  "rejected",
];

export const MEMBER_ROLES = [
  "member",
  "company_admin",
  "moderator",
  "xl100_admin",
];

export const XL100_GOVERNANCE = {
  organizationVotesPerRoadmapItem: 1,
  licenseVerificationModel: "honor_system_admin_review",
  publicExactLicenseCount: false,
  vendorNeutral: true,
};
