import React, { useState, useEffect } from 'react';
import { Download, Star, Calendar, Search, Filter, FileText, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useProfile } from '../hooks/useProfile';
import toast from 'react-hot-toast';

interface Purchase {
  id: string;
  note_id: string;
  purchased_at: string;
  price_paid: number;
  note: {
    title: string;
    description: string;
    subject: string;
    course: string;
    university: string;
    file_url: string;
    seller: {
      name: string;
      avatar_url: string | null;
    };
  };
}

export default function Purchases() {
  const { profile } = useProfile();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'Engineering', 'Business', 'Economics', 'Psychology', 'History',
    'English', 'Philosophy', 'Art', 'Music', 'Other'
  ];

  useEffect(() => {
    if (profile) {
      fetchPurchases();
    }
  }, [profile]);

  const fetchPurchases = async () => {
    try {
      // Mock data for demonstration
      const mockPurchases: Purchase[] = [
        {
          id: '1',
          note_id: 'note1',
          purchased_at: '2024-01-15T10:30:00Z',
          price_paid: 15.99,
          note: {
            title: 'Calculus I - Complete Study Guide',
            description: 'Comprehensive notes covering limits, derivatives, and integrals with solved examples.',
            subject: 'Mathematics',
            course: 'MATH 101',
            university: 'Stanford University',
            file_url: '/downloads/calculus-guide.pdf',
            seller: {
              name: 'Sarah Chen',
              avatar_url: null
            }
          }
        },
        {
          id: '2',
          note_id: 'note2',
          purchased_at: '2024-01-12T14:20:00Z',
          price_paid: 22.50,
          note: {
            title: 'Organic Chemistry Mechanisms',
            description: 'Detailed reaction mechanisms with step-by-step explanations and memory tricks.',
            subject: 'Chemistry',
            course: 'CHEM 201',
            university: 'MIT',
            file_url: '/downloads/organic-chemistry.pdf',
            seller: {
              name: 'Alex Rodriguez',
              avatar_url: null
            }
          }
        },
        {
          id: '3',
          note_id: 'note3',
          purchased_at: '2024-01-08T09:15:00Z',
          price_paid: 18.99,
          note: {
            title: 'Data Structures & Algorithms',
            description: 'Complete notes on arrays, linked lists, trees, graphs, and sorting algorithms.',
            subject: 'Computer Science',
            course: 'CS 201',
            university: 'UC Berkeley',
            file_url: '/downloads/data-structures.pdf',
            seller: {
              name: 'Michael Kim',
              avatar_url: null
            }
          }
        },
        {
          id: '4',
          note_id: 'note4',
          purchased_at: '2024-01-05T16:45:00Z',
          price_paid: 12.99,
          note: {
            title: 'Microeconomics Principles',
            description: 'Supply and demand, market structures, consumer theory, and producer theory.',
            subject: 'Economics',
            course: 'ECON 101',
            university: 'Harvard University',
            file_url: '/downloads/microeconomics.pdf',
            seller: {
              name: 'Emma Thompson',
              avatar_url: null
            }
          }
        }
      ];

      setPurchases(mockPurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (purchase: Purchase) => {
    try {
      // In a real app, you would handle the file download
      toast.success(`Downloading ${purchase.note.title}...`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.note.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || purchase.note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price_paid, 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Purchases</h1>
        <p className="text-gray-600 mt-2">Access and download your purchased study notes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Purchases</p>
              <p className="text-2xl font-bold">{purchases.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Spent</p>
              <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
            </div>
            <Download className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg. Price</p>
              <p className="text-2xl font-bold">
                ${purchases.length > 0 ? (totalSpent / purchases.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
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
          </div>
        </div>
      </div>

      {/* Purchases List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredPurchases.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredPurchases.map((purchase) => (
              <div key={purchase.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{purchase.note.title}</h3>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {purchase.note.subject}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{purchase.note.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>{purchase.note.course}</span>
                      <span>•</span>
                      <span>{purchase.note.university}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Purchased {new Date(purchase.purchased_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xs">
                          {purchase.note.seller.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">by {purchase.note.seller.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Price Paid</p>
                      <p className="text-lg font-semibold text-gray-900">${purchase.price_paid}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDownload(purchase)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedSubject !== 'all' 
                ? 'Try adjusting your search filters'
                : 'Start browsing the marketplace to find study notes'
              }
            </p>
            {!searchTerm && selectedSubject === 'all' && (
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Browse Marketplace
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}