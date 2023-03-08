/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { injected, walletConnect } from 'blockchain/connectors'

export const useEagerConnect = () => {
  const { activate, active } = useWeb3React()
  const logged = useSelector(state => (state as any)?.user?.data?.walletAddress)

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized && logged) {
        const isWc = 'walletconnect' in localStorage
        activate(isWc ? walletConnect : injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, [logged]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}
