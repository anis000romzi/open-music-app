import { Outfit } from 'next/font/google';
import './globals.css';
import { StoreProvider } from './StoreProvider';
import AudioPlayerWrapper from './_components/audio-player/AudioPlayerWrapper';
import AuthWrapper from './_components/AuthWrapper';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  title: 'Open Music',
  description: 'Free music platform app',
};

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={outfit.className}>
          <AuthWrapper>
            {children}
            <AudioPlayerWrapper />
          </AuthWrapper>
        </body>
      </html>
    </StoreProvider>
  );
}
