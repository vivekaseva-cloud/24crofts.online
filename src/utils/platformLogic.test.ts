import test from 'node:test';
import assert from 'node:assert/strict';
import {
  authenticateByRole,
  buildShareableProfileLink,
  calculateHostingEstimate,
  canViewContactDetails,
  findProfileById,
  getApprovedAdsByType,
  maskPhoneNumber,
  sortProfilesForCategoryDrilldown,
  sortProfilesForHome,
} from './platformLogic';
import { INITIAL_ADS, INITIAL_PRODUCTION_HOUSES, INITIAL_PROFILES } from '../data/craftsData';

test('separate login portals strictly enforce Category, Production House, and Admin credentials', () => {
  // 1. Admin Login portal only accepts Admin credentials
  const adminSuccess = authenticateByRole(
    'ADMIN_LOGIN',
    'Admin',
    'Bchakriraju1992@',
    INITIAL_PROFILES,
    INITIAL_PRODUCTION_HOUSES
  );
  assert.equal(adminSuccess.ok, true);
  assert.equal(adminSuccess.session?.role, 'ADMIN');

  // Admin credentials rejected on Category Login portal
  const adminOnCategory = authenticateByRole(
    'CATEGORY_LOGIN',
    'Admin',
    'Bchakriraju1992@',
    INITIAL_PROFILES,
    INITIAL_PRODUCTION_HOUSES
  );
  assert.equal(adminOnCategory.ok, false);

  // 2. Category Login portal authenticates 24 Crafts Talent by userId or 24C ID
  const talentSuccess = authenticateByRole(
    'CATEGORY_LOGIN',
    'user_1001',
    'Pass@1001',
    INITIAL_PROFILES,
    INITIAL_PRODUCTION_HOUSES,
    'direction'
  );
  assert.equal(talentSuccess.ok, true);
  assert.equal(talentSuccess.session?.role, 'TALENT');
  assert.equal(talentSuccess.session?.profileId, '24C-1001');

  // 3. Production House Login portal authenticates only Production Houses
  const prodSuccess = authenticateByRole(
    'PRODUCTION_LOGIN',
    'mythri_prod',
    'Mythri@2026',
    INITIAL_PROFILES,
    INITIAL_PRODUCTION_HOUSES
  );
  assert.equal(prodSuccess.ok, true);
  assert.equal(prodSuccess.session?.role, 'PRODUCTION_HOUSE');
  assert.equal(prodSuccess.session?.productionHouseId, 'PH-201');
});

test('contact numbers are hidden for guests and unapproved production houses, visible only to Admin and Approved Production Houses', () => {
  const targetId = '24C-1001';
  assert.equal(
    canViewContactDetails({ role: 'GUEST' }, targetId, INITIAL_PRODUCTION_HOUSES),
    false
  );
  // PH-202 is unapproved initially
  assert.equal(
    canViewContactDetails(
      { role: 'PRODUCTION_HOUSE', productionHouseId: 'PH-202' },
      targetId,
      INITIAL_PRODUCTION_HOUSES
    ),
    false
  );
  // PH-201 is approved by Admin
  assert.equal(
    canViewContactDetails(
      { role: 'PRODUCTION_HOUSE', productionHouseId: 'PH-201' },
      targetId,
      INITIAL_PRODUCTION_HOUSES
    ),
    true
  );
  // Admin always has access
  assert.equal(
    canViewContactDetails({ role: 'ADMIN' }, targetId, INITIAL_PRODUCTION_HOUSES),
    true
  );

  const masked = maskPhoneNumber('+91 98480 10007', false);
  assert.equal(masked.includes('98480'), false);
  const unmasked = maskPhoneNumber('+91 98480 10007', true);
  assert.equal(unmasked, '+91 98480 10007');
});

test('unique profile ID search and shareable link generation work accurately', () => {
  const foundExact = findProfileById(INITIAL_PROFILES, '24C-1001');
  assert.ok(foundExact);
  assert.equal(foundExact.id, '24C-1001');

  const foundNumeric = findProfileById(INITIAL_PROFILES, '1005');
  assert.ok(foundNumeric);
  assert.equal(foundNumeric.id, '24C-1005');

  const link = buildShareableProfileLink('https://24crofts.com/', '24c-1001');
  assert.equal(link, 'https://24crofts.com/?profile=24C-1001');
});

test('category drilldown sorts paid profiles first, while homepage sorts daily uploads first', () => {
  const directionProfiles = sortProfilesForCategoryDrilldown(INITIAL_PROFILES, 'direction');
  assert.equal(directionProfiles.length, 3);
  assert.equal(directionProfiles[0].isPaid, true);

  const homeSorted = sortProfilesForHome(INITIAL_PROFILES);
  assert.equal(homeSorted[0].isTodayUpload, true);
});

test('ad placements return up to 6 approved items ordered by admin priorityOrder', () => {
  const teasers = getApprovedAdsByType(INITIAL_ADS, 'MOVIE_TEASER', 6);
  assert.equal(teasers.length, 6);
  assert.equal(teasers[0].priorityOrder, 1);
  assert.equal(teasers[5].priorityOrder, 6);
});

test('hosting and maintenance estimate calculates monthly and annual breakdown', () => {
  const est = calculateHostingEstimate(5000);
  assert.ok(est.monthlyInr > 0);
  assert.equal(est.annualInr, est.monthlyInr * 12);
  assert.equal(est.breakdown.length, 5);
});
