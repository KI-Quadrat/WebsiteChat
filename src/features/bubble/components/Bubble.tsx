import { createSignal, Show, splitProps, onCleanup, createEffect } from 'solid-js';
import styles from '../../../assets/index.css';
import { BubbleButton } from './BubbleButton';
import { BubbleParams } from '../types';
import { Bot, BotProps } from '../../../components/Bot';
import Tooltip from './Tooltip';
import { getBubbleButtonSize } from '@/utils';
import { Send, Upload, X } from 'lucide-react';

const defaultButtonColor = '#3B81F6';
const defaultIconColor = 'white';

export type BubbleProps = BotProps & BubbleParams;

export const Bubble = (props: BubbleProps) => {
  const [bubbleProps] = splitProps(props, ['theme']);

  const [isBotOpened, setIsBotOpened] = createSignal(false);
  const [isBotStarted, setIsBotStarted] = createSignal(false);
  const [buttonPosition, setButtonPosition] = createSignal({
    bottom: bubbleProps.theme?.button?.bottom ?? 20,
    right: bubbleProps.theme?.button?.right ?? 20,
  });

  const openBot = () => {
    if (!isBotStarted()) setIsBotStarted(true);
    setIsBotOpened(true);
  };

  const closeBot = () => {
    setIsBotOpened(false);
  };

  const toggleBot = () => {
    isBotOpened() ? closeBot() : openBot();
  };

  onCleanup(() => {
    setIsBotStarted(false);
  });

  const buttonSize = getBubbleButtonSize(props.theme?.button?.size);

  createEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, interactive-widget=resizes-content';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  });

  const showTooltip = bubbleProps.theme?.tooltip?.showTooltip ?? false;

  return (
    <>
      <style>{styles}</style>
      <Tooltip
        showTooltip={showTooltip && !isBotOpened()}
        position={buttonPosition()}
        buttonSize={buttonSize}
        tooltipMessage={bubbleProps.theme?.tooltip?.tooltipMessage}
        tooltipBackgroundColor={bubbleProps.theme?.tooltip?.tooltipBackgroundColor}
        tooltipTextColor={bubbleProps.theme?.tooltip?.tooltipTextColor}
        tooltipFontSize={bubbleProps.theme?.tooltip?.tooltipFontSize}
      />
      <BubbleButton
        {...bubbleProps.theme?.button}
        toggleBot={toggleBot}
        isBotOpened={isBotOpened()}
        setButtonPosition={setButtonPosition}
        dragAndDrop={bubbleProps.theme?.button?.dragAndDrop ?? false}
        autoOpen={bubbleProps.theme?.button?.autoWindowOpen?.autoOpen ?? false}
        openDelay={bubbleProps.theme?.button?.autoWindowOpen?.openDelay}
        autoOpenOnMobile={bubbleProps.theme?.button?.autoWindowOpen?.autoOpenOnMobile ?? false}
      />
      <Show when={isBotOpened()}>
        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div class="bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg w-full h-full md:w-[70%] md:h-[70%] flex flex-col">
            {/* Header */}
            <div class="flex justify-between items-center p-4 bg-gray-800">
              <div class="md:hidden text-white text-2xl font-bold">
                <span class="block">KI²</span>
                <span class="block text-sm">KI QUADRAT</span>
              </div>
              <div class="text-xl font-bold hidden md:block">Wiener Neudorf</div>
              <div class="flex items-center space-x-2">
                <button class="text-sm bg-gray-700 px-2 py-1 rounded hidden md:block">Send Transcript</button>
                <button class="text-lg hidden md:block">A</button>
                <button class="text-xl font-bold hidden md:block">A</button>
                <button class="md:hidden" onClick={closeBot}>
                  <X size={24} />
                </button>
              </div>
            </div>
            {/* Main Content */}
            <div class="flex-grow flex overflow-hidden">
              {/* Left Panel (hidden on mobile) */}
              <div class="w-1/4 bg-gray-900 hidden md:flex flex-col">
                <div class="p-4">
                  <div class="text-white text-2xl font-bold">
                    <span class="block">KI²</span>
                    <span class="block text-sm">KI QUADRAT</span>
                  </div>
                </div>
              </div>
              {/* Right Panel */}
              <div class="flex-grow flex flex-col overflow-hidden md:border-l md:border-gray-800">
                <div class="flex-grow overflow-y-auto p-4">
                  <Bot
                    badgeBackgroundColor={bubbleProps.theme?.chatWindow?.backgroundColor}
                    bubbleBackgroundColor={bubbleProps.theme?.button?.backgroundColor ?? defaultButtonColor}
                    bubbleTextColor={bubbleProps.theme?.button?.iconColor ?? defaultIconColor}
                    showTitle={false}
                    showAgentMessages={bubbleProps.theme?.chatWindow?.showAgentMessages}
                    welcomeMessage={bubbleProps.theme?.chatWindow?.welcomeMessage}
                    errorMessage={bubbleProps.theme?.chatWindow?.errorMessage}
                    poweredByTextColor={bubbleProps.theme?.chatWindow?.poweredByTextColor}
                    textInput={bubbleProps.theme?.chatWindow?.textInput}
                    botMessage={bubbleProps.theme?.chatWindow?.botMessage}
                    userMessage={bubbleProps.theme?.chatWindow?.userMessage}
                    feedback={bubbleProps.theme?.chatWindow?.feedback}
                    fontSize={bubbleProps.theme?.chatWindow?.fontSize}
                    footer={bubbleProps.theme?.chatWindow?.footer}
                    starterPrompts={bubbleProps.theme?.chatWindow?.starterPrompts}
                    starterPromptFontSize={bubbleProps.theme?.chatWindow?.starterPromptFontSize}
                    chatflowid={props.chatflowid}
                    chatflowConfig={props.chatflowConfig}
                    apiHost={props.apiHost}
                    onRequest={props.onRequest}
                    observersConfig={props.observersConfig}
                    clearChatOnReload={bubbleProps.theme?.chatWindow?.clearChatOnReload}
                  />
                </div>
                <div class="p-4">
                  <div class="flex items-center bg-gray-800 rounded-lg">
                    <input type="text" placeholder="Wie darf ich ihnen helfen?" class="flex-grow bg-transparent p-3 outline-none text-sm" />
                    <button class="p-3">
                      <Upload size={20} />
                    </button>
                    <button class="p-3">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div class="p-2 text-center text-sm text-gray-500">Powered by KI QUADRAT</div>
          </div>
        </div>
      </Show>
    </>
  );
};
