import React from 'react';

interface PageHeaderProps {
  title: string;
  rightSlot?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, rightSlot }) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700 }}>{title}</h1>
      {rightSlot && <div>{rightSlot}</div>}
    </header>
  );
};
