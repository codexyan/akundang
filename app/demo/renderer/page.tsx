import InvitationRenderer from '@/components/renderer/InvitationRenderer'
import JAVANESE_GOLD from '@/lib/template-configs/javanese-gold'
import type { NewInvitationData, Wish } from '@/lib/types'

export const metadata = {
  title: 'Demo Renderer — Akundang',
  description: 'Preview JSON-driven template renderer',
}

const DEMO_DATA: NewInvitationData = {
  groom_name: 'Budi Santoso',
  bride_name: 'Ani Permatasari',
  bride_parents: 'Bapak Hendra Permata & Ibu Dewi Lestari',
  groom_parents: 'Bapak Ahmad Santoso & Ibu Sri Rahayu',
  tagline: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri. — QS Ar-Rum: 21',
  story_title: 'Kisah Kami',
  story_text: 'Kami pertama kali bertemu di sebuah acara kampus pada tahun 2019. Sebuah perkenalan singkat yang ternyata menjadi awal dari perjalanan panjang yang penuh makna. Dengan izin Allah SWT, kami memutuskan untuk melanjutkan ke jenjang yang lebih serius.',
  akad: {
    date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '08:00',
    venue_name: 'Masjid Al-Ikhlas',
    venue_address: 'Jl. Mawar No. 12, Kebayoran Baru, Jakarta Selatan',
    maps_url: 'https://maps.google.com',
  },
  resepsi: {
    date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '11:00',
    venue_name: 'Ballroom Hotel Grand Sahid Jaya',
    venue_address: 'Jl. Jend. Sudirman No. 86, Jakarta Pusat',
    maps_url: 'https://maps.google.com',
  },
  gift_accounts: [
    { type: 'bank', bank: 'BCA', number: '1234567890', name: 'Budi Santoso' },
    { type: 'ewallet', platform: 'GoPay', number: '081234567890', name: 'Ani Permatasari' },
  ],
  closing_text:
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.',
  thank_you_message: 'Terima kasih atas doa dan kehadiran Anda.',
}

const DEMO_WISHES: Wish[] = [
  {
    id: '1',
    invitation_id: 'demo',
    name: 'Reza Firmansyah',
    message: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallah 💕',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    invitation_id: 'demo',
    name: 'Sari & Keluarga',
    message: 'Turut berbahagia atas pernikahan kalian. Semoga rumah tangga kalian dipenuhi kebahagiaan dan keberkahan!',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
]

export default function DemoRendererPage() {
  return (
    <InvitationRenderer
      invitationId="demo-renderer"
      invitationData={DEMO_DATA}
      template={JAVANESE_GOLD}
      initialWishes={DEMO_WISHES}
    />
  )
}
