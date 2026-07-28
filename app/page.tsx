import { supabaseAdmin } from '@/lib/supabase'
import Ticker from '@/components/Ticker'
import Feed from '@/components/Feed'
import SubmitModal from '@/components/SubmitModal'
import Navigation from '@/components/Navigation'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: tips } = await supabaseAdmin
    .from('tips')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <>
      <Ticker tips={tips || []} />
      <header>
        <h1 className="wordmark">NAFIZIC</h1>
        <p className="tagline">Campus intel, verified</p>
        <p className="est">SUBMISSIONS ANONYMOUS · EVERY POST REVIEWED BEFORE IT GOES LIVE</p>
      </header>
      <div className="container" id="publicView">
        <Feed initialTips={tips || []} />
      </div>
      <SubmitModal />
      <Navigation />
    </>
  )
}
