// ===== Campus Bites — Mock Data =====

export const foodCourts = [
  {
    id: 'fc1',
    name: 'Central Food Court',
    image: '🏫',
    description: 'Main campus food hub near the library',
    storeCount: 4,
    crowdLevel: 'low',
    isOpen: true,
    openTime: '8:00 AM',
    closeTime: '9:00 PM',
  },
  {
    id: 'fc2',
    name: 'Engineering Block Canteen',
    image: '🔧',
    description: 'Quick bites near engineering labs',
    storeCount: 3,
    crowdLevel: 'medium',
    isOpen: true,
    openTime: '7:30 AM',
    closeTime: '8:00 PM',
  },
  {
    id: 'fc3',
    name: 'Sports Complex Café',
    image: '⚽',
    description: 'Healthy options near the sports grounds',
    storeCount: 3,
    crowdLevel: 'high',
    isOpen: true,
    openTime: '9:00 AM',
    closeTime: '7:00 PM',
  },
  {
    id: 'fc4',
    name: 'Arts & Media Plaza',
    image: '🎨',
    description: 'Creative eats by the arts faculty',
    storeCount: 3,
    crowdLevel: 'low',
    isOpen: true,
    openTime: '8:30 AM',
    closeTime: '8:30 PM',
  },
  {
    id: 'fc5',
    name: 'Hostel Block Mess',
    image: '🏠',
    description: 'Late-night munchies near hostels',
    storeCount: 3,
    crowdLevel: 'medium',
    isOpen: true,
    openTime: '7:00 AM',
    closeTime: '11:00 PM',
  },
  {
    id: 'fc6',
    name: 'Medical Campus Café',
    image: '🏥',
    description: 'Quick meals for med students',
    storeCount: 3,
    crowdLevel: 'low',
    isOpen: true,
    openTime: '6:30 AM',
    closeTime: '10:00 PM',
  },
  {
    id: 'fc7',
    name: 'Business School Lounge',
    image: '💼',
    description: 'Premium bites at the B-school',
    storeCount: 3,
    crowdLevel: 'high',
    isOpen: true,
    openTime: '8:00 AM',
    closeTime: '9:00 PM',
  },
  {
    id: 'fc8',
    name: 'Lakeside Dhaba',
    image: '🌅',
    description: 'Chill vibes by the campus lake',
    storeCount: 2,
    crowdLevel: 'medium',
    isOpen: false,
    openTime: '10:00 AM',
    closeTime: '6:00 PM',
  },
];

