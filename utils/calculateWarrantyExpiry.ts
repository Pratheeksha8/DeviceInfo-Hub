// src/calculateWarrantyExpiry.ts
const calculateWarrantyExpiry = (releasedYear: number, warrantyPeriod: number): Date => {
    const releaseDate = new Date(releasedYear, 0, 1); // January 1st of the release year
    releaseDate.setFullYear(releaseDate.getFullYear() + warrantyPeriod); // Add warranty period to the release year
    return releaseDate;
  };
  
  export { calculateWarrantyExpiry };
  