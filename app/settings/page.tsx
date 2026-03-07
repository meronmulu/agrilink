'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Camera, Save, Loader2 } from 'lucide-react'
import api from '@/axios'

interface UserProfile {
  id?: string
  name?: string
  email?: string
  phone?: string
  role?: string
  location?: string
  bio?: string
  avatarUrl?: string
  language?: string
  notifications?: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

export default function SettingsPage() {
  const { t } = useLanguage()
  const { user: authUser } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    language: 'en',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const userData = response.data
        setProfile({
          id: userData.id || userData._id,
          name: userData.name || userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || userData.userRole || '',
          location: userData.location || userData.address || '',
          bio: userData.bio || userData.description || '',
          avatarUrl: userData.avatarUrl || userData.avatar || '',
          language: userData.language || 'en',
          notifications: userData.notifications || {
            email: true,
            sms: false,
            push: true
          }
        })
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        setMessage({ type: 'error', text: 'Failed to load profile data' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (type: 'email' | 'sms' | 'push', checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications!,
        [type]: checked
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const updateData = {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        language: profile.language,
        notifications: profile.notifications
      }

      await api.put('/auth/profile', updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setMessage({ type: 'success', text: 'Profile updated successfully!' })

      // Update local storage if needed
      localStorage.setItem('userLanguage', profile.language || 'en')

    } catch (error: any) {
      console.error('Failed to update profile:', error)
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="pt-24 px-4 md:px-12 min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading profile...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="pt-24 px-4 md:px-12 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">{t('settings_title') || 'Settings'}</h1>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera size={20} />
                  {t('settings_profile_picture') || 'Profile Picture'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-gray-400" />
                  )}
                </div>
                <Button variant="outline" size="sm">
                  {t('settings_change_photo') || 'Change Photo'}
                </Button>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t('settings_profile_info') || 'Profile Information'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('signup_name_label') || 'Full Name'}</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('signup_email_label') || 'Email Address'}</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <p className="text-xs text-gray-500">{t('settings_email_note') || 'Email cannot be changed'}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('signup_phone_label') || 'Phone Number'}</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+251912033566"
                        className="pl-10"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">{t('signup_location_label') || 'Location'}</Label>
                    <div className="relative">
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, Region"
                        className="pl-10"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">{t('settings_bio') || 'Bio'}</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">{t('settings_language') || 'Preferred Language'}</Label>
                  <Select value={profile.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                      <SelectItem value="om">Afaan Oromoo (Oromo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>{t('settings_notifications') || 'Notification Preferences'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">{t('settings_email_notifications') || 'Email Notifications'}</Label>
                      <p className="text-sm text-gray-500">{t('settings_email_desc') || 'Receive updates via email'}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.notifications?.email}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">{t('settings_sms_notifications') || 'SMS Notifications'}</Label>
                      <p className="text-sm text-gray-500">{t('settings_sms_desc') || 'Receive updates via SMS'}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.notifications?.sms}
                      onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">{t('settings_push_notifications') || 'Push Notifications'}</Label>
                      <p className="text-sm text-gray-500">{t('settings_push_desc') || 'Receive push notifications'}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.notifications?.push}
                      onChange={(e) => handleNotificationChange('push', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  {t('settings_saving') || 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="mr-2" size={16} />
                  {t('settings_save_changes') || 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}