export const stores = [
  // --- Central Food Court (fc1) ---
  { id: 's1', courtId: 'fc1', name: 'Desi Tadka', image: '🍛', cuisine: 'North Indian', rating: 4.5, prepTime: '10-15 min', isOpen: true, isFavorite: false },
  { id: 's2', courtId: 'fc1', name: 'Dragon Wok', image: '🥡', cuisine: 'Chinese & Indo-Chinese', rating: 4.2, prepTime: '8-12 min', isOpen: true, isFavorite: false },
  { id: 's3', courtId: 'fc1', name: 'Pizza Planet', image: '🍕', cuisine: 'Italian & Pizza', rating: 4.7, prepTime: '12-18 min', isOpen: true, isFavorite: true },
  { id: 's4', courtId: 'fc1', name: 'Chai Point', image: '☕', cuisine: 'Beverages & Snacks', rating: 4.8, prepTime: '3-5 min', isOpen: false, isFavorite: false },

  // --- Engineering Block Canteen (fc2) ---
  { id: 's5', courtId: 'fc2', name: 'South Express', image: '🥘', cuisine: 'South Indian', rating: 4.6, prepTime: '5-10 min', isOpen: true, isFavorite: true },
  { id: 's6', courtId: 'fc2', name: 'Burger Barn', image: '🍔', cuisine: 'Burgers & Fries', rating: 4.3, prepTime: '8-12 min', isOpen: true, isFavorite: false },
  { id: 's7', courtId: 'fc2', name: 'Juice Junction', image: '🧃', cuisine: 'Juices & Smoothies', rating: 4.4, prepTime: '3-5 min', isOpen: true, isFavorite: false },

  // --- Sports Complex Café (fc3) ---
  { id: 's8', courtId: 'fc3', name: 'FitBowl', image: '🥗', cuisine: 'Salads & Bowls', rating: 4.5, prepTime: '5-8 min', isOpen: true, isFavorite: false },
  { id: 's9', courtId: 'fc3', name: 'Wrap Star', image: '🌯', cuisine: 'Wraps & Rolls', rating: 4.1, prepTime: '6-10 min', isOpen: true, isFavorite: false },
  { id: 's10', courtId: 'fc3', name: 'Protein Shake Bar', image: '💪', cuisine: 'Shakes & Supplements', rating: 4.6, prepTime: '3-5 min', isOpen: true, isFavorite: true },

  // --- Arts & Media Plaza (fc4) ---
  { id: 's11', courtId: 'fc4', name: 'Café Canvas', image: '🎭', cuisine: 'Artisan Coffee & Bakes', rating: 4.7, prepTime: '5-8 min', isOpen: true, isFavorite: false },
  { id: 's12', courtId: 'fc4', name: 'Taco Twist', image: '🌮', cuisine: 'Mexican & Fusion', rating: 4.3, prepTime: '8-12 min', isOpen: true, isFavorite: false },
  { id: 's13', courtId: 'fc4', name: 'Dessert Drama', image: '🧁', cuisine: 'Desserts & Ice Cream', rating: 4.8, prepTime: '5-10 min', isOpen: true, isFavorite: true },

  // --- Hostel Block Mess (fc5) ---
  { id: 's14', courtId: 'fc5', name: 'Midnight Maggi', image: '🍜', cuisine: 'Late Night Snacks', rating: 4.4, prepTime: '5-8 min', isOpen: true, isFavorite: false },
  { id: 's15', courtId: 'fc5', name: 'Tandoori Nights', image: '🔥', cuisine: 'Tandoor & Kebabs', rating: 4.5, prepTime: '10-15 min', isOpen: true, isFavorite: false },
  { id: 's16', courtId: 'fc5', name: 'Paratha House', image: '🫓', cuisine: 'Parathas & Thalis', rating: 4.6, prepTime: '8-12 min', isOpen: true, isFavorite: false },

  // --- Medical Campus Café (fc6) ---
  { id: 's17', courtId: 'fc6', name: 'Green Leaf', image: '🥬', cuisine: 'Organic & Healthy', rating: 4.5, prepTime: '5-8 min', isOpen: true, isFavorite: false },
  { id: 's18', courtId: 'fc6', name: 'Egg Factory', image: '🥚', cuisine: 'Egg Specials', rating: 4.2, prepTime: '5-10 min', isOpen: true, isFavorite: false },
  { id: 's19', courtId: 'fc6', name: 'Chai & Cream', image: '🍦', cuisine: 'Tea & Ice Cream', rating: 4.4, prepTime: '3-5 min', isOpen: true, isFavorite: false },

  // --- Business School Lounge (fc7) ---
  { id: 's20', courtId: 'fc7', name: 'The BBQ Co.', image: '🥩', cuisine: 'Grills & BBQ', rating: 4.6, prepTime: '12-18 min', isOpen: true, isFavorite: false },
  { id: 's21', courtId: 'fc7', name: 'Sushi Station', image: '🍣', cuisine: 'Japanese & Asian', rating: 4.7, prepTime: '10-15 min', isOpen: true, isFavorite: true },
  { id: 's22', courtId: 'fc7', name: 'Brew & Beans', image: '☕', cuisine: 'Premium Coffee', rating: 4.9, prepTime: '3-5 min', isOpen: true, isFavorite: false },

  // --- Lakeside Dhaba (fc8) ---
  { id: 's23', courtId: 'fc8', name: 'Dhaba Express', image: '🍲', cuisine: 'Punjabi Dhaba Style', rating: 4.5, prepTime: '10-15 min', isOpen: false, isFavorite: false },
  { id: 's24', courtId: 'fc8', name: 'Lassi Corner', image: '🥛', cuisine: 'Lassi & Chaat', rating: 4.3, prepTime: '3-5 min', isOpen: false, isFavorite: false },
];

