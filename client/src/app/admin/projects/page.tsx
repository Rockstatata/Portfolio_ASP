'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { sampleProjects } from '@/data/sampleData';
import type { Project } from '@/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState(sampleProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    demo_url: '',
    github_url: '',
    status: 'active',
    project_year: new Date().getFullYear(),
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      demo_url: '',
      github_url: '',
      status: 'active',
      project_year: new Date().getFullYear(),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      status: project.status,
      project_year: project.project_year,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    if (editingProject) {
      setProjects(projects.map((p) =>
        p.id === editingProject.id
          ? { ...p, ...formData, demo_url: formData.demo_url || null, github_url: formData.github_url || null, updated_at: new Date().toISOString() }
          : p
      ));
      toast.success('Project updated');
    } else {
      const newProject: Project = {
        id: String(Date.now()),
        ...formData,
        demo_url: formData.demo_url || null,
        github_url: formData.github_url || null,
        image_url: '/images/project-placeholder.svg',
        display_order: projects.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProjects([...projects, newProject]);
      toast.success('Project created');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter((p) => p.id !== id));
      toast.success('Project deleted');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg"
          style={{ backgroundColor: '#DC143C' }}
        >
          <FiPlus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Technologies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{project.title}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{project.technologies}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{project.project_year}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        aria-label="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingProject ? 'Edit Project' : 'New Project'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none"
                    placeholder="React, TypeScript, Tailwind CSS"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Demo URL</label>
                    <input
                      type="url"
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                    <input
                      type="number"
                      value={formData.project_year}
                      onChange={(e) => setFormData({ ...formData, project_year: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:shadow-lg"
                  style={{ backgroundColor: '#DC143C' }}
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
