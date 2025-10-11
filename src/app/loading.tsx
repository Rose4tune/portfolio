import Loader from "@/shared/ui/loader/Loader";
import { AnimatedLoadingText } from "@/shared/ui";

function Loading() {
  return (
    <Loader>
      <AnimatedLoadingText />
    </Loader>
  );
}

export default Loading;
