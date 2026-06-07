import { format } from 'date-fns';

export function datetoString(date: Date | string) {
  return format(date, 'dd-MM-yyyy');
}
export function formatQuestionType(value: string): string {
  const lowercaseWords = ['in', 'the', 'of', 'and'];

  return value
    .toLowerCase()
    .split('_')
    .map((word, index) =>
      index > 0 && lowercaseWords.includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');
}
