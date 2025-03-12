import { useState } from 'react';
import commenterIcon from '../../../assets/avatar.png'
import RatingStars from '../../../components/RatingStars';
import { formatDate } from '../../../utils/formateDate';
import PropTypes from 'prop-types';
import PostReview from './PostReview';

const ReviewsCard = ({ productReview }) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false)

  const reviews = productReview || [];
  
  const handleOpenReviewModel = () => {
    setIsModalOpen(true);
  }

  const handleCloseReviewModel = () => {
    setIsModalOpen(false);
  }

  return (
    <div className='my-6 bg-white p-8'>
      <div>
        {
          reviews.length > 0 ? (<div>
            <h3 className='text-lg font-medium'>All Comments...</h3>
            <div>
              {
                reviews.map((review, index) => (
                  <div key={index} className='mt-4'>
                    <div className='flex gap-4 items-center'>
                      <img src={commenterIcon} alt="" className='size-14' />
                      <div className='space-y-1'>
                        <p
                          className='text-lg font-medium underline capitalize underline-offset-4 text-blue-400'>
                          {review?.userId.username}</p>
                        <p className='text-[12px] italic'>{formatDate(review?.updatedAt)}</p>
                        <RatingStars rating={review?.rating} />
                      </div>
                    </div>
                    <div className='text-gray-600 mt-5 border p-8'>
                      <p className='md:w-4/5'>{review?.comment}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>) : (<p>No reviews yet</p>)
            
        }
      </div>

      {/* add a review button */}
      <div className='mt-12'>
        <button
          onClick={handleOpenReviewModel}
          className='px-6 py-3 bg-primary text-white rounded-md'>Add A Review</button>
      </div>

      {/* review modal */}
      <PostReview isModalOpen={isModalOpen } handleClose={ handleCloseReviewModel} />
    </div>
  )
}
ReviewsCard.propTypes = {
  productReview: PropTypes.arrayOf(PropTypes.shape({
    useId: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
    updatedAt: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
  }))
};

export default ReviewsCard