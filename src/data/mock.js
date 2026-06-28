// ===== C STUDIO Reserve モックデータ =====

export const store = {
  name: 'C STUDIO 熊本店',
  company: '株式会社シー・スタジオ熊本',
  role: '加盟店オーナー',
  owner: '中川 翔',
  email: 'kumamoto@cstudio.example.jp',
  phone: '096-123-4567',
  address: '熊本県熊本市中央区下通1-2-3 C STUDIOビル 2F',
  url: 'reserve.cstudio.jp/kumamoto',
  hours: '10:00〜19:00',
  holiday: '毎週水曜日',
}

export const booths = [
  {
    id: 'b1', name: 'セルフブースA', type: 'セルフブース', capacity: 4,
    menuCount: 3, todayCount: 5, published: true, autoAssign: true,
    nominate: true, maintenance: false,
  },
  {
    id: 'b2', name: 'セルフブースB', type: 'セルフブース', capacity: 4,
    menuCount: 3, todayCount: 3, published: true, autoAssign: true,
    nominate: false, maintenance: false,
  },
  {
    id: 'b3', name: '白壁スタジオ', type: '撮影スタジオ', capacity: 8,
    menuCount: 4, todayCount: 2, published: true, autoAssign: false,
    nominate: true, maintenance: false,
  },
  {
    id: 'b4', name: 'ペット対応ブース', type: 'セルフブース', capacity: 3,
    menuCount: 2, todayCount: 4, published: true, autoAssign: true,
    nominate: false, maintenance: true,
  },
]

export const menus = [
  {
    id: 'm1', name: 'セルフ写真30分プラン', major: 'セルフ写真', middle: 'カップル',
    price: 3500, taxIncluded: true, displayTime: 30, realTime: 45,
    bufferBefore: 5, bufferAfter: 10, resource: 'セルフブース', booth: ['セルフブースA', 'セルフブースB'],
    capacity: 4, prepay: 'ON', method: '全額事前決済', deposit: 0, local: false,
    cancelFee: '当日100%', published: true, approval: '本部承認済み', scope: '本部共通',
  },
  {
    id: 'm2', name: 'セルフ写真60分プラン', major: 'セルフ写真', middle: '友達',
    price: 6000, taxIncluded: true, displayTime: 60, realTime: 75,
    bufferBefore: 5, bufferAfter: 10, resource: 'セルフブース', booth: ['セルフブースA', 'セルフブースB'],
    capacity: 4, prepay: 'ON', method: '全額事前決済', deposit: 0, local: false,
    cancelFee: '当日100%', published: true, approval: '本部承認済み', scope: '本部共通',
  },
  {
    id: 'm3', name: '七五三スタンダード撮影', major: '七五三', middle: '七五三スタンダード',
    price: 33000, taxIncluded: true, displayTime: 60, realTime: 90,
    bufferBefore: 10, bufferAfter: 20, resource: '白壁スタジオ・カメラマン', booth: ['白壁スタジオ'],
    capacity: 6, prepay: '予約金のみ', method: '予約金のみ事前決済', deposit: 10000, local: true,
    cancelFee: '前日50%', published: true, approval: '本部承認済み', scope: '本部共通',
  },
  {
    id: 'm4', name: 'ペットセルフフォト', major: 'ペット撮影', middle: 'ペット',
    price: 5500, taxIncluded: true, displayTime: 30, realTime: 60,
    bufferBefore: 10, bufferAfter: 20, resource: 'ペット対応ブース', booth: ['ペット対応ブース'],
    capacity: 3, prepay: 'ON', method: '全額事前決済', deposit: 0, local: false,
    cancelFee: '当日100%', published: true, approval: '承認待ち', scope: '店舗独自',
  },
  {
    id: 'm5', name: 'スタジオレンタル60分', major: 'スタジオレンタル', middle: 'ビジネスプロフィール',
    price: 8800, taxIncluded: true, displayTime: 60, realTime: 75,
    bufferBefore: 5, bufferAfter: 10, resource: '白壁スタジオ', booth: ['白壁スタジオ'],
    capacity: 8, prepay: 'ON', method: '全額事前決済', deposit: 0, local: true,
    cancelFee: '前日50%', published: false, approval: '本部承認済み', scope: '店舗独自',
  },
]

