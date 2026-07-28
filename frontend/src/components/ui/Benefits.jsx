import { FaUsers, FaComments, FaLightbulb } from 'react-icons/fa6'

const benefits = [
  {
    icon: FaUsers,
    title: 'Communauté engagée',
    description: 'Connectez-vous avec des milliers de passionnés qui partagent vos centres d\'intérêt et vos valeurs.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: FaComments,
    title: 'Échanges enrichissants',
    description: 'Participez à des discussions constructives, donnez votre avis et apprenez des autres chaque jour.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: FaLightbulb,
    title: 'Contenus de qualité',
    description: 'Découvrez des articles soigneusement rédigés par une communauté bienveillante et créative.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
]

const Benefits = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-text mb-4">
            Pourquoi <span className="text-primary">Comm</span>
            <span className="text-secondary">Unity</span> ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une plateforme conçue pour les auteurs et les lecteurs, où la qualité
            des échanges prime avant tout.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 ${benefit.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <Icon className={`text-3xl ${benefit.color}`} />
                </div>
                <h3 className="text-xl font-bold text-neutral-text mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Benefits
