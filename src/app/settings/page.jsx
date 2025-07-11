'use client'

import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSelector } from 'react-redux'
import { ro } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useNotificationSetting } from '@/services/general'
import { useQueryClient } from '@tanstack/react-query'
import { useNotificationContext } from '../context/ShowNotification'
import api from '@/services/api'

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationContext();
  const { userId } = useSelector(state => state.auth);
  const [notificationSettings, setNotificationSettings] = useState({
    newArrivalsNotifications: true,
    saleAlerts: false,
    securityUpdates: true,
    orderStatusUpdate: true,
    exclusiveOffers: false,
    appUpdatesAndNews: false,
    rewards: true,
  })
  const { data: notificationData } = useNotificationSetting(router);
  useEffect(() => {
    if (notificationData?.data) {
      setNotificationSettings(notificationData?.data);
    }
  }, [notificationData]);

  useEffect(() => {
    queryClient.invalidateQueries['notificationSettings']
  }, []);


  const handleToggle = async (key) => {

    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    const payload = {
      userId,
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };

    try {
      const res = await api.post(
        '/api/Account/UpdateNotificationSettingAsync',
        payload
      );

      if (!res?.data?.isSuccess) throw new Error(res?.data?.message);

      showNotification?.({
        message: res.data.message || 'Notification setting updated.',
        variant: 'success',
      });
    } catch (err) {
      setNotificationSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
      showNotification?.({
        message:
          err?.response?.data?.message ||
          err.message ||
          'Failed to update setting.',
        variant: 'error',
      });
    }
  };

  const settingsTabs = [
    { key: 'notifications', label: 'Notifications' },
    { key: 'addresses', label: 'Manage Addresses' },
    { key: 'payments', label: 'Payment Methods' },
    { key: 'language', label: 'Language' },
    { key: 'privacy', label: 'Privacy Policy' },
    { key: 'terms', label: 'Terms & Conditions' },
    { key: 'support', label: 'Help & Support' },
  ]

  return (
    <div className='container p-10'>
      <h4 className="font-semibold text-2xl mb-6">Settings</h4>

      <Tabs defaultValue="notifications" className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-8 gap-4 sm:gap-5 lg:gap-10">
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <TabsList className="flex flex-col items-start w-full h-full bg-transparent sm:border-r sm:pe-4">
            {settingsTabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="hover:!text-primary w-full justify-start data-[state=active]:!bg-primary/5 data-[state=active]:!text-primary"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="col-span-1 sm:col-span-3 lg:col-span-6">
          <div className='w-full'>
            <TabsContent value="notifications">
              <h2 className="text-lg font-semibold mb-4">Notifications</h2>
              <div className="space-y-4 bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
                {[
                  { key: 'newArrivalsNotifications', label: 'New Arrivals Notifications' },
                  { key: 'saleAlerts', label: 'Sale Alerts' },
                  { key: 'securityUpdates', label: 'Security Updates' },
                  { key: 'orderStatusUpdate', label: 'Order Status Update' },
                  { key: 'exclusiveOffers', label: 'Exclusive Offers' },
                  { key: 'appUpdatesAndNews', label: 'App Updates & News' },
                  { key: 'rewards', label: 'Rewards' },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between border-b pb-2 last:border-b-0"
                  >
                    <span>{label}</span>
                    <Switch
                      checked={notificationSettings[key]}
                      onCheckedChange={() => handleToggle(key)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="addresses">
              <h2 className="text-lg font-semibold mb-4">Manage Addresses</h2>
              <p>Address-related settings go here.</p>
            </TabsContent>

            <TabsContent value="payments">
              <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
              <p>Payment method configuration goes here.</p>
            </TabsContent>

            <TabsContent value="language">
              <h2 className="text-lg font-semibold mb-4">Language Settings</h2>
              <p>Language preferences go here.</p>
            </TabsContent>

            <TabsContent value="privacy">
              <h2 className="text-lg font-semibold mb-4">Privacy Policy</h2>
              <p>Your privacy details go here.</p>
            </TabsContent>

            <TabsContent value="terms">
              <h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
              <p>Terms and policies go here.</p>
            </TabsContent>

            <TabsContent value="support">
              <h2 className="text-lg font-semibold mb-4">Help & Support</h2>
              <p>Contact/help options go here.</p>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

export default Page
