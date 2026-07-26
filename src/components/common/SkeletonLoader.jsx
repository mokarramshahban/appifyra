import React from 'react';

export function TableSkeleton({ rows = 4, cols = 6 }) {
  return (
    <div className="table-responsive" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px' }}>
      <table className="table table-dark mb-0 align-middle">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}>
                <div className="skeleton-shimmer" style={{ height: '16px', width: '80%', borderRadius: '4px' }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="py-3">
                  <div className="skeleton-shimmer" style={{ height: '22px', width: c === 0 ? '60%' : c === 1 ? '85%' : '70%', borderRadius: '6px' }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeletonGrid({ count = 4 }) {
  return (
    <div className="row g-4">
      {Array.from({ length: count }).map((_, i) => (
        <div className="col-lg-6" key={i}>
          <div 
            className="p-4" 
            style={{ 
              borderRadius: '16px', 
              backgroundColor: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.1)' 
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="skeleton-shimmer" style={{ height: '24px', width: '90px', borderRadius: '12px' }} />
              <div className="skeleton-shimmer" style={{ height: '24px', width: '100px', borderRadius: '12px' }} />
            </div>
            <div className="skeleton-shimmer mb-2" style={{ height: '28px', width: '70%', borderRadius: '6px' }} />
            <div className="skeleton-shimmer mb-3" style={{ height: '18px', width: '50%', borderRadius: '6px' }} />
            <div className="pt-3 d-flex justify-content-between align-items-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="skeleton-shimmer" style={{ height: '16px', width: '120px', borderRadius: '4px' }} />
              <div className="skeleton-shimmer" style={{ height: '16px', width: '80px', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
