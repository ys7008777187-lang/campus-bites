import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearch, IoTime, IoStorefront, IoPeople, IoChevronForward, IoFastFood, IoClose, IoStar } from 'react-icons/io5';
import { fetchFoodCourts, fetchStores } from '../api';
import './ExplorePage.css';

const crowdConfig = {
    low: { label: 'Low Crowd', className: 'crowd--green', icon: '🟢' },
    medium: { label: 'Moderate', className: 'crowd--yellow', icon: '🟡' },
    high: { label: 'Busy', className: 'crowd--red', icon: '🔴' },
};

export default function ExplorePage() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [foodCourts, setFoodCourts] = useState([]);
    const [allStores, setAllStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([fetchFoodCourts(), fetchStores()])
            .then(([courts, stores]) => {
                setFoodCourts(courts);
                setAllStores(stores);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const query = search.toLowerCase().trim();

    let filtered = foodCourts.filter(fc =>
        fc.name.toLowerCase().includes(query) ||
        fc.description.toLowerCase().includes(query)
    );

    // Filter stores matching the search query (by name or cuisine)
    const matchedStores = query.length >= 1
        ? allStores.filter(s =>
            s.name.toLowerCase().includes(query) ||
            (s.cuisine && s.cuisine.toLowerCase().includes(query))
        )
        : [];

    if (filter === 'open') filtered = filtered.filter(fc => fc.isOpen);
    if (filter === 'low-crowd') filtered = filtered.filter(fc => fc.crowdLevel === 'low');

    const totalStores = foodCourts.reduce((s, fc) => s + (fc.storeCount || 0), 0);
    const openCourts = foodCourts.filter(fc => fc.isOpen).length;

    if (loading) return <div className="page explore-page"><div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}><span className="login-spinner" /></div></div>;

    return (
        <div className="page explore-page">
            {/* Hero */}
            <div className="explore-hero">
                <div className="explore-hero__top">
                    <div>
                        <p className="explore-hero__greeting">Hey there! 👋</p>
                        <h1 className="explore-hero__title">
                            What would you like<br />to <span className="explore-hero__highlight">eat today</span>?
                        </h1>
                    </div>
                    <div className="explore-hero__logo">
                        <span>🍽️</span>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="explore-search-wrap" ref={searchRef}>
                <div className="explore-search">
                    <IoSearch className="explore-search__icon" />
                    <input
                        type="search"
                        placeholder="Search stores, food courts..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        className="explore-search__input"
                        aria-label="Search stores and food courts"
                    />
                    {search && (
                        <button className="explore-search__clear" onClick={() => { setSearch(''); setSearchFocused(false); }} aria-label="Clear search">
                            <IoClose />
                        </button>
                    )}
                </div>

                {/* Store Search Results Dropdown */}
                {searchFocused && query.length >= 1 && (
                    <div className="store-search-results">
                        <p className="store-search-results__label">
                            <IoStorefront /> Stores matching "{search}"
                        </p>
                        {matchedStores.length > 0 ? (
                            matchedStores.slice(0, 8).map(store => (
                                <button
                                    key={store.id}
                                    className="store-search-result"
                                    onClick={() => {
                                        setSearchFocused(false);
                                        setSearch('');
                                        navigate(`/store/${store.id}`);
                                    }}
                                >
                                    <div className="store-search-result__icon">
                                        <span className="store-search-result__emoji">{store.image}</span>
                                    </div>
                                    <div className="store-search-result__info">
                                        <span className="store-search-result__name">{store.name}</span>
                                        <span className="store-search-result__cuisine">{store.cuisine}</span>
                                        <div className="store-search-result__details">
                                            <span className="store-search-result__rating"><IoStar /> {store.rating}</span>
                                            <span className="store-search-result__prep"><IoTime /> {store.prepTime}</span>
                                            <span className={`store-search-result__status ${store.isOpen ? 'store-search-result__status--open' : 'store-search-result__status--closed'}`}>
                                                {store.isOpen ? '● Open' : '● Closed'}
                                            </span>
                                        </div>
                                    </div>
                                    <IoChevronForward className="store-search-result__arrow" />
                                </button>
                            ))
                        ) : (
                            <div className="store-search-empty">
                                <span className="store-search-empty__icon">🔍</span>
                                <p className="store-search-empty__text">No stores found for "{search}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="explore-stats">
                <div className="explore-stats__item">
                    <span className="explore-stats__emoji">🏪</span>
                    <div>
                        <span className="explore-stats__number">{foodCourts.length}</span>
                        <span className="explore-stats__label">Food Courts</span>
                    </div>
                </div>
                <div className="explore-stats__divider" />
                <div className="explore-stats__item">
                    <span className="explore-stats__emoji">🍴</span>
                    <div>
                        <span className="explore-stats__number">{totalStores}</span>
                        <span className="explore-stats__label">Stores</span>
                    </div>
                </div>
                <div className="explore-stats__divider" />
                <div className="explore-stats__item">
                    <span className="explore-stats__emoji">✅</span>
                    <div>
                        <span className="explore-stats__number">{openCourts}</span>
                        <span className="explore-stats__label">Open Now</span>
                    </div>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="explore-filters">
                {[
                    { key: 'all', label: 'All', icon: '🏪' },
                    { key: 'open', label: 'Open Now', icon: '✅' },
                    { key: 'low-crowd', label: 'Less Crowd', icon: '🚶' },
                ].map(f => (
                    <button
                        key={f.key}
                        className={`explore-filter ${filter === f.key ? 'explore-filter--active' : ''}`}
                        onClick={() => setFilter(f.key)}
                    >
                        <span className="explore-filter__icon">{f.icon}</span>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Section Label */}
            <div className="explore-section-header">
                <h2 className="explore-section-header__title">
                    Nearby Food Courts
                </h2>
                <span className="explore-section-header__count">{filtered.length} found</span>
            </div>

            {/* Food Court Cards */}
            <div className="explore-grid">
                {filtered.map((fc, i) => {
                    const crowd = crowdConfig[fc.crowdLevel] || crowdConfig.low;
                    const courtStores = []; // stores loaded per-court in FoodCourtPage
                    const avgRating = '—';

                    return (
                        <Link
                            key={fc.id}
                            to={`/court/${fc.id}`}
                            className="fc-card"
                            style={{ animationDelay: `${i * 60}ms` }}
                            aria-label={`${fc.name}, ${fc.storeCount} stores, ${crowd.label}`}
                        >
                            {/* Visual / Emoji */}
                            <div className={`fc-card__visual ${!fc.isOpen ? 'fc-card__visual--closed' : ''}`}>
                                <span className="fc-card__emoji">{fc.image}</span>
                                {!fc.isOpen && <span className="fc-card__closed-tag">CLOSED</span>}
                            </div>

                            {/* Body */}
                            <div className="fc-card__body">
                                <div className="fc-card__name-row">
                                    <h2 className="fc-card__name">{fc.name}</h2>
                                    <IoChevronForward className="fc-card__arrow" />
                                </div>
                                <p className="fc-card__desc">{fc.description}</p>

                                {/* Meta chips */}
                                <div className="fc-card__chips">
                                    <span className="fc-card__chip">
                                        <IoStorefront /> {fc.storeCount} stores
                                    </span>
                                    <span className="fc-card__chip">
                                        ⭐ {avgRating}
                                    </span>
                                    <span className={`fc-card__chip ${crowd.className}`}>
                                        {crowd.icon} {crowd.label}
                                    </span>
                                </div>

                                {/* Bottom bar */}
                                <div className="fc-card__footer">
                                    <span className="fc-card__time">
                                        <IoTime /> {fc.openTime} – {fc.closeTime}
                                    </span>
                                    {fc.isOpen && (
                                        <span className="fc-card__open-badge">● Open</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state__illustration">
                        <span className="empty-state__icon">🔍</span>
                    </div>
                    <p className="empty-state__title">No courts found</p>
                    <p className="empty-state__text">Try a different search or filter</p>
                    <button className="btn btn--secondary" onClick={() => { setSearch(''); setFilter('all'); }}>
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
