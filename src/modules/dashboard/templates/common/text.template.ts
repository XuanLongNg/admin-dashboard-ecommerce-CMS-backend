import { TextRun } from 'docx';
import { IText } from '@/modules/dashboard/interfaces/dashboard.interface';

const TextTemplate = (props: IText) => {
  const isUppercase = props.isUppercase ?? false;
  const isLowercase = props.isLowercase ?? false;
  const isBold = props.isBold ?? false;
  const size = props.size ?? 28;
  const text = (() => {
    if (isUppercase) return props.text.toUpperCase();
    else if (isLowercase) return props.text.toLowerCase();
    else return props.text;
  })();
  return new TextRun({
    text: text,
    bold: isBold,
    size: size,
  });
};

export { TextTemplate };
