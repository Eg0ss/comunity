import BaseButton from './BaseButton.jsx'

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-text mb-6 leading-tight">
            Partagez vos idées,{' '}
            <span className="text-primary">construisez</span>{' '}
            <span className="text-secondary">ensemble</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            CommUnity est la plateforme de blog communautaire où chacun peut
            écrire, lire, échanger et se connecter avec des passionnés du
            monde entier. Rejoignez une communauté qui valorise la parole et
            les échanges authentiques.
          </p>
          <div className="flex items-center justify-center">
            <BaseButton variant="primary">Rejoindre la communauté</BaseButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
