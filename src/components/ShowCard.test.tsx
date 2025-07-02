import { render, screen } from '@testing-library/react';
import React from 'react';

// We'll create this component next
import ShowCard from './ShowCard';

describe('ShowCard component', () => {
    const mockShow = {
        id: '1',
        title: 'The Great Show',
        isLive: true,
        nextAirDate: '2025-07-07',
    };

    test('renders the show title and live badge', () => {
        render(<ShowCard show={mockShow} />);

        // Check for the title text
        expect(screen.getByText('The Great Show')).toBeInTheDocument();

        // Check for "Live" badge
        expect(screen.getByText(/live/i)).toBeInTheDocument();
    });
});
