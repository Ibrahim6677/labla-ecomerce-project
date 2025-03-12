import PropTypes from 'prop-types'

const RatingStars = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<span key={i} className="ri-star-fill"></span>); // نجمة ممتلئة
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(<span key={i} className="ri-star-half-line"></span>); // نجمة نصف ممتلئة
    } else {
      stars.push(<span key={i} className="ri-star-line"></span>); // نجمة فارغة
    }
  }
  return <div className="product__rating">{stars}</div>;
}

RatingStars.propTypes = {
  rating: PropTypes.number.isRequired,
}

export default RatingStars;

