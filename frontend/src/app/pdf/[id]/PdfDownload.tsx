'use client';

import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

import AssessmentDocument from './AssessmentDocument';

import { useAssessmentByAssignment } from '@/features/assessment/api/assignment.query';

interface Props {
  assignmentId: string;
}

export default function PdfDownload({ assignmentId }: Props) {
  const { data: assessment, isLoading, error } = useAssessmentByAssignment(assignmentId);
  console.log(assessment);
  if (isLoading) {
    return <div>Loading assessment...</div>;
  }

  if (error || !assessment) {
    return <div>Failed to load assessment</div>;
  }

  return (
    <div className="space-y-6">
      <PDFDownloadLink
        document={<AssessmentDocument assessment={assessment} />}
        fileName={`${assessment.title}.pdf`}
      >
        {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF')}
      </PDFDownloadLink>

      <PDFViewer width="100%" height={900}>
        <AssessmentDocument assessment={assessment} />
      </PDFViewer>
    </div>
  );
}
