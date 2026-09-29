import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ShipmentCard from '../components/ShipmentCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import FilterPanel from '../components/FilterPanel';
import ExportButton from '../components/ExportButton';
import EventBadge from '../components/EventBadge';
import Tabs, { TabPanel } from '../components/Tabs';
import { useToast } from '../components/Toast';
import './Shipments.css';

/**
 * Mock shipment list — simulates the CQRS read model
 * projection of all active shipments.
 */
const ALL_SHIPMENTS = [
  { id: 'SHIP-2024-0847', route: 'Shanghai → Los Angeles', status: 'In Transit', containerType: '40ft Refrigerated', weight: '22,450 kg', lastEvent: 'ARRIVED_AT_PORT' },
  { id: 'SHIP-2024-0621', route: 'Rotterdam → Mumbai', status: 'Delivered', containerType: '20ft Standard', weight: '14,200 kg', lastEvent: 'DELIVERED' },
  { id: 'SHIP-2024-0103', route: 'Hamburg → Singapore', status: 'Alert', containerType: '40ft High Cube', weight: '28,900 kg', lastEvent: 'TEMPERATURE_SPIKE' },
  { id: 'SHIP-2024-0489', route: 'Busan → Seattle', status: 'In Transit', containerType: '20ft Standard', weight: '11,600 kg', lastEvent: 'LOADED_ON_SHIP' },
  { id: 'SHIP-2024-0952', route: 'Rotterdam → Mumbai', status: 'Created', containerType: '40ft Standard', weight: '19,800 kg', lastEvent: 'CONTAINER_CREATED' },
  { id: 'SHIP-2024-1100', route: 'Shenzhen → Hamburg', status: 'In Transit', containerType: '40ft Refrigerated', weight: '24,100 kg', lastEvent: 'LOADED_ON_SHIP' },
  { id: 'SHIP-2024-0755', route: 'Tokyo → Vancouver', status: 'Delivered', containerType: '20ft Standard', weight: '13,500 kg', lastEvent: 'DELIVERED' },
  { id: 'SHIP-2024-1203', route: 'Singapore → Sydney', status: 'In Transit', containerType: '40ft High Cube', weight: '26,700 kg', lastEvent: 'LOADED_ON_SHIP' },
  { id: 'SHIP-2024-0331', route: 'Dubai → London', status: 'In Transit', containerType: '20ft Standard', weight: '15,300 kg', lastEvent: 'ARRIVED_AT_PORT' },
  { id: 'SHIP-2024-0667', route: 'Los Angeles → Tokyo', status: 'Delivered', containerType: '40ft Refrigerated', weight: '20,800 kg', lastEvent: 'DELIVERED' },
  { id: 'SHIP-2024-0999', route: 'Mumbai → Rotterdam', status: 'Created', containerType: '40ft Standard', weight: '18,400 kg', lastEvent: 'CONTAINER_CREATED' },
  { id: 'SHIP-2024-0410', route: 'Shanghai → Hamburg', status: 'Alert', containerType: '40ft High Cube', weight: '30,100 kg', lastEvent: 'TEMPERATURE_SPIKE' },
];

const FILTER_OPTIONS = ['All', 'In Transit', 'Delivered', 'Alert', 'Created'];
const ITEMS_PER_PAGE = 6;

const TABLE_COLUMNS = [
  { key: 'id', label: 'Shipment ID', sortable: true },
  { key: 'route', label: 'Route', sortable: true },
  { key: 'status', label: 'Status', sortable: true, render: (val) => {
    const colors = { 'In Transit': '#4facfe', 'Delivered': '#43e97b', 'Alert': '#fa709a', 'Created': '#a78bfa' };
    return <span style={{ color: colors[val] || '#64748b', fontWeight: 600, fontSize: '0.8rem' }}>{val}</span>;
  }},
  { key: 'containerType', label: 'Container', sortable: false },
  { key: 'weight', label: 'Weight', sortable: false },
  { key: 'lastEvent', label: 'Last Event', sortable: true, render: (val) => <EventBadge type={val} size="sm" /> },
];

function Shipments() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('id');
  const [viewMode, setViewMode] = useState('cards');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = ALL_SHIPMENTS;
    if (activeFilter !== 'All') {
      result = result.filter((s) => s.status === activeFilter);
    }
    return result.sort((a, b) => {
      if (sortBy === 'id') return a.id.localeCompare(b.id);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });
  }, [activeFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = (format) => {
    addToast({ type: 'success', message: `Shipments exported as ${format.toUpperCase()}` });
  };

  const handleRowClick = (row) => {
    navigate(`/shipment/${row.id}`);
  };

  const viewTabs = [
    { id: 'cards', label: 'Cards' },
    { id: 'table', label: 'Table' },
  ];

  return (
    <div className="shipments-page animate-fade-in">
      <header className="shipments-header">
        <div>
          <h1 className="page-title">Shipments</h1>
          <p className="page-subtitle">Browse and manage all shipment containers</p>
        </div>
        <div className="shipments-header-actions">
          <ExportButton label="Export" onExport={handleExport} />
          <button
            className={`filter-toggle-btn ${showFilters ? 'filter-toggle-btn--active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>
            Filters
          </button>
          <div className="shipments-count-badge">
            <span className="count-number">{filtered.length}</span>
            <span className="count-label">shipments</span>
          </div>
        </div>
      </header>

      <div className="shipments-layout">
        {/* Filter Panel */}
        {showFilters && (
          <aside className="shipments-filter-sidebar animate-fade-in">
            <FilterPanel
              onApply={(filters) => addToast({ type: 'info', message: 'Filters applied' })}
              onClear={() => { setActiveFilter('All'); addToast({ type: 'info', message: 'Filters cleared' }); }}
            />
          </aside>
        )}

        <div className="shipments-main">
          {/* Toolbar */}
          <div className="shipments-toolbar">
            <div className="filter-pills">
              {FILTER_OPTIONS.map((filter) => (
                <button
                  key={filter}
                  className={`filter-pill ${activeFilter === filter ? 'filter-pill--active' : ''}`}
                  onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                >
                  {filter}
                  {filter !== 'All' && (
                    <span className="filter-pill-count">
                      {ALL_SHIPMENTS.filter((s) => s.status === filter).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="shipments-toolbar-right">
              <Tabs tabs={viewTabs} activeTab={viewMode} onTabChange={setViewMode} variant="pills" />
              <div className="sort-control">
                <label className="sort-label" htmlFor="sort-select">Sort by</label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="id">Shipment ID</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'cards' ? (
            <div className="shipments-grid">
              {paginated.map((shipment, index) => (
                <ShipmentCard key={shipment.id} shipment={shipment} index={index} />
              ))}
            </div>
          ) : (
            <DataTable
              columns={TABLE_COLUMNS}
              data={paginated}
              onRowClick={handleRowClick}
              emptyMessage="No shipments found"
            />
          )}

          {filtered.length === 0 && (
            <div className="shipments-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
              <p>No shipments found for "{activeFilter}"</p>
              <button className="shipments-reset-btn" onClick={() => setActiveFilter('All')}>
                Show all shipments
              </button>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filtered.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Shipments;
