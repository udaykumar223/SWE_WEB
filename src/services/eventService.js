// Mock Event Service for Frontend-only Demo
let MOCK_EVENTS = [];

export const eventService = {
    // Get all events
    getEvents: async (filters = {}) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            data: MOCK_EVENTS
        };
    },

    // Get single event
    getEvent: async (id) => {
        const event = MOCK_EVENTS.find(e => e._id === id);
        return {
            success: true,
            data: event
        };
    },

    // Create event
    createEvent: async (eventData) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newEvent = { ...eventData, _id: Date.now().toString() };
        MOCK_EVENTS.push(newEvent);
        return {
            success: true,
            data: newEvent
        };
    },

    // Update event
    updateEvent: async (id, eventData) => {
        MOCK_EVENTS = MOCK_EVENTS.map(e => e._id === id ? { ...e, ...eventData } : e);
        return {
            success: true,
            data: { ...eventData, _id: id }
        };
    },

    // Delete event
    deleteEvent: async (id) => {
        MOCK_EVENTS = MOCK_EVENTS.filter(e => e._id !== id);
        return {
            success: true,
            message: 'Event deleted'
        };
    },

    // Toggle completion
    toggleComplete: async (id) => {
        MOCK_EVENTS = MOCK_EVENTS.map(e => e._id === id ? { ...e, completed: !e.completed } : e);
        return {
            success: true,
            message: 'Status updated'
        };
    },

    // Get events for a specific day
    getEventsByDay: async (date) => {
        const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date.split('T')[0];
        const filtered = MOCK_EVENTS.filter(e => e.date.split('T')[0] === dateStr);
        return {
            success: true,
            data: filtered
        };
    },

    // Get upcoming deadlines
    getUpcomingDeadlines: async (limit = 10) => {
        return {
            success: true,
            data: MOCK_EVENTS.filter(e => e.type === 'deadline')
        };
    },

    // Get today's stats
    getTodayStats: async () => {
        const today = new Date().toISOString().split('T')[0];
        const todayEvents = MOCK_EVENTS.filter(e => e.date.split('T')[0] === today);

        return {
            success: true,
            data: {
                total: todayEvents.length,
                completed: todayEvents.filter(e => e.completed).length,
                pending: todayEvents.filter(e => !e.completed).length,
                attendance: '0%',
                upcomingCount: todayEvents.length
            }
        };
    },

    // Get counts for a day
    getCountsForDay: async (date) => {
        const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date.split('T')[0];
        const count = MOCK_EVENTS.filter(e => e.date.split('T')[0] === dateStr).length;
        return {
            success: true,
            data: { count }
        };
    },
};

