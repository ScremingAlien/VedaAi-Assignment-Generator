import { SocketProvider } from '../../lib/provider/socket-provider';
import LinkSectionMobile from './_components/sidebar/LinkSectionMobile';
import SideBar from './_components/sidebar/SideBar';
import TitleBar from './_components/titlebar/TitleBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <div className="h-screen flex  pb-14 md:pb-0  flex-col md:flex-row   gradientBg  relative w-screen">
        <SideBar />
        {/* bg-[#CECECE] */}
        <div className="flex-1 flex flex-col    h-full overflow-hidden">
          <TitleBar />

          <main className="flex-1 px-3 overflow-auto hide-scrollbar">{children}</main>
        </div>

        <LinkSectionMobile />
      </div>
    </SocketProvider>
  );
}

/**
 * edit, delete, retry button in card
 */
