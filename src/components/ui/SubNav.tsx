import React from 'react';
import { useNavigate } from 'react-router-dom';

export function SubNav({ to = '/' }: { to?: string }) {
    const navigate = useNavigate();

    return (
        <div className="subnav">
            <button className="back" onClick={() => navigate(to)}>
                ← Ticketeer
            </button>
        </div>
    );
}