import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Star, User, Plus, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useProfile } from '../hooks/useProfile';
import toast from 'react-hot-toast';

interface TutoringSession {
  id: string;
  tutor_id: string;
  student_id: string;
  subject_name: string;
  subject_category: string;
  scheduled_at: string;
  duration: number;
  status: string;
  meeting_link: string | null;
  created_at: string;
  tutor_profile: {
    name: string;
    avatar_url: string | null;
    rating: number;
  };
  student_profile: {
    name: string;
    avatar_url: string | null;
  };
}

interface Tutor {
  id: string;
  name: string;
  avatar_url: string | null;
  rating: number;
  total_reviews: number;
  academic_level: string;
  bio: string | null;
  subjects: Array<{
    name: string;
    category: string;
    skill_level: string;
  }>;
}

export default function Tutoring() {
  const { profile } = useProfile();
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [activeTab, setActiveTab] = useState<'scheduled' | 'find-tutor' | 'be-tutor'>('scheduled');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (profile) {
      fetchTutoringSessions();
      if (activeTab === 'find-tutor') {
        fetchTutors();
      }
    }
  }, [profile, activeTab]);

  const fetchTutoringSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('tutoring_sessions')
        .select(`
          *,
          tutor_profile:profiles!tutoring_sessions_tutor_id_fkey (
            name,
            avatar_url,
            rating
          ),
          student_profile:profiles!tutoring_sessions_student_id_fkey (
            name,
            avatar_url
          )
        `)
        .or(`tutor_id.eq.${profile!.id},student_id.eq.${profile!.id}`)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching tutoring sessions:', error);
      toast.error('Failed to load tutoring sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTutors = async () => {
    try {
      // Get users who can help with subjects
      const { data: tutorData, error } = await supabase
        .from('profiles')
        .select(`
          *,
          subjects!subjects_user_id_fkey (
            name,
            category,
            skill_level
          )
        `)
        .neq('id', profile!.id);

      if (error) throw error;

      // Filter to only include users who have subjects they can help with
      const availableTutors = (tutorData || [])
        .map(tutor => ({
          ...tutor,
          subjects: tutor.subjects.filter((s: any) => s.can_help)
        }))
        .filter(tutor => tutor.subjects.length > 0);

      setTutors(availableTutors);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      toast.error('Failed to load tutors');
    }
  };

  const scheduledSessions = sessions.filter(s => s.status === 'scheduled' && new Date(s.scheduled_at) > new Date());
  const completedSessions = sessions.filter(s => s.status === 'completed');

  const filteredTutors = tutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.subjects.some(subject => 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tutoring</h1>
        <p className="text-gray-600 mt-2">Schedule tutoring sessions or become a tutor</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'scheduled', label: 'My Sessions', count: scheduledSessions.length },
            { id: 'find-tutor', label: 'Find a Tutor', count: tutors.length },
            { id: 'be-tutor', label: 'Become a Tutor', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scheduled Sessions */}
      {activeTab === 'scheduled' && (
        <div className="space-y-6">
          {scheduledSessions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scheduledSessions.map((session) => (
                <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {session.tutor_id === profile?.id 
                          ? session.student_profile.name.charAt(0)
                          : session.tutor_profile.name.charAt(0)
                        }
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.subject_name}</h3>
                      <p className="text-gray-600">
                        {session.tutor_id === profile?.id 
                          ? `with ${session.student_profile.name}`
                          : `with ${session.tutor_profile.name}`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(session.scheduled_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(session.scheduled_at).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4" />
                      <span>{session.duration} minutes</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <Video className="w-4 h-4" />
                      <span>Join Session</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
              <p className="text-gray-600 mb-6">Schedule your first tutoring session to get started</p>
              <button
                onClick={() => setActiveTab('find-tutor')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Find a Tutor
              </button>
            </div>
          )}
        </div>
      )}

      {/* Find a Tutor */}
      {activeTab === 'find-tutor' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tutors by subject or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTutors.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {tutor.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{tutor.rating.toFixed(1)}</span>
                      </div>
                      <span>•</span>
                      <span>{tutor.total_reviews} reviews</span>
                    </div>
                    <p className="text-sm text-gray-600">{tutor.academic_level}</p>
                  </div>
                </div>

                {tutor.bio && (
                  <p className="text-gray-600 text-sm mb-4">{tutor.bio}</p>
                )}

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Can help with:</h4>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.slice(0, 3).map((subject, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {subject.name}
                      </span>
                    ))}
                    {tutor.subjects.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        +{tutor.subjects.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Book Session
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTutors.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      )}

      {/* Become a Tutor */}
      {activeTab === 'be-tutor' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <User className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Become a Tutor</h2>
            <p className="text-gray-600">Share your knowledge and earn money helping other students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Set Your Expertise</h3>
              <p className="text-sm text-gray-600">Add subjects you can help with in the "My Subjects" section</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Set Your Schedule</h3>
              <p className="text-sm text-gray-600">Choose when you're available to tutor</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Start Helping</h3>
              <p className="text-sm text-gray-600">Get matched with students and start tutoring</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6">
              To become a tutor, make sure you have subjects marked as "Can Help" in your subjects list.
            </p>
            <button
              onClick={() => window.location.hash = 'subjects'}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <BookOpen className="w-5 h-5" />
              <span>Manage My Subjects</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}