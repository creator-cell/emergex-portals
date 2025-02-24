import { cn } from "@/lib/utils";

interface TextBarTypes {
    title: string;
    line: string;
    TitleClassName?:string;
    LineClassname?:string
  }
  // {cn(
  //   `flex flex-wrap items-center justify-between w-full bg-white gap-[16px] rounded-[20px] shadow-md px-[22px] py-[24px] `,
  //   className
  // )}
  const TextBar: React.FC<TextBarTypes> = ({ title, line,TitleClassName,LineClassname }) => {
    return (
      <div className="flex flex-col   ">
        <h5 className= {cn(`text-grayish text-[14px] font-[600]`,TitleClassName)}>{title}</h5>
        <p className={cn(` text-darkish text-[18px] font-[500]`,LineClassname)}>{line}</p>
      </div>
    );
  };

  export default TextBar;