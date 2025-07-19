import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import PhoneAuth from './components/auth/PhoneAuth';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import MyNotes from './components/MyNotes';
import Purchases from './components/Purchases';
import Profile from './components/Profile';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [activeTab, setActiveTab] = React.useState('marketplace');

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading NotesHub...</h2>
          <p className="text-gray-600">Your student notes marketplace</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <>
        <PhoneAuth onSuccess={() => window.location.reload()} />
        <Toaster position="top-right" />
      </>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />;
      case 'marketplace':
        return <Marketplace />;
      case 'my-notes':
        return <MyNotes />;
      case 'purchases':
        return <Purchases />;
      case 'profile':
        return <Profile />;
      default:
        return <Marketplace />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderActiveTab()}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;