// Define the base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Create a new meeting
 * @param {Object} meetingData - Meeting details
 * @returns {Promise<Object>} Created meeting
 */
export const createMeeting = async (meetingData) => {
  try {
    console.log('Sending meeting data to API:', meetingData); // Debugging log
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error Response:', error); // Log detailed error
      throw new Error(error.message || 'Failed to create meeting');
    }

    return await response.json();
  } catch (err) {
    console.error('Error in createMeeting:', err.message); // Debugging log
    throw err;
  }
};


/**
 * Get all meetings
 * @returns {Promise<Array>} List of meetings
 */
export const getMeetings = async () => {
  try {
    console.log("Fetching meetings from API..."); // Debugging
    const response = await fetch(`${API_BASE_URL}/meetings`);

    if (!response.ok) {
      throw new Error('Failed to fetch meetings');
    }

    const meetings = await response.json();
    console.log("Fetched meetings:", meetings); // Debugging
    return meetings;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
};

/**
 * Delete a meeting
 * @param {string} meetingId - ID of the meeting to delete
 * @returns {Promise<void>}
 */
export const deleteMeeting = async (meetingId) => {
  try {
    console.log(`Deleting meeting with ID: ${meetingId}`); // Debugging
    const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete meeting');
    }

    console.log(`Meeting with ID ${meetingId} deleted successfully.`); // Debugging
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw error;
  }
};

/**
 * Update an existing meeting
 * @param {string} meetingId - ID of the meeting to update
 * @param {Object} meetingData - Updated meeting details
 * @returns {Promise<Object>} Updated meeting
 */

export const updateMeeting = async (id, updatedData) => {
  try {
    console.log(`Updating meeting with ID: ${id}`, updatedData); // Debugging log
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update meeting');
    }

    return await response.json();
  } catch (err) {
    console.error('Error in updateMeeting:', err.message);
    throw err;
  }
};

export const fetchMeetings = async () => {
  try {
    console.log('Fetching meetings from API...'); // Debug log
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error Response:', error); // Debugging log
      throw new Error(error.message || 'Failed to fetch meetings');
    }

    const data = await response.json();
    console.log('Fetched meetings:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error in fetchMeetings:', error.message); // Debugging log
    throw error;
  }
};
