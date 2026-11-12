export const packagePrices = {
  'website-public-v1': 2_500_000,
  'account-data-v1': 5_000_000,
  'application-admin-v1': 8_000_000,
} as const;

export type PackageCode = keyof typeof packagePrices;
export const packageCodes = Object.keys(packagePrices) as PackageCode[];

export function isPackageCode(value: unknown): value is PackageCode {
  return typeof value === 'string' && Object.hasOwn(packagePrices, value);
}
