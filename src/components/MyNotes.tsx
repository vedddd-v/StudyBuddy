import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Download, DollarSign, TrendingUp, Upload, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useProfile } from '../hooks/useProfile';
import toast from 'react-hot-toast';

interface MyNote {
  id: string;
  title: string;
  description: string;
  subject: string;
  course: string;
  university: string;
  price: number;
  file_url: string;
  thumbnail_url: string | null;
  downloads: number;
  earnings: number;
  status: 'draft' | 'published' | 'under_review';
  created_at: string;
}

export default function MyNotes() {
  const { profile } = useProfile();
  const [notes, setNotes] = useState<MyNote[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Mathematics',
    course: '',
    university: '',
    price: 9.99
  });

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'Engineering', 'Business', 'Economics', 'Psychology', 'History',
    'English', 'Philosophy', 'Art', 'Music', 'Other'
  ];

  useEffect(() => {
    if (profile) {
      fetchMyNotes();
    }
  }, [profile]);

  const fetchMyNotes = async () => {
    try {
      // Mock data for demonstration
      const mockNotes: MyNote[] = [
        {
          id: '1',
          title: 'Linear Algebra Study Guide',
          description: 'Complete notes on matrices, eigenvalues, and vector spaces',
          subject: 'Mathematics',
          course: 'MATH 201',
          university: 'Stanford University',
          price: 18.99,
          file_url: '',
          thumbnail_url: null,
          downloads: 45,
          earnings: 854.55,
          status: 'published',
          created_at: '2024-01-10'
        },
        {
          id: '2',
          title: 'React Hooks Deep Dive',
          description: 'Advanced React patterns and custom hooks implementation',
          subject: 'Computer Science',
          course: 'CS 301',
          university: 'Stanford University',
          price: 24.99,
          file_url: '',
          thumbnail_url: null,
          downloads: 78,
          earnings: 1949.22,
          status: 'published',
          created_at: '2024-01-05'
        },
        {
          id: '3',
          title: 'Thermodynamics Fundamentals',
          description: 'Laws of thermodynamics with practical examples',
          subject: 'Physics',
          course: 'PHYS 201',
          university: 'Stanford University',
          price: 16.99,
          file_url: '',
          thumbnail_url: null,
          downloads: 0,
          earnings: 0,
          status: 'under_review',
          created_at: '2024-01-15'
        }
      ];

      setNotes(mockNotes);
    } catch (error) {
      console.error('Error fetching my notes:', error);
      toast.error('Failed to load your notes');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSubmitting(true);
    try {
      // In a real app, you would upload the file and create the note record
      toast.success('Note uploaded successfully! It will be reviewed before publishing.');
      setShowUploadForm(false);
      setFormData({
        title: '',
        description: '',
        subject: 'Mathematics',
        course: '',
        university: '',
        price: 9.99
      });
      fetchMyNotes();
    } catch (error) {
      console.error('Error uploading note:', error);
      toast.error('Failed to upload note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        toast.success('Note deleted successfully');
        fetchMyNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700 border-green-200';
      case 'under_review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalEarnings = notes.reduce((sum, note) => sum + note.earnings, 0);
  const totalDownloads = notes.reduce((sum, note) => sum + note.downloads, 0);
  const publishedNotes = notes.filter(note => note.status === 'published').length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-600 mt-2">Manage your uploaded study notes and track earnings</p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Notes</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Downloads</p>
              <p className="text-2xl font-bold">{totalDownloads}</p>
            </div>
            <Download className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Published Notes</p>
              <p className="text-2xl font-bold">{publishedNotes}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Avg. Price</p>
              <p className="text-2xl font-bold">
                ${notes.length > 0 ? (notes.reduce((sum, note) => sum + note.price, 0) / notes.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Notes</h2>
        </div>
        
        {notes.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notes.map((note) => (
              <div key={note.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                      <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(note.status)}`}>
                        {note.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{note.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{note.subject}</span>
                      <span>•</span>
                      <span>{note.course}</span>
                      <span>•</span>
                      <span>{note.university}</span>
                      <span>•</span>
                      <span>${note.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Downloads</p>
                      <p className="font-semibold text-gray-900">{note.downloads}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Earnings</p>
                      <p className="font-semibold text-green-600">${note.earnings.toFixed(2)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes uploaded yet</h3>
            <p className="text-gray-600 mb-6">Start earning by sharing your study notes with other students</p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Your First Note
            </button>
          </div>
        )}
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-90vh overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Study Notes</h2>
            <form onSubmit={handleUploadNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Calculus I - Complete Study Guide"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what your notes cover..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <input
                    type="text"
                    placeholder="e.g., MATH 101"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  type="text"
                  placeholder="e.g., Stanford University"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  min="0.99"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 50MB</p>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Upload Notes'
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