import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, List } from 'lucide-react';
import ScheduleMeeting from './ScheduleMeeting';
import MeetingCard from './MeetingCard';
import { getMeetings, deleteMeeting, updateMeeting, createMeeting } from '../api/meetingApi';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState('');
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchMeetings = async () => {
    try {
      setError('');
      const fetchedMeetings = await getMeetings();
      console.log('Fetched meetings:', fetchedMeetings);
      setMeetings(fetchedMeetings);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError('Failed to fetch meetings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreateMeeting = async (meetingData) => {
    try {
      console.log('Attempting to create meeting with data:', meetingData); // Log request data
      setIsLoading(true);
      const createdMeeting = await createMeeting(meetingData);
      console.log('Meeting successfully created:', createdMeeting); // Log response data
      setMeetings((prevMeetings) => [...prevMeetings, createdMeeting]);
      showNotification('Meeting successfully scheduled');
      return createdMeeting;
    } catch (err) {
      console.error('Error in handleCreateMeeting:', err); // Log detailed error
      setError('Failed to schedule the meeting. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await deleteMeeting(id);
      setMeetings(prevMeetings => prevMeetings.filter(m => m.id !== id));
      showNotification('Meeting successfully deleted');
    } catch (err) {
      console.error('Error deleting meeting:', err);
      setError('Failed to delete the meeting. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (updatedMeeting) => {
    try {
      setIsLoading(true);
      console.log('Sending update for meeting:', updatedMeeting);
      
      const response = await updateMeeting(updatedMeeting.id, updatedMeeting);
      console.log('Received updated meeting:', response);
      
      setMeetings(prevMeetings => 
        prevMeetings.map(meeting => 
          meeting.id === updatedMeeting.id ? response : meeting
        )
      );
      
      showNotification('Meeting successfully updated');
      return response;
    } catch (error) {
      console.error('Failed to update meeting:', error);
      setError('Failed to update meeting. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setShowScheduleModal(true);
  };

  const handleModalClose = () => {
    setShowScheduleModal(false);
    setEditingMeeting(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">Loading...</div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Dashboard</h2>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Schedule Meeting
        </button>
      </div>

      {notification.show && (
        <div 
          className={`mb-4 p-4 rounded-lg ${
            notification.type === 'error' 
              ? 'bg-red-100 text-red-700 border border-red-400'
              : 'bg-green-100 text-green-700 border border-green-400'
          }`}
        >
          {notification.message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700 border border-red-400">
          {error}
        </div>
      )}

      <div className="flex space-x-4 border-b mb-6">
        <TabButton
          active={activeTab === 'calendar'}
          onClick={() => setActiveTab('calendar')}
          icon={<CalendarIcon className="w-5 h-5" />}
          text="Calendar View"
        />
        <TabButton
          active={activeTab === 'list'}
          onClick={() => setActiveTab('list')}
          icon={<List className="w-5 h-5" />}
          text="List View"
        />
      </div>

      <div className="space-y-4">
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onDelete={handleDelete}
              onEdit={() => handleEdit(meeting)}
              onUpdate={handleUpdate}
            />
          ))
        ) : (
          <p className="text-gray-500">No meetings scheduled yet. Click "Schedule Meeting" to add one!</p>
        )}
      </div>

      {showScheduleModal && (
        <ScheduleMeeting
          meeting={editingMeeting}
          onClose={handleModalClose}
          onSchedule={async (meetingData) => {
            try {
              if (editingMeeting) {
                await handleUpdate({ ...meetingData, id: editingMeeting.id });
              } else {
                await handleCreateMeeting(meetingData);
              }
              handleModalClose();
            } catch (err) {
              // Error is already handled in handleUpdate/handleCreateMeeting
            }
          }}
        />
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 border-b-2 transition-colors ${
      active ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {icon}
    <span className="ml-2">{text}</span>
  </button>
);

export default Dashboard;