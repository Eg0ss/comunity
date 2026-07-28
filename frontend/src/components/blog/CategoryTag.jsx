const categoryColors = {
  Technologie: 'bg-secondary/10 text-secondary',
  Lifestyle: 'bg-primary/10 text-primary',
  Voyage: 'bg-secondary/10 text-secondary',
  Cuisine: 'bg-primary/10 text-primary',
  Santé: 'bg-secondary/10 text-secondary',
  Culture: 'bg-primary/10 text-primary',
}

const CategoryTag = ({ category }) => {
  const colorClass = categoryColors[category] || 'bg-gray-100 text-gray-700'

  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
      {category}
    </span>
  )
}

export default CategoryTag
