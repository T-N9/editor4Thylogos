import type { MDXComponents } from 'mdx/types'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1 : ({children}) => <h1 className='text-[#4f46e5]'>{children}</h1>,
    h2 : ({children}) => <h2 className='text-[#4f46e5]'>{children}</h2>
  }
}