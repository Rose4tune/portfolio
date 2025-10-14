<<<<<<< HEAD
<<<<<<< HEAD
import { AnimatedLoadingText, Loader } from "@/shared/ui";
=======
import { Loader, AnimatedLoadingText } from "@/layout";
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
import { AnimatedLoadingText, Loader } from "@/shared/ui";
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))

function Loading() {
  return (
    <Loader>
      <AnimatedLoadingText />
    </Loader>
  );
}

export default Loading;
