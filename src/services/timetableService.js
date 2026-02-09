import api from './api';

export const timetableService = {
    // Get all timetable entries
    getTimetable: async () => {
        const response = await api.get('/timetable');
        return {
            success: true,
            data: response.data
        };
    },

    // Create entry
    createEntry: async (entryData) => {
        const response = await api.post('/timetable', entryData);
        return {
            success: true,
            data: response.data
        };
    },

    // Update entry
    updateEntry: async (id, entryData) => {
        const response = await api.put(`/timetable/${id}`, entryData);
        return {
            success: true,
            data: response.data
        };
    },

    // Delete entry
    deleteEntry: async (id) => {
        await api.delete(`/timetable/${id}`);
        return {
            success: true,
            message: 'Entry deleted'
        };
    }
};
