import apiClient from './ServiceAPI';

const ProjectService = {
  /**
   * Fetch all projects with pagination.
   *
   * @param {number} page - The current page number.
   * @param {number} perPage - The number of projects per page.
   * @returns {Promise} - The result of the API call.
   */
  getProjects(page = 1, perPage = 10) {
    return apiClient.get(`projects?page=${page}&perPage=${perPage}`);
  },

  /**
   * Fetch a specific project by its ID.
   *
   * @param {number} id - The ID of the project.
   * @returns {Promise} - The result of the API call.
   */
  getProjectById(id) {
    return apiClient.get(`projects/${id}`);
  },

  /**
   * Update an existing project.
   *
   * @param {number} id - The ID of the project.
   * @param {Object} projectData - The updated project data.
   * @returns {Promise} - The result of the API call.
   */
  updateProject(id, projectData) {
    return apiClient.put(`projects/${id}`, projectData);
  },

  /**
   * Create a new project.
   *
   * @param {Object} projectData - The project data to create.
   * @returns {Promise} - The result of the API call.
   */
  createProject(projectData) {
    return apiClient.post('projects', projectData);
  },

  /**
   * Delete a project by its ID.
   *
   * @param {number} id - The ID of the project to delete.
   * @returns {Promise} - The result of the API call.
   */
  deleteProject(id) {
    return apiClient.delete(`projects/${id}`);
  },
};

export default ProjectService;
