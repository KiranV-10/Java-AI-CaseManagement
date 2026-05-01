import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import AiDisclaimer from '../components/AiDisclaimer';

describe('StatusBadge', () => {
  it('renders NEW status', () => {
    render(<StatusBadge status="NEW" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders IN_REVIEW status', () => {
    render(<StatusBadge status="IN_REVIEW" />);
    expect(screen.getByText('In Review')).toBeInTheDocument();
  });

  it('renders WAITING_FOR_CITIZEN status', () => {
    render(<StatusBadge status="WAITING_FOR_CITIZEN" />);
    expect(screen.getByText('Waiting for Citizen')).toBeInTheDocument();
  });

  it('renders RESOLVED status', () => {
    render(<StatusBadge status="RESOLVED" />);
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('renders CLOSED status', () => {
    render(<StatusBadge status="CLOSED" />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });
});

describe('PriorityBadge', () => {
  it('renders LOW priority', () => {
    render(<PriorityBadge priority="LOW" />);
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('renders HIGH priority', () => {
    render(<PriorityBadge priority="HIGH" />);
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('renders URGENT priority', () => {
    render(<PriorityBadge priority="URGENT" />);
    expect(screen.getByText('URGENT')).toBeInTheDocument();
  });
});

describe('AiDisclaimer', () => {
  it('renders disclaimer text', () => {
    render(<AiDisclaimer />);
    expect(screen.getByText(/AI-generated recommendations/)).toBeInTheDocument();
  });
});
