interface LabelTypes {
    htmlFor?: string;
    text: string;
  }
  const Label: React.FC<LabelTypes> = ({ htmlFor, text }) => {
    return <label htmlFor={htmlFor} className="text-sm text-[#636B62] font-semibold">{text}</label>;
  };


  export default Label;
  