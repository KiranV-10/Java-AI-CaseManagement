import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../pages/LoginPage';

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage onLogin={vi.fn()} />);
    expect(screen.getByText('Labor Services')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders demo login buttons', () => {
    render(<LoginPage onLogin={vi.fn()} />);
    expect(screen.getByText('Citizen')).toBeInTheDocument();
    expect(screen.getByText('Staff')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders email and password fields as required', () => {
    render(<LoginPage onLogin={vi.fn()} />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
