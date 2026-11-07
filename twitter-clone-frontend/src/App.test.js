import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login form', () => {
  window.history.replaceState({}, '', '/login');
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
});
