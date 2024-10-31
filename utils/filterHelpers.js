// utils/filterHelpers.js

export const filterListingsBySearchTerm = (listings, term) => {
    return listings.filter((listing) =>
      listing.title.toLowerCase().includes(term) ||
      listing.content.toLowerCase().includes(term)
    );
  };
  
  export const filterListingsByCategories = (listings, selectedCategories) => {
    return listings.filter((listing) =>
      selectedCategories.length === 0 || selectedCategories.includes(listing.category.name)
    );
  };
  