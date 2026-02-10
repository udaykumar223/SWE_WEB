import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff, HiCheckCircle } from 'react-icons/hi';
import { authService } from '../services/authService';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpRefs = useRef([]);

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            toast.success('OTP sent to your email!');
            setStep(2);
            startResendCooldown();
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Failed to send OTP';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: OTP input handling
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // only digits
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // take last digit
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(''));
            otpRefs.current[5]?.focus();
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }
        setStep(3);
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(email, otp.join(''), newPassword);
            toast.success('Password reset successfully!');
            setStep(4); // success state
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Failed to reset password';
            toast.error(msg);
            // If OTP is invalid, go back to OTP step
            if (msg.toLowerCase().includes('otp')) {
                setStep(2);
                setOtp(['', '', '', '', '', '']);
            }
        } finally {
            setLoading(false);
        }
    };

    const startResendCooldown = () => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            toast.success('New OTP sent!');
            setOtp(['', '', '', '', '', '']);
            startResendCooldown();
        } catch (error) {
            toast.error('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page fade-in">
            <div className="forgot-container">
                {/* Step Indicator */}
                {step < 4 && (
                    <div className="step-indicator">
                        <div className={`step-dot ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`} />
                        <div className={`step-dot ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`} />
                        <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
                    </div>
                )}

                {/* Step 1: Enter Email */}
                {step === 1 && (
                    <>
                        <div className="forgot-header">
                            <h1>Forgot Password?</h1>
                            <p>Enter your email address and we'll send you a verification code to reset your password.</p>
                        </div>
                        <form className="forgot-form" onSubmit={handleSendOtp}>
                            <div className="forgot-input-group">
                                <HiOutlineMail className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="btn-forgot" disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    </>
                )}

                {/* Step 2: Enter OTP */}
                {step === 2 && (
                    <>
                        <div className="forgot-header">
                            <h1>Verify OTP</h1>
                            <p>Enter the 6-digit code sent to <strong>{email}</strong></p>
                        </div>
                        <form className="forgot-form" onSubmit={handleVerifyOtp}>
                            <div className="otp-inputs" onPaste={handleOtpPaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                            <button type="submit" className="btn-forgot" disabled={otp.join('').length !== 6}>
                                Verify OTP
                            </button>
                            <div className="resend-row">
                                {resendCooldown > 0 ? (
                                    <span>Resend OTP in {resendCooldown}s</span>
                                ) : (
                                    <>
                                        Didn't receive the code?{' '}
                                        <button onClick={handleResendOtp} disabled={loading}>
                                            Resend
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <>
                        <div className="forgot-header">
                            <h1>New Password</h1>
                            <p>Create a new password for your account.</p>
                        </div>
                        <form className="forgot-form" onSubmit={handleResetPassword}>
                            <div className="forgot-input-group">
                                <HiOutlineLockClosed className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="toggle-eye-forgot"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <HiEyeOff /> : <HiEye />}
                                </button>
                            </div>
                            <div className="forgot-input-group">
                                <HiOutlineLockClosed className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button type="submit" className="btn-forgot" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <>
                        <div className="success-icon">
                            <HiCheckCircle />
                        </div>
                        <div className="forgot-header">
                            <h1>Password Reset!</h1>
                            <p>Your password has been successfully reset. You can now sign in with your new password.</p>
                        </div>
                        <button className="btn-forgot" onClick={() => navigate('/auth')}>
                            Back to Sign In
                        </button>
                    </>
                )}

                {/* Back to login link */}
                {step < 4 && (
                    <div className="back-to-login">
                        <a onClick={() => navigate('/auth')}>← Back to Sign In</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
