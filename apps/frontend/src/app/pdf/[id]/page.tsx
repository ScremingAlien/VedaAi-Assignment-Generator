import PdfDownload from './PdfDownload';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <PdfDownload assignmentId={id} />
    </div>
  );
}
