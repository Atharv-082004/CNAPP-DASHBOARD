import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, AlertTriangle, Bell, ChevronDown, ChevronRight, CircleHelp, Clock3, Cloud, Grip, LayoutDashboard, Menu, Plus, Search, Settings2, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import './styles.css';

const initialDashboard = {
  categories: [
    { id: 'cspm', name: 'CSPM Executive Dashboard', widgets: [
      { id: 'cloud-accounts', name: 'Cloud Accounts', text: '2 Total accounts', kind: 'accounts' },
      { id: 'risk-assessment', name: 'Cloud Account Risk Assessment', text: '9659 Total resources assessed', kind: 'risk' },
    ] },
    { id: 'cwpp', name: 'CWPP Dashboard', widgets: [
      { id: 'namespace-alerts', name: 'Top 5 Namespace Specific Alerts', text: 'No graph data available!', kind: 'empty' },
      { id: 'workload-alerts', name: 'Workload Alerts', text: 'No graph data available!', kind: 'empty' },
    ] },
    { id: 'registry', name: 'Registry Scan', widgets: [
      { id: 'image-risk', name: 'Image Risk Assessment', text: '1470 Total vulnerabilities', kind: 'bar' },
      { id: 'security-issues', name: 'Image Security Issues', text: '2 Total images', kind: 'bar2' },
    ] },
    { id: 'tickets', name: 'Ticket Dashboard', widgets: [
      { id: 'open-tickets', name: 'Open Tickets', text: '24 tickets need attention', kind: 'tickets' },
    ] },
  ]
};

function reducer(state, action) {
  switch (action.type) {
    case 'load': return action.value || state;
    case 'add': return { ...state, categories: state.categories.map(c => c.id === action.categoryId ? { ...c, widgets: [...c.widgets, action.widget] } : c) };
    case 'remove': return { ...state, categories: state.categories.map(c => ({ ...c, widgets: c.widgets.filter(w => w.id !== action.widgetId) })) };
    case 'toggle': return { ...state, categories: state.categories.map(c => c.id === action.categoryId ? { ...c, widgets: action.checked ? [...c.widgets, action.widget] : c.widgets.filter(w => w.id !== action.widget.id) } : c) };
    default: return state;
  }
}

function Donut({ variant }) {
  return <div className={`donut ${variant}`}><div className="donut-center"><strong>{variant === 'blue' ? '2' : '9659'}</strong><span>{variant === 'blue' ? 'Total' : 'Total'}</span></div></div>;
}
function Legend({ items }) { return <div className="legend">{items.map(([color, label]) => <div className="legend-item" key={label}><i style={{ background: color }} />{label}</div>)}</div>; }
function EmptyChart() { return <div className="empty-chart"><Activity size={24} strokeWidth={1.5} /><span>No Graph data available!</span></div>; }
function RiskBars({ second = false }) { return <div className="risk-content"><div className="risk-total"><b>{second ? '2' : '1470'}</b><span>{second ? 'Total Images' : 'Total Vulnerabilities'}</span></div><div className={`stacked-bar ${second ? 'bar-secondary' : ''}`} /><div className="risk-labels"><span><i className="critical" />Critical ({second ? '0' : '6'})</span><span><i className="high" />High ({second ? '0' : '84'})</span><span><i className="medium" />Medium ({second ? '1' : '316'})</span></div></div>; }
function WidgetVisual({ widget }) {
  switch (widget.kind) {
    case 'accounts': return <div className="chart-row"><Donut variant="blue" /><Legend items={[[ '#5478f8', 'Connected (2)' ], [ '#dce4ff', 'Not Connected (2)' ]]} /></div>;
    case 'risk': return <div className="chart-row"><Donut variant="green" /><Legend items={[[ '#d21d1d', 'Failed (689)' ], [ '#f3c52a', 'Warning (58)' ], [ '#c8d0df', 'Not available (36)' ], [ '#20aa69', 'Passed (7263)' ]]} /></div>;
    case 'empty': return <EmptyChart />;
    case 'bar': return <RiskBars />;
    case 'bar2': return <RiskBars second />;
    case 'tickets': return <div className="tickets-visual"><div className="ticket-number">24</div><div className="ticket-caption">Open tickets</div><div className="ticket-track"><i /></div><small>8 high priority · 16 awaiting review</small></div>;
    default: return <div className="custom-copy">{widget.text}</div>;
  }
}

