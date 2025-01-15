import React, { useState } from 'react';
import { X, Clock, Calendar, User, Check } from 'lucide-react';

const ScheduleMeeting = ({ onClose, onSchedule }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: 30,
    participants: [],
  });
  const [participantInput, setParticipantInput] = useState('');
  const [confirmedTime, setConfirmedTime] = useState('');
  const [error, setError] = useState('');
  const [timeDialogVisible, setTimeDialogVisible] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return value.trim() === '' ? 'Title is required.' : '';
      case 'date':
        return value === '' ? 'Date is required.' : '';
      case 'time':
        return value === '' ? 'Time is required.' : '';
      case 'participant':
        return value === '' || !/\S+@\S+\.\S+/.test(value) ? 'Valid email is required.' : '';
      default:
        return '';
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setError(error);
  };

  const addParticipant = () => {
    if (participantInput.trim() === '' || !/\S+@\S+\.\S+/.test(participantInput)) {
      setError('Please enter a valid email address.');
      return;
    }
    setFormData({
      ...formData,
      participants: [...formData.participants, participantInput.trim()],
    });
    setParticipantInput('');
    setError('');
  };

  const removeParticipant = (index) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter((_, i) => i !== index),
    });
  };

  const handleTimeDialog = () => {
    if (!formData.time) {
      setError('Please select a time first.');
      return;
    }
    setError('');
    setTimeDialogVisible(true);
  };

  const confirmTime = () => {
    setConfirmedTime(formData.time);
    setTimeDialogVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      title: formData.title,
      date: formData.date,
      time: confirmedTime,
      duration: formData.duration,
      participants: formData.participants,
    };
  
    console.log('Form payload for submission:', payload); // Debugging log
  
    if (!payload.title || !payload.date || !confirmedTime || payload.participants.length === 0) {
      setError('All fields must be completed, and time must be confirmed.');
      return;
    }
  
    try {
      const response = await onSchedule(payload);
      console.log('Meeting scheduled successfully:', response); // Debugging log
    } catch (err) {
      console.error('Failed to schedule the meeting:', err.message);
      setError('Failed to schedule the meeting. Please try again.');
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <User className="w-6 h-6 mr-2" /> Schedule New Meeting
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Meeting Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Meeting Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFieldChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter meeting title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Time
              </label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleFieldChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleTimeDialog}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Confirm
                </button>
              </div>
              {confirmedTime && (
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Confirmed Time: {confirmedTime}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Participants</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter participant email"
              />
              <button
                type="button"
                onClick={addParticipant}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {formData.participants.map((email, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {error && <div className="text-red-500 text-sm py-2">{error}</div>}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!confirmedTime || !formData.title || !formData.date}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                !confirmedTime || !formData.title || !formData.date ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Schedule
            </button>
          </div>
        </form>
      </div>

      {/* Time Confirmation Dialog */}
      {timeDialogVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-sm text-center">
            <h4 className="text-lg font-semibold mb-4">Confirm Selected Time</h4>
            <p className="text-gray-700 mb-6">{`You selected ${formData.time}. Do you want to confirm this time?`}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmTime}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setTimeDialogVisible(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleMeeting;