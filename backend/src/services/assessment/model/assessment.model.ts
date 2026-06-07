import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    marks: {
      type: Number,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
    },

    answer: String,

    solution: String,
  },
  {
    _id: false,
  },
);

const SectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    instructions: {
      type: String,
    },

    totalMarks: Number,

    questions: [QuestionSchema],
  },
  {
    _id: false,
  },
);

const AssessmentSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    sections: [SectionSchema],

    generatedBy: {
      type: String,
      default: 'AI',
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);
AssessmentSchema.index({ assignmentId: 1, version: 1 }, { unique: true });
export const AssessmentModel = mongoose.model('Assessment', AssessmentSchema);