export const reservations = [
  {
    id: 'R-20260701-001', datetime: '2026/07/01 10:00', date: '2026/07/01', time: '10:00〜10:45',
    customer: '山田 美咲', menu: 'セルフ写真30分プラン', booth: 'セルフブースA',
    status: '予約確定', pay: '決済完了', amount: 3500, phone: '090-1111-2222',
    email: 'misaki@example.com', method: 'クレジットカード', memo: 'カップルでの来店。記念日撮影希望。',
  },
  {
    id: 'R-20260701-002', datetime: '2026/07/01 11:00', date: '2026/07/01', time: '11:00〜12:00',
    customer: '田中 健', menu: 'ペットセルフフォト', booth: 'ペット対応ブース',
    status: '予約確定', pay: '決済完了', amount: 5500, phone: '080-3333-4444',
    email: 'ken.tanaka@example.com', method: 'クレジットカード', memo: '小型犬1匹同伴。',
  },
  {
    id: 'R-20260701-003', datetime: '2026/07/01 13:00', date: '2026/07/01', time: '13:00〜14:30',
    customer: '佐藤 由美', menu: '七五三スタンダード撮影', booth: '白壁スタジオ',
    status: '仮予約', pay: '決済待ち', amount: 33000, phone: '090-5555-6666',
    email: 'yumi.sato@example.com', method: '予約金10,000円', memo: '7歳女児。着物レンタル相談あり。',
  },
  {
    id: 'R-20260701-004', datetime: '2026/07/01 15:00', date: '2026/07/01', time: '15:00〜16:15',
    customer: '鈴木 翔太', menu: 'セルフ写真60分プラン', booth: 'セルフブースB',
    status: 'キャンセル', pay: '一部返金', amount: 6000, phone: '070-7777-8888',
    email: 'shota.s@example.com', method: 'クレジットカード', memo: '前日キャンセル。50%キャンセル料適用。',
  },
  {
    id: 'R-20260702-005', datetime: '2026/07/02 10:30', date: '2026/07/02', time: '10:30〜11:45',
    customer: '高橋 彩', menu: 'スタジオレンタル60分', booth: '白壁スタジオ',
    status: '来店済み', pay: '決済完了', amount: 8800, phone: '090-9999-0000',
    email: 'aya.t@example.com', method: 'クレジットカード', memo: '物販撮影での利用。',
  },
  {
    id: 'R-20260702-006', datetime: '2026/07/02 14:00', date: '2026/07/02', time: '14:00〜14:45',
    customer: '伊藤 大輔', menu: 'セルフ写真30分プラン', booth: 'セルフブースA',
    status: '無断キャンセル', pay: '現地決済', amount: 3500, phone: '080-1212-3434',
    email: 'daisuke.i@example.com', method: '現地決済', memo: '連絡なし不来店。',
  },
]

export const customers = [
  {
    id: 'c1', name: '山田 美咲', phone: '090-1111-2222', email: 'misaki@example.com',
    visits: 6, total: 24800, lastVisit: '2026/06/20', tags: ['リピーター', 'カップル'], memo: 'いつも丁寧。',
  },
  {
    id: 'c2', name: '田中 健', phone: '080-3333-4444', email: 'ken.tanaka@example.com',
    visits: 3, total: 16500, lastVisit: '2026/06/15', tags: ['ペット'], memo: '愛犬と来店。',
  },
  {
    id: 'c3', name: '佐藤 由美', phone: '090-5555-6666', email: 'yumi.sato@example.com',
    visits: 1, total: 0, lastVisit: '—', tags: ['七五三', '新規'], memo: '初回予約。',
  },
  {
    id: 'c4', name: '高橋 彩', phone: '090-9999-0000', email: 'aya.t@example.com',
    visits: 12, total: 98600, lastVisit: '2026/06/25', tags: ['VIP', '法人'], memo: '物販撮影で定期利用。',
  },
  {
    id: 'c5', name: '鈴木 翔太', phone: '070-7777-8888', email: 'shota.s@example.com',
    visits: 2, total: 6000, lastVisit: '2026/05/30', tags: ['要注意'], memo: 'キャンセル歴あり。',
  },
]

