'use client';

import AssessmentDocument from '@/app/pdf/[id]/AssessmentDocument';
import { useAssessmentByAssignment } from '@/features/assessment/api/assignment.query';
import { formatQuestionType } from '@/utils/formatDate';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Image from 'next/image';

const difficultyStyles = {
  easy: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  hard: 'bg-red-100 text-red-700 border-red-200',
} as const;

export default function AssessmentData({ assignmentId }: { assignmentId: string }) {
  const { data, isLoading, error } = useAssessmentByAssignment(assignmentId);

  if (isLoading) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  if (error || !data) {
    return <div className="p-10 text-red-500">Error loading assessment</div>;
  }

  const assignment = data.assignmentId;

  return (
    <>
      <div className=" px-4 pt-4   ">
        <div className="rounded-[28px]  px-4 md:px-8 py-6 sidebarShadow   bg-[#303030]  md:bg-[#181818CC]">
          <p className="   mb-4 font-semibold  text-[14px] md:text-[20px] font-bricolage text-white leading-[140%] ">
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science
            classes on the NCERT chapters:
          </p>

          <PDFDownloadLink
            document={<AssessmentDocument assessment={data} />}
            fileName={`${data.title}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <div className=" px-5 py-2 rounded-3xl flex items-center gap-2 bg-white w-fit">
                  s
                  <Image src="/assets/Frame.svg" alt="pdf" width={24} height={24} />
                  <span className=" font-bricolage font-medium text-[16px] text-TWO">
                    Preparing PDF...
                  </span>
                </div>
              ) : (
                <div className=" px-5 py-2 rounded-3xl flex items-center gap-2 bg-white w-fit">
                  <Image src="/assets/Frame.svg" alt="pdf" width={24} height={24} />
                  <span className=" font-bricolage font-medium text-[16px] text-TWO">
                    Download as PDF
                  </span>
                </div>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>

      <div className=" mx-auto px-4 md:px-5   pt-3  pb-5 mb-14 md:mb-0 font-inter">
        <div className="rounded-[28px] mx-auto bg-[#F6F6F6]   px-3 md:px-10  py-8 md:py-10 text-[12px] leading-relaxed font-inter">
          {/* Header */}

          <div className="text-center">
            <h1 className=" text-[22px] md:text-[32px] font-bold">
              Delhi Public School, Sector-4, Bokaro
            </h1>

            <p className="mt-1 text-[18px] md:text-[24px]">Subject: {assignment.subject}</p>

            <p className="  text-[18px] md:text-[24px]">Class: {assignment.className}</p>
          </div>

          {/* Meta */}

          <div className="flex justify-between  flex-col md:flex-row mt-8  text-[16px] md:text-[18px] font-medium">
            <p>Time Allowed: {assignment.timeAllowedMinutes} minutes</p>

            <p>Maximum Marks: {data.totalMarks}</p>
          </div>

          {/* Instructions */}

          <div className="mt-4  text-[16px] md:text-[18px]">
            <p>All questions are compulsory unless stated otherwise.</p>
          </div>

          {/* Student Details */}

          <div className="mt-8 space-y-3  text-[16px] md:text-[18px]">
            <div>Name: ______________________________</div>

            <div>Roll Number: ________________________</div>

            <div>Class: {assignment.className} Section: __________________</div>
          </div>

          {/* Sections */}

          {data.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mt-10">
              <h2 className="text-center  text-[20px] md:text-[24px] font-semibold mb-4">
                Section {String.fromCharCode(65 + sectionIndex)}
              </h2>

              <p className="font-semibold text-[18px] mb-1">
                {formatQuestionType(
                  assignment?.questionRequirements[sectionIndex]?.type || section.title,
                )}
              </p>

              <p className="  italic text-[16px] mb-4">{section.instruction}</p>

              {section.questions.map((question, index) => (
                <div key={index} className="mb-3 text-[16px] font-inter">
                  <p>
                    {index + 1}.{' '}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border mr-2 ${
                        difficultyStyles[question.difficulty as keyof typeof difficultyStyles] ??
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {question.difficulty}
                    </span>
                    {question.question}
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                      {question.marks} Marks
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ))}

          {/*ANSWER KEY */}

          <div className="mt-16   pt-10">
            <h2 className="  text-[20px]  md:text-[24px] font-bold mb-8">Answer Key:</h2>

            {data.sections.map((section, sectionIndex) => (
              <div key={`answer - ${sectionIndex}`} className="mb-10">
                <p className="font-semibold text-[18px] mb-4">
                  Section {String.fromCharCode(65 + sectionIndex)}
                </p>

                <div className="space-y-2">
                  {section.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="flex gap-3 text-[16px]">
                      <span className="font-medium min-w-[32px]">{questionIndex + 1}.</span>

                      <span>{question.answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
