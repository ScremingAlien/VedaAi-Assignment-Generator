import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import './fonts';

import type { Assessment } from '@/features/assessment/api/assessment.types';
import { formatQuestionType } from '@/utils/formatDate';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: 'Inter',
  },

  schoolName: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 700,
    marginBottom: 4,
  },

  subject: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 4,
  },

  className: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 24,
  },

  topMeta: {
    fontSize: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    fontWeight: 600,
  },

  instructions: {
    fontSize: 11,
    marginBottom: 16,
    fontWeight: 500,
  },

  studentBox: {
    marginBottom: 30,
    gap: 8,
  },

  fieldRow: {
    fontSize: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },

  line: {
    borderBottomWidth: 1,
    width: 120,
    marginLeft: 6,
  },

  sectionTitle: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 16,
    marginTop: 12,
  },

  questionType: {
    fontSize: 12,
    textTransform: 'capitalize',
    fontWeight: 600,
    marginBottom: 4,
  },

  questionInfo: {
    fontSize: 10,
    marginBottom: 14,
  },

  question: {
    fontSize: 10,
    marginBottom: 10,
    lineHeight: 1.6,
  },
  answerKeyTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 30,
    marginBottom: 12,
  },

  answerSectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 8,
    marginTop: 12,
  },

  answerItem: {
    flexDirection: 'row',
    marginBottom: 6,
    fontSize: 10,
  },

  answerNumber: {
    width: 20,
    fontWeight: 600,
  },

  answerText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
  },
});

interface Props {
  assessment: Assessment;
}

export default function AssessmentDocument({ assessment }: Props) {
  const assignment = assessment.assignmentId;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}

        <Text style={styles.schoolName}>Delhi Public School, Sector-4, Bokaro</Text>

        <Text style={styles.subject}>Subject: {assignment.subject}</Text>

        <Text style={styles.className}>Class: {assignment.className}</Text>

        {/* Meta */}

        <View style={styles.topMeta}>
          <Text>Time Allowed: {assignment.timeAllowedMinutes} minutes</Text>

          <Text>Maximum Marks: {assessment.totalMarks}</Text>
        </View>

        {/* Instructions */}

        <Text style={styles.instructions}>
          All questions are compulsory unless stated otherwise.
        </Text>

        {/* Student Details */}

        <View style={styles.studentBox}>
          <View style={styles.fieldRow}>
            <Text>Name:</Text>
            <Text>______________________</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text>Roll Number:</Text>

            <Text>_______________</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text>Class: {assignment.className} Section:</Text>

            <Text>_________</Text>
          </View>
        </View>

        {/* Sections */}

        {assessment.sections.map((section, sectionIndex) => (
          <View key={sectionIndex} wrap={false}>
            <Text style={styles.sectionTitle}>
              Section {String.fromCharCode(65 + sectionIndex)}
            </Text>

            <Text style={styles.questionType}>
              {formatQuestionType(
                assignment?.questionRequirements[sectionIndex]?.type || section.title,
              )}
            </Text>

            <Text style={styles.questionInfo}>{section.instruction}</Text>

            {section.questions.map((question, index) => (
              <Text key={index} style={styles.question}>
                {index + 1}. [{question.difficulty}] {question.question} [{question.marks} Marks]
              </Text>
            ))}
          </View>
        ))}

        {/* Answer Key */}

        {/* <View break /> */}

        <Text style={styles.answerKeyTitle}>Answer Key</Text>

        {assessment.sections.map((section, sectionIndex) => (
          <View key={`answer-${sectionIndex}`} style={{ marginBottom: 16 }}>
            <Text style={styles.answerSectionTitle}>
              Section {String.fromCharCode(65 + sectionIndex)}
            </Text>

            {section.questions.map((question, questionIndex) => (
              <View key={questionIndex} style={styles.answerItem}>
                <Text style={styles.answerNumber}>{questionIndex + 1}.</Text>

                <Text style={styles.answerText}>
                  {'answer' in question && question.answer
                    ? question.answer
                    : 'Answer not available'}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
