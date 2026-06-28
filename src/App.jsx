import React, { useState, useCallback, useRef } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { Toast } from './components/ui'

import Dashboard from './screens/Dashboard'
import Reservations from './screens/Reservations'
import Booths from './screens/Booths'
import Menus from './screens/Menus'
import SiteSettings from './screens/SiteSettings'
import Prepay from './screens/Prepay'
import Stripe from './screens/Stripe'
import Sales from './screens/Sales'
import Customers from './screens/Customers'
import StoreSettings from './screens/StoreSettings'
import Calendar from './screens/Calendar'

const PAGES = {
  dashboard: { title: 'ダッシュボード', crumb: ['ホーム', 'ダッシュボード'], C: Dashboard },
  reservations: { title: '予約管理', crumb: ['ホーム', '予約管理'], C: Reservations },
  calendar: { title: 'Googleカレンダー連携', crumb: ['ホーム', '連携', 'Googleカレンダー'], C: Calendar },
  booths: { title: 'ブース・スペース管理', crumb: ['ホーム', 'ブース・スペース'], C: Booths },
  menus: { title: 'メニュー管理', crumb: ['ホーム', 'メニュー管理'], C: Menus },
  site: { title: '予約サイト設定', crumb: ['ホーム', '予約サイト設定'], C: SiteSettings },
  prepay: { title: '事前決済設定', crumb: ['ホーム', '決済', '事前決済設定'], C: Prepay },
  stripe: { title: 'Stripe接続設定', crumb: ['ホーム', '決済', 'Stripe接続'], C: Stripe },
  sales: { title: '売上管理', crumb: ['ホーム', '売上管理'], C: Sales },
  customers: { title: '顧客管理', crumb: ['ホーム', '顧客管理'], C: Customers },
  settings: { title: '店舗設定', crumb: ['ホーム', '店舗設定'], C: StoreSettings },
}

export default function App() {
  // 最初に表示する画面は「事前決済設定」
  const [current, setCurrent] = useState('prepay')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const showToast = useCallback((message, type = 'success') => {
    clearTimeout(timer.current)
    setToast({ message, type, id: Date.now() })
    timer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const navigate = useCallback((key) => {
    setCurrent(key)
    setMobileOpen(false)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }, [])

  const page = PAGES[current]
  const Screen = page.C

  return (
    <div className="min-h-screen flex bg-canvas">
      <Sidebar current={current} onNavigate={navigate} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header title={page.title} breadcrumb={page.crumb} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 max-w-[1400px] w-full mx-auto">
          <Screen showToast={showToast} navigate={navigate} />
        </main>
      </div>
      <Toast toast={toast} />
    </div>
  )
}
