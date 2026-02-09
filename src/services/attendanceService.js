import api from './api';

export const attendanceService = {
    // Get all attendance records
    getAttendance: async () => {
        const response = await api.get('/attendance');
        return {
            success: true,
            data: response.data
        };
    },

    // Get stats
    getStats: async () => {
        const response = await api.get('/attendance/stats');
        return {
            success: true,
            data: response.data
        };
    },

    // Mark attendance
    markAttendance: async (data) => {
        const response = await api.post('/attendance', data);
        return {
            success: true,
            data: response.data
        };
    },

    // Delete record
    deleteRecord: async (id) => {
        await api.delete(`/attendance/${id}`);
        return {
            success: true,
            message: 'Record deleted'
        };
    }
};
