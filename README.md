# Asset Guild

Secure marketplace for your assets. Sell pay-to-view content without leaking them.


A decentralized, Ethereum-centric pay-to-view platform for content creators and consumers, leveraging advanced cryptographic techniques and layer 2 solutions.

## Overview

Our platform allows content creators to easily monetize their work while providing consumers with a seamless way to access high-quality, watermark-free content. By leveraging blockchain technology, layer 2 solutions, and advanced encryption techniques, we ensure a secure, scalable, and privacy-preserving ecosystem for all users.

## Features

- **Decentralized Payments**: Connect your wallet using Dynamic for easy, secure transactions.
- **Content Monetization**: Upload your content, set your price, and start earning.
- **Watermark Removal**: Consumers can unlock and view non-watermarked content after payment.
- **Identity Verification**: Worldcoin integration for secure, privacy-preserving identity verification.
- **Layer 2 Deployment**: Utilizes Arbitrum Sepolia for scalability and cost-efficiency.
- **Fully Homomorphic Encryption**: Ensures data privacy throughout the entire process.
- **Circle Integration**: For stable and reliable payment processing.

## Technical Implementation

### Ethereum Foundation Integration
The project is built with a strong focus on Ethereum, leveraging its robust ecosystem and tools. Our smart contracts and overall architecture are designed to be fully compatible with the Ethereum network and its standards.

### Arbitrum Sepolia Deployment
- Smart contracts are deployed on Arbitrum Sepolia, a layer 2 solution for enhanced scalability and reduced transaction costs.
- Implementation includes creating developer-controlled wallets and key management.
- The deployment process involves:
  1. Wallet preparation
  2. Funding wallets
  3. Contract deployment using transient encrypted public keys

### Circle Integration
- Utilizes Circle's infrastructure for stable and efficient payment processing.
- Ensures seamless transactions between fiat and cryptocurrency.

### Fhenix Integration (Fully Homomorphic Encryption)
- Implements fully homomorphic encryption (FHE) to ensure data privacy and security.
- Custom derived encryption for strings using simple symmetric encryption on-chain.
- Utilizes sealed outputs and encrypted inputs to prevent data leakage at any point.
- Tested and validated on a local network before deployment on Fhenix Helium.

## How It Works

### For Content Creators

1. Verify your identity using Worldcoin's World ID.
2. Upload your content to the platform.
3. Set your desired price for the content.
4. Content is encrypted using FHE techniques.
5. Start earning as users purchase access to your work.

### For Content Consumers

1. Browse available content on the platform.
2. Connect your wallet using Dynamic.
3. Purchase access to desired content through Circle integration.
4. Securely decrypt and enjoy watermark-free, high-quality content.

## Getting Started

(Add detailed instructions for installation, setup, and basic usage here, including how to interact with the Arbitrum Sepolia network and handle encrypted content)

## Technical Stack

- Smart Contracts: Solidity, deployed on Arbitrum Sepolia
- Encryption: Fully Homomorphic Encryption via Fhenix
- Frontend: Next.js
- Backend: IPFS
- Blockchain Integration: Dynamic for wallet connections, Arbitrum for scalability
- Payment Processing: Circle integration
- Identity Verification: Worldcoin's World ID

## Security and Privacy

Our platform prioritizes the security and privacy of both creators and consumers:
- Blockchain technology ensures secure and transparent transactions.
- Fully Homomorphic Encryption protects content and user data throughout the entire process.
- Worldcoin's World ID provides secure, privacy-preserving identity verification.
- Layer 2 solution (Arbitrum Sepolia) enhances security while reducing costs.

## Development and Testing

- Local network testing performed for initial validation of FHE implementation.
- Deployed and further tested on Fhenix Helium for real-world performance.

## Support

(Add information about how users can get support or contact your team)

## Contributing

(If applicable, add information about how others can contribute to the project)

## License

(Add your license information here)
