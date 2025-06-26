// components/SettingsPage.tsx
"use client"

import React, { useState } from "react"
import { Switch } from "@headlessui/react"

interface NotificationsSettings {
  emailAlerts: boolean
  smsAlerts: boolean
  productUpdates: boolean
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends"
  searchable: boolean
}

interface SettingsState {
  username: string
  email: string
  changePassword: boolean
  currentPassword: string
  newPassword: string
  notifications: NotificationsSettings
  privacy: PrivacySettings
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    username: "",
    email: "",
    changePassword: false,
    currentPassword: "",
    newPassword: "",
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      productUpdates: true,
    },
    privacy: {
      profileVisibility: "public",
      searchable: true,
    },
  })

  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, checked } = e.target
    if (name === "username" || name === "email") {
      setSettings(prev => ({ ...prev, [name]: value }))
    } else if (name === "currentPassword" || name === "newPassword") {
      setSettings(prev => ({ ...prev, [name]: value }))
    } else if (name === "searchable") {
      setSettings(prev => ({
        ...prev,
        privacy: { ...prev.privacy, searchable: checked }
      }))
    }
  }

  // Handle select change for profile visibility
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === "profileVisibility") {
      setSettings(prev => ({
        ...prev,
        privacy: { ...prev.privacy, profileVisibility: value as PrivacySettings["profileVisibility"] }
      }))
    }
  }

  // Handle change password toggle
  const handleChangePasswordToggle = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, changePassword: enabled }))
  }

  // Handle notification toggles
  const handleNotificationToggle = (key: keyof NotificationsSettings) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Settings saved", settings)
    // integrate save logic here
  }

  return (
    <div className="min-h-screen bg-stone-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-stone-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Account Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Account</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block mb-1">Username</label>
                <input
                  id="username"
                  name="username"
                  value={settings.username}
                  onChange={handleInputChange}
                  className="w-full bg-stone-700 border border-stone-600 rounded p-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  className="w-full bg-stone-700 border border-stone-600 rounded p-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.changePassword}
                  onChange={handleChangePasswordToggle}
                  className={`${settings.changePassword ? 'bg-yellow-500' : 'bg-stone-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${settings.changePassword ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                  />
                </Switch>
                <span>Change Password</span>
              </div>
              {settings.changePassword && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label htmlFor="currentPassword" className="block mb-1">Current Password</label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={settings.currentPassword}
                      onChange={handleInputChange}
                      className="w-full bg-stone-700 border border-stone-600 rounded p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block mb-1">New Password</label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={settings.newPassword}
                      onChange={handleInputChange}
                      className="w-full bg-stone-700 border border-stone-600 rounded p-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Notifications Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, val]) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={key}
                    checked={val}
                    onChange={() => handleNotificationToggle(key as keyof NotificationsSettings)}
                    className="h-4 w-4"
                  />
                  <label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Privacy</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="profileVisibility" className="block mb-1">Profile Visibility</label>
                <select
                  id="profileVisibility"
                  name="profileVisibility"
                  value={settings.privacy.profileVisibility}
                  onChange={handleSelectChange}
                  className="w-full bg-stone-700 border border-stone-600 rounded p-2"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="searchable"
                  name="searchable"
                  type="checkbox"
                  checked={settings.privacy.searchable}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <label htmlFor="searchable">Allow others to find me</label>
              </div>
            </div>
          </section>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-semibold py-3 rounded"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SettingsPage
