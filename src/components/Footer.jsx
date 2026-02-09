const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            textAlign: 'center',
            padding: '20px',
            color: 'var(--text-tertiary)',
            fontSize: '0.85rem',
            marginTop: 'auto',
            marginBottom: '80px' // Space for bottom nav
        }}>
            <p>&copy; {currentYear} ClassFlow. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
