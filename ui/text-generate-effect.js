import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");

  useEffect(() => {
    // Reset all spans to invisible first
    animate("span", {
      opacity: 0,
      filter: filter ? "blur(10px)" : "none",
    }, {
      duration: 0,
    }).then(() => {
      // Then animate them in
      animate("span", {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      }, {
        duration: duration ? duration : 0.5,
        delay: stagger(0.1), // Reduced delay for faster animation
      });
    });
  }, [words, scope, animate, filter, duration]); // Added 'words' as dependency

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={`${word}-${idx}-${words}`} // Made key more unique to force re-render
              className="dark:text-white text-white opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}>
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-white text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};