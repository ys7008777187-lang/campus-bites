import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoStar, IoTime, IoHeart } from 'react-icons/io5';
import { fetchStores } from '../api';
import { useApp } from '../context/AppContext';
import './FavoritesPage.css';

export default function FavoritesPage() {
    const { state, dispatch } = useApp();
    const [allStores, setAllStores] = useState([]);

    useEffect(() => {
        fetchStores().then(setAllStores).catch(() => { });
    }, []);

    const favStores = allStores.filter(s => state.favoriteStoreIds.includes(s.id));

    return (
        <div className="page favorites-page">
            <div className="page-header">
                <h1>Favorites</h1>
            </div>

            {favStores.length === 0 && (
                <div className="empty-state">
                    <span className="empty-state__icon">💖</span>
                    <p className="empty-state__title">No favorites yet</p>
                    <p className="empty-state__text">Tap the heart icon on any store to save it here</p>
                    <Link to="/" className="btn btn--primary">Explore Stores</Link>
                </div>
            )}

            <div className="favorites-grid">
                {favStores.map((store, i) => (
                    <Link
                        key={store.id}
                        to={`/store/${store.id}`}
                        className="fav-card card"
                        style={{ animationDelay: `${i * 80}ms` }}
                        aria-label={`${store.name}, ${store.cuisine}`}
                    >
                        <div className="fav-card__visual">
                            <span className="fav-card__emoji">{store.image}</span>
                            <button
                                className="fav-card__remove"
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch({ type: 'TOGGLE_FAVORITE', payload: store.id });
                                }}
                                aria-label={`Remove ${store.name} from favorites`}
                            >
                                <IoHeart />
                            </button>
                        </div>
                        <div className="fav-card__body">
                            <h3 className="fav-card__name">{store.name}</h3>
                            <p className="fav-card__cuisine">{store.cuisine}</p>
                            <div className="fav-card__meta">
                                <span><IoStar style={{ color: '#FFC107' }} /> {store.rating}</span>
                                <span><IoTime /> {store.prepTime}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
