import React from 'react'
import NewsletterForm from './NewsletterForm'

const NewsletterSection = () => {
  return (
    <div className='max-w-screen-md mx-auto my-10 px-3 lg:px-0'>
      <h1 className='text-4xl font-bold text-primary-600 mb-5'>Get Notify!</h1>
      <NewsletterForm />
    </div>
  )
}

export default NewsletterSection