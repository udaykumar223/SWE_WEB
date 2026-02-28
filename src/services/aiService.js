import api from './api';

export const aiService = {
    // Generate AI-powered study plan for a given date
    generateStudyPlan: async (date) => {
        const params = {};
        if (date) {
            params.date = date instanceof Date ? date.toISOString() : date;
        }
        const response = await api.get('/ai/studyplan', { params });
        return response.data;
    },

    // Get procrastination analysis
    getProcrastinationAnalysis: async () => {
        const response = await api.get('/ai/procrastination');
        return response.data;
    },

    // Get burnout risk analysis
    getBurnoutAnalysis: async (days = 7) => {
        const response = await api.get('/ai/burnout', { params: { days } });
        return response.data;
    },

    // Get daily workload
    getDailyWorkload: async (date) => {
        const params = {};
        if (date) {
            params.date = date instanceof Date ? date.toISOString() : date;
        }
        const response = await api.get('/ai/daily', { params });
        return response.data;
    },

    // Check overcommitment
    checkOvercommitment: async (date) => {
        const params = {};
        if (date) {
            params.date = date instanceof Date ? date.toISOString() : date;
        }
        const response = await api.get('/ai/overcommitment', { params });
        return response.data;
    }
};
