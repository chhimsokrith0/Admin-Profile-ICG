import apiClient from './ServiceAPI';

const ProjectDetailsService = {
  getAllProjectDetails() {
    return apiClient.get('project-details');
  },

  getProjectDetailById(id) {
    return apiClient.get(`project-details/${id}`);
  },

  createProjectDetail(detailData) {
    return apiClient.post('project-details', detailData);
  },

  updateProjectDetail(id, detailData) {
    return apiClient.put(`project-details/${id}`, detailData);
  },

  deleteProjectDetail(id) {
    return apiClient.delete(`project-details/${id}`);
  },
};

export default ProjectDetailsService;
