/**
 * AZORA PROPRIETARY LICENSE
 * 
 * Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
 * See LICENSE file for details.
 */

'use client'

import React, { useState } from 'react'
import {
  ShoppingCart,
  TrendingUp,
  Star,
  Users,
  Search,
  Filter,
  ChevronRight,
  Heart,
  Share2,
  ShieldCheck,
  MessageCircle,
  Clock,
  Zap,
} from 'lucide-react'

/**
 * Azora Forge - P2P Marketplace Dashboard
 * 
 * The marketplace platform providing:
 * - Digital goods listing
 * - AZR token payments
 * - Seller & buyer dashboards
 * - Transaction escrow
 * - Review & rating system
 * - Dispute resolution
 */
export default function MarketplaceDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [userRole, setUserRole] = useState('buyer') // buyer | seller

  const [marketplaceStats] = useState({
    activeListings: 12450,
    totalTransactions: 48230,
    buyers: 25630,
    sellers: 2847,
    totalVolume: '$8.5M AZR',
    averageRating: 4.8,
  })

  const [products] = useState([
    {
      id: 1,
      title: 'Constitutional AI Ethics Course',
      seller: 'Dr. Azora Prime',
      price: 125,
      currency: 'aZAR',
      rating: 4.9,
      reviews: 347,
      image: '📚',
      category: 'education',
      sales: 2340,
      verified: true,
    },
    {
      id: 2,
      title: 'Blockchain Development Kit',
      seller: 'Tech Innovations Ltd',
      price: 450,
      currency: 'aZAR',
      rating: 4.7,
      reviews: 189,
      image: '⛓️',
      category: 'tools',
      sales: 1230,
      verified: true,
    },
    {
      id: 3,
      title: 'Economic Intelligence Dashboard',
      seller: 'Analytics Pro',
      price: 890,
      currency: 'aZAR',
      rating: 4.6,
      reviews: 92,
      image: '📊',
      category: 'software',
      sales: 456,
      verified: true,
    },
    {
      id: 4,
      title: 'Global Compliance Template Library',
      seller: 'Legal Tech Suite',
      price: 250,
      currency: 'aZAR',
      rating: 4.8,
      reviews: 234,
      image: '⚖️',
      category: 'legal',
      sales: 1890,
      verified: true,
    },
  ])

  const [categories] = useState([
    { id: 'all', name: 'All Products', count: 12450 },
    { id: 'education', name: 'Education & Courses', count: 3420 },
    { id: 'software', name: 'Software & Tools', count: 2840 },
    { id: 'services', name: 'Professional Services', count: 2150 },
    { id: 'legal', name: 'Legal & Compliance', count: 1230 },
    { id: 'content', name: 'Digital Content', count: 2810 },
  ])

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent-100 p-2 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Azora Forge</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">P2P Marketplace for Digital Goods</p>
              </div>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <div className="rounded-lg border border-neutral-300 bg-white px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="text-sm font-medium bg-transparent"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller Dashboard</option>
                </select>
              </div>
              <button className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Marketplace Stats */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Active Listings</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{marketplaceStats.activeListings.toLocaleString()}</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Volume</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{marketplaceStats.totalVolume}</p>
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">+24% this month</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Active Sellers</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{marketplaceStats.sellers.toLocaleString()}</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Average Rating</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-3xl font-bold text-foreground">{marketplaceStats.averageRating}</p>
              <Star className="h-6 w-6 fill-accent-500 text-accent-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search for digital goods, courses, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-12 py-3 pl-12 text-foreground placeholder-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:placeholder-neutral-400"
            />
            <button className="absolute right-3 top-2.5 rounded-lg bg-primary-600 p-2 text-white hover:bg-primary-700">
              <Filter className="h-5 w-5" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary-600 text-white dark:bg-primary-500'
                    : 'border border-neutral-300 text-neutral-600 hover:border-primary-300 hover:text-primary-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {cat.name}
                <span className="ml-2 text-xs opacity-75">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Listings */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-foreground">Featured Products</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group overflow-hidden rounded-xl border border-neutral-200 bg-white/50 backdrop-blur transition-all hover:border-primary-300 hover:shadow-lg dark:border-neutral-800 dark:hover:border-primary-600">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 px-6 py-12 text-center dark:from-primary-900 dark:to-accent-900">
                  <div className="text-6xl transition-transform duration-300 group-hover:scale-110">
                    {product.image}
                  </div>
                  <button className="absolute top-3 right-3 rounded-lg bg-white/80 p-2 backdrop-blur hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-800">
                    <Heart className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground line-clamp-2">{product.title}</h3>
                    {product.verified && <ShieldCheck className="h-4 w-4 flex-shrink-0 text-emerald-600" />}
                  </div>

                  <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">by {product.seller}</p>

                  {/* Rating */}
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-accent-500 text-accent-500' : 'text-neutral-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-foreground">{product.price}</p>
                      <p className="text-sm text-accent-600 dark:text-accent-400">{product.currency}</p>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{product.sales.toLocaleString()} sales</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 rounded-lg bg-primary-600 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600">
                      View Details
                    </button>
                    <button className="rounded-lg border border-neutral-300 bg-white p-2 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
                      <Share2 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust & Security Section */}
        <div className="mt-16 rounded-xl border border-neutral-200 bg-white/50 p-8 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Forge Trust & Security</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex gap-4">
              <ShieldCheck className="h-8 w-8 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="font-semibold text-foreground">Secure Escrow</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">All transactions protected by blockchain escrow</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Zap className="h-8 w-8 flex-shrink-0 text-primary-600 dark:text-primary-400" />
              <div>
                <h3 className="font-semibold text-foreground">Instant Settlement</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">AZR payments settle in seconds</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Users className="h-8 w-8 flex-shrink-0 text-accent-600 dark:text-accent-400" />
              <div>
                <h3 className="font-semibold text-foreground">Verified Sellers</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">All sellers verified and rated by community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
