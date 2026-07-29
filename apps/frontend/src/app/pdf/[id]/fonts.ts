import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: '/fonts/Inter-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: '/fonts/Inter-Medium.ttf',
      fontWeight: 500,
    },
    {
      src: '/fonts/Inter-SemiBold.ttf',
      fontWeight: 600,
    },
    {
      src: '/fonts/Inter-Bold.ttf',
      fontWeight: 700,
    },
    {
      src: '/fonts/Inter-ExtraBold.ttf',
      fontWeight: 800,
    },
  ],
});
