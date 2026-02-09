import api from './api';

export const eventService = {
    // Get all events
    getEvents: async () => {
        const response = await api.get('/events');
        return {
            success: true,
            data: response.data
        };
    },

    // Get single event
    getEvent: async (id) => {
        // Backend doesn't strictly have a "get single" unless we added it, 
        // but we can filter from list or add endpoint if needed.
        // For now, let's assume we fetch all and find, OR add the endpoint.
        // Actually, let's just fetch all for now or check if backend supports GET /:id (it usually does in standard controllers)
        // Checking routes/events.js -> router.delete('/:id') is there. router.get('/') is there. 
        // router.get('/:id') was NOT in the previous file view of routes/events.js.
        // So we might need to rely on the list or add the endpoint.
        // Let's implement get-all-and-find pattern for safety for now, or just return null if not critical.
        // Better: Fetch all.
        const response = await api.get('/events');
        const event = response.data.find(e => e._id === id);
        return {
            success: true,
            data: event
        };
    },

    // Create event
    createEvent: async (eventData) => {
        const response = await api.post('/events', eventData);
        return {
            success: true,
            data: response.data
        };
    },

    // Update event
    updateEvent: async (id, eventData) => {
        const response = await api.put(`/events/${id}`, eventData);
        return {
            success: true,
            data: response.data
        };
    },

    // Delete event
    deleteEvent: async (id) => {
        await api.delete(`/events/${id}`);
        return {
            success: true,
            message: 'Event deleted'
        };
    },

    // Toggle completion (Helper that just calls update)
    toggleComplete: async (id, currentStatus) => {
        // We need the current event first or just send the toggle.
        // Let's assume the caller passes the new object or we fetch it.
        // Simplified: Just accept we need to update 'isCompleted'
        const response = await api.put(`/events/${id}`, { isCompleted: !currentStatus });
        return {
            success: true,
            message: 'Status updated',
            data: response.data
        };
    },

    // Get events for a specific day
    getEventsByDay: async (date) => {
        const response = await api.get('/events');
        const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date.split('T')[0];
        const filtered = response.data.filter(e => {
            const eDate = new Date(e.startTime).toISOString().split('T')[0];
            return eDate === dateStr;
        });
        return {
            success: true,
            data: filtered
        };
    },

    // Get upcoming deadlines
    getUpcomingDeadlines: async (limit = 10) => {
        const response = await api.get('/events');
        // Filter tasks/deadlines
        const upcoming = response.data
            .filter(e => e.classification === 'assignment' || e.classification === 'exam' || e.classification === 'deadline')
            .filter(e => new Date(e.startTime) > new Date())
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .slice(0, limit);

        return {
            success: true,
            data: upcoming
        };
    },

    // Get today's stats
    getTodayStats: async () => {
        const response = await api.get('/events');
        const today = new Date().toISOString().split('T')[0];
        const todayEvents = response.data.filter(e => new Date(e.startTime).toISOString().split('T')[0] === today);

        return {
            success: true,
            data: {
                total: todayEvents.length,
                completed: todayEvents.filter(e => e.isCompleted).length,
                pending: todayEvents.filter(e => !e.isCompleted).length,
                attendance: '0%', // Placeholder, needs attendance service
                upcomingCount: todayEvents.length
            }
        };
    },

    // Get countsForDay
    getCountsForDay: async (date) => {
        const response = await api.get('/events');
        const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date.split('T')[0];
        const count = response.data.filter(e => new Date(e.startTime).toISOString().split('T')[0] === dateStr).length;
        return {
            success: true,
            data: { count }
        };
    }
};

