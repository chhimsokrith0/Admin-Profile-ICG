import apiClient from './ServiceAPI';

const CategoryService = {
  getAllCategories() {
    return apiClient.get('category');
  },

  getCategoryById(id) {
    return apiClient.get(`category/${id}`);
  },

  createCategory(categoryData) {
    return apiClient.post('category', categoryData);
  },

  updateCategory(id, categoryData) {
    return apiClient.put(`category/${id}`, categoryData);
  },

  deleteCategory(id) {
    return apiClient.delete(`category/${id}`);
  },
};

export default CategoryService;
