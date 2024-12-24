'use client';
import { Button } from '@nextui-org/react';
import useNewsletterForm from './useNewsletterForm';
import Link from 'next/link';

const NewsletterForm = () => {
    const { handleSubmit, errors, isLoading, register, onSubmit } = useNewsletterForm();

    return (

        <>
            <div className="mx-auto ">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-lg text-primary-900 dark:text-white"
                        >
                            Join me on my journey and get my latest articles delivered straight to your inbox.
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`bg-gray-50 border text-primary-600 ${errors.email ? '!border-red-500' : 'border-gray-300'}  text-lg lg:text-2xl rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-secondary placeholder-gray-300 dark:placeholder-gray-500 dark:focus:ring-accent-500 dark:focus:border-accent-500`}
                            placeholder="Enter your email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <span className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                   <div className='flex gap-4 items-center'>
                     <Button
                         type="submit"
                         className="w-fit bg-primary-600 text-white dark:text-secondary"
                         size="lg"
                         disabled={isLoading}
                     >
                         {isLoading ? "Subscribing..." : "Subscribe Now"}
                     </Button>
                    
                     <div className='dark:text-white'>
                         or <Link href={'/api/rss'} className='font-bold text-[#FFA500]'>Feed to your RSS</Link> 
                     </div>
                   </div>
                </form>
            </div>
        </>

    );
};

export default NewsletterForm;
