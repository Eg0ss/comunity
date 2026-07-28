import Navbar from '../components/ui/Navbar.jsx'
import Hero from '../components/ui/Hero.jsx'
import Benefits from '../components/ui/Benefits.jsx'
import Footer from '../components/ui/Footer.jsx'
import PostCard from '../components/blog/PostCard.jsx'

const posts = [
  { id: 1, title: 'Les tendances React en 2026', excerpt: 'Hooks, RSC, performance… tour d’horizon des évolutions qui changent la façon de construire des interfaces modernes.', author: 'Nadia', date: '2026-07-12', category: 'Technologie', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20developer%20workspace%20with%20laptop%20showing%20code%2C%20clean%20minimal%20desk%2C%20soft%20daylight%2C%20professional%20photography%2C%20realistic&image_size=landscape_4_3' },
  { id: 2, title: 'Voyager léger : guide pratique', excerpt: 'Une méthode simple pour préparer un sac efficace, éviter le superflu et profiter pleinement de chaque destination.', author: 'Lucas', date: '2026-07-08', category: 'Voyage', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=traveler%20packing%20a%20carry-on%20suitcase%20on%20bed%2C%20minimal%20travel%20gear%2C%20warm%20natural%20light%2C%20realistic%20photo&image_size=landscape_4_3' },
  { id: 3, title: 'Cuisine express : 3 recettes du soir', excerpt: 'Des idées rapides, gourmandes et équilibrées pour cuisiner en semaine sans passer des heures derrière les fourneaux.', author: 'Amel', date: '2026-07-02', category: 'Cuisine', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=healthy%20home-cooked%20dinner%20on%20wooden%20table%2C%20colorful%20ingredients%2C%20cozy%20kitchen%20scene%2C%20realistic%20food%20photography&image_size=landscape_4_3' },
  { id: 4, title: 'Routine bien-être en 15 minutes', excerpt: 'Une mini routine facile pour se recentrer, respirer et repartir avec plus d’énergie, même dans les journées chargées.', author: 'Sofia', date: '2026-06-28', category: 'Santé', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=person%20doing%20morning%20stretch%20and%20breathing%20exercise%20near%20window%2C%20calm%20home%20interior%2C%20soft%20light%2C%20realistic%20photo&image_size=landscape_4_3' },
  { id: 5, title: 'Culture : 5 expos à ne pas manquer', excerpt: 'Sélection d’expositions inspirantes et accessibles, à voir pour nourrir sa curiosité et découvrir de nouveaux artistes.', author: 'Hugo', date: '2026-06-21', category: 'Culture', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20art%20museum%20gallery%20interior%2C%20people%20viewing%20paintings%2C%20bright%20minimal%20space%2C%20realistic%20photography&image_size=landscape_4_3' },
  { id: 6, title: 'Lifestyle : organiser sa semaine', excerpt: 'Un système simple pour planifier, prioriser et garder du temps pour soi, sans tomber dans l’obsession de la productivité.', author: 'Claire', date: '2026-06-15', category: 'Lifestyle', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=organized%20planner%20notebook%20with%20pen%20and%20coffee%20on%20desk%2C%20minimal%20lifestyle%20aesthetic%2C%20soft%20natural%20light%2C%20realistic&image_size=landscape_4_3' },
]

const Home = () => {
  return (
    <div className="min-h-screen bg-neutral-bg text-neutral-text">
      <Navbar />
      <Hero />
      <main className="py-14">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Dernières publications</h2>
              <p className="text-gray-600 mt-2">
                Explorez 6 articles fictifs pour découvrir l’esprit de la communauté.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </section>
      </main>
      <Benefits />
      <Footer />
    </div>
  )
}

export default Home
