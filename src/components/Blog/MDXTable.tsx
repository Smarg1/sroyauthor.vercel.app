import type React from 'react';

type MDXTableProps = React.HTMLAttributes<HTMLTableElement>;

const MDXTable: React.FC<MDXTableProps> = ({ children }) => {
  return (
    <div className="w-full overflow-x-auto px-2 [scrollbar-width:thin]">
      <table className="border-outline min-w-full table-auto divide-x rounded-lg border">
        {children}
      </table>
    </div>
  );
};

export default MDXTable;
