import Image from 'next/image';

type Props = {};

export default function SchoolInfo({}: Props) {
  return (
    <div className=" w-full flex flex-row  gap-2 items-center  rounded-[16px] bg-[#F0F0F0] py-3  px-2 ">
      <div className=" size-12  relative   ">
        <Image src="/assets/image3.svg" alt="school" fill className="  " />
      </div>
      <div className="">
        <p className=" font-bold tracking-[-4%] leading-[140%] text-TWO">Delhi Public School</p>
        <p className=" font-normal text-sm tracking-[-4%] leading-[140%] text-THREE">
          Bokaro Steel City
        </p>
      </div>
    </div>
  );
}

export function AiToolKitButton() {
  return (
    <button className=" w-full mb-12 py-3 flex flex-row gap-2 items-center justify-center  text-white border bg-[#272727] rounded-full   aiToolkitButton">
      <svg
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.63783 8.63783L6.18377 4H7.13246L8.6784 8.63783L13.3162 10.1838V11.1325L8.6784 12.6784L7.13246 17.3162H6.18377L4.63783 12.6784L0 11.1325V10.1838L4.63783 8.63783Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.3878 2.38783L14.1838 0H15.1325L15.9284 2.38783L18.3162 3.18377V4.13246L15.9284 4.9284L15.1325 7.31623H14.1838L13.3878 4.9284L11 4.13246V3.18377L13.3878 2.38783Z"
          fill="white"
        />
      </svg>
      AI Teacher’s Toolkit
    </button>
  );
}
