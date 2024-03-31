import { Outfit } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from './ReduxProvider';
import ProgressBarProvider from './ProgressBarProvider';
import AudioPlayerWrapper from './_components/audio-player/AudioPlayerWrapper';
import AuthWrapper from './_components/AuthWrapper';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  title: 'Open Music',
  description: 'Free music platform app',
};

export default function RootLayout({ children }) {
  return (
    <ReduxProvider>
      <html lang="en">
        <body className={outfit.className}>
          <ProgressBarProvider>
            <AuthWrapper>
              {children}
              <AudioPlayerWrapper />
            </AuthWrapper>
          </ProgressBarProvider>
        </body>
      </html>
    </ReduxProvider>
  );
}
