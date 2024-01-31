import React, { Suspense, useEffect, useReducer, useState } from 'react';

import type IArtifact from '@/interfaces/artifact';
import type { TContractType } from '@/sdk/src/types';
import type { EIP1193Provider, PublicClient, WalletClient } from 'viem';

import { Loader2, ShieldAlert, ShieldX } from 'lucide-react';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { useAccount } from 'wagmi';

import stepBackground from '@/assets/images/step.svg';
import BorderedContainer from '@/components/bordered-container';
import ContractCreationSteps from '@/components/contract-creation-steps';
import ExternalAnchor from '@/components/external-anchor';
import IncompatibleChainDialog from '@/components/incompatible-chain-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast/use-toast';
import chainConfig from '@/config/chain';
import orb3Network from '@/constants/orb3-network';
import EReducerState from '@/constants/reducer-state';
import { auditContractInitialState, auditContractReducer } from '@/reducers/audit-contract';
import { compileContractInitialState, compileContractReducer } from '@/reducers/compile-contract';
import {
  generateContractInitialState,
  generateContractReducer
} from '@/reducers/generate-contract';
import {
  predefinedPromptsInitialState,
  predefinedPromptsReducer
} from '@/reducers/predefined-prompts';
import { LlmService } from '@/sdk/llmService.sdk';

