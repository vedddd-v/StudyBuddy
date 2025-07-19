import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Download, Eye, Heart, BookOpen, GraduationCap, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useProfile } from '../hooks/useProfile';
import toast from 'react-hot-toast';

interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  course: string;
  university: string;
  price: number;
  preview_url: string | null;
  file_url: string;
  thumbnail_url: string | null;
  downloads: number;
  rating: number;
  total_reviews: number;
  created_at: string;
  seller: {
    id: string;
    name: string;
    avatar_url: string | null;
    rating: number;
  };
}

export default function Marketplace() {
  const { profile } = useProfile();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'Engineering', 'Business', 'Economics', 'Psychology', 'History',
    'English', 'Philosophy', 'Art', 'Music', 'Other'
  ];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      // Mock data for demonstration
      const mockNotes: Note[] = [
        {
          id: '1',
          title: 'Calculus I - Complete Study Guide',
          description: 'Comprehensive notes covering limits, derivatives, and integrals with solved examples and practice problems.',
          subject: 'Mathematics',
          course: 'MATH 101',
          university: 'Stanford University',
          price: 15.99,
          preview_url: null,
          file_url: '',
          thumbnail_url: null,
          downloads: 234,
          rating: 4.8,
          total_reviews: 45,
          created_at: '2024-01-15',
          seller: {
            id: 'seller1',
            name: 'Sarah Chen',
            avatar_url: null,
            rating: 4.9
          }
        },
        {
          id: '2',
          title: 'Organic Chemistry Mechanisms',
          description: 'Detailed reaction mechanisms with step-by-step explanations and memory tricks.',
          subject: 'Chemistry',
          course: 'CHEM 201',
          university: 'MIT',
          price: 22.50,
          preview_url: null,
          file_url: '',
          thumbnail_url: null,
          downloads: 189,
          rating: 4.7,
          total_reviews: 32,
          created_at: '2024-01-10',
          seller: {
            id: 'seller2',
            name: 'Alex Rodriguez',
            avatar_url: null,
            rating: 4.8
          }
        },
        {
          id: '3',
          title: 'Data Structures & Algorithms',
          description: 'Complete notes on arrays, linked lists, trees, graphs, and sorting algorithms with code examples.',
          subject: 'Computer Science',
          course: 'CS 201',
          university: 'UC Berkeley',
          price: 18.99,
          preview_url: null,
          file_url: '',
          thumbnail_url: null,
          downloads: 456,
          rating: 4.9,
          total_reviews: 78,
          created_at: '2024-01-08',
          seller: {
            id: 'seller3',
            name: 'Michael Kim',
            avatar_url: null,
            rating: 4.9
          }
        },
        {
          id: '4',
          title: 'Microeconomics Principles',
          description: 'Supply and demand, market structures, consumer theory, and producer theory explained clearly.',
          subject: 'Economics',
          course: 'ECON 101',
          university: 'Harvard University',
          price: 12.99,
          preview_url: null,
          file_url: '',
          thumbnail_url: null,
          downloads: 167,
          rating: 4.6,
          total_reviews: 28,
          created_at: '2024-01-05',
          seller: {
            id: 'seller4',
            name: 'Emma Thompson',
            avatar_url: null,
            rating: 4.7
          }
        },
        {
          id: '5',
          title: 'Physics Mechanics - Newton\'s Laws',
          description: 'Comprehensive coverage of classical mechanics including forces, motion, and energy.',
          subject: 'Physics',
          course: 'PHYS 101',
          university: 'Caltech',
          price: 16.99,
          preview_url: null,
          file_url: '',
          thumbnail_url: null,
          downloads: 298,
          rating: 4.8,
          total_reviews: 52,
          created_at: '2024-01-03',
          seller: {
            id: 'seller5',
            name: 'David Park',
            avatar_url: null,
            rating: 4.8
          }
        },
        {
          id: '6',
          title: 'Psychology Research Methods',
          description: 'Statistical analysis, experimental design, and research ethics in psychology.',
          subject: 'Psychology',
          course: 'PSYC 201',
          university: 'Yale University',
          price: 14.99,
          preview_url: null,
          file_url: '',
          thumbnail_url: null,
          downloads: 123,
          rating: 4.5,
          total_reviews: 19,
          created_at: '2024-01-01',
          seller: {
            id: 'seller6',
            name: 'Lisa Wang',
            avatar_url: null,
            rating: 4.6
          }
        }
      ];

      setNotes(mockNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (noteId: string, price: number) => {
    toast.success(`Note purchased for $${price}! Check your purchases.`);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'under-10' && note.price < 10) ||
                        (priceRange === '10-20' && note.price >= 10 && note.price <= 20) ||
                        (priceRange === 'over-20' && note.price > 20);
    return matchesSearch && matchesSubject && matchesPrice;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'popular': return b.downloads - a.downloads;
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Notes Marketplace</h1>
        <p className="text-gray-600">Discover high-quality study notes from top students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Total Notes</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">2,847</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Universities</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">156</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Downloads</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">45.2K</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Avg Rating</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.7</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Prices</option>
            <option value="under-10">Under $10</option>
            <option value="10-20">$10 - $20</option>
            <option value="over-20">Over $20</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
              <BookOpen className="w-12 h-12 text-blue-600" />
              <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{note.title}</h3>
                  <p className="text-sm text-gray-600">{note.course} • {note.university}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  {note.subject}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{note.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{note.rating}</span>
                    <span>({note.total_reviews})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{note.downloads}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${note.price}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-xs">
                      {note.seller.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{note.seller.name}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">{note.seller.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedNotes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
}