export const payments = [
  { id: 'P-1001', datetime: '2026/06/28 10:05', customer: '山田 美咲', resId: 'R-20260701-001', menu: 'セルフ写真30分プラン', amount: 3500, method: 'クレジットカード', status: '決済完了', refund: '—' },
  { id: 'P-1002', datetime: '2026/06/28 11:10', customer: '田中 健', resId: 'R-20260701-002', menu: 'ペットセルフフォト', amount: 5500, method: 'クレジットカード', status: '決済完了', refund: '—' },
  { id: 'P-1003', datetime: '2026/06/27 13:20', customer: '佐藤 由美', resId: 'R-20260701-003', menu: '七五三スタンダード撮影', amount: 10000, method: '予約金（事前）', status: '決済完了', refund: '—' },
  { id: 'P-1004', datetime: '2026/06/26 15:40', customer: '鈴木 翔太', resId: 'R-20260701-004', menu: 'セルフ写真60分プラン', amount: 6000, method: 'クレジットカード', status: '一部返金', refund: '3,000円返金済' },
  { id: 'P-1005', datetime: '2026/06/25 10:35', customer: '高橋 彩', resId: 'R-20260702-005', menu: 'スタジオレンタル60分', amount: 8800, method: 'クレジットカード', status: '決済完了', refund: '—' },
]

export const announcements = [
  { id: 'a1', date: '2026/06/27', tag: '重要', title: '【夏季キャンペーン】セルフ写真メニューの本部共通価格改定について', body: '8月1日より本部共通メニューの表示価格を改定します。各店舗の事前決済設定をご確認ください。' },
  { id: 'a2', date: '2026/06/20', tag: 'お知らせ', title: 'Stripe手数料率の改定（2026年7月分より）', body: '決済手数料が3.6%→3.5%に変更されます。' },
  { id: 'a3', date: '2026/06/12', tag: 'メンテ', title: '予約システム定期メンテナンスのお知らせ', body: '7月3日 02:00〜04:00、予約受付を一時停止します。' },
]

export const popularMenus = [
  { name: 'セルフ写真30分プラン', count: 142, rate: 100 },
  { name: 'セルフ写真60分プラン', count: 98, rate: 69 },
  { name: 'ペットセルフフォト', count: 71, rate: 50 },
  { name: 'スタジオレンタル60分', count: 44, rate: 31 },
  { name: '七五三スタンダード撮影', count: 28, rate: 20 },
]

export const dailySales = [
  { day: '6/22', value: 42000 }, { day: '6/23', value: 58000 },
  { day: '6/24', value: 31000 }, { day: '6/25', value: 76500 },
  { day: '6/26', value: 64000 }, { day: '6/27', value: 88000 },
  { day: '6/28', value: 52500 },
]

export const stripe = {
  status: '接続済み',
  accountName: 'C STUDIO Kumamoto LLC',
  accountId: 'acct_1QxC5tDk8mKumamotO',
  payoutEnabled: true,
  chargesEnabled: true,
  lastSync: '2026/06/28 09:42',
  nextPayout: '2026/07/03',
  errorCount: 1,
  brands: ['Visa', 'Mastercard', 'JCB', 'American Express', 'Apple Pay', 'Google Pay'],
  payoutSchedule: '毎週金曜（週次・自動）',
  feeRate: '3.5% + 0円 / 件',
}
