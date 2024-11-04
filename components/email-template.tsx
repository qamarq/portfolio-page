import * as React from 'react';

interface EmailTemplateProps {
    name: string;
    email: string;
    message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    name,
    email,
    message,
}) => (
    <div className='border p-10'>
        <h1>Message from: {name} - {email}!</h1>
        <p className='mt-10'>{message}</p>
    </div>
);
