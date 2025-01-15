import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-blue-50">
      {/* Header/Welcome Section */}
      <header className="bg-indigo-600 text-white shadow-lg py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold">
            Professional Meeting Scheduler
          </h1>
          <p className="mt-2 text-lg">
            Streamline your meetings with our intuitive scheduling platform
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="w-12 h-12 text-indigo-500" />}
              title="Easy Scheduling"
              description="Schedule meetings with just a few clicks"
            />
            <FeatureCard 
              icon={<Clock className="w-12 h-12 text-indigo-500" />}
              title="Time Zone Smart"
              description="Automatic time zone conversion for all participants"
            />
            <FeatureCard 
              icon={<Users className="w-12 h-12 text-indigo-500" />}
              title="Team Coordination"
              description="Coordinate with team members effortlessly"
            />
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <Dashboard />
      </main>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Meeting Scheduler. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow transform hover:scale-105">
    <div className="flex flex-col items-center text-center">
      <div className="mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 text-base">{description}</p>
    </div>
  </div>
);

export default App;