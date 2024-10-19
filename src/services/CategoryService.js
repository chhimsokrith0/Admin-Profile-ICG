import apiClient from './ServiceAPI';

const CategoryService = {
  /**
   * Fetch all categories.
   * @returns {Promise} - The result of the API call to get all categories.
   */
  getAllCategories() {
    return apiClient
      .get('category')
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching all categories:', error);
        throw error; // Re-throw the error after logging it
      });
  },

  /**
   * Fetch a specific category by its ID.
   * @param {number} id - The ID of the category to fetch.
   * @returns {Promise} - The result of the API call to get a category by ID.
   */
  getCategoryById(id) {
    return apiClient
      .get(`category/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error fetching category with ID ${id}:`, error);
        throw error;
      });
  },

  /**
   * Create a new category.
   * @param {Object} categoryData - The data for the category to create.
   * @returns {Promise} - The result of the API call to create a new category.
   */
  createCategory(categoryData) {
    return apiClient
      .post('category', categoryData)
      .then(response => {
        if (response && response.data) {
          return response.data; // Check for valid response
        } else {
          throw new Error('Invalid response from server'); // Handle invalid response
        }
      })
      .catch(error => {
        console.error('Error creating category:', error);
        throw error;
      });
  },

  /**
   * Update an existing category.
   * @param {number} id - The ID of the category to update.
   * @param {Object} categoryData - The updated data for the category.
   * @returns {Promise} - The result of the API call to update the category.
   */
  updateCategory(id, categoryData) {
    return apiClient
      .put(`category/${id}`, categoryData)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error updating category with ID ${id}:`, error);
        throw error;
      });
  },

  /**
   * Delete a category by its ID.
   * @param {number} id - The ID of the category to delete.
   * @returns {Promise} - The result of the API call to delete the category.
   */
  deleteCategory(id) {
    return apiClient
      .delete(`category/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error deleting category with ID ${id}:`, error);
        throw error;
      });
  },
};

export default CategoryService;
