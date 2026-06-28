import bgLeftMargin from "@/assets/bg-left-margin.png";
import bgRightMargin from "@/assets/bg-right-margin.png";

export const MarginBackgrounds = () => {
  return (
    <>
      {/* Left margin background - contain ensures image is NEVER cut */}
      <div 
        className="fixed left-0 top-0 bottom-0 z-0 pointer-events-none w-[50px] sm:w-[70px] md:w-[100px] lg:w-[140px] xl:w-[180px]"
        style={{ 
          opacity: 0.18,
          backgroundImage: `url(${bgLeftMargin})`,
          backgroundRepeat: 'repeat-y',
          backgroundSize: 'contain',
          backgroundPosition: 'top center'
        }}
        aria-hidden="true"
      />
      
      {/* Right margin background - contain ensures image is NEVER cut */}
      <div 
        className="fixed right-0 top-0 bottom-0 z-0 pointer-events-none w-[50px] sm:w-[70px] md:w-[100px] lg:w-[140px] xl:w-[180px]"
        style={{ 
          opacity: 0.18,
          backgroundImage: `url(${bgRightMargin})`,
          backgroundRepeat: 'repeat-y',
          backgroundSize: 'contain',
          backgroundPosition: 'top center'
        }}
        aria-hidden="true"
      />
    </>
  );
};
