import category1 from '../../assets/category-1.jpg'
import category2 from '../../assets/category-2.jpg'
import category3 from '../../assets/category-3.jpg'
import category4 from '../../assets/category-4.jpg'
import { Link } from 'react-router-dom'

const Categories = () => {
  const categories = [
    {name: 'Accessories', path: 'accessories', img: category1},
    {name: 'Dress Collection', path: 'dress', img: category2},
    {name: 'Jewellery', path: 'jewellery', img: category3},
    {name: 'Cosmetics', path: 'cosmetics', img: category4},
  ]
  return (
    <>
      <div className="product__grid">
        {
          categories.map((category) => (
            <Link to={`/category/${category.path}`} key={category.path} className='categories__card'>
              <img src={category.img} alt={category.name} />
              <h4>{ category.name }</h4>
            </Link>
          ))
        }
    </div>
    </>
  )
}

export default Categories