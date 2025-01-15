import React, { useState, useEffect } from 'react';
import { Clock, Calendar, User, Trash2, Edit2, X, Check, Plus, Minus } from 'lucide-react';

const MeetingCard = ({ meeting, onDelete, onEdit, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeeting, setEditedMeeting] = useState(meeting);
  const [validationError, setValidationError] = useState('');
  const [emails, setEmails] = useState(
    meeting.participants ? meeting.participants.split(',').map(email => email.trim()) : []
  );

  const commonTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  const commonDurations = [15, 30, 45, 60, 90, 120];

  useEffect(() => {
    setEditedMeeting(meeting);
    setEmails(meeting.participants ? meeting.participants.split(',').map(email => email.trim()) : []);
  }, [meeting]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    return new Date(`2024-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isPastMeeting = new Date(`${meeting.date}T${meeting.time}`) < new Date();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateDateInput = (inputDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(inputDate);
    return selectedDate >= today;
  };

  const validateMeeting = (meeting) => {
    if (!meeting.title?.trim()) {
      return 'Meeting title is required';
    }

    if (!meeting.date || !validateDateInput(meeting.date)) {
      return 'Please select a valid future date';
    }

    if (!meeting.time) {
      return 'Meeting time is required';
    }

    if (!meeting.duration || meeting.duration <= 0 || meeting.duration > 480) {
      return 'Duration must be between 1 and 480 minutes';
    }

    if (emails.length === 0) {
      return 'At least one participant is required';
    }

    if (emails.some(email => !validateEmail(email))) {
      return 'Please enter valid email addresses';
    }

    return '';
  };

  const handleEditClick = () => {
    if (!isPastMeeting) {
      setIsEditing(true);
      setEditedMeeting(meeting);
      setValidationError('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMeeting(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
  };

  const handleEmailAdd = () => {
    setEmails([...emails, '']);
  };

  const handleEmailRemove = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
    setEditedMeeting(prev => ({
      ...prev,
      participants: newEmails.join(',')
    }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
    setEditedMeeting(prev => ({
      ...prev,
      participants: newEmails.join(',')
    }));
  };

  const handleTimeSelect = (time) => {
    setEditedMeeting(prev => ({
      ...prev,
      time
    }));
  };

  const handleDurationSelect = (duration) => {
    setEditedMeeting(prev => ({
      ...prev,
      duration
    }));
  };

  const handleSave = async () => {
    try {
      const error = validateMeeting(editedMeeting);
      if (error) {
        setValidationError(error);
        return;
      }

      const updatedMeetingData = {
        ...editedMeeting,
        participants: emails.join(',')
      };

      const updatedMeeting = await onUpdate(updatedMeetingData);
      setEditedMeeting(updatedMeeting);
      setIsEditing(false);
      setValidationError('');
    } catch (error) {
      setValidationError(error.message || 'Error saving meeting');
    }
  };

  const handleCancel = () => {
    setEditedMeeting(meeting);
    setEmails(meeting.participants ? meeting.participants.split(',').map(email => email.trim()) : []);
    setIsEditing(false);
    setValidationError('');
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="w-full">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={editedMeeting.title}
                onChange={handleInputChange}
                className="w-full text-lg font-semibold text-gray-900 border rounded p-1"
                placeholder="Meeting Title"
                maxLength={255}
                required
              />

              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                  <input
                    type="date"
                    name="date"
                    value={editedMeeting.date}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-600" />
                    <input
                      type="time"
                      name="time"
                      value={editedMeeting.time}
                      onChange={handleInputChange}
                      className="border rounded p-1 mr-2"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonTimes.map(time => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`px-2 py-1 text-sm rounded ${
                          editedMeeting.time === time
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Duration:</span>
                    <input
                      type="number"
                      name="duration"
                      value={editedMeeting.duration}
                      onChange={handleInputChange}
                      className="border rounded p-1 w-20"
                      min="1"
                      max="480"
                      required
                    />
                    <span className="ml-2">minutes</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {commonDurations.map(duration => (
                      <button
                        key={duration}
                        onClick={() => handleDurationSelect(duration)}
                        className={`px-2 py-1 text-sm rounded ${
                          editedMeeting.duration === duration
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {duration} min
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-600" />
                      <span>Participants</span>
                    </span>
                    <button
                      onClick={handleEmailAdd}
                      className="text-blue-500 hover:text-blue-600"
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        className="flex-1 border rounded p-1"
                        placeholder="participant@example.com"
                        required
                      />
                      <button
                        onClick={() => handleEmailRemove(index)}
                        className="text-red-500 hover:text-red-600"
                        type="button"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(meeting.date)}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatTime(meeting.time)} ({meeting.duration} minutes)
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  {emails.join(', ')}
                </div>
              </div>
            </>
          )}

          {validationError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {validationError}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                title="Save changes"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
                title="Cancel editing"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditClick}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Edit meeting"
                disabled={isPastMeeting}
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(meeting.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cancel meeting"
                disabled={isPastMeeting}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isPastMeeting ? 'bg-gray-500' : 'bg-green-500'}`}></div>
          <span className={`text-sm ${isPastMeeting ? 'text-gray-500' : 'text-green-600'}`}>
            {isPastMeeting ? 'Past Meeting' : 'Confirmed'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;