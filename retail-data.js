/**
 * RetailSync AI - Simulated Retail Data API
 * Mimics dunhumby-style POS and retail intelligence data
 * 
 * This provides realistic retail insights for the hackathon demo
 */

const RetailDataAPI = {
    // Product Categories with realistic Indian market data
    categories: {
        'food': {
            name: 'Food & Snacks',
            avgCTR: 1.4,
            avgROAS: 3.8,
            topRegions: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'],
            peakHours: ['11:00-13:00', '19:00-21:00'],
            seasonality: { Q1: 0.9, Q2: 1.0, Q3: 1.1, Q4: 1.3 },
            topBrands: ['Britannia', 'Parle', 'ITC', 'Nestle', 'Haldiram'],
            avgBasketSize: 450,
            repeatPurchaseRate: 0.68
        },
        'beverage': {
            name: 'Beverages',
            avgCTR: 1.6,
            avgROAS: 4.2,
            topRegions: ['Chennai', 'Hyderabad', 'Pune', 'Mumbai', 'Bangalore'],
            peakHours: ['14:00-17:00', '20:00-22:00'],
            seasonality: { Q1: 1.2, Q2: 1.4, Q3: 1.1, Q4: 1.0 },
            topBrands: ['Coca-Cola', 'PepsiCo', 'Dabur', 'Paper Boat', 'Red Bull'],
            avgBasketSize: 320,
            repeatPurchaseRate: 0.72
        },
        'personal_care': {
            name: 'Personal Care',
            avgCTR: 1.2,
            avgROAS: 3.5,
            topRegions: ['Mumbai', 'Delhi', 'Kolkata', 'Pune', 'Ahmedabad'],
            peakHours: ['10:00-12:00', '18:00-20:00'],
            seasonality: { Q1: 1.0, Q2: 1.0, Q3: 1.0, Q4: 1.5 },
            topBrands: ['Hindustan Unilever', 'P&G', 'Nivea', 'Lakme', 'Mamaearth'],
            avgBasketSize: 680,
            repeatPurchaseRate: 0.58
        },
        'household': {
            name: 'Household & Cleaning',
            avgCTR: 0.9,
            avgROAS: 3.2,
            topRegions: ['Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Jaipur'],
            peakHours: ['09:00-11:00', '16:00-18:00'],
            seasonality: { Q1: 1.1, Q2: 1.0, Q3: 0.9, Q4: 1.2 },
            topBrands: ['Surf Excel', 'Vim', 'Harpic', 'Lizol', 'Godrej'],
            avgBasketSize: 520,
            repeatPurchaseRate: 0.75
        },
        'automotive': {
            name: 'Automotive Care',
            avgCTR: 1.8,
            avgROAS: 5.2,
            topRegions: ['Pune', 'Chennai', 'Ahmedabad', 'Delhi', 'Bangalore'],
            peakHours: ['10:00-12:00', '15:00-17:00'],
            seasonality: { Q1: 0.9, Q2: 1.0, Q3: 1.1, Q4: 1.3 },
            topBrands: ['Castrol', 'Shell', 'Mobil', '3M', 'Turtle Wax'],
            avgBasketSize: 890,
            repeatPurchaseRate: 0.45
        },
        'electronics': {
            name: 'Electronics & Gadgets',
            avgCTR: 2.1,
            avgROAS: 4.8,
            topRegions: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'],
            peakHours: ['12:00-14:00', '20:00-23:00'],
            seasonality: { Q1: 0.8, Q2: 0.9, Q3: 1.2, Q4: 1.6 },
            topBrands: ['Samsung', 'Apple', 'OnePlus', 'Boat', 'Noise'],
            avgBasketSize: 2500,
            repeatPurchaseRate: 0.32
        },
        'health': {
            name: 'Health & Wellness',
            avgCTR: 1.5,
            avgROAS: 4.0,
            topRegions: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai'],
            peakHours: ['07:00-09:00', '18:00-20:00'],
            seasonality: { Q1: 1.3, Q2: 1.0, Q3: 0.9, Q4: 1.1 },
            topBrands: ['Himalaya', 'Dabur', 'Patanjali', 'HealthKart', 'MuscleBlaze'],
            avgBasketSize: 750,
            repeatPurchaseRate: 0.62
        }
    },

    // Competitor pricing database (simulated)
    competitorPricing: {
        'Premium Motor Oil': { low: 449, mid: 549, high: 699 },
        'Organic Snacks': { low: 99, mid: 149, high: 199 },
        'Energy Drink': { low: 89, mid: 125, high: 175 },
        'Shampoo': { low: 149, mid: 249, high: 399 },
        'Floor Cleaner': { low: 79, mid: 129, high: 199 },
        'default': { low: 199, mid: 349, high: 549 }
    },

    // Store-level data (simulated dunhumby style)
    storeData: {
        zones: ['North', 'South', 'East', 'West', 'Central'],
        formats: ['Hypermarket', 'Supermarket', 'Express', 'Online'],
        footfallTrends: {
            weekday: { morning: 0.6, afternoon: 0.8, evening: 1.2, night: 0.7 },
            weekend: { morning: 0.9, afternoon: 1.4, evening: 1.5, night: 0.8 }
        }
    },

    /**
     * Generate comprehensive product insights
     */
    getProductInsights(productName, category = null) {
        // Auto-detect category if not provided
        if (!category) {
            category = this.detectCategory(productName);
        }
        
        const cat = this.categories[category] || this.categories['food'];
        const region = cat.topRegions[Math.floor(Math.random() * 3)];
        const salesLift = (15 + Math.random() * 25).toFixed(1);
        const inventoryUnits = Math.floor(50 + Math.random() * 200);
        const competitorCount = Math.floor(3 + Math.random() * 5);
        
        // Calculate time-based metrics
        const currentHour = new Date().getHours();
        const isWeekend = [0, 6].includes(new Date().getDay());
        const timeSlot = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : currentHour < 21 ? 'evening' : 'night';
        const footfallMultiplier = this.storeData.footfallTrends[isWeekend ? 'weekend' : 'weekday'][timeSlot];

        // Generate realistic metrics
        const baseCTR = cat.avgCTR;
        const adjustedCTR = (baseCTR * footfallMultiplier * (0.9 + Math.random() * 0.3)).toFixed(2);
        const predictedROAS = (cat.avgROAS * (0.85 + Math.random() * 0.4)).toFixed(2);
        
        return {
            product: productName,
            category: cat.name,
            categoryKey: category,
            timestamp: new Date().toISOString(),
            
            // Sales Performance
            salesPerformance: {
                weeklyGrowth: `+${salesLift}%`,
                topRegion: region,
                topRegionLift: `+${(parseInt(salesLift) + 5 + Math.random() * 10).toFixed(0)}%`,
                peakTime: cat.peakHours[0],
                peakDay: isWeekend ? 'Weekend' : 'Weekday',
                vsCategory: `${Math.random() > 0.5 ? '+' : ''}${(Math.random() * 20 - 5).toFixed(1)}%`,
                trend: Math.random() > 0.3 ? 'rising' : 'stable'
            },

            // Inventory Intelligence
            inventory: {
                currentStock: inventoryUnits,
                stockStatus: inventoryUnits < 50 ? 'critical' : inventoryUnits < 100 ? 'low' : 'healthy',
                lowStockAlert: inventoryUnits < 75,
                restockIn: inventoryUnits < 75 ? `${Math.floor(1 + Math.random() * 3)} days` : 'N/A',
                turnoverRate: (2 + Math.random() * 3).toFixed(1),
                daysOfStock: Math.floor(inventoryUnits / (5 + Math.random() * 10))
            },

            // Competitor Intelligence
            competitorData: {
                pricePosition: Math.random() > 0.5 ? 'Below Market' : 'At Market',
                competitorCount: competitorCount,
                marketShare: `${(8 + Math.random() * 12).toFixed(1)}%`,
                priceIndex: (95 + Math.random() * 15).toFixed(0),
                topCompetitors: cat.topBrands.slice(0, 3)
            },

            // Customer Insights
            customerInsights: {
                avgBasketSize: `₹${cat.avgBasketSize}`,
                repeatPurchase: `${(cat.repeatPurchaseRate * 100).toFixed(0)}%`,
                crossSellOpportunity: this.getCrossSellProducts(category),
                customerSegment: this.getCustomerSegment(),
                loyaltyTier: Math.random() > 0.6 ? 'Premium' : 'Standard'
            },

            // Performance Predictions
            predictions: {
                predictedCTR: adjustedCTR,
                categoryAvgCTR: baseCTR.toFixed(2),
                predictedROAS: predictedROAS,
                confidence: Math.floor(75 + Math.random() * 20),
                vsAverage: ((adjustedCTR - baseCTR) / baseCTR * 100).toFixed(0)
            },

            // AI Recommendations
            recommendations: this.generateRecommendations(category, cat, inventoryUnits, adjustedCTR),
            
            // Dynamic Badges Suggestions
            suggestedBadges: this.getSuggestedBadges(inventoryUnits, salesLift, cat)
        };
    },

    /**
     * Auto-detect product category from name
     */
    detectCategory(productName) {
        const name = productName.toLowerCase();
        
        if (/oil|motor|car|auto|tyre|tire|wash/.test(name)) return 'automotive';
        if (/drink|juice|water|coffee|tea|cola|energy/.test(name)) return 'beverage';
        if (/snack|food|biscuit|chips|chocolate|sweet/.test(name)) return 'food';
        if (/shampoo|soap|cream|lotion|beauty|skin|hair/.test(name)) return 'personal_care';
        if (/clean|wash|detergent|floor|toilet|kitchen/.test(name)) return 'household';
        if (/phone|laptop|gadget|speaker|headphone|electronic/.test(name)) return 'electronics';
        if (/vitamin|protein|health|supplement|ayurvedic/.test(name)) return 'health';
        
        return 'food'; // default
    },

    /**
     * Generate AI-powered recommendations
     */
    generateRecommendations(category, catData, inventory, ctr) {
        const recommendations = [];
        
        // Region-based recommendation
        recommendations.push({
            type: 'targeting',
            icon: '🎯',
            text: `Target ${catData.topRegions[0]} region for ${(15 + Math.random() * 10).toFixed(0)}% higher engagement`,
            impact: '+15-25% CTR'
        });
        
        // Time-based recommendation
        recommendations.push({
            type: 'scheduling',
            icon: '⏰',
            text: `Schedule ads during ${catData.peakHours[0]} for peak visibility`,
            impact: '+12% reach'
        });
        
        // Inventory-based recommendation
        if (inventory < 100) {
            recommendations.push({
                type: 'urgency',
                icon: '🔥',
                text: `Add "Limited Stock" badge - only ${inventory} units left`,
                impact: '+23% conversion'
            });
        }
        
        // Performance-based recommendations
        if (parseFloat(ctr) < catData.avgCTR) {
            recommendations.push({
                type: 'creative',
                icon: '🎨',
                text: 'Add customer rating badge to improve trust',
                impact: '+18% CTR'
            });
        }
        
        // Category-specific recommendations
        const categoryRecs = {
            'food': { icon: '🍽️', text: 'Use "Bestseller" badge for social proof', impact: '+20% conversion' },
            'beverage': { icon: '❄️', text: 'Highlight "Refreshing" for summer months', impact: '+15% engagement' },
            'personal_care': { icon: '✨', text: 'Add "Natural Ingredients" callout', impact: '+22% trust' },
            'household': { icon: '🏠', text: 'Show "Family Size" value proposition', impact: '+18% cart size' },
            'automotive': { icon: '🚗', text: 'Display "Professional Grade" quality badge', impact: '+25% premium perception' },
            'electronics': { icon: '📱', text: 'Add "Free Shipping" badge if applicable', impact: '+30% conversion' },
            'health': { icon: '💪', text: 'Show "Certified" trust indicators', impact: '+28% conversion' }
        };
        
        if (categoryRecs[category]) {
            recommendations.push({
                type: 'category',
                ...categoryRecs[category]
            });
        }
        
        // Color recommendation
        recommendations.push({
            type: 'design',
            icon: '🎨',
            text: 'Green backgrounds perform 15% better in this category',
            impact: '+15% CTR'
        });
        
        return recommendations.slice(0, 5); // Return top 5
    },

    /**
     * Get suggested dynamic badges
     */
    getSuggestedBadges(inventory, salesLift, catData) {
        const badges = [];
        
        // Urgency badges
        if (inventory < 50) {
            badges.push({
                type: 'scarcity',
                text: `Only ${inventory} Left!`,
                priority: 'high',
                color: '#ef4444'
            });
        } else if (inventory < 100) {
            badges.push({
                type: 'scarcity',
                text: 'Selling Fast!',
                priority: 'medium',
                color: '#f97316'
            });
        }
        
        // Social proof badges
        if (parseFloat(salesLift) > 20) {
            badges.push({
                type: 'social',
                text: 'Trending Now 📈',
                priority: 'high',
                color: '#22c55e'
            });
        }
        
        // Value badges
        badges.push({
            type: 'value',
            text: 'Best Value',
            priority: 'medium',
            color: '#3b82f6'
        });
        
        // Trust badges
        badges.push({
            type: 'trust',
            text: 'Verified Quality ✓',
            priority: 'low',
            color: '#0891b2'
        });
        
        return badges;
    },

    /**
     * Get cross-sell product suggestions
     */
    getCrossSellProducts(category) {
        const crossSell = {
            'food': ['Beverages', 'Snacks', 'Condiments'],
            'beverage': ['Snacks', 'Ice', 'Glasses'],
            'personal_care': ['Cosmetics', 'Accessories', 'Fragrances'],
            'household': ['Storage', 'Tools', 'Organizers'],
            'automotive': ['Accessories', 'Tools', 'Cleaning'],
            'electronics': ['Accessories', 'Cases', 'Chargers'],
            'health': ['Fitness', 'Nutrition', 'Equipment']
        };
        return crossSell[category] || crossSell['food'];
    },

    /**
     * Get customer segment
     */
    getCustomerSegment() {
        const segments = [
            'Value Seekers',
            'Premium Buyers',
            'Health Conscious',
            'Convenience Shoppers',
            'Brand Loyalists',
            'Deal Hunters'
        ];
        return segments[Math.floor(Math.random() * segments.length)];
    },

    /**
     * Get pricing intelligence
     */
    getPricingInsights(productName, basePrice) {
        const pricing = this.competitorPricing[productName] || this.competitorPricing['default'];
        
        const position = basePrice <= pricing.low ? 'lowest' : 
                        basePrice <= pricing.mid ? 'competitive' : 'premium';
        
        return {
            yourPrice: basePrice,
            marketLow: pricing.low,
            marketMid: pricing.mid,
            marketHigh: pricing.high,
            position: position,
            recommendation: position === 'lowest' ? 
                'Highlight "Best Price" badge' : 
                position === 'competitive' ?
                'Emphasize value proposition' :
                'Focus on premium quality messaging',
            suggestedBadge: position === 'lowest' ? 
                '💰 Lowest Price' : 
                position === 'competitive' ?
                '⭐ Great Value' :
                '👑 Premium Quality',
            savingsMessage: basePrice > pricing.low ? 
                `Compare at ₹${pricing.high}` : null
        };
    },

    /**
     * Get trending products in category
     */
    getTrendingProducts(category) {
        const trends = {
            'food': [
                { name: 'Organic Protein Bars', growth: '+45%' },
                { name: 'Millet Snacks', growth: '+38%' },
                { name: 'Ready-to-Eat Meals', growth: '+32%' }
            ],
            'beverage': [
                { name: 'Cold Brew Coffee', growth: '+52%' },
                { name: 'Flavored Water', growth: '+41%' },
                { name: 'Energy Drinks', growth: '+28%' }
            ],
            'personal_care': [
                { name: 'Natural Skincare', growth: '+48%' },
                { name: 'Beard Care', growth: '+35%' },
                { name: 'Organic Shampoo', growth: '+29%' }
            ],
            'household': [
                { name: 'Eco-friendly Cleaners', growth: '+55%' },
                { name: 'Smart Home Products', growth: '+42%' },
                { name: 'Storage Solutions', growth: '+25%' }
            ],
            'automotive': [
                { name: 'Premium Car Care Kits', growth: '+38%' },
                { name: 'Interior Accessories', growth: '+31%' },
                { name: 'Performance Parts', growth: '+27%' }
            ],
            'electronics': [
                { name: 'TWS Earbuds', growth: '+62%' },
                { name: 'Smartwatches', growth: '+48%' },
                { name: 'Portable Chargers', growth: '+35%' }
            ],
            'health': [
                { name: 'Immunity Boosters', growth: '+58%' },
                { name: 'Plant Protein', growth: '+45%' },
                { name: 'Sleep Supplements', growth: '+32%' }
            ]
        };
        return trends[category] || trends['food'];
    },

    /**
     * Get real-time promotion alerts
     */
    getPromotionAlerts(category) {
        const currentMonth = new Date().getMonth();
        const alerts = [];
        
        // Seasonal promotions
        if (currentMonth === 0) { // January
            alerts.push({
                type: 'seasonal',
                title: 'New Year Sale Active',
                suggestion: 'Add "New Year Special" badge',
                endDate: 'Jan 15'
            });
        } else if (currentMonth === 9 || currentMonth === 10) { // Oct-Nov
            alerts.push({
                type: 'festival',
                title: 'Festive Season',
                suggestion: 'Add "Diwali Offer" or "Festival Special" badge',
                endDate: 'Nov 15'
            });
        }
        
        // Category-specific promotions
        if (category === 'electronics' && (currentMonth === 6 || currentMonth === 7)) {
            alerts.push({
                type: 'category',
                title: 'Electronics Sale Season',
                suggestion: 'Highlight discounts prominently',
                endDate: 'Aug 31'
            });
        }
        
        // Weekend promotion
        if ([5, 6, 0].includes(new Date().getDay())) {
            alerts.push({
                type: 'weekend',
                title: 'Weekend Shopping Peak',
                suggestion: 'Use "Weekend Special" messaging',
                endDate: 'Sunday'
            });
        }
        
        return alerts;
    },

    /**
     * Get campaign performance benchmark
     */
    getCampaignBenchmarks(category) {
        const cat = this.categories[category] || this.categories['food'];
        
        return {
            category: cat.name,
            benchmarks: {
                ctr: {
                    poor: cat.avgCTR * 0.5,
                    average: cat.avgCTR,
                    good: cat.avgCTR * 1.3,
                    excellent: cat.avgCTR * 1.8
                },
                roas: {
                    poor: cat.avgROAS * 0.6,
                    average: cat.avgROAS,
                    good: cat.avgROAS * 1.2,
                    excellent: cat.avgROAS * 1.5
                },
                conversionRate: {
                    poor: 0.5,
                    average: 1.2,
                    good: 2.0,
                    excellent: 3.5
                }
            },
            topPerformers: {
                headline: 'Limited Time Offer',
                cta: 'Shop Now',
                badgeType: 'urgency',
                colorScheme: 'high-contrast'
            }
        };
    }
};

// Export for browser use
if (typeof window !== 'undefined') {
    window.RetailDataAPI = RetailDataAPI;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RetailDataAPI;
}

console.log('✅ RetailDataAPI loaded - dunhumby-style retail intelligence ready');
