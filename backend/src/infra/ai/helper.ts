function getQuestionTypeGuide(type: string) {
  switch (type) {
    case 'MCQ':
      return 'Provide 4 options.';

    case 'TRUE_FALSE':
      return 'Question answerable by True or False.';

    case 'FILL_IN_THE_BLANK':
      return 'Provide fill in blank format.';

    case 'ONE_WORD':
      return 'Answer should be one word.';

    case 'VERY_SHORT_ANSWER':
      return '1-2 sentence answer.';

    case 'SHORT_ANSWER':
      return '3-5 sentence answer.';

    case 'SHORT_NOTE':
      return 'Brief explanatory note.';

    case 'LONG_ANSWER':
      return 'Detailed answer.';

    case 'ESSAY':
      return 'Essay style question.';

    case 'NUMERICAL_PROBLEM':
      return 'Calculation-based question.';

    case 'DIAGRAM_BASED':
      return 'Question requiring diagram.';
  }
}
