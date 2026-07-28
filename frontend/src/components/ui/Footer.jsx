const Footer = () => {
  const year = new Date().getFullYear()
  const links = [
    { label: 'Accueil', href: '#' },
    { label: 'Articles', href: '#' },
    { label: 'À propos', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Mentions légales', href: '#' },
    { label: 'Confidentialité', href: '#' },
  ]

  return (
    <footer className="bg-neutral-text text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-primary">Comm</span>
              <span className="text-secondary">Unity</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              La plateforme de blog communautaire où chacun partage ses idées
              et construit des liens avec une communauté passionnée.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {links.slice(0, 3).map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Informations</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {links.slice(3).map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-secondary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          © {year} CommUnity. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}

export default Footer
