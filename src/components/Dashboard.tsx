import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Download, FileText, Star, Eye, ShoppingBag, Users } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

export default function Dashboard({ onTabChange }: DashboardProps) {
  const { profile } = useProfile();

  // Mock data for demonstration
  const stats = {
    totalEarnings: 2803.77,
    totalDownloads: 123,
    notesUploaded: 3,
    totalPurchases: 4,
    totalSpent: 70.47,
    avgRating: 4.8
  };

  const recentActivity = [
    {
      id: '1',
      type: 'sale',
      title: 'React Hooks Deep Dive',
      amount: 24.99,
      buyer: 'John Smith',
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'purchase',
      title: 'Advanced Calculus Notes',
      amount: 18.99,
      seller: 'Maria Garcia',
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'sale',
      title: 'Linear Algebra Study Guide',
      amount: 18.99,
      buyer: 'Sarah Johnson',
      date: '2024-01-13'
    }
  ];

  const topNotes = [
    {
      id: '1',
      title: 'React Hooks Deep Dive',
      downloads: 78,
      earnings: 1949.22,
      rating: 4.9
    },
    {
      id: '2',
      title: 'Linear Algebra Study Guide',
      downloads: 45,
      earnings: 854.55,
      rating: 4.8
    }
  ];

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile.name}!
        </h1>
        <p className="text-gray-600">
          Here's how your notes are performing on the marketplace
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
              <p className="text-green-100 text-xs">+12% from last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Downloads</p>
              <p className="text-2xl font-bold">{stats.totalDownloads}</p>
              <p className="text-blue-100 text-xs">Across all notes</p>
            </div>
            <Download className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Notes Uploaded</p>
              <p className="text-2xl font-bold">{stats.notesUploaded}</p>
              <p className="text-purple-100 text-xs">Published & earning</p>
            </div>
            <FileText className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Purchases Made</p>
              <p className="text-2xl font-bold">{stats.totalPurchases}</p>
              <p className="text-orange-100 text-xs">${stats.totalSpent} spent</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Average Rating</p>
              <p className="text-2xl font-bold">{stats.avgRating}</p>
              <p className="text-pink-100 text-xs">From buyers</p>
            </div>
            <Star className="w-8 h-8 text-pink-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Profile Views</p>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-indigo-100 text-xs">This month</p>
            </div>
            <Eye className="w-8 h-8 text-indigo-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'sale' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'sale' ? (
                      <DollarSign className="w-5 h-5 text-green-600" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600">
                      {activity.type === 'sale' ? `Sold to ${activity.buyer}` : `Purchased from ${activity.seller}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      activity.type === 'sale' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {activity.type === 'sale' ? '+' : '-'}${activity.amount}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Top Notes */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => onTabChange('my-notes')}
                className="w-full flex items-center space-x-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <FileText className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                <span className="font-medium text-blue-700">Upload New Notes</span>
              </button>
              <button 
                onClick={() => onTabChange('marketplace')}
                className="w-full flex items-center space-x-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <ShoppingBag className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                <span className="font-medium text-green-700">Browse Marketplace</span>
              </button>
              <button 
                onClick={() => onTabChange('purchases')}
                className="w-full flex items-center space-x-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
              >
                <Download className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                <span className="font-medium text-purple-700">My Purchases</span>
              </button>
            </div>
          </div>

          {/* Top Performing Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Notes</h2>
            <div className="space-y-4">
              {topNotes.map((note) => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 text-sm mb-2">{note.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Download className="w-3 h-3" />
                        <span>{note.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{note.rating}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">${note.earnings.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => onTabChange('my-notes')}
              className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}