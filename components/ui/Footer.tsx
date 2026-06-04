import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-lg font-bold tracking-tight leading-none"><span className="text-rose-600">ak</span><span className="text-stone-900">undang</span></p>
            <p className="text-sm text-gray-500 mt-1">Undangan digital premium, tanpa coding</p>
          </div>

          <div className="flex gap-8 text-sm text-gray-500">
            <div className="space-y-2">
              <p className="font-medium text-gray-700">Produk</p>
              <ul className="space-y-1">
                <li><Link href="/#templates" className="hover:text-gold-700">Template</Link></li>
                <li><Link href="/#harga" className="hover:text-gold-700">Harga</Link></li>
                <li><Link href="/#faq" className="hover:text-gold-700">FAQ</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-700">Akun</p>
              <ul className="space-y-1">
                <li><Link href="/login" className="hover:text-gold-700">Masuk</Link></li>
                <li><Link href="/register" className="hover:text-gold-700">Daftar</Link></li>
                <li><Link href="/dashboard" className="hover:text-gold-700">Dashboard</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-700">Kontak</p>
              <ul className="space-y-1">
                <li>
                  <a href="https://wa.me/628123456789" className="hover:text-gold-700">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:halo@akundang.id" className="hover:text-gold-700">
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Akundang. Dibuat dengan ❤️ untuk pasangan Indonesia.
        </div>
      </div>
    </footer>
  )
}
