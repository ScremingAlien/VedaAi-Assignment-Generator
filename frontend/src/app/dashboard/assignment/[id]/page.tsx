import AssessmentData from './AssessmentData';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <div className=" w-full   mt-2 rounded-[32px]  bg-[#ffffff] md:bg-[#5E5E5E]">
      <AssessmentData assignmentId={id} />
    </div>
  );
}
