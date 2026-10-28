import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Login } from '../pages/Login';

describe('Login Component', () => {
  it('should render the login form with all elements', () => {
    const mockLogin = vi.fn().mockResolvedValue({});
    const mockNavigateRegister = vi.fn();
    const mockContinueGuest = vi.fn();

    render(
      <Login
        onLogin={mockLogin}
        onNavigateRegister={mockNavigateRegister}
        onContinueAsGuest={mockContinueGuest}
      />
    );

    expect(screen.getByText('Urban Traffic & Accident Intelligence Platform')).toBeDefined();
    expect(screen.getByText('Demo Analyst Account')).toBeDefined();
    expect(screen.getByLabelText(/Analyst Email/i)).toBeDefined();
    expect(screen.getByLabelText(/Secure Password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign In to Analytics Hub/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Auto Fill/i })).toBeDefined();
  });

  it('should auto-fill demo analyst credentials when Auto Fill is clicked', () => {
    const mockLogin = vi.fn().mockResolvedValue({});
    const mockNavigateRegister = vi.fn();
    const mockContinueGuest = vi.fn();

    render(
      <Login
        onLogin={mockLogin}
        onNavigateRegister={mockNavigateRegister}
        onContinueAsGuest={mockContinueGuest}
      />
    );

    const emailInput = screen.getByLabelText(/Analyst Email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Secure Password/i) as HTMLInputElement;

    // Clear inputs first
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    expect(emailInput.value).toBe('');

    const autoFillBtn = screen.getByRole('button', { name: /Auto Fill/i });
    fireEvent.click(autoFillBtn);

    expect(emailInput.value).toBe('demo@citypulse.com');
    expect(passwordInput.value).toBe('demo123');
  });

  it('should call onLogin with credentials upon form submission', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ token: 'mock-token' });
    const mockNavigateRegister = vi.fn();
    const mockContinueGuest = vi.fn();

    render(
      <Login
        onLogin={mockLogin}
        onNavigateRegister={mockNavigateRegister}
        onContinueAsGuest={mockContinueGuest}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Sign In to Analytics Hub/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'demo@citypulse.com',
        password: 'demo123'
      });
    });
  });

  it('should trigger onContinueAsGuest when clicked', () => {
    const mockLogin = vi.fn().mockResolvedValue({});
    const mockNavigateRegister = vi.fn();
    const mockContinueGuest = vi.fn();

    render(
      <Login
        onLogin={mockLogin}
        onNavigateRegister={mockNavigateRegister}
        onContinueAsGuest={mockContinueGuest}
      />
    );

    const guestBtn = screen.getByRole('button', { name: /Continue as Guest/i });
    fireEvent.click(guestBtn);
    expect(mockContinueGuest).toHaveBeenCalledTimes(1);
  });

  it('should trigger onNavigateRegister when register link is clicked', () => {
    const mockLogin = vi.fn().mockResolvedValue({});
    const mockNavigateRegister = vi.fn();
    const mockContinueGuest = vi.fn();

    render(
      <Login
        onLogin={mockLogin}
        onNavigateRegister={mockNavigateRegister}
        onContinueAsGuest={mockContinueGuest}
      />
    );

    const registerBtn = screen.getByRole('button', { name: /Create new account/i });
    fireEvent.click(registerBtn);
    expect(mockNavigateRegister).toHaveBeenCalledTimes(1);
  });
});
