import { useState, useEffect } from 'react'

export function useRequest<T>(service: () => Promise<T>): [ boolean, T | undefined ] {
  const [ loading, setLoading ] = useState(false)
  const [ data, setData ] = useState<T>()

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await service()
        setData(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [ service ])

  return [ loading, data ]
}