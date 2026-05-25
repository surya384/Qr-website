import React from 'react';

const TestPage = ({ title }) => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mt-4 text-gray-600">This is a placeholder test page for {title}.</p>
        </div>
    );
};

export default TestPage;
