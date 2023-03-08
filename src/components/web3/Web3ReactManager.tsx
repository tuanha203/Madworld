import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'; 
// import { network } from 'blockchain/connectors'; 
import { useEagerConnect, useInactiveListener } from 'hooks/useWeb3';
import { Web3Provider } from "@ethersproject/providers";
import { useUpdateBalance } from 'hooks/useUpdateBalance';

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const context = useWeb3React<Web3Provider>();
  const { updateBalance } = useUpdateBalance();

  const { connector, account, chainId, library } = context;
  const [activatingConnector, setActivatingConnector] = useState<any>();
  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  useEffect(() => {
    if (!account && !library) return;
    updateBalance();
  }, [chainId, account, library]);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  if (!triedEager) {
    // return null
  }

  return children
}
