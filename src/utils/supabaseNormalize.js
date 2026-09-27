/** Convert snake_case keys to camelCase (shallow + nested plain objects/arrays). */
const toCamelKey = (key) =>
  String(key).replace(/_([a-z])/g, (_, c) => c.toUpperCase())

export const toCamel = (value) => {
  if (Array.isArray(value)) return value.map(toCamel)
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [toCamelKey(k), toCamel(v)])
    )
  }
  return value
}

/** Normalize a catalog row for the React app. */
export const normalizeProduct = (row) => {
  if (!row) return null
  const p = toCamel(row)
  return {
    ...p,
    id: p.customId || p.id || p.slug,
    customId: p.customId || p.id,
    isNewItem: p.isNewItem ?? false,
    isBestSeller: p.isBestSeller ?? false,
    isFeatured: p.isFeatured ?? false,
    images: Array.isArray(p.images) ? p.images : [],
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    specifications: p.specifications || {},
    customerReviews: p.customerReviews || [],
  }
}

export const normalizeCategory = (row) => {
  if (!row) return null
  const c = toCamel(row)
  return {
    ...c,
    id: c.customId || c.slug || c.id,
    customId: c.customId || c.slug || c.id,
  }
}

export const normalizeUser = (row) => {
  if (!row) return null
  const u = toCamel(row)
  return {
    ...u,
    id: u.customId || u.id,
    customId: u.customId || u.id,
    accountStatus: u.accountStatus || 'Active',
  }
}

export default { toCamel, normalizeProduct, normalizeCategory, normalizeUser }
