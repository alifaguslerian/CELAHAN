export const scopeCopy = {
  id: {
    heading: 'Cakupan proyek', version: 'Usulan versi', agreedVersion: 'Kesepakatan versi',
    fields: { title: 'Judul proyek', included: 'Bagian yang masuk cakupan', excluded: 'Bagian di luar cakupan', deliverables: 'Hasil yang akan diterima' },
    waiting: 'Belum ada usulan cakupan dari admin.', awaiting: 'Menunggu keputusan pemilik tiket.',
    approved: 'Disetujui pemilik tiket', changes_requested: 'Pemilik meminta perubahan',
    pendingHistory: 'Belum diputuskan', proposedAt: 'Diusulkan', decidedAt: 'Diputuskan',
    send: 'Kirim usulan', edit: 'Ubah usulan', revise: 'Kirim revisi', approve: 'Setujui cakupan', request: 'Minta perubahan',
    reason: 'Bagian mana yang perlu diubah?', previous: 'Riwayat usulan', refresh: 'Muat ulang cakupan',
  },
  en: {
    heading: 'Project scope', version: 'Proposal version', agreedVersion: 'Agreement version',
    fields: { title: 'Project title', included: 'In scope', excluded: 'Out of scope', deliverables: 'Deliverables' },
    waiting: 'The admin has not proposed a scope yet.', awaiting: 'Waiting for the ticket owner’s decision.',
    approved: 'Approved by the ticket owner', changes_requested: 'The owner requested changes',
    pendingHistory: 'No decision recorded', proposedAt: 'Proposed', decidedAt: 'Decided',
    send: 'Send proposal', edit: 'Edit proposal', revise: 'Send revision', approve: 'Approve scope', request: 'Request changes',
    reason: 'What needs to change?', previous: 'Proposal history', refresh: 'Refresh scope',
  },
} as const;
