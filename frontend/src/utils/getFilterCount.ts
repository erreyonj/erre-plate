import type { ChefQueryFilters } from "../types/queryParams";

export function countActiveFilters(filters: ChefQueryFilters) {
    let count = 0
  
    if (filters.cuisine) count++
    if (filters.rating) count++
    if (filters.search) count++
  
    return count
  }