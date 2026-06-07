import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {};

export default function AssignmentNofound({}: Props) {
  const router = useRouter();
  return (
    <div className="  mt-8 md:mt-20 flex flex-col items-center ">
      <div className="  relative size-64">
        <Image src="/assets/Illustrations.png" alt="assignmentNotFound" fill />
      </div>

      <p className=" font-bold text-[20px] pt-8 text-center leading-[140%]  text-TWO">
        No Assignment yet
      </p>
      <p className=" pt-2 font-normal  w-[85%] md:w-1/3  text-center tracking-[-4%] leading-[140%] text-[#5E5E5ECC]">
        Create your first assignment to start collecting and grading student submissions. You can
        set up rubrics, define marking criteria, and let AI assist with grading.
      </p>
      <Button
        onClick={() => {
          router.push('/dashboard/assignment/create');
        }}
        className="flex mt-8 createAssignButton px-6 py-5 flex-row justify-center gap-2  rounded-2xl  "
      >
        <Plus color="#fff" size={28} />
        <span className=" leading-[140%] font-medium  text-white text-[16px]">
          Create Your First Assignment
        </span>
      </Button>
    </div>
  );
}