function WidgetCard({ widget, onRemove }) {
  return <article className="widget-card"><div className="widget-title"><h3>{widget.name}</h3><button className="icon-button remove-widget" title={`Remove ${widget.name}`} onClick={onRemove}><X size={15} /></button></div><WidgetVisual widget={widget} /></article>;
}

function AddPanel({ category, state, onClose, onAdd, onToggle }) {
  const [tab, setTab] = useState(category.id === 'cspm' ? 'CSPM' : category.name.split(' ')[0]);
  const [newName, setNewName] = useState(''); const [newText, setNewText] = useState('');
  const catWidgets = state.categories.find(c => c.name.toUpperCase().startsWith(tab.toUpperCase()))?.widgets || [];
  const categories = state.categories;
  function addCustom(e) { e.preventDefault(); if (!newName.trim() || !newText.trim()) return; onAdd(category.id, { id: crypto.randomUUID(), name: newName.trim(), text: newText.trim(), kind: 'custom' }); setNewName(''); setNewText(''); }
  return <><button className="scrim" aria-label="Close widget panel" onClick={onClose} /><aside className="add-panel"><div className="panel-heading"><div><span className="eyebrow">DASHBOARD BUILDER</span><h2>Add widgets</h2></div><button className="icon-button close-panel" onClick={onClose} aria-label="Close"><X size={19} /></button></div><p className="panel-copy">Personalize <b>{category.name}</b> by adding widgets to this section.</p><div className="tabs">{categories.map(c => <button key={c.id} onClick={() => setTab(c.name.split(' ')[0])} className={tab.toUpperCase() === c.name.split(' ')[0].toUpperCase() ? 'active' : ''}>{c.name.split(' ')[0]}</button>)}</div><div className="existing-list">{catWidgets.length ? catWidgets.map(w => <label className="check-row" key={w.id}><input type="checkbox" checked={category.widgets.some(x => x.id === w.id)} onChange={e => onToggle(category.id, w, e.target.checked)} /><span className="checkmark" /><span>{w.name}</span></label>) : <div className="no-widgets">No saved widgets in this category yet.</div>}</div><form className="new-widget-form" onSubmit={addCustom}><div className="form-title"><span className="form-plus"><Plus size={14} /></span><div><b>Create a widget</b><small>Add your own title and text</small></div></div><label>Widget name<input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Compliance overview" maxLength="50" /></label><label>Widget text<textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Add a short description or metric" rows="3" maxLength="160" /></label><button className="button button-primary add-custom" type="submit" disabled={!newName.trim() || !newText.trim()}><Plus size={16} /> Add widget</button></form><div className="panel-footer"><button className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" onClick={onClose}>Done <ChevronRight size={15} /></button></div></aside></>;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialDashboard);
  const [query, setQuery] = useState(''); const [searchOpen, setSearchOpen] = useState(false); const [activeCategory, setActiveCategory] = useState('cspm'); const [panelOpen, setPanelOpen] = useState(false); const [rangeOpen, setRangeOpen] = useState(false); const [range, setRange] = useState('Last 2 days'); const [notice, setNotice] = useState('');
  useEffect(() => { try { const saved = localStorage.getItem('cnapp-dashboard-state'); if (saved) dispatch({ type: 'load', value: JSON.parse(saved) }); } catch {} }, []);
  useEffect(() => { localStorage.setItem('cnapp-dashboard-state', JSON.stringify(state)); }, [state]);
  const selected = state.categories.find(c => c.id === activeCategory) || state.categories[0];
  const filteredCategories = useMemo(() => state.categories.map(c => ({ ...c, widgets: c.widgets.filter(w => `${w.name} ${w.text}`.toLowerCase().includes(query.toLowerCase())) })).filter(c => !query || c.widgets.length), [state, query]);
  const openPanel = id => { setActiveCategory(id); setPanelOpen(true); };
  const remove = (widget, cat) => { dispatch({ type: 'remove', widgetId: widget.id }); setNotice(`${widget.name} removed`); window.setTimeout(() => setNotice(''), 2400); };
  return <div className="app-shell"><main className="main-content"><div className="page-heading"><div><div className="eyebrow">YOUR WORKSPACE <span className="eyebrow-dot">•</span> OVERVIEW</div><h1>CNAPP Dashboard</h1><p>Get a clear view of your cloud security posture.</p></div><div className="page-actions">{searchOpen && <label className="inline-search"><Search size={15} /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search widgets..." /><button onClick={() => { setQuery(''); setSearchOpen(false); }} aria-label="Close search"><X size={14} /></button></label>}<button className="button button-outline" onClick={() => openPanel(activeCategory)}><Plus size={16} /> Add widget</button><button className="button button-outline icon-only search-toggle" title="Search widgets" onClick={() => setSearchOpen(!searchOpen)}><Search size={16} /></button><button className="button button-outline icon-only" title="Dashboard settings"><SlidersHorizontal size={16} /></button><div className="range-wrap"><button className="button button-outline" onClick={() => setRangeOpen(!rangeOpen)}><Clock3 size={15} />{range}<ChevronDown size={14} /></button>{rangeOpen && <div className="range-menu">{['Last 24 hours','Last 2 days','Last 7 days','Last 30 days'].map(r => <button key={r} onClick={() => { setRange(r); setRangeOpen(false); }}>{r}</button>)}</div>}</div></div></div>
      <div className="dashboard-meta"><span><i className="live-dot" />All systems operational</span><span>Last updated just now</span></div>
      {filteredCategories.length === 0 ? <div className="empty-search"><Search size={23} /><h2>No widgets found</h2><p>Try a different search term or add a new widget.</p><button className="button button-primary" onClick={() => openPanel(activeCategory)}><Plus size={16} /> Add widget</button></div> : filteredCategories.map((category, index) => <section className="category-section" key={category.id}><div className="section-heading"><div className="section-index">0{index + 1}</div><h2>{category.name}</h2><span className="widget-count">{category.widgets.length} {category.widgets.length === 1 ? 'widget' : 'widgets'}</span><button className="text-action" onClick={() => openPanel(category.id)}><Plus size={15} /> Add to section</button></div><div className="widget-grid">{category.widgets.map(widget => <WidgetCard key={widget.id} widget={widget} onRemove={() => remove(widget, category)} />)}<button className="widget-card add-card" onClick={() => openPanel(category.id)}><span className="add-card-icon"><Plus size={18} /></span><b>Add a widget</b><span>Customize this section</span></button></div></section>)}
      <footer className="page-footer"><span>Showing {state.categories.reduce((n,c) => n+c.widgets.length,0)} widgets across {state.categories.length} sections</span><span><span className="footer-dot" />Data refreshes automatically</span></footer>
    </main>{panelOpen && <AddPanel category={selected} state={state} onClose={() => setPanelOpen(false)} onAdd={(categoryId, widget) => { dispatch({ type: 'add', categoryId, widget }); setNotice('Widget added to your dashboard'); }} onToggle={(categoryId, widget, checked) => dispatch({ type: 'toggle', categoryId, widget, checked })} />}{notice && <div className="toast"><span>✓</span>{notice}</div>}</div>;
}

createRoot(document.getElementById('root')).render(<App />);
