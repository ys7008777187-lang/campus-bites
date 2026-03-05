import { db, isSeeded } from './database.js';

export function seedDatabase() {
    if (isSeeded()) {
        console.log('✅ Database already seeded');
        return;
    }

    console.log('🌱 Seeding database...');

    // --- Food Courts ---
    const foodCourts = [
        { id: 'fc1', name: 'Central Food Court', image: '🏫', description: 'Main campus food hub near the library', isOpen: true, openTime: '8:00 AM', closeTime: '9:00 PM' },
        { id: 'fc2', name: 'Engineering Block Canteen', image: '🔧', description: 'Quick bites near engineering labs', isOpen: true, openTime: '7:30 AM', closeTime: '8:00 PM' },
        { id: 'fc3', name: 'Sports Complex Café', image: '⚽', description: 'Healthy options near the sports grounds', isOpen: true, openTime: '9:00 AM', closeTime: '7:00 PM' },
        { id: 'fc4', name: 'Arts & Media Plaza', image: '🎨', description: 'Creative eats by the arts faculty', isOpen: true, openTime: '8:30 AM', closeTime: '8:30 PM' },
        { id: 'fc5', name: 'Hostel Block Mess', image: '🏠', description: 'Late-night munchies near hostels', isOpen: true, openTime: '7:00 AM', closeTime: '11:00 PM' },
        { id: 'fc6', name: 'Medical Campus Café', image: '🏥', description: 'Quick meals for med students', isOpen: true, openTime: '6:30 AM', closeTime: '10:00 PM' },
        { id: 'fc7', name: 'Business School Lounge', image: '💼', description: 'Premium bites at the B-school', isOpen: true, openTime: '8:00 AM', closeTime: '9:00 PM' },
        { id: 'fc8', name: 'Lakeside Dhaba', image: '🌅', description: 'Chill vibes by the campus lake', isOpen: false, openTime: '10:00 AM', closeTime: '6:00 PM' },
    ];
    for (const c of foodCourts) db.addFoodCourt(c);

    // --- Stores ---
    const stores = [
        { id: 's1', courtId: 'fc1', name: 'Desi Tadka', image: '🍛', cuisine: 'North Indian', rating: 4.5, totalReviews: 287, prepTime: '10-15 min', isOpen: true, ownerName: 'Priya Nair', ownerAvatar: '👩‍🍳', phone: '+91 99887 11001', upiId: 'desitadka@upi' },
        { id: 's2', courtId: 'fc1', name: 'Dragon Wok', image: '🥡', cuisine: 'Chinese & Indo-Chinese', rating: 4.2, totalReviews: 198, prepTime: '8-12 min', isOpen: true, ownerName: 'Amit Joshi', ownerAvatar: '🧔', phone: '+91 99887 22002', upiId: 'dragonwok@upi' },
        { id: 's3', courtId: 'fc1', name: 'Pizza Planet', image: '🍕', cuisine: 'Italian & Pizza', rating: 4.7, totalReviews: 342, prepTime: '12-18 min', isOpen: true, ownerName: 'Rahul Sharma', ownerAvatar: '👨‍🍳', phone: '+91 98765 43210', upiId: 'pizzaplanet@upi' },
        { id: 's4', courtId: 'fc1', name: 'Chai Point', image: '☕', cuisine: 'Beverages & Snacks', rating: 4.8, totalReviews: 156, prepTime: '3-5 min', isOpen: false, ownerName: 'Sunita Devi', ownerAvatar: '👩‍🍳', phone: '+91 99887 44004', upiId: 'chaipoint@upi' },
        { id: 's5', courtId: 'fc2', name: 'South Express', image: '🥘', cuisine: 'South Indian', rating: 4.6, totalReviews: 234, prepTime: '5-10 min', isOpen: true, ownerName: 'Ramesh K', ownerAvatar: '👨‍🍳', phone: '+91 99887 55005', upiId: 'southexpress@upi' },
        { id: 's6', courtId: 'fc2', name: 'Burger Barn', image: '🍔', cuisine: 'Burgers & Fries', rating: 4.3, totalReviews: 412, prepTime: '8-12 min', isOpen: true, ownerName: 'Karan Singh', ownerAvatar: '👨‍🍳', phone: '+91 99887 66006', upiId: 'burgerbarn@upi' },
        { id: 's7', courtId: 'fc2', name: 'Juice Junction', image: '🧃', cuisine: 'Juices & Smoothies', rating: 4.4, totalReviews: 178, prepTime: '3-5 min', isOpen: true, ownerName: 'Neha P', ownerAvatar: '👩‍🍳', phone: '+91 99887 77007', upiId: 'juicejunction@upi' },
        { id: 's8', courtId: 'fc3', name: 'FitBowl', image: '🥗', cuisine: 'Salads & Bowls', rating: 4.5, totalReviews: 145, prepTime: '5-8 min', isOpen: true, ownerName: 'Deepak V', ownerAvatar: '👨‍🍳', phone: '+91 99887 88008', upiId: 'fitbowl@upi' },
        { id: 's9', courtId: 'fc3', name: 'Wrap Star', image: '🌯', cuisine: 'Wraps & Rolls', rating: 4.1, totalReviews: 112, prepTime: '6-10 min', isOpen: true, ownerName: 'Meera G', ownerAvatar: '👩‍🍳', phone: '+91 99887 99009', upiId: 'wrapstar@upi' },
        { id: 's10', courtId: 'fc3', name: 'Protein Shake Bar', image: '💪', cuisine: 'Shakes & Supplements', rating: 4.6, totalReviews: 89, prepTime: '3-5 min', isOpen: true, ownerName: 'Arjun T', ownerAvatar: '👨‍🍳', phone: '+91 99887 10010', upiId: 'proteinbar@upi' },
        { id: 's11', courtId: 'fc4', name: 'Café Canvas', image: '🎭', cuisine: 'Artisan Coffee & Bakes', rating: 4.7, totalReviews: 267, prepTime: '5-8 min', isOpen: true, ownerName: 'Kavya N', ownerAvatar: '👩‍🍳', phone: '+91 99887 11011', upiId: 'cafecanvas@upi' },
        { id: 's12', courtId: 'fc4', name: 'Taco Twist', image: '🌮', cuisine: 'Mexican & Fusion', rating: 4.3, totalReviews: 134, prepTime: '8-12 min', isOpen: true, ownerName: 'Rohan P', ownerAvatar: '👨‍🍳', phone: '+91 99887 12012', upiId: 'tacotwist@upi' },
        { id: 's13', courtId: 'fc4', name: 'Dessert Drama', image: '🧁', cuisine: 'Desserts & Ice Cream', rating: 4.8, totalReviews: 301, prepTime: '5-10 min', isOpen: true, ownerName: 'Sneha R', ownerAvatar: '👩‍🍳', phone: '+91 99887 13013', upiId: 'dessertdrama@upi' },
        { id: 's14', courtId: 'fc5', name: 'Midnight Maggi', image: '🍜', cuisine: 'Late Night Snacks', rating: 4.4, totalReviews: 456, prepTime: '5-8 min', isOpen: true, ownerName: 'Tarun G', ownerAvatar: '👨‍🍳', phone: '+91 99887 14014', upiId: 'midnightmaggi@upi' },
        { id: 's15', courtId: 'fc5', name: 'Tandoori Nights', image: '🔥', cuisine: 'Tandoor & Kebabs', rating: 4.5, totalReviews: 223, prepTime: '10-15 min', isOpen: true, ownerName: 'Amit D', ownerAvatar: '👨‍🍳', phone: '+91 99887 15015', upiId: 'tandoorinights@upi' },
        { id: 's16', courtId: 'fc5', name: 'Paratha House', image: '🫓', cuisine: 'Parathas & Thalis', rating: 4.6, totalReviews: 189, prepTime: '8-12 min', isOpen: true, ownerName: 'Suresh M', ownerAvatar: '👨‍🍳', phone: '+91 99887 16016', upiId: 'parathahouse@upi' },
        { id: 's17', courtId: 'fc6', name: 'Green Leaf', image: '🥬', cuisine: 'Organic & Healthy', rating: 4.5, totalReviews: 98, prepTime: '5-8 min', isOpen: true, ownerName: 'Ananya K', ownerAvatar: '👩‍🍳', phone: '+91 99887 17017', upiId: 'greenleaf@upi' },
        { id: 's18', courtId: 'fc6', name: 'Egg Factory', image: '🥚', cuisine: 'Egg Specials', rating: 4.2, totalReviews: 167, prepTime: '5-10 min', isOpen: true, ownerName: 'Vikram S', ownerAvatar: '👨‍🍳', phone: '+91 99887 18018', upiId: 'eggfactory@upi' },
        { id: 's19', courtId: 'fc6', name: 'Chai & Cream', image: '🍦', cuisine: 'Tea & Ice Cream', rating: 4.4, totalReviews: 145, prepTime: '3-5 min', isOpen: true, ownerName: 'Priya M', ownerAvatar: '👩‍🍳', phone: '+91 99887 19019', upiId: 'chaicream@upi' },
        { id: 's20', courtId: 'fc7', name: 'The BBQ Co.', image: '🥩', cuisine: 'Grills & BBQ', rating: 4.6, totalReviews: 178, prepTime: '12-18 min', isOpen: true, ownerName: 'Rohit D', ownerAvatar: '👨‍🍳', phone: '+91 99887 20020', upiId: 'bbqco@upi' },
        { id: 's21', courtId: 'fc7', name: 'Sushi Station', image: '🍣', cuisine: 'Japanese & Asian', rating: 4.7, totalReviews: 89, prepTime: '10-15 min', isOpen: true, ownerName: 'Anita S', ownerAvatar: '👩‍🍳', phone: '+91 99887 21021', upiId: 'sushistation@upi' },
        { id: 's22', courtId: 'fc7', name: 'Brew & Beans', image: '☕', cuisine: 'Premium Coffee', rating: 4.9, totalReviews: 312, prepTime: '3-5 min', isOpen: true, ownerName: 'Nisha K', ownerAvatar: '👩‍🍳', phone: '+91 99887 22022', upiId: 'brewbeans@upi' },
        { id: 's23', courtId: 'fc8', name: 'Dhaba Express', image: '🍲', cuisine: 'Punjabi Dhaba Style', rating: 4.5, totalReviews: 201, prepTime: '10-15 min', isOpen: false, ownerName: 'Raj T', ownerAvatar: '👨‍🍳', phone: '+91 99887 23023', upiId: 'dhabaexpress@upi' },
        { id: 's24', courtId: 'fc8', name: 'Lassi Corner', image: '🥛', cuisine: 'Lassi & Chaat', rating: 4.3, totalReviews: 134, prepTime: '3-5 min', isOpen: false, ownerName: 'Pooja M', ownerAvatar: '👩‍🍳', phone: '+91 99887 24024', upiId: 'lassicorner@upi' },
    ];
    for (const s of stores) db.addStore(s);

    // --- Users ---
    // Super admin
    db.addUser({ id: 'u-admin', username: 'admin', password: 'admin123', role: 'super_admin', name: 'Campus Admin', avatar: '🛡️', storeId: null, email: 'admin@campusbites.app' });

    // Simple 'store' login that maps to Pizza Planet (s3) for easy demo access
    db.addUser({ id: 'u-store-demo', username: 'store', password: 'store123', role: 'store_owner', name: 'Rahul Sharma', avatar: '👨‍🍳', storeId: 's3', email: null });

    // Auto-generate a store_owner account for every store
    for (const s of stores) {
        const username = s.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
        db.addUser({
            id: `u-store-${s.id}`,
            username,
            password: 'store123',
            role: 'store_owner',
            name: s.ownerName,
            avatar: s.ownerAvatar || '👨‍🍳',
            storeId: s.id,
            email: null,
        });
    }

    // --- Menu Items ---
    const menuItems = [
        { id: 'm1', storeId: 's1', name: 'Paneer Butter Masala', category: 'Main Course', price: 150, prepTime: 12, isVeg: true, image: '🧈', description: 'Rich and creamy paneer in tomato gravy', isAvailable: true },
        { id: 'm2', storeId: 's1', name: 'Chicken Biryani', category: 'Main Course', price: 180, prepTime: 15, isVeg: false, image: '🍗', description: 'Aromatic basmati rice with tender chicken', isAvailable: true },
        { id: 'm3', storeId: 's1', name: 'Dal Makhani', category: 'Main Course', price: 120, prepTime: 10, isVeg: true, image: '🫘', description: 'Slow-cooked lentils in butter sauce', isAvailable: true },
        { id: 'm4', storeId: 's1', name: 'Butter Naan', category: 'Breads', price: 30, prepTime: 5, isVeg: true, image: '🫓', description: 'Soft naan with butter', isAvailable: true },
        { id: 'm5', storeId: 's1', name: 'Gulab Jamun', category: 'Desserts', price: 60, prepTime: 3, isVeg: true, image: '🍩', description: 'Sweet dumplings in sugar syrup', isAvailable: true },
        { id: 'm6', storeId: 's1', name: 'Masala Chaas', category: 'Beverages', price: 40, prepTime: 2, isVeg: true, image: '🥛', description: 'Spiced buttermilk', isAvailable: true },
        { id: 'm7', storeId: 's2', name: 'Veg Manchurian', category: 'Starters', price: 120, prepTime: 8, isVeg: true, image: '🥟', description: 'Crispy vegetable balls in spicy sauce', isAvailable: true },
        { id: 'm8', storeId: 's2', name: 'Chicken Fried Rice', category: 'Main Course', price: 150, prepTime: 10, isVeg: false, image: '🍚', description: 'Wok-tossed rice with chicken', isAvailable: true },
        { id: 'm9', storeId: 's2', name: 'Hakka Noodles', category: 'Main Course', price: 130, prepTime: 10, isVeg: true, image: '🍜', description: 'Stir-fried noodles with vegetables', isAvailable: true },
        { id: 'm10', storeId: 's2', name: 'Spring Rolls', category: 'Starters', price: 100, prepTime: 8, isVeg: true, image: '🥢', description: 'Crispy rolls with veggie filling', isAvailable: true },
        { id: 'm11', storeId: 's2', name: 'Hot & Sour Soup', category: 'Soups', price: 80, prepTime: 5, isVeg: true, image: '🥣', description: 'Tangy and spicy soup', isAvailable: true },
        { id: 'm12', storeId: 's3', name: 'Margherita Pizza', category: 'Pizzas', price: 199, prepTime: 15, isVeg: true, image: '🍕', description: 'Classic mozzarella and basil', isAvailable: true },
        { id: 'm13', storeId: 's3', name: 'Pepperoni Pizza', category: 'Pizzas', price: 249, prepTime: 15, isVeg: false, image: '🍕', description: 'Loaded with spicy pepperoni', isAvailable: true },
        { id: 'm14', storeId: 's3', name: 'Garlic Bread', category: 'Sides', price: 99, prepTime: 8, isVeg: true, image: '🥖', description: 'Toasted with garlic butter', isAvailable: true },
        { id: 'm15', storeId: 's3', name: 'Pasta Alfredo', category: 'Pasta', price: 179, prepTime: 12, isVeg: true, image: '🍝', description: 'Creamy white sauce pasta', isAvailable: true },
        { id: 'm16', storeId: 's3', name: 'Cold Coffee', category: 'Beverages', price: 89, prepTime: 3, isVeg: true, image: '🧋', description: 'Chilled coffee with ice cream', isAvailable: true },
        { id: 'm101', storeId: 's3', name: 'BBQ Chicken Pizza', category: 'Pizzas', price: 279, prepTime: 18, isVeg: false, image: '🍕', description: 'Smoky BBQ chicken with onions', isAvailable: true },
        { id: 'm102', storeId: 's3', name: 'Paneer Tikka Pizza', category: 'Pizzas', price: 229, prepTime: 16, isVeg: true, image: '🍕', description: 'Tandoori paneer with capsicum', isAvailable: false },
        { id: 'm103', storeId: 's3', name: 'Cheese Fries', category: 'Sides', price: 119, prepTime: 8, isVeg: true, image: '🍟', description: 'Crispy fries loaded with cheese', isAvailable: true },
        { id: 'm104', storeId: 's3', name: 'Penne Arrabiata', category: 'Pasta', price: 169, prepTime: 12, isVeg: true, image: '🍝', description: 'Spicy tomato pasta', isAvailable: true },
        { id: 'm105', storeId: 's3', name: 'Mojito', category: 'Beverages', price: 79, prepTime: 4, isVeg: true, image: '🍹', description: 'Refreshing mint & lime cooler', isAvailable: true },
        { id: 'm106', storeId: 's3', name: 'Brownie Sundae', category: 'Desserts', price: 149, prepTime: 5, isVeg: true, image: '🍫', description: 'Warm brownie with vanilla ice cream', isAvailable: true },
        { id: 'm107', storeId: 's3', name: 'Tiramisu', category: 'Desserts', price: 179, prepTime: 3, isVeg: true, image: '🍰', description: 'Classic Italian coffee dessert', isAvailable: false },
        { id: 'm17', storeId: 's4', name: 'Masala Chai', category: 'Beverages', price: 30, prepTime: 3, isVeg: true, image: '🍵', description: 'Authentic Indian spiced tea', isAvailable: true },
        { id: 'm18', storeId: 's4', name: 'Filter Coffee', category: 'Beverages', price: 40, prepTime: 3, isVeg: true, image: '☕', description: 'Strong South Indian coffee', isAvailable: true },
        { id: 'm19', storeId: 's4', name: 'Samosa', category: 'Snacks', price: 20, prepTime: 2, isVeg: true, image: '🔺', description: 'Crispy pastry with potato filling', isAvailable: true },
        { id: 'm20', storeId: 's4', name: 'Vada Pav', category: 'Snacks', price: 25, prepTime: 2, isVeg: true, image: '🥔', description: 'Mumbai-style spiced potato burger', isAvailable: true },
        { id: 'm21', storeId: 's5', name: 'Masala Dosa', category: 'Main Course', price: 80, prepTime: 8, isVeg: true, image: '🫓', description: 'Crispy crepe with spiced potato', isAvailable: true },
        { id: 'm22', storeId: 's5', name: 'Idli Sambar', category: 'Main Course', price: 60, prepTime: 5, isVeg: true, image: '⚪', description: 'Steamed rice cakes with lentil soup', isAvailable: true },
        { id: 'm23', storeId: 's5', name: 'Medu Vada', category: 'Snacks', price: 50, prepTime: 5, isVeg: true, image: '🍩', description: 'Crispy lentil donuts', isAvailable: true },
        { id: 'm24', storeId: 's5', name: 'Uttapam', category: 'Main Course', price: 90, prepTime: 8, isVeg: true, image: '🫓', description: 'Thick pancake with vegetables', isAvailable: true },
        { id: 'm25', storeId: 's5', name: 'Filter Coffee', category: 'Beverages', price: 35, prepTime: 3, isVeg: true, image: '☕', description: 'Traditional South Indian coffee', isAvailable: true },
        { id: 'm26', storeId: 's6', name: 'Classic Veg Burger', category: 'Burgers', price: 99, prepTime: 8, isVeg: true, image: '🍔', description: 'Crunchy patty with fresh veggies', isAvailable: true },
        { id: 'm27', storeId: 's6', name: 'Chicken Burger', category: 'Burgers', price: 139, prepTime: 10, isVeg: false, image: '🍔', description: 'Grilled chicken with special sauce', isAvailable: true },
        { id: 'm28', storeId: 's6', name: 'French Fries', category: 'Sides', price: 69, prepTime: 5, isVeg: true, image: '🍟', description: 'Crispy golden fries', isAvailable: true },
        { id: 'm29', storeId: 's6', name: 'Onion Rings', category: 'Sides', price: 79, prepTime: 5, isVeg: true, image: '🧅', description: 'Battered and fried onion rings', isAvailable: true },
        { id: 'm30', storeId: 's6', name: 'Milkshake', category: 'Beverages', price: 99, prepTime: 5, isVeg: true, image: '🥤', description: 'Thick creamy milkshake', isAvailable: true },
        { id: 'm31', storeId: 's7', name: 'Orange Juice', category: 'Fresh Juices', price: 60, prepTime: 3, isVeg: true, image: '🍊', description: 'Freshly squeezed orange', isAvailable: true },
        { id: 'm32', storeId: 's7', name: 'Mango Smoothie', category: 'Smoothies', price: 90, prepTime: 4, isVeg: true, image: '🥭', description: 'Thick mango smoothie', isAvailable: true },
        { id: 'm33', storeId: 's7', name: 'Green Detox', category: 'Fresh Juices', price: 80, prepTime: 4, isVeg: true, image: '🥬', description: 'Spinach, cucumber, and apple', isAvailable: true },
        { id: 'm34', storeId: 's7', name: 'Protein Shake', category: 'Smoothies', price: 120, prepTime: 4, isVeg: true, image: '💪', description: 'Banana, oats, and protein powder', isAvailable: true },
        { id: 'm35', storeId: 's8', name: 'Greek Salad', category: 'Salads', price: 130, prepTime: 5, isVeg: true, image: '🥗', description: 'Fresh veggies with feta cheese', isAvailable: true },
        { id: 'm36', storeId: 's8', name: 'Chicken Bowl', category: 'Bowls', price: 180, prepTime: 8, isVeg: false, image: '🍗', description: 'Grilled chicken with brown rice', isAvailable: true },
        { id: 'm37', storeId: 's8', name: 'Quinoa Buddha Bowl', category: 'Bowls', price: 160, prepTime: 7, isVeg: true, image: '🥙', description: 'Quinoa, avocado, and veggies', isAvailable: true },
        { id: 'm38', storeId: 's8', name: 'Fruit Bowl', category: 'Desserts', price: 100, prepTime: 3, isVeg: true, image: '🍓', description: 'Seasonal fresh fruits', isAvailable: true },
        { id: 'm39', storeId: 's9', name: 'Paneer Tikka Wrap', category: 'Wraps', price: 110, prepTime: 7, isVeg: true, image: '🌯', description: 'Grilled paneer in tortilla', isAvailable: true },
        { id: 'm40', storeId: 's9', name: 'Chicken Shawarma', category: 'Wraps', price: 130, prepTime: 8, isVeg: false, image: '🌯', description: 'Middle-eastern style wrap', isAvailable: true },
        { id: 'm41', storeId: 's9', name: 'Falafel Roll', category: 'Wraps', price: 100, prepTime: 6, isVeg: true, image: '🧆', description: 'Crispy falafel with hummus', isAvailable: true },
        { id: 'm42', storeId: 's9', name: 'Egg Roll', category: 'Rolls', price: 80, prepTime: 5, isVeg: false, image: '🥚', description: 'Egg-stuffed Kolkata-style roll', isAvailable: true },
        { id: 'm43', storeId: 's10', name: 'Whey Protein Shake', category: 'Shakes', price: 150, prepTime: 3, isVeg: true, image: '🥤', description: 'Whey protein with banana', isAvailable: true },
        { id: 'm44', storeId: 's10', name: 'Peanut Butter Shake', category: 'Shakes', price: 130, prepTime: 3, isVeg: true, image: '🥜', description: 'Peanut butter with oat milk', isAvailable: true },
        { id: 'm45', storeId: 's10', name: 'Energy Bar', category: 'Snacks', price: 80, prepTime: 1, isVeg: true, image: '🍫', description: 'Oats, nuts, and honey bar', isAvailable: true },
        { id: 'm46', storeId: 's10', name: 'BCAA Drink', category: 'Supplements', price: 100, prepTime: 2, isVeg: true, image: '🧊', description: 'Branched-chain amino acids drink', isAvailable: true },
        { id: 'm47', storeId: 's11', name: 'Cappuccino', category: 'Coffee', price: 120, prepTime: 5, isVeg: true, image: '☕', description: 'Frothy Italian-style cappuccino', isAvailable: true },
        { id: 'm48', storeId: 's11', name: 'Croissant', category: 'Bakes', price: 80, prepTime: 3, isVeg: true, image: '🥐', description: 'Buttery flaky French pastry', isAvailable: true },
        { id: 'm49', storeId: 's11', name: 'Blueberry Muffin', category: 'Bakes', price: 70, prepTime: 2, isVeg: true, image: '🫐', description: 'Fresh blueberry muffin', isAvailable: true },
        { id: 'm50', storeId: 's11', name: 'Matcha Latte', category: 'Coffee', price: 140, prepTime: 5, isVeg: true, image: '🍵', description: 'Japanese green tea latte', isAvailable: true },
        { id: 'm51', storeId: 's12', name: 'Chicken Tacos', category: 'Tacos', price: 140, prepTime: 8, isVeg: false, image: '🌮', description: 'Spiced chicken with salsa', isAvailable: true },
        { id: 'm52', storeId: 's12', name: 'Veg Burrito Bowl', category: 'Bowls', price: 160, prepTime: 10, isVeg: true, image: '🥗', description: 'Rice, beans, guac, and veggies', isAvailable: true },
        { id: 'm53', storeId: 's12', name: 'Nachos Grande', category: 'Starters', price: 130, prepTime: 8, isVeg: true, image: '🧀', description: 'Loaded nachos with cheese dip', isAvailable: true },
        { id: 'm54', storeId: 's12', name: 'Churros', category: 'Desserts', price: 90, prepTime: 5, isVeg: true, image: '🍩', description: 'Cinnamon sugar churros', isAvailable: true },
        { id: 'm55', storeId: 's13', name: 'Belgian Waffle', category: 'Waffles', price: 150, prepTime: 8, isVeg: true, image: '🧇', description: 'Crispy waffle with toppings', isAvailable: true },
        { id: 'm56', storeId: 's13', name: 'Chocolate Brownie', category: 'Brownies', price: 100, prepTime: 5, isVeg: true, image: '🍫', description: 'Gooey dark chocolate brownie', isAvailable: true },
        { id: 'm57', storeId: 's13', name: 'Mango Ice Cream', category: 'Ice Cream', price: 80, prepTime: 2, isVeg: true, image: '🍨', description: 'Fresh mango scoop', isAvailable: true },
        { id: 'm58', storeId: 's13', name: 'Red Velvet Cake', category: 'Cakes', price: 120, prepTime: 3, isVeg: true, image: '🎂', description: 'Cream cheese frosted slice', isAvailable: true },
        { id: 'm59', storeId: 's14', name: 'Classic Maggi', category: 'Maggi', price: 40, prepTime: 5, isVeg: true, image: '🍜', description: 'Campus classic masala Maggi', isAvailable: true },
        { id: 'm60', storeId: 's14', name: 'Cheese Maggi', category: 'Maggi', price: 60, prepTime: 6, isVeg: true, image: '🧀', description: 'Extra cheesy loaded Maggi', isAvailable: true },
        { id: 'm61', storeId: 's14', name: 'Egg Maggi', category: 'Maggi', price: 55, prepTime: 7, isVeg: false, image: '🥚', description: 'Maggi with scrambled egg', isAvailable: true },
        { id: 'm62', storeId: 's14', name: 'Bread Omelette', category: 'Snacks', price: 50, prepTime: 5, isVeg: false, image: '🍳', description: 'Classic midnight bread omelette', isAvailable: true },
        { id: 'm63', storeId: 's15', name: 'Tandoori Chicken', category: 'Tandoor', price: 200, prepTime: 15, isVeg: false, image: '🍗', description: 'Smoky charcoal grilled chicken', isAvailable: true },
        { id: 'm64', storeId: 's15', name: 'Paneer Tikka', category: 'Tandoor', price: 160, prepTime: 12, isVeg: true, image: '🧀', description: 'Spiced paneer on skewers', isAvailable: true },
        { id: 'm65', storeId: 's15', name: 'Seekh Kebab', category: 'Kebabs', price: 180, prepTime: 12, isVeg: false, image: '🥩', description: 'Minced lamb spiced kebabs', isAvailable: true },
        { id: 'm66', storeId: 's15', name: 'Roomali Roti', category: 'Breads', price: 25, prepTime: 3, isVeg: true, image: '🫓', description: 'Paper-thin soft roti', isAvailable: true },
        { id: 'm67', storeId: 's16', name: 'Aloo Paratha', category: 'Parathas', price: 60, prepTime: 8, isVeg: true, image: '🫓', description: 'Stuffed potato paratha with butter', isAvailable: true },
        { id: 'm68', storeId: 's16', name: 'Paneer Paratha', category: 'Parathas', price: 80, prepTime: 10, isVeg: true, image: '🧀', description: 'Cottage cheese stuffed paratha', isAvailable: true },
        { id: 'm69', storeId: 's16', name: 'Egg Paratha', category: 'Parathas', price: 70, prepTime: 8, isVeg: false, image: '🥚', description: 'Egg stuffed crispy paratha', isAvailable: true },
        { id: 'm70', storeId: 's16', name: 'Mini Thali', category: 'Thalis', price: 120, prepTime: 12, isVeg: true, image: '🍛', description: 'Roti, dal, sabzi, rice, salad', isAvailable: true },
        { id: 'm71', storeId: 's17', name: 'Avocado Toast', category: 'Toasts', price: 130, prepTime: 5, isVeg: true, image: '🥑', description: 'Smashed avocado on sourdough', isAvailable: true },
        { id: 'm72', storeId: 's17', name: 'Oats Porridge', category: 'Breakfast', price: 90, prepTime: 5, isVeg: true, image: '🥣', description: 'Warm oats with honey and fruits', isAvailable: true },
        { id: 'm73', storeId: 's17', name: 'Grilled Veg Sandwich', category: 'Sandwiches', price: 100, prepTime: 7, isVeg: true, image: '🥪', description: 'Multi-grain with grilled veggies', isAvailable: true },
        { id: 'm74', storeId: 's17', name: 'Detox Water', category: 'Drinks', price: 50, prepTime: 2, isVeg: true, image: '🍋', description: 'Lemon, cucumber, and mint', isAvailable: true },
        { id: 'm75', storeId: 's18', name: 'French Omelette', category: 'Omelettes', price: 80, prepTime: 5, isVeg: false, image: '🍳', description: 'Fluffy French-style omelette', isAvailable: true },
        { id: 'm76', storeId: 's18', name: 'Egg Bhurji', category: 'Specials', price: 70, prepTime: 5, isVeg: false, image: '🥚', description: 'Spiced scrambled eggs Indian style', isAvailable: true },
        { id: 'm77', storeId: 's18', name: 'Egg Fried Rice', category: 'Rice', price: 100, prepTime: 8, isVeg: false, image: '🍚', description: 'Wok-tossed rice with egg', isAvailable: true },
        { id: 'm78', storeId: 's18', name: 'Boiled Eggs', category: 'Basics', price: 30, prepTime: 1, isVeg: false, image: '🥚', description: '2 protein-packed boiled eggs', isAvailable: true },
        { id: 'm79', storeId: 's19', name: 'Kulhad Chai', category: 'Tea', price: 25, prepTime: 3, isVeg: true, image: '🍵', description: 'Traditional clay pot tea', isAvailable: true },
        { id: 'm80', storeId: 's19', name: 'Butterscotch Sundae', category: 'Sundaes', price: 110, prepTime: 5, isVeg: true, image: '🍨', description: 'Crunchy butterscotch ice cream', isAvailable: true },
        { id: 'm81', storeId: 's19', name: 'Hot Chocolate', category: 'Drinks', price: 80, prepTime: 4, isVeg: true, image: '🍫', description: 'Rich dark hot chocolate', isAvailable: true },
        { id: 'm82', storeId: 's19', name: 'Mango Kulfi', category: 'Kulfi', price: 60, prepTime: 2, isVeg: true, image: '🥭', description: 'Traditional mango kulfi on stick', isAvailable: true },
        { id: 'm83', storeId: 's20', name: 'BBQ Chicken Wings', category: 'Wings', price: 180, prepTime: 15, isVeg: false, image: '🍗', description: 'Smoky BBQ glazed wings', isAvailable: true },
        { id: 'm84', storeId: 's20', name: 'Grilled Paneer Steak', category: 'Grills', price: 160, prepTime: 12, isVeg: true, image: '🧀', description: 'Thick paneer with herb butter', isAvailable: true },
        { id: 'm85', storeId: 's20', name: 'Lamb Chops', category: 'Grills', price: 280, prepTime: 18, isVeg: false, image: '🥩', description: 'Herb-crusted lamb chops', isAvailable: true },
        { id: 'm86', storeId: 's20', name: 'Coleslaw', category: 'Sides', price: 60, prepTime: 2, isVeg: true, image: '🥗', description: 'Creamy crunchy coleslaw', isAvailable: true },
        { id: 'm87', storeId: 's21', name: 'California Roll', category: 'Sushi', price: 220, prepTime: 12, isVeg: false, image: '🍣', description: 'Crab, avocado, cucumber roll', isAvailable: true },
        { id: 'm88', storeId: 's21', name: 'Veg Maki Roll', category: 'Sushi', price: 180, prepTime: 10, isVeg: true, image: '🍣', description: 'Veggie maki with soy dip', isAvailable: true },
        { id: 'm89', storeId: 's21', name: 'Miso Soup', category: 'Soups', price: 90, prepTime: 5, isVeg: true, image: '🥣', description: 'Traditional Japanese miso', isAvailable: true },
        { id: 'm90', storeId: 's21', name: 'Edamame', category: 'Starters', price: 100, prepTime: 5, isVeg: true, image: '🫛', description: 'Steamed salted edamame beans', isAvailable: true },
        { id: 'm91', storeId: 's22', name: 'Pour Over Coffee', category: 'Specialty', price: 180, prepTime: 5, isVeg: true, image: '☕', description: 'Single-origin hand-brewed coffee', isAvailable: true },
        { id: 'm92', storeId: 's22', name: 'Espresso Shot', category: 'Classics', price: 80, prepTime: 2, isVeg: true, image: '☕', description: 'Double shot Italian espresso', isAvailable: true },
        { id: 'm93', storeId: 's22', name: 'Iced Americano', category: 'Iced', price: 120, prepTime: 3, isVeg: true, image: '🧊', description: 'Chilled espresso with water', isAvailable: true },
        { id: 'm94', storeId: 's22', name: 'Cookie', category: 'Bites', price: 50, prepTime: 1, isVeg: true, image: '🍪', description: 'Chunky chocolate chip cookie', isAvailable: true },
        { id: 'm95', storeId: 's23', name: 'Rajma Chawal', category: 'Specials', price: 100, prepTime: 10, isVeg: true, image: '🍛', description: 'Punjabi kidney beans with rice', isAvailable: true },
        { id: 'm96', storeId: 's23', name: 'Chole Bhature', category: 'Specials', price: 90, prepTime: 10, isVeg: true, image: '🫓', description: 'Spicy chickpeas with fried bread', isAvailable: true },
        { id: 'm97', storeId: 's23', name: 'Butter Chicken', category: 'Main Course', price: 180, prepTime: 15, isVeg: false, image: '🍗', description: 'Creamy tomato butter chicken', isAvailable: true },
        { id: 'm98', storeId: 's24', name: 'Sweet Lassi', category: 'Lassi', price: 50, prepTime: 3, isVeg: true, image: '🥛', description: 'Thick creamy sweet lassi', isAvailable: true },
        { id: 'm99', storeId: 's24', name: 'Mango Lassi', category: 'Lassi', price: 70, prepTime: 3, isVeg: true, image: '🥭', description: 'Mango pulp blended lassi', isAvailable: true },
        { id: 'm100', storeId: 's24', name: 'Aloo Tikki Chaat', category: 'Chaat', price: 60, prepTime: 5, isVeg: true, image: '🥔', description: 'Crispy potato patty with chutneys', isAvailable: true },
    ];
    for (const m of menuItems) db.addMenuItem(m);

    // --- Platform config ---
    db.setConfig('fee_per_order', 2);
    db.setConfig('settlement_cycle', 'weekly');
    db.setConfig('fee_collection', 'auto-deduct');

    // --- Sample orders ---
    const ago = (min) => new Date(Date.now() - min * 60000).toISOString();
    const fromNow = (min) => new Date(Date.now() + min * 60000).toISOString();

    const orders = [
        { id: 'ORD-DEMO1', userId: null, storeId: 's3', storeName: 'Pizza Planet', customerName: 'Demo Student', items: [{ name: 'Margherita Pizza', qty: 2, price: 199 }, { name: 'Garlic Bread', qty: 1, price: 99 }], total: 497, status: 'preparing', paymentMethod: 'upi', otp: '4829', placedAt: ago(5), estimatedReady: fromNow(10), completedAt: null },
        { id: 'ORD-DEMO2', userId: null, storeId: 's3', storeName: 'Pizza Planet', customerName: 'Ananya K.', items: [{ name: 'Pepperoni Pizza', qty: 1, price: 249 }], total: 249, status: 'completed', paymentMethod: 'card', otp: '7291', placedAt: ago(50), estimatedReady: ago(35), completedAt: ago(33) },
        { id: 'ORD-DEMO3', userId: null, storeId: 's1', storeName: 'Desi Tadka', customerName: 'Vikram S.', items: [{ name: 'Paneer Butter Masala', qty: 1, price: 150 }, { name: 'Butter Naan', qty: 3, price: 30 }], total: 240, status: 'completed', paymentMethod: 'upi', otp: '3156', placedAt: ago(120), estimatedReady: ago(105), completedAt: ago(100) },
        { id: 'ORD-DEMO4', userId: null, storeId: 's5', storeName: 'South Express', customerName: 'Priya M.', items: [{ name: 'Masala Dosa', qty: 2, price: 80 }], total: 160, status: 'completed', paymentMethod: 'cash', otp: '8462', placedAt: ago(180), estimatedReady: ago(175), completedAt: ago(173) },
    ];
    for (const o of orders) db.addOrder(o);

    console.log('✅ Database seeded — 8 food courts, 24 stores, 100 menu items, 4 sample orders');
}
