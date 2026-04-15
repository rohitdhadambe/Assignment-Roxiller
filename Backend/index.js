require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminUserRoutes = require('./routes/adminUsers');
const adminStoreRoutes = require('./routes/adminStores');
const adminDashboardRoutes = require('./routes/adminDashboard');
const userRoutes = require('./routes/user'); 
const ratingRoutes = require('./routes/ratings'); 
const storeRoutes = require('./routes/stores');
const storeOwnerRoutes = require('./routes/storeOwner');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/stores', adminStoreRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/user', userRoutes); 
app.use('/api/ratings', ratingRoutes); 
app.use('/api/stores', storeRoutes);
app.use('/api/storeowner', storeOwnerRoutes);

app.get('/', (req, res) => {
    res.send('Store Rating API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
