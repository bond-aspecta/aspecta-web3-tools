import { createConfig, http } from 'wagmi';
import {
  mainnet,
  opBNB,
  opBNBTestnet,
  polygon,
  polygonMumbai,
  scroll,
  scrollSepolia,
  zetachain,
  zetachainAthensTestnet,
} from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [
    mainnet, // line-break
    polygonMumbai,
    zetachainAthensTestnet,
    opBNBTestnet,
    zetachain,
    polygon,
    opBNB,
    scrollSepolia,
    scroll,
  ],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [polygonMumbai.id]: http(),
    [zetachainAthensTestnet.id]: http(),
    [opBNBTestnet.id]: http(),
    [zetachain.id]: http(),
    [polygon.id]: http(),
    [opBNB.id]: http(),
    [scrollSepolia.id]: http(),
    [scroll.id]: http(),
  },
});