export const menuItems = [
  // --- Desi Tadka (s1) ---
  { id: 'm1', storeId: 's1', name: 'Paneer Butter Masala', category: 'Main Course', price: 150, prepTime: 12, isVeg: true, image: '🧈', description: 'Rich and creamy paneer in tomato gravy' },
  { id: 'm2', storeId: 's1', name: 'Chicken Biryani', category: 'Main Course', price: 180, prepTime: 15, isVeg: false, image: '🍗', description: 'Aromatic basmati rice with tender chicken' },
  { id: 'm3', storeId: 's1', name: 'Dal Makhani', category: 'Main Course', price: 120, prepTime: 10, isVeg: true, image: '🫘', description: 'Slow-cooked lentils in butter sauce' },
  { id: 'm4', storeId: 's1', name: 'Butter Naan', category: 'Breads', price: 30, prepTime: 5, isVeg: true, image: '🫓', description: 'Soft naan with butter' },
  { id: 'm5', storeId: 's1', name: 'Gulab Jamun', category: 'Desserts', price: 60, prepTime: 3, isVeg: true, image: '🍩', description: 'Sweet dumplings in sugar syrup' },
  { id: 'm6', storeId: 's1', name: 'Masala Chaas', category: 'Beverages', price: 40, prepTime: 2, isVeg: true, image: '🥛', description: 'Spiced buttermilk' },

  // --- Dragon Wok (s2) ---
  { id: 'm7', storeId: 's2', name: 'Veg Manchurian', category: 'Starters', price: 120, prepTime: 8, isVeg: true, image: '🥟', description: 'Crispy vegetable balls in spicy sauce' },
  { id: 'm8', storeId: 's2', name: 'Chicken Fried Rice', category: 'Main Course', price: 150, prepTime: 10, isVeg: false, image: '🍚', description: 'Wok-tossed rice with chicken' },
  { id: 'm9', storeId: 's2', name: 'Hakka Noodles', category: 'Main Course', price: 130, prepTime: 10, isVeg: true, image: '🍜', description: 'Stir-fried noodles with vegetables' },
  { id: 'm10', storeId: 's2', name: 'Spring Rolls', category: 'Starters', price: 100, prepTime: 8, isVeg: true, image: '🥢', description: 'Crispy rolls with veggie filling' },
  { id: 'm11', storeId: 's2', name: 'Hot & Sour Soup', category: 'Soups', price: 80, prepTime: 5, isVeg: true, image: '🥣', description: 'Tangy and spicy soup' },

  // --- Pizza Planet (s3) ---
  { id: 'm12', storeId: 's3', name: 'Margherita Pizza', category: 'Pizzas', price: 199, prepTime: 15, isVeg: true, image: '🍕', description: 'Classic mozzarella and basil' },
  { id: 'm13', storeId: 's3', name: 'Pepperoni Pizza', category: 'Pizzas', price: 249, prepTime: 15, isVeg: false, image: '🍕', description: 'Loaded with spicy pepperoni' },
  { id: 'm14', storeId: 's3', name: 'Garlic Bread', category: 'Sides', price: 99, prepTime: 8, isVeg: true, image: '🥖', description: 'Toasted with garlic butter' },
  { id: 'm15', storeId: 's3', name: 'Pasta Alfredo', category: 'Pasta', price: 179, prepTime: 12, isVeg: true, image: '🍝', description: 'Creamy white sauce pasta' },
  { id: 'm16', storeId: 's3', name: 'Cold Coffee', category: 'Beverages', price: 89, prepTime: 3, isVeg: true, image: '🧋', description: 'Chilled coffee with ice cream' },

  // --- Chai Point (s4) ---
  { id: 'm17', storeId: 's4', name: 'Masala Chai', category: 'Beverages', price: 30, prepTime: 3, isVeg: true, image: '🍵', description: 'Authentic Indian spiced tea' },
  { id: 'm18', storeId: 's4', name: 'Filter Coffee', category: 'Beverages', price: 40, prepTime: 3, isVeg: true, image: '☕', description: 'Strong South Indian coffee' },
  { id: 'm19', storeId: 's4', name: 'Samosa', category: 'Snacks', price: 20, prepTime: 2, isVeg: true, image: '🔺', description: 'Crispy pastry with potato filling' },
  { id: 'm20', storeId: 's4', name: 'Vada Pav', category: 'Snacks', price: 25, prepTime: 2, isVeg: true, image: '🥔', description: 'Mumbai-style spiced potato burger' },

  // --- South Express (s5) ---
  { id: 'm21', storeId: 's5', name: 'Masala Dosa', category: 'Main Course', price: 80, prepTime: 8, isVeg: true, image: '🫓', description: 'Crispy crepe with spiced potato' },
  { id: 'm22', storeId: 's5', name: 'Idli Sambar', category: 'Main Course', price: 60, prepTime: 5, isVeg: true, image: '⚪', description: 'Steamed rice cakes with lentil soup' },
  { id: 'm23', storeId: 's5', name: 'Medu Vada', category: 'Snacks', price: 50, prepTime: 5, isVeg: true, image: '🍩', description: 'Crispy lentil donuts' },
  { id: 'm24', storeId: 's5', name: 'Uttapam', category: 'Main Course', price: 90, prepTime: 8, isVeg: true, image: '🫓', description: 'Thick pancake with vegetables' },
  { id: 'm25', storeId: 's5', name: 'Filter Coffee', category: 'Beverages', price: 35, prepTime: 3, isVeg: true, image: '☕', description: 'Traditional South Indian coffee' },

  // --- Burger Barn (s6) ---
  { id: 'm26', storeId: 's6', name: 'Classic Veg Burger', category: 'Burgers', price: 99, prepTime: 8, isVeg: true, image: '🍔', description: 'Crunchy patty with fresh veggies' },
  { id: 'm27', storeId: 's6', name: 'Chicken Burger', category: 'Burgers', price: 139, prepTime: 10, isVeg: false, image: '🍔', description: 'Grilled chicken with special sauce' },
  { id: 'm28', storeId: 's6', name: 'French Fries', category: 'Sides', price: 69, prepTime: 5, isVeg: true, image: '🍟', description: 'Crispy golden fries' },
  { id: 'm29', storeId: 's6', name: 'Onion Rings', category: 'Sides', price: 79, prepTime: 5, isVeg: true, image: '🧅', description: 'Battered and fried onion rings' },
  { id: 'm30', storeId: 's6', name: 'Milkshake', category: 'Beverages', price: 99, prepTime: 5, isVeg: true, image: '🥤', description: 'Thick creamy milkshake' },

  // --- Juice Junction (s7) ---
  { id: 'm31', storeId: 's7', name: 'Orange Juice', category: 'Fresh Juices', price: 60, prepTime: 3, isVeg: true, image: '🍊', description: 'Freshly squeezed orange' },
  { id: 'm32', storeId: 's7', name: 'Mango Smoothie', category: 'Smoothies', price: 90, prepTime: 4, isVeg: true, image: '🥭', description: 'Thick mango smoothie' },
  { id: 'm33', storeId: 's7', name: 'Green Detox', category: 'Fresh Juices', price: 80, prepTime: 4, isVeg: true, image: '🥬', description: 'Spinach, cucumber, and apple' },
  { id: 'm34', storeId: 's7', name: 'Protein Shake', category: 'Smoothies', price: 120, prepTime: 4, isVeg: true, image: '💪', description: 'Banana, oats, and protein powder' },

  // --- FitBowl (s8) ---
  { id: 'm35', storeId: 's8', name: 'Greek Salad', category: 'Salads', price: 130, prepTime: 5, isVeg: true, image: '🥗', description: 'Fresh veggies with feta cheese' },
  { id: 'm36', storeId: 's8', name: 'Chicken Bowl', category: 'Bowls', price: 180, prepTime: 8, isVeg: false, image: '🍗', description: 'Grilled chicken with brown rice' },
  { id: 'm37', storeId: 's8', name: 'Quinoa Buddha Bowl', category: 'Bowls', price: 160, prepTime: 7, isVeg: true, image: '🥙', description: 'Quinoa, avocado, and veggies' },
  { id: 'm38', storeId: 's8', name: 'Fruit Bowl', category: 'Desserts', price: 100, prepTime: 3, isVeg: true, image: '🍓', description: 'Seasonal fresh fruits' },

  // --- Wrap Star (s9) ---
  { id: 'm39', storeId: 's9', name: 'Paneer Tikka Wrap', category: 'Wraps', price: 110, prepTime: 7, isVeg: true, image: '🌯', description: 'Grilled paneer in tortilla' },
  { id: 'm40', storeId: 's9', name: 'Chicken Shawarma', category: 'Wraps', price: 130, prepTime: 8, isVeg: false, image: '🌯', description: 'Middle-eastern style wrap' },
  { id: 'm41', storeId: 's9', name: 'Falafel Roll', category: 'Wraps', price: 100, prepTime: 6, isVeg: true, image: '🧆', description: 'Crispy falafel with hummus' },
  { id: 'm42', storeId: 's9', name: 'Egg Roll', category: 'Rolls', price: 80, prepTime: 5, isVeg: false, image: '🥚', description: 'Egg-stuffed Kolkata-style roll' },

  // --- Protein Shake Bar (s10) ---
  { id: 'm43', storeId: 's10', name: 'Whey Protein Shake', category: 'Shakes', price: 150, prepTime: 3, isVeg: true, image: '🥤', description: 'Whey protein with banana' },
  { id: 'm44', storeId: 's10', name: 'Peanut Butter Shake', category: 'Shakes', price: 130, prepTime: 3, isVeg: true, image: '🥜', description: 'Peanut butter with oat milk' },
  { id: 'm45', storeId: 's10', name: 'Energy Bar', category: 'Snacks', price: 80, prepTime: 1, isVeg: true, image: '🍫', description: 'Oats, nuts, and honey bar' },
  { id: 'm46', storeId: 's10', name: 'BCAA Drink', category: 'Supplements', price: 100, prepTime: 2, isVeg: true, image: '🧊', description: 'Branched-chain amino acids drink' },

  // --- Café Canvas (s11) ---
  { id: 'm47', storeId: 's11', name: 'Cappuccino', category: 'Coffee', price: 120, prepTime: 5, isVeg: true, image: '☕', description: 'Frothy Italian-style cappuccino' },
  { id: 'm48', storeId: 's11', name: 'Croissant', category: 'Bakes', price: 80, prepTime: 3, isVeg: true, image: '🥐', description: 'Buttery flaky French pastry' },
  { id: 'm49', storeId: 's11', name: 'Blueberry Muffin', category: 'Bakes', price: 70, prepTime: 2, isVeg: true, image: '🫐', description: 'Fresh blueberry muffin' },
  { id: 'm50', storeId: 's11', name: 'Matcha Latte', category: 'Coffee', price: 140, prepTime: 5, isVeg: true, image: '🍵', description: 'Japanese green tea latte' },

  // --- Taco Twist (s12) ---
  { id: 'm51', storeId: 's12', name: 'Chicken Tacos', category: 'Tacos', price: 140, prepTime: 8, isVeg: false, image: '🌮', description: 'Spiced chicken with salsa' },
  { id: 'm52', storeId: 's12', name: 'Veg Burrito Bowl', category: 'Bowls', price: 160, prepTime: 10, isVeg: true, image: '🥗', description: 'Rice, beans, guac, and veggies' },
  { id: 'm53', storeId: 's12', name: 'Nachos Grande', category: 'Starters', price: 130, prepTime: 8, isVeg: true, image: '🧀', description: 'Loaded nachos with cheese dip' },
  { id: 'm54', storeId: 's12', name: 'Churros', category: 'Desserts', price: 90, prepTime: 5, isVeg: true, image: '🍩', description: 'Cinnamon sugar churros' },

  // --- Dessert Drama (s13) ---
  { id: 'm55', storeId: 's13', name: 'Belgian Waffle', category: 'Waffles', price: 150, prepTime: 8, isVeg: true, image: '🧇', description: 'Crispy waffle with toppings' },
  { id: 'm56', storeId: 's13', name: 'Chocolate Brownie', category: 'Brownies', price: 100, prepTime: 5, isVeg: true, image: '🍫', description: 'Gooey dark chocolate brownie' },
  { id: 'm57', storeId: 's13', name: 'Mango Ice Cream', category: 'Ice Cream', price: 80, prepTime: 2, isVeg: true, image: '🍨', description: 'Fresh mango scoop' },
  { id: 'm58', storeId: 's13', name: 'Red Velvet Cake', category: 'Cakes', price: 120, prepTime: 3, isVeg: true, image: '🎂', description: 'Cream cheese frosted slice' },

  // --- Midnight Maggi (s14) ---
  { id: 'm59', storeId: 's14', name: 'Classic Maggi', category: 'Maggi', price: 40, prepTime: 5, isVeg: true, image: '🍜', description: 'Campus classic masala Maggi' },
  { id: 'm60', storeId: 's14', name: 'Cheese Maggi', category: 'Maggi', price: 60, prepTime: 6, isVeg: true, image: '🧀', description: 'Extra cheesy loaded Maggi' },
  { id: 'm61', storeId: 's14', name: 'Egg Maggi', category: 'Maggi', price: 55, prepTime: 7, isVeg: false, image: '🥚', description: 'Maggi with scrambled egg' },
  { id: 'm62', storeId: 's14', name: 'Bread Omelette', category: 'Snacks', price: 50, prepTime: 5, isVeg: false, image: '🍳', description: 'Classic midnight bread omelette' },

  // --- Tandoori Nights (s15) ---
  { id: 'm63', storeId: 's15', name: 'Tandoori Chicken', category: 'Tandoor', price: 200, prepTime: 15, isVeg: false, image: '🍗', description: 'Smoky charcoal grilled chicken' },
  { id: 'm64', storeId: 's15', name: 'Paneer Tikka', category: 'Tandoor', price: 160, prepTime: 12, isVeg: true, image: '🧀', description: 'Spiced paneer on skewers' },
  { id: 'm65', storeId: 's15', name: 'Seekh Kebab', category: 'Kebabs', price: 180, prepTime: 12, isVeg: false, image: '🥩', description: 'Minced lamb spiced kebabs' },
  { id: 'm66', storeId: 's15', name: 'Roomali Roti', category: 'Breads', price: 25, prepTime: 3, isVeg: true, image: '🫓', description: 'Paper-thin soft roti' },

  // --- Paratha House (s16) ---
  { id: 'm67', storeId: 's16', name: 'Aloo Paratha', category: 'Parathas', price: 60, prepTime: 8, isVeg: true, image: '🫓', description: 'Stuffed potato paratha with butter' },
  { id: 'm68', storeId: 's16', name: 'Paneer Paratha', category: 'Parathas', price: 80, prepTime: 10, isVeg: true, image: '🧀', description: 'Cottage cheese stuffed paratha' },
  { id: 'm69', storeId: 's16', name: 'Egg Paratha', category: 'Parathas', price: 70, prepTime: 8, isVeg: false, image: '🥚', description: 'Egg stuffed crispy paratha' },
  { id: 'm70', storeId: 's16', name: 'Mini Thali', category: 'Thalis', price: 120, prepTime: 12, isVeg: true, image: '🍛', description: 'Roti, dal, sabzi, rice, salad' },

  // --- Green Leaf (s17) ---
  { id: 'm71', storeId: 's17', name: 'Avocado Toast', category: 'Toasts', price: 130, prepTime: 5, isVeg: true, image: '🥑', description: 'Smashed avocado on sourdough' },
  { id: 'm72', storeId: 's17', name: 'Oats Porridge', category: 'Breakfast', price: 90, prepTime: 5, isVeg: true, image: '🥣', description: 'Warm oats with honey and fruits' },
  { id: 'm73', storeId: 's17', name: 'Grilled Veg Sandwich', category: 'Sandwiches', price: 100, prepTime: 7, isVeg: true, image: '🥪', description: 'Multi-grain with grilled veggies' },
  { id: 'm74', storeId: 's17', name: 'Detox Water', category: 'Drinks', price: 50, prepTime: 2, isVeg: true, image: '🍋', description: 'Lemon, cucumber, and mint' },

  // --- Egg Factory (s18) ---
  { id: 'm75', storeId: 's18', name: 'French Omelette', category: 'Omelettes', price: 80, prepTime: 5, isVeg: false, image: '🍳', description: 'Fluffy French-style omelette' },
  { id: 'm76', storeId: 's18', name: 'Egg Bhurji', category: 'Specials', price: 70, prepTime: 5, isVeg: false, image: '🥚', description: 'Spiced scrambled eggs Indian style' },
  { id: 'm77', storeId: 's18', name: 'Egg Fried Rice', category: 'Rice', price: 100, prepTime: 8, isVeg: false, image: '🍚', description: 'Wok-tossed rice with egg' },
  { id: 'm78', storeId: 's18', name: 'Boiled Eggs', category: 'Basics', price: 30, prepTime: 1, isVeg: false, image: '🥚', description: '2 protein-packed boiled eggs' },

  // --- Chai & Cream (s19) ---
  { id: 'm79', storeId: 's19', name: 'Kulhad Chai', category: 'Tea', price: 25, prepTime: 3, isVeg: true, image: '🍵', description: 'Traditional clay pot tea' },
  { id: 'm80', storeId: 's19', name: 'Butterscotch Sundae', category: 'Sundaes', price: 110, prepTime: 5, isVeg: true, image: '🍨', description: 'Crunchy butterscotch ice cream' },
  { id: 'm81', storeId: 's19', name: 'Hot Chocolate', category: 'Drinks', price: 80, prepTime: 4, isVeg: true, image: '🍫', description: 'Rich dark hot chocolate' },
  { id: 'm82', storeId: 's19', name: 'Mango Kulfi', category: 'Kulfi', price: 60, prepTime: 2, isVeg: true, image: '🥭', description: 'Traditional mango kulfi on stick' },

  // --- The BBQ Co. (s20) ---
  { id: 'm83', storeId: 's20', name: 'BBQ Chicken Wings', category: 'Wings', price: 180, prepTime: 15, isVeg: false, image: '🍗', description: 'Smoky BBQ glazed wings' },
  { id: 'm84', storeId: 's20', name: 'Grilled Paneer Steak', category: 'Grills', price: 160, prepTime: 12, isVeg: true, image: '🧀', description: 'Thick paneer with herb butter' },
  { id: 'm85', storeId: 's20', name: 'Lamb Chops', category: 'Grills', price: 280, prepTime: 18, isVeg: false, image: '🥩', description: 'Herb-crusted lamb chops' },
  { id: 'm86', storeId: 's20', name: 'Coleslaw', category: 'Sides', price: 60, prepTime: 2, isVeg: true, image: '🥗', description: 'Creamy crunchy coleslaw' },

  // --- Sushi Station (s21) ---
  { id: 'm87', storeId: 's21', name: 'California Roll', category: 'Sushi', price: 220, prepTime: 12, isVeg: false, image: '🍣', description: 'Crab, avocado, cucumber roll' },
  { id: 'm88', storeId: 's21', name: 'Veg Maki Roll', category: 'Sushi', price: 180, prepTime: 10, isVeg: true, image: '🍣', description: 'Veggie maki with soy dip' },
  { id: 'm89', storeId: 's21', name: 'Miso Soup', category: 'Soups', price: 90, prepTime: 5, isVeg: true, image: '🥣', description: 'Traditional Japanese miso' },
  { id: 'm90', storeId: 's21', name: 'Edamame', category: 'Starters', price: 100, prepTime: 5, isVeg: true, image: '🫛', description: 'Steamed salted edamame beans' },

  // --- Brew & Beans (s22) ---
  { id: 'm91', storeId: 's22', name: 'Pour Over Coffee', category: 'Specialty', price: 180, prepTime: 5, isVeg: true, image: '☕', description: 'Single-origin hand-brewed coffee' },
  { id: 'm92', storeId: 's22', name: 'Espresso Shot', category: 'Classics', price: 80, prepTime: 2, isVeg: true, image: '☕', description: 'Double shot Italian espresso' },
  { id: 'm93', storeId: 's22', name: 'Iced Americano', category: 'Iced', price: 120, prepTime: 3, isVeg: true, image: '🧊', description: 'Chilled espresso with water' },
  { id: 'm94', storeId: 's22', name: 'Cookie', category: 'Bites', price: 50, prepTime: 1, isVeg: true, image: '🍪', description: 'Chunky chocolate chip cookie' },

  // --- Dhaba Express (s23) ---
  { id: 'm95', storeId: 's23', name: 'Rajma Chawal', category: 'Specials', price: 100, prepTime: 10, isVeg: true, image: '🍛', description: 'Punjabi kidney beans with rice' },
  { id: 'm96', storeId: 's23', name: 'Chole Bhature', category: 'Specials', price: 90, prepTime: 10, isVeg: true, image: '🫓', description: 'Spicy chickpeas with fried bread' },
  { id: 'm97', storeId: 's23', name: 'Butter Chicken', category: 'Main Course', price: 180, prepTime: 15, isVeg: false, image: '🍗', description: 'Creamy tomato butter chicken' },

  // --- Lassi Corner (s24) ---
  { id: 'm98', storeId: 's24', name: 'Sweet Lassi', category: 'Lassi', price: 50, prepTime: 3, isVeg: true, image: '🥛', description: 'Thick creamy sweet lassi' },
  { id: 'm99', storeId: 's24', name: 'Mango Lassi', category: 'Lassi', price: 70, prepTime: 3, isVeg: true, image: '🥭', description: 'Mango pulp blended lassi' },
  { id: 'm100', storeId: 's24', name: 'Aloo Tikki Chaat', category: 'Chaat', price: 60, prepTime: 5, isVeg: true, image: '🥔', description: 'Crispy potato patty with chutneys' },
];

// Generate a 4-digit OTP
export const generateOTP = () => String(Math.floor(1000 + Math.random() * 9000));

// Generate order ID
export const generateOrderId = () => 'ORD-' + Date.now().toString(36).toUpperCase();

// Sample orders
export const sampleOrders = [
  {
    id: 'ORD-DEMO1',
    storeId: 's3',
    storeName: 'Pizza Planet',
    items: [
      { ...menuItems.find(m => m.id === 'm12'), quantity: 1 },
      { ...menuItems.find(m => m.id === 'm14'), quantity: 2 },
    ],
    total: 397,
    status: 'preparing',
    otp: '4829',
    paymentMethod: 'upi',
    placedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    estimatedReady: new Date(Date.now() + 10 * 60000).toISOString(),
  },
];
