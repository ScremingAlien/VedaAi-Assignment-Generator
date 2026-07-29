import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

type Props = {};

export default function Logo({}: Props) {
  return (
    <Link href="/" className=" flex items-center gap-3">
      <div className=" relative  size-7 md:size-10">
        <Image src="/assets/logo.svg" alt="vedaAi" fill />
      </div>
      <span className=" font-bricolage  text-[20px] md:text-[28px] tracking-[-6%] font-bold text-TWO">
        {APP_NAME}
      </span>
    </Link>
  );
}
