import React, { useState } from 'react';
import { Phone, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface PhoneAuthProps {
  onSuccess: () => void;
}

export default function PhoneAuth({ onSuccess }: PhoneAuthProps) {
  const [step, setStep] = useState<'phone' | 'verify' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    academicLevel: '',
    bio: ''
  });

  // Demo phone number for testing
  const DEMO_PHONE = '(123) 456-7890';
  const DEMO_OTP = '123456';
  const DEMO_EMAIL = 'demo@noteshub.app';
  const DEMO_PASSWORD = 'demo123456';

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if it's the demo phone number
      if (phone === DEMO_PHONE) {
        toast.success('Demo verification code: 123456');
        setStep('verify');
        setLoading(false);
        return;
      }

      const cleanPhone = phone.replace(/[^\d]/g, '');
      const formattedPhone = `+1${cleanPhone}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast.success('Verification code sent!');
      setStep('verify');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Handle demo phone number
      if (phone === DEMO_PHONE) {
        if (otp === DEMO_OTP) {
          // Try to sign in with demo user first
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: DEMO_EMAIL,
            password: DEMO_PASSWORD
          });

          if (signInError) {
            // If demo user doesn't exist, create it
            console.log('Demo user not found, creating new demo user...');
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: DEMO_EMAIL,
              password: DEMO_PASSWORD,
              options: {
                emailRedirectTo: undefined // Disable email confirmation
              }
            });

            if (signUpError) {
              console.error('Demo user creation error:', signUpError);
              throw new Error('Failed to create demo user: ' + signUpError.message);
            }

            if (signUpData.user) {
              console.log('Demo user created successfully:', signUpData.user.id);
              setStep('profile');
            } else {
              throw new Error('Failed to create demo user - no user returned');
            }
          } else if (signInData.user) {
            console.log('Demo user signed in successfully:', signInData.user.id);
            // Check if profile exists
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', signInData.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error checking profile:', profileError);
              throw profileError;
            }

            if (profile) {
              console.log('Demo user profile found, logging in...');
              onSuccess();
            } else {
              console.log('Demo user profile not found, creating profile...');
              setStep('profile');
            }
          }
        } else {
          throw new Error('Invalid demo verification code. Use: 123456');
        }
        setLoading(false);
        return;
      }

      // Handle real phone verification
      const cleanPhone = phone.replace(/[^\d]/g, '');
      const formattedPhone = `+1${cleanPhone}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      if (data.user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          onSuccess();
        } else {
          setStep('profile');
        }
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      console.log('Creating profile for user:', user.id);

      // Determine phone number and email based on demo or real user
      const phoneNumber = phone === DEMO_PHONE ? '+11234567890' : `+1${phone.replace(/[^\d]/g, '')}`;
      const email = user.email || (phone === DEMO_PHONE ? DEMO_EMAIL : null);

      const profileInsert = {
        id: user.id,
        name: profileData.name,
        academic_level: profileData.academicLevel,
        bio: profileData.bio,
        phone: phoneNumber,
        email: email,
        rating: 5.0,
        total_reviews: 0
      };

      console.log('Inserting profile:', profileInsert);

      const { error } = await supabase
        .from('profiles')
        .insert(profileInsert);

      if (error) {
        console.error('Profile creation error:', error);
        throw error;
      }

      console.log('Profile created successfully');
      toast.success('Profile created successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const academicLevels = [
    '9th Grade', '10th Grade', '11th Grade', '12th Grade',
    'College Freshman', 'College Sophomore', 'College Junior', 'College Senior'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to NotesHub</h1>
          <p className="text-gray-600">Your student notes marketplace</p>
        </div>

        {step === 'phone' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter your phone number</h2>
              <p className="text-gray-600 text-sm">We'll send you a verification code</p>
            </div>

            {/* Demo Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-900 mb-1">Demo Mode Available</h3>
                  <p className="text-sm text-blue-700">
                    Use <span className="font-mono bg-blue-100 px-1 rounded">(123) 456-7890</span> to test without SMS.
                    Verification code: <span className="font-mono bg-blue-100 px-1 rounded">123456</span>
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">+1</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    placeholder="(555) 123-4567"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={14}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 14}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {step === 'verify' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter verification code</h2>
              <p className="text-gray-600 text-sm">
                We sent a 6-digit code to {phone}
              </p>
              {phone === DEMO_PHONE && (
                <p className="text-blue-600 text-sm mt-2 font-medium">
                  Demo code: 123456
                </p>
              )}
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-gray-600 hover:text-gray-800 text-sm"
              >
                Change phone number
              </button>
            </form>
          </div>
        )}

        {step === 'profile' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Complete your profile</h2>
              <p className="text-gray-600 text-sm">Tell us a bit about yourself</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Level
                </label>
                <select
                  value={profileData.academicLevel}
                  onChange={(e) => setProfileData({ ...profileData, academicLevel: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select your academic level</option>
                  {academicLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell others about your interests and what subjects you're good at..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !profileData.name || !profileData.academicLevel}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}