import type { MDXComponents } from 'mdx/types'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1 : ({children}) => <h1 className='text-[var(--primary-600)]'>{children}</h1>,
    h2 : ({children}) => <h2 className='text-[var(--primary-600)]'>{children}</h2>
  }
}