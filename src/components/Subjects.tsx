import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Star, Trash2, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useProfile } from '../hooks/useProfile';
import toast from 'react-hot-toast';

type SubjectCategory = 'Mathematics' | 'Science' | 'English' | 'History' | 'Foreign Language' | 'Computer Science' | 'Arts' | 'Business' | 'Engineering' | 'Other';
type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface Subject {
  id: string;
  name: string;
  category: SubjectCategory;
  skill_level: SkillLevel;
  can_help: boolean;
  needs_help: boolean;
}

export default function Subjects() {
  const { profile } = useProfile();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Mathematics' as SubjectCategory,
    skill_level: 'beginner' as SkillLevel,
    can_help: false,
    needs_help: false
  });

  const subjectCategories: SubjectCategory[] = [
    'Mathematics', 'Science', 'English', 'History', 'Foreign Language',
    'Computer Science', 'Arts', 'Business', 'Engineering', 'Other'
  ];

  const skillLevels: { level: SkillLevel; label: string; description: string }[] = [
    { level: 'beginner', label: 'Beginner', description: 'Just starting to learn' },
    { level: 'intermediate', label: 'Intermediate', description: 'Have some experience' },
    { level: 'advanced', label: 'Advanced', description: 'Very comfortable with the subject' },
    { level: 'expert', label: 'Expert', description: 'Can teach others effectively' }
  ];

  useEffect(() => {
    if (profile) {
      fetchSubjects();
    }
  }, [profile]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSubmitting(true);
    try {
      if (editingSubject) {
        const { error } = await supabase
          .from('subjects')
          .update({
            name: formData.name,
            category: formData.category,
            skill_level: formData.skill_level,
            can_help: formData.can_help,
            needs_help: formData.needs_help
          })
          .eq('id', editingSubject.id);

        if (error) throw error;
        toast.success('Subject updated successfully!');
      } else {
        const { error } = await supabase
          .from('subjects')
          .insert({
            user_id: profile.id,
            name: formData.name,
            category: formData.category,
            skill_level: formData.skill_level,
            can_help: formData.can_help,
            needs_help: formData.needs_help
          });

        if (error) throw error;
        toast.success('Subject added successfully!');
      }

      setShowAddForm(false);
      setEditingSubject(null);
      setFormData({
        name: '',
        category: 'Mathematics',
        skill_level: 'beginner',
        can_help: false,
        needs_help: false
      });
      fetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast.error('Failed to save subject');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      category: subject.category,
      skill_level: subject.skill_level,
      can_help: subject.can_help,
      needs_help: subject.needs_help
    });
    setShowAddForm(true);
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) throw error;
      toast.success('Subject deleted successfully!');
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error('Failed to delete subject');
    }
  };

  const getSkillColor = (level: SkillLevel) => {
    switch (level) {
      case 'beginner': return 'bg-red-100 text-red-700 border-red-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'expert': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Subjects</h1>
          <p className="text-gray-600 mt-2">Manage your subject expertise and learning interests</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Current Academic Level */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Academic Level</h2>
            <p className="text-gray-600">Your current academic standing</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-blue-600">{profile.academic_level}</p>
          </div>
        </div>
      </div>

      {/* Subjects I Can Help With */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Subjects I Can Help With</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.filter(s => s.can_help).map((subject) => (
            <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.category}</p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getSkillColor(subject.skill_level)}`}>
                  {skillLevels.find(l => l.level === subject.skill_level)?.label}
                </span>
                <div className="flex items-center space-x-1 text-green-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">Can Tutor</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {subjects.filter(s => s.can_help).length === 0 && (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No subjects you can help with yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-green-600 hover:text-green-700 font-medium"
            >
              Add your first subject
            </button>
          </div>
        )}
      </div>

      {/* Subjects I Need Help With */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Subjects I Need Help With</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.filter(s => s.needs_help).map((subject) => (
            <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.category}</p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getSkillColor(subject.skill_level)}`}>
                  {skillLevels.find(l => l.level === subject.skill_level)?.label}
                </span>
                <div className="flex items-center space-x-1 text-blue-600">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Learning</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {subjects.filter(s => s.needs_help).length === 0 && (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No subjects you need help with</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add a subject to learn
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Subject Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g., Calculus I, Organic Chemistry"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as SubjectCategory })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  required
                >
                  {subjectCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Skill Level</label>
                <select
                  value={formData.skill_level}
                  onChange={(e) => setFormData({ ...formData, skill_level: e.target.value as SkillLevel })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  required
                >
                  {skillLevels.map((skill) => (
                    <option key={skill.level} value={skill.level}>
                      {skill.label} - {skill.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">I want to:</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.can_help}
                      onChange={(e) => setFormData({ ...formData, can_help: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Help others with this subject</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.needs_help}
                      onChange={(e) => setFormData({ ...formData, needs_help: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Get help with this subject</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingSubject(null);
                    setFormData({
                      name: '',
                      category: 'Mathematics',
                      skill_level: 'beginner',
                      can_help: false,
                      needs_help: false
                    });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    `${editingSubject ? 'Update' : 'Add'} Subject`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}