const HeaderSection = React.lazy(() => import('@/components/sections/header'));
const TemplatesSection = React.lazy(() => import('@/components/sections/templates'));
const PromptSection = React.lazy(() => import('@/components/sections/prompt'));
const AuditSection = React.lazy(() => import('@/components/sections/audit'));
const CodeViewerSection = React.lazy(() => import('@/components/sections/code-viewer'));

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function HomePage() {
  // eslint-disable-next-line unicorn/prefer-array-find
  const activeTemplates = chainConfig.templates.filter((template) => template.isActive);

  const [activeTemplateName, setActiveTemplateName] = useState(activeTemplates[0].name);
  const [userPrompt, setUserPrompt] = useState('');

  const { isConnected } = useAccount();
  const [publicClient, setPublicClient] = useState<PublicClient | undefined>(undefined);
  const [walletClient, setWalletClient] = useState<WalletClient | undefined>(undefined);

  const { toast } = useToast();

  const [predefinedPromptsState, dispatchPredefinedPrompts] = useReducer(
    predefinedPromptsReducer,
    predefinedPromptsInitialState
  );

  const [generateContractState, dispatchGenerateContract] = useReducer(
    generateContractReducer,
    generateContractInitialState
  );

  const [compileContractState, dispatchCompileContract] = useReducer(
    compileContractReducer,
    compileContractInitialState
  );

  const [auditContractState, dispatchAuditContract] = useReducer(
    auditContractReducer,
    auditContractInitialState
  );

  useEffect(() => {
    if (window.ethereum) {
      const publicClient = createPublicClient({
        chain: orb3Network,
        transport: custom(window.ethereum as EIP1193Provider)
      });

      const walletClient = createWalletClient({
        chain: orb3Network,
        transport: custom(window.ethereum as EIP1193Provider)
      });

      setPublicClient(publicClient);
      setWalletClient(walletClient);
    }
  }, []);

  useEffect(() => {
    async function getPredefinedPromptsByTemplate() {
      try {
        dispatchPredefinedPrompts({
          state: EReducerState.reset,
          payload: null
        });

        const promptsResponse = await LlmService.getPromptByTemplate(
          activeTemplateName as TContractType
        );

        if (!promptsResponse || !Array.isArray(promptsResponse)) {
          dispatchPredefinedPrompts({
            state: EReducerState.error,
            payload: null
          });

          return;
        }

        setUserPrompt('');
        dispatchPredefinedPrompts({
          state: EReducerState.success,
          payload: promptsResponse
        });

        console.log('promptsResponse', promptsResponse);
      } catch (error) {
        dispatchPredefinedPrompts({
          state: EReducerState.error,
          payload: null
        });

        console.error('ERROR FETCHING PROMPTS BY TEMPLATE', error);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getPredefinedPromptsByTemplate();
  }, [activeTemplateName]);

  const isGenerationLoading =
    generateContractState.isLoading ||
    compileContractState.isLoading ||
    auditContractState.isLoading;

  const isGenerationCompleted =
    (generateContractState.isError || generateContractState.isSuccess) &&
    (compileContractState.isError || compileContractState.isSuccess) &&
    (auditContractState.isError || auditContractState.isSuccess);

  const creationSteps = [
    {
      number: 1,
      step: 'Generating',
      isLoading: generateContractState.isLoading,
      isSuccess: generateContractState.isSuccess,
      isError: generateContractState.isError,
      isStepConnected: true
    },
    {
      number: 2,
      step: 'Compiling',
      isLoading: compileContractState.isLoading,
      isSuccess: compileContractState.isSuccess,
      isError: compileContractState.isError,
      isStepConnected: true
    },
    {
      number: 3,
      step: 'Auditing',
      isLoading: auditContractState.isLoading,
      isSuccess: auditContractState.isSuccess,
      isError: auditContractState.isError,
      isStepConnected: true
    },
    {
      number: 4,
      step: 'Completed',
      isLoading: false,
      isSuccess: isGenerationCompleted,
      isError:
        generateContractState.isError && compileContractState.isError && auditContractState.isError,
      isStepConnected: false
    }
  ];

  async function initCreation() {
    dispatchGenerateContract({
      state: EReducerState.reset,
      payload: null
    });

    dispatchCompileContract({
      state: EReducerState.reset,
      payload: null
    });

    dispatchAuditContract({
      state: EReducerState.reset,
      payload: null
    });

    let contractCode = await generateContract();

    if (contractCode) {
      contractCode = await compileContract(contractCode);
    }

    if (contractCode) {
      await auditContract(contractCode);
    }
  }

  async function generateContract() {
    console.log('GENERATING CONTRACT');

    try {
      dispatchGenerateContract({
        state: EReducerState.start,
        payload: null
      });

      const contractCodeResponse = await LlmService.callGeneratorLLM(
        userPrompt,
        activeTemplateName as TContractType
      );

      if (
        contractCodeResponse === null ||
        contractCodeResponse === undefined ||
        typeof contractCodeResponse !== 'string'
      ) {
        dispatchGenerateContract({
          state: EReducerState.error,
          payload: null
        });

        console.error('ERROR GENERATING CONTRACT', contractCodeResponse);

        return null;
      }

      dispatchGenerateContract({
        state: EReducerState.success,
        payload: contractCodeResponse
      });

      console.log('CONTRACT CODE', contractCodeResponse);

      return contractCodeResponse;
    } catch (error) {
      dispatchGenerateContract({
        state: EReducerState.error,
        payload: null
      });

      console.error('ERROR GENERATING CONTRACT', error);
    }

    return null;
  }

  async function compileContract(contractCode: string, maxTries = 3): Promise<string | null> {
    console.log('COMPILING CONTRACT');

    try {
      dispatchCompileContract({
        state: EReducerState.start,
        payload: null
      });

      const compileContractResponse = await LlmService.buildCode(contractCode);

      if (
        compileContractResponse === null ||
        compileContractResponse === undefined ||
        !compileContractResponse.success
      ) {
        console.error(`ERROR COMPILING CONTRACT attempt ${maxTries}`, compileContractResponse);

        if (maxTries > 0) {
          toast({
            variant: 'destructive',
            title: 'Oops, compilation did not succeed.',
            description: `Relax, our AI friend is taking care of it! Remaining Attempts: ${maxTries}`
          });

          // Try fixing the code
          const newContractCode = await LlmService.callBuildResolverLLM(
            contractCode,
            compileContractResponse.message
          );

          // Overwrite the faulty contract code
          dispatchGenerateContract({
            state: EReducerState.success,
            payload: newContractCode
          });

          return await compileContract(newContractCode, maxTries - 1);
        }

        toast({
          variant: 'destructive',
          title: 'Oops, my processor overheated',
          description:
            'Our AI friend could not figure out your requirements. Plase be more precise with your smart contract description and try again!'
        });

        // Max tries reached and still error
        dispatchCompileContract({
          state: EReducerState.error,
          payload: compileContractResponse.message
        });

        return null;
      }

      dispatchCompileContract({
        state: EReducerState.success,
        payload: compileContractResponse.artifact as IArtifact
      });

      console.log('COMPILATION RESPONSE', compileContractResponse);
      return contractCode;
    } catch (error) {
      dispatchCompileContract({
        state: EReducerState.error,
        payload: null
      });

      console.error('ERROR FROM COMPILE ENDPOINT', error);
      return null;
    }
  }

  async function auditContract(contractCode: string) {
    console.log('AUDITING CONTRACT');

    try {
      dispatchAuditContract({
        state: EReducerState.start,
        payload: null
      });

      const auditContractResponse = await LlmService.callAuditorLLM(contractCode);

      if (
        auditContractResponse === null ||
        auditContractResponse === undefined ||
        !Array.isArray(auditContractResponse)
      ) {
        dispatchAuditContract({
          state: EReducerState.error,
          payload: null
        });

        console.error('ERROR AUDITING CONTRACT', auditContractResponse);

        return;
      }

      dispatchAuditContract({
        state: EReducerState.success,
        payload: auditContractResponse
      });

      console.log('AUDITION RESPONSE', auditContractResponse);
    } catch (error) {
      dispatchAuditContract({
        state: EReducerState.error,
        payload: null
      });

      console.error('ERROR AUDITING CONTRACT', error);
    }
  }

  if (!publicClient && !walletClient) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center'>
        <ShieldX className='mb-2.5 h-16 w-16 text-destructive' />

        <h1 className='text-2xl font-bold'>Get a Wallet</h1>
        <h2 className='mb-5 text-lg text-muted-foreground'>
          It looks like you don&apos;t have a Wallet installed into your browser
        </h2>

        <Button asChild>
          <ExternalAnchor href='https://ethereum.org/en/wallets/find-wallet'>
            Choose your first Wallet
          </ExternalAnchor>
        </Button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center'>
        <ShieldAlert className='mb-2.5 h-16 w-16 text-yellow-400' />

        <h1 className='text-2xl font-bold'>Connect your Wallet</h1>
        <h2 className='mb-5 text-lg text-muted-foreground'>
          Connect your Wallet to in order to use our application
        </h2>

        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error */}
        <w3m-button />
      </div>
    );
  }

  return (
    <div className='flex w-full max-w-[1140px] flex-col gap-y-5'>
      <IncompatibleChainDialog />

      <BorderedContainer
        className='bg-cover md:mt-16 md:bg-contain'
        style={{
          background: `url(${stepBackground}) no-repeat`
        }}
      >
        <Suspense fallback={<Skeleton className='h-40 w-[95%] rounded-3xl' />}>
          <HeaderSection chainsName={chainConfig.name} chainsDocumentationLink={chainConfig.docs} />
        </Suspense>
      </BorderedContainer>

      <BorderedContainer>
        <Suspense fallback={<Skeleton className='h-60 w-[95%] rounded-3xl' />}>
          <TemplatesSection
            chainsName={chainConfig.name}
            templates={chainConfig.templates}
            activeTemplateName={activeTemplateName}
            setActiveTemplateName={setActiveTemplateName}
          />
        </Suspense>

        <Suspense fallback={<Skeleton className='h-60 w-[95%] rounded-3xl' />}>
          <div className='flex w-full flex-col items-start'>
            <PromptSection
              chainsName={chainConfig.name}
              predefinedPrompts={predefinedPromptsState.prompts}
              userPrompt={userPrompt}
              setUserPrompt={setUserPrompt}
            />

            <div className='mt-5 flex w-full flex-col items-center justify-center gap-y-5 px-5 md:flex-row md:items-start md:justify-between md:px-10'>
              <Button
                disabled={isGenerationLoading}
                onClick={() => initCreation()}
                className='w-full md:w-60'
              >
                {isGenerationLoading ? (
                  <div className='flex items-center gap-x-2.5'>
                    <Loader2 className='animate-spin' />
                    <span>Generating Smart Contract</span>
                  </div>
                ) : (
                  <span>Generate Smart Contract</span>
                )}
              </Button>

              <ContractCreationSteps steps={creationSteps} />
            </div>
          </div>
        </Suspense>
      </BorderedContainer>

      {auditContractState.isSuccess && auditContractState.audit ? (
        <BorderedContainer>
          <Suspense fallback={<Skeleton className='h-60 w-[95%] rounded-3xl' />}>
            <AuditSection chainsName={chainConfig.name} audit={auditContractState.audit} />
          </Suspense>
        </BorderedContainer>
      ) : null}

      {publicClient && walletClient && generateContractState.contractCode ? (
        <BorderedContainer>
          <Suspense fallback={<Skeleton className='h-60 w-[95%] rounded-3xl' />}>
            <CodeViewerSection
              chainsName={chainConfig.name}
              publicClient={publicClient}
              walletClient={walletClient}
              smartContractCode={generateContractState.contractCode}
              smartContractFileExtension={chainConfig.contractFileExtension}
              contractArtifacts={isGenerationCompleted ? compileContractState.artifact : null}
            />
          </Suspense>
        </BorderedContainer>
      ) : null}
    </div>
  );
}
