import React, { useState } from 'react'
import { Card, CardHeader, Button, Badge, Toggle, Alert } from '../components/ui'
import { stripe } from '../data/mock'

const STATES = ['未接続', '接続済み', '審査中', '追加情報が必要', 'エラー']
const statusTone = { '未接続': 'gray', '接続済み': 'green', '審査中': 'blue', '追加情報が必要': 'orange', 'エラー': 'red' }

export default function Stripe({ showToast }) {
  const [status, setStatus] = useState(stripe.status) // demo: switch states
  const [testMode, setTestMode] = useState(true)
  const [testLog, setTestLog] = useState([
    { t: '2026/06/28 09:40', msg: 'テスト決済 ¥3,500 / Visa **** 4242', ok: true },
  ])

  const connected = status === '接続済み'
  const runTest = () => {
    setTestLog((l) => [{ t: '2026/06/28 10:0' + (l.length + 1), msg: `テスト決済 ¥3,500 / Visa **** 4242`, ok: true }, ...l])
    showToast('テスト決済が成功しました')
  }

  return (
    <div className="space-y-5">
      {/* Demo state switcher */}
      <Card className="p-4 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-ink-500">表示状態を切替（デモ用）:</span>
        {STATES.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${status === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-ink-600 border-slate-200 hover:border-slate-300'}`}>{s}</button>
        ))}
      </Card>

      {/* ===== Status card ===== */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#635BFF] grid place-items-center text-white font-bold text-lg">S</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-ink-900">Stripe 接続</h3>
                <Badge tone={statusTone[status]} dot>{status}</Badge>
              </div>
              <p className="text-[13px] text-ink-500 mt-0.5">オンライン決済・キャンセル料徴収・返金管理に利用します</p>
            </div>
          </div>
          {connected && <Badge tone="green" dot className="text-sm">接続済みバッジ</Badge>}
        </div>

        {connected && (
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Info label="アカウント名" value={stripe.accountName} />
            <Info label="StripeアカウントID" value={stripe.accountId} mono />
            <Info label="入金可能状態" value={<Badge tone="green" dot>有効</Badge>} />
            <Info label="決済受付可能状態" value={<Badge tone="green" dot>有効</Badge>} />
            <Info label="最終同期日時" value={stripe.lastSync} />
            <Info label="入金スケジュール" value={stripe.payoutSchedule} />
            <Info label="次回入金予定" value={stripe.nextPayout} />
            <Info label="手数料" value={stripe.feeRate} />
          </div>
        )}
      </Card>

      {/* ===== 未接続時 ===== */}
      {status === '未接続' && (
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 grid place-items-center mx-auto text-2xl">🔌</div>
            <h3 className="mt-4 text-lg font-bold text-ink-900">Stripeアカウントを接続しましょう</h3>
            <p className="mt-2 text-[13px] text-ink-500 leading-relaxed">Stripeと接続すると、予約時のオンライン決済、キャンセル料徴収、返金管理が利用できます。</p>
            <Button size="lg" className="mt-5 w-full" onClick={() => { setStatus('審査中'); showToast('Stripe接続を開始しました', 'info') }}>Stripeアカウントを接続する</Button>
          </div>
          <div className="mt-8 grid sm:grid-cols-4 gap-3 text-left">
            {['Stripeアカウント作成またはログイン', '事業者情報の登録', '入金口座の設定', 'C STUDIO Reserveとの接続完了'].map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white grid place-items-center text-xs font-bold mb-2">{i + 1}</div>
                <div className="text-[12px] text-ink-700 leading-snug">{s}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ===== 審査中 ===== */}
      {status === '審査中' && (
        <Card className="p-6"><Alert tone="blue" title="アカウントを審査中です">Stripeにて事業者情報を確認しています。通常1〜2営業日で完了します。完了するとオンライン決済が利用可能になります。</Alert></Card>
      )}

      {/* ===== エラー / 追加情報 ===== */}
      {(status === 'エラー' || status === '追加情報が必要') && (
        <Card className="p-6 space-y-3">
          <h3 className="text-sm font-semibold text-ink-900 mb-1">対応が必要な項目</h3>
          {[
            { t: '本人確認が未完了です', d: '代表者の本人確認書類をアップロードしてください' },
            { t: '入金口座の登録が必要です', d: '売上の入金先となる銀行口座を登録してください' },
            { t: '決済受付が一時停止されています', d: '追加情報の提出により再開できます' },
            { t: 'Stripe接続の再認証が必要です', d: 'セキュリティのため再認証を行ってください' },
          ].map((e, i) => (
            <div key={i} className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50/40 px-4 py-3">
              <div>
                <div className="text-[13px] font-semibold text-rose-700">⛔ {e.t}</div>
                <div className="text-[12px] text-ink-500 mt-0.5">{e.d}</div>
              </div>
              <Button variant="danger" size="sm" onClick={() => showToast('対応ページを開きます', 'info')}>対応する</Button>
            </div>
          ))}
        </Card>
      )}

      {/* ===== 接続済み時UI ===== */}
      {connected && (
        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-sm font-semibold text-ink-900 mb-3">決済・入金</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Info label="決済受付" value={<Badge tone="green" dot>有効</Badge>} box />
              <Info label="入金" value={<Badge tone="green" dot>有効</Badge>} box />
            </div>
            <div className="mt-4">
              <div className="text-[11px] text-ink-500 mb-2">利用可能ブランド</div>
              <div className="flex flex-wrap gap-2">{stripe.brands.map((b) => <span key={b} className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs text-ink-700">{b}</span>)}</div>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <div className="text-[11px] text-ink-500 mb-1">手数料表示</div>
              <div className="text-sm font-semibold text-ink-900">{stripe.feeRate}</div>
              <div className="text-[11px] text-ink-400 mt-0.5">入金スケジュール：{stripe.payoutSchedule}</div>
            </div>
            <div className="mt-5 flex gap-2 flex-wrap">
              <Button variant="accent" onClick={() => showToast('Stripeダッシュボードを開きます', 'info')}>↗ Stripeダッシュボードを開く</Button>
              <Button variant="secondary" onClick={() => { setStatus('未接続'); showToast('Stripe接続を解除しました', 'info') }}>接続を解除する</Button>
            </div>
          </Card>

          {/* Test mode */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-ink-900">テストモード</h3>
              <Toggle checked={testMode} onChange={setTestMode} />
            </div>
            <p className="text-[12px] text-ink-500 mb-4">{testMode ? 'テスト環境で決済を検証できます。実際の請求は発生しません。' : '本番モードです。実際の決済が行われます。'}</p>
            <Button variant="secondary" className="w-full" disabled={!testMode} onClick={runTest}>テスト決済を実行する</Button>
            <div className="mt-4">
              <div className="text-[11px] text-ink-500 mb-2">テスト決済結果ログ</div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {testLog.map((l, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 px-3 py-2 text-[12px]">
                    <div className="flex items-center gap-2"><Badge tone={l.ok ? 'green' : 'red'}>{l.ok ? '成功' : '失敗'}</Badge><span className="text-ink-400 text-[11px]">{l.t}</span></div>
                    <div className="text-ink-700 mt-1">{l.msg}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function Info({ label, value, mono, box }) {
  return (
    <div className={box ? 'rounded-xl border border-slate-200 px-4 py-3' : ''}>
      <div className="text-[11px] text-ink-500 mb-1">{label}</div>
      <div className={`text-[13px] font-medium text-ink-900 ${mono ? 'font-mono text-[12px]' : ''}`}>{value}</div>
    </div>
  )
}
