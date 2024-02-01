# 🚀 AI No-Code DeFi Development Suite on Orb3 Blockchain

Elevate your DeFi project development on the Orb3 blockchain with our state-of-the-art AI No-Code Development Suite. This revolutionary platform is specifically engineered for innovators and developers keen on shaping the future of decentralized finance (DeFi) on the Orb3 ecosystem. Utilizing advanced AI-driven tools, our suite simplifies the process of designing, launching, and fine-tuning Ethereum-compatible decentralized financial applications (dApps) on Orb3, a blockchain celebrated for its high throughput, robust security, and EVM compatibility.

Our No-Code Development Suite is designed to democratize DeFi development, enabling both seasoned developers and those new to the blockchain space to easily create sophisticated DeFi solutions. From automated marketplaces and decentralized exchanges (DEXs), our intuitive AI tools facilitate the seamless integration of complex financial mechanisms and smart contract functionalities without the need for extensive programming expertise.

Leverage the power of AI to navigate the complexities of DeFi development on the Orb3 blockchain. Our No-Code Suite ensures that your projects are not only innovative and scalable but also aligned with the best practices and standards of the DeFi ecosystem. Step into the realm of DeFi on Orb3 and transform your vision into reality, setting new benchmarks in the decentralized finance landscape.

## 🤖 Technical Overview

Defi Builder AI integrates advanced AI capabilities to enhance EVM smart contract development. The core of the platform is built around our AI-driven smart contract generator and a suite of EVM-specific development tools.

## ✨ Features

- 🤖 **AI Smart Contract Generator**: Utilize fine tuned AI to generate a variety of smart contracts based on user requests, trained on Solidity smart contracts.
- 🔍 **AI Auditor**: Trained on over 10,000 audits from various firms, ensuring thorough and reliable contract examination.
- 🌐 **AI Build Resolver**: AI agent specialized to resolve compilation errors from generation.
- 🛠️ **DeFi Tool Suite**: Access tools for creating custom tokens, NFTs, DEXs, farming strategies, staking and launchpads.
- 🏦 **Web3 Wallet Integration**: DEFI BUILDER AI requires a web3 wallet connection connected to Orb3 Testnet to be fully operational.
- 🚀 **Integrated Contract Deployment**: Deploy generated contracts with just a few clicks. Supports custom constructors for tailored functionality.
- 🌉 **EVM Code Compiler**: DEFI BUILDER AI is composed by an handsome tool that help developers test the generated contracts using Hardhat.
- 🔄 **Automatic Iteration**: If an error occurs, the system automatically reverts to the previous step with instructions on how to fix the error, ensuring a smooth development process.

## 🧠 Main Logic of the AI System in Defi Buider AI Suite

![TechStack Scheme](./data-logic.jpg 'Architecture')

🚀 Try it now: [Defi Builder AI](https://orb3.defibuilder.com/)

Defi BUilder's AI system is a sophisticated ensemble of components, each designed to ensure the security, efficiency, and reliability of Ethereum smart contracts. The system comprises three main elements: the AI Generator Agent, the Builder Backend, and the AI Auditor Backend.

### AI Generator Agent

- **Purpose**: The AI Generator Agent is responsible for generating Ethereum Virtual Machine (EVM) smart contracts.
- **Training and Data Sources**: This agent has been fine-tuned on over 300 verified smart contract primitives from cookbook.dev, enhancing its security and reliability. Additionally, it leverages a vast dataset from Hugging Face, comprising over 300,000 smart contracts, to incorporate user customizations and ensure a robust starting point for integrating user requests.
- **Functionality**: The agent intelligently processes user inputs and requirements to generate smart contract code that is not only functional but also adheres to best practices in smart contract development.

### Builder Backend

- **Role**: Once the AI Generator Agent produces a smart contract, the Builder Backend takes over.
- **Compilation and Syntax Checking**: Utilizing Hardhat, a popular Ethereum development environment, the backend verifies the compilation of the generated contract. This step is crucial to ensure that the contract is free of syntax errors and other common coding issues.
- **Error Handling**: If any errors are detected during the compilation process, the contract is sent back to the Generator Agent. The errors are provided as feedback, enabling the AI to learn and improve in subsequent iterations.

### AI Auditor Backend

- **Objective**: After a successful compilation, the AI Auditor Backend evaluates the smart contract for potential vulnerabilities.
- **Vulnerability Assessment and Categorization**: The AI Auditor is fine-tuned on a comprehensive dataset, including a public Hugging Face Q&A dataset with over 9,000 examples of potential vulnerabilities. This allows the AI to categorize vulnerabilities based on their security concerns (Low, Medium, High).
- **Audit Data Sources**: To enhance its auditing capabilities, the AI integrates models based on over 5,000 audits from various public reports on GitHub, sourced from more than 30 audit firms. This extensive dataset ensures a thorough and informed audit of the smart contracts.

## 🚀 Getting Started

Follow these steps to set up Defi Builder AI for development and testing:

### Prerequisites

- Node.js
- npm or Yarn
- Genezio SDK
- Git
- OpenAI API Key
- MongoDB URI
- Defi Builder Backend API KEY

### Environment Setup

- Update the `.env` files in respective folders with necessary API keys and database URIs.

genezio-back-end
'''sh
OPENAI_API_KEY=''
MONGO_DB_URI=''
X_API_KEY=''
'''

front-end
'''sh
VITE_WALLET_CONNECT_PROJECT_ID=''
'''

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/thedefibuilder/hackathon-orb3.git
   ```

2. Navigate to the project directory and install dependencies:

   ```sh
   cd hackathon-orb3/back-end
   npm install
   cd ../front-end
   npm install
   ```

## 📝 Usage

To use the app, start the local development server:

```sh
cd back-end
npx genezio local
```

On a new terminal while backend is running

```sh
cd front-end
npm run dev
```

Navigate through the platform to create, test, and deploy Ethereum smart contracts using our AI-assisted tools.

## 🔥 Contributing

Contributions are welcome! Please follow the standard fork-and-pull-request workflow to contribute.

## 🧾 License

Defi Builder's AI is released under the CC BY-NC-SA License.
