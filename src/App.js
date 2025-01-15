import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header/Welcome Section */}
      <header className="bg-white shadow-lg py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Professional Meeting Scheduler
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Streamline your meetings with our intuitive scheduling platform
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-blue-500" />}
              title="Easy Scheduling"
              description="Schedule meetings with just a few clicks"
            />
            <FeatureCard 
              icon={<Clock className="w-8 h-8 text-blue-500" />}
              title="Time Zone Smart"
              description="Automatic time zone conversion for all participants"
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-blue-500" />}
              title="Team Coordination"
              description="Coordinate with team members effortlessly"
            />
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Dashboard />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Meeting Scheduler. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default App;