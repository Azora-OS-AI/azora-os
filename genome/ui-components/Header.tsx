/**
 * AZORA PROPRIETARY LICENSE
 * 
 * Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
 * See LICENSE file for details.
 */

'use client'

import React from 'react'
import { Bell, Settings, Wallet, Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useState } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  showWallet?: boolean
  showNotifications?: boolean
  userInitials?: string
  userName?: string
  onMenuClick?: () => void
  onNotificationClick?: () => void
  onSettingsClick?: () => void
  onProfileClick?: () => void
}

export function Header({
  title,
  subtitle,
  showWallet = true,
  showNotifications = true,
  userInitials = 'AC',
  userName = 'User',
  onMenuClick,
  onNotificationClick,
  onSettingsClick,
  onProfileClick,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
          </div>
        </div>

        {/* Right: Actions and Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Wallet */}
          {showWallet && (
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden sm:flex"
            >
              <Wallet className="h-5 w-5 text-primary-600" />
            </Button>
          )}

          {/* Notifications */}
          {showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onNotificationClick}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger-500" />
            </Button>
          )}

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="hidden sm:flex"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Profile */}
          <div className="hidden border-l border-neutral-200 pl-4 sm:flex sm:items-center sm:gap-3 dark:border-neutral-800">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Welcome,</p>
              <p className="text-xs text-primary-600">{userName}</p>
            </div>
            <button
              onClick={onProfileClick}
              className="rounded-lg transition-transform hover:scale-105"
            >
              <Avatar className="h-10 w-10 border-2 border-primary-200 dark:border-primary-800">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
