import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center p-8">
            <motion.div
                className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid rgba(99, 102, 241, 0.3)',
                    borderTop: '4px solid #6366f1',
                    borderRadius: '50%',
                }}
            />
        </div>
    );
};

export default LoadingSpinner;
