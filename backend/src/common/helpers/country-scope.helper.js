// returns a Prisma where-clause fragment for country-based filtering
// admins see all data; managers and members see only their own country
function getCountryFilter(user) {
  // admin has no country restriction
  if (user.role === 'ADMIN') {
    return {};
  }

  // non-admin users are scoped to their assigned country
  return { country: user.country };
}

module.exports = { getCountryFilter };
