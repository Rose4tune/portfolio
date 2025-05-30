import CVLayout from "@/components/layout/CVLayout";
import { Download } from "lucide-react";

export default function CVPage() {
  return (
    <CVLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Curriculum Vitae</h1>
        <a
          href="/documents/resume.pdf"
          download
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          PDF
          <Download className="w-6 h-6 m-auto" />
        </a>
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Software Engineer & Full Stack Developer
      </p>
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">Experience</h2>
          <div className="space-y-8">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus,
            deserunt eligendi quos ducimus exercitationem quod consequatur
            sapiente beatae voluptatibus qui rerum et, ea necessitatibus, cumque
            temporibus perspiciatis modi ipsum! Eos. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Minus, deserunt eligendi quos ducimus
            exercitationem quod consequatur sapiente beatae voluptatibus qui
            rerum et, ea necessitatibus, cumque temporibus perspiciatis modi
            ipsum! Eos. Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Minus, deserunt eligendi quos ducimus exercitationem quod
            consequatur sapiente beatae voluptatibus qui rerum et, ea
            necessitatibus, cumque temporibus perspiciatis modi ipsum! Eos.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus,
            deserunt eligendi quos ducimus exercitationem quod consequatur
            sapiente beatae voluptatibus qui rerum et, ea necessitatibus, cumque
            temporibus perspiciatis modi ipsum! Eos. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Minus, deserunt eligendi quos ducimus
            exercitationem quod consequatur sapiente beatae voluptatibus qui
            rerum et, ea necessitatibus, cumque temporibus perspiciatis modi
            ipsum! Eos. Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Minus, deserunt eligendi quos ducimus exercitationem quod
            consequatur sapiente beatae voluptatibus qui rerum et, ea
            necessitatibus, cumque temporibus perspiciatis modi ipsum! Eos.
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          <div className="space-y-8">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus,
            deserunt eligendi quos ducimus exercitationem quod consequatur
            sapiente beatae voluptatibus qui rerum et, ea necessitatibus, cumque
            temporibus perspiciatis modi ipsum! Eos. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Minus, deserunt eligendi quos ducimus
            exercitationem quod consequatur sapiente beatae voluptatibus qui
            rerum et, ea necessitatibus, cumque temporibus perspiciatis modi
            ipsum! Eos. Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Minus, deserunt eligendi quos ducimus exercitationem quod
            consequatur sapiente beatae voluptatibus qui rerum et, ea
            necessitatibus, cumque temporibus perspiciatis modi ipsum! Eos.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus,
            deserunt eligendi quos ducimus exercitationem quod consequatur
            sapiente beatae voluptatibus qui rerum et, ea necessitatibus, cumque
            temporibus perspiciatis modi ipsum! Eos.
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <div className="space-y-8">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus,
            deserunt eligendi quos ducimus exercitationem quod consequatur
            sapiente beatae voluptatibus qui rerum et, ea necessitatibus, cumque
            temporibus perspiciatis modi ipsum! Eos. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Minus, deserunt eligendi quos ducimus
            exercitationem quod consequatur sapiente beatae voluptatibus qui
            rerum et, ea necessitatibus, cumque temporibus perspiciatis modi
            ipsum! Eos. Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Minus, deserunt eligendi quos ducimus exercitationem quod
            consequatur sapiente beatae voluptatibus qui rerum et, ea
            necessitatibus, cumque temporibus perspiciatis modi ipsum! Eos.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus,
            deserunt eligendi quos ducimus exercitationem quod consequatur
            sapiente beatae voluptatibus qui rerum et, ea necessitatibus, cumque
            temporibus perspiciatis modi ipsum! Eos.
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Education</h2>
          <div className="space-y-8">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus,
            deserunt eligendi quos ducimus exercitationem quod consequatur
            sapiente beatae voluptatibus qui rerum et, ea necessitatibus, cumque
            temporibus perspiciatis modi ipsum! Eos. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Minus, deserunt eligendi quos ducimus
            exercitationem quod consequatur sapiente beatae voluptatibus qui
            rerum et, ea necessitatibus, cumque temporibus perspiciatis modi
            ipsum! Eos. Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Minus, deserunt eligendi quos ducimus exercitationem quod
            consequatur sapiente beatae voluptatibus qui rerum et, ea
            necessitatibus, cumque temporibus perspiciatis modi ipsum! Eos.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus,
            deserunt eligendi quos ducimus exercitationem quod consequatur
            sapiente beatae voluptatibus qui rerum et, ea necessitatibus, cumque
            temporibus perspiciatis modi ipsum! Eos. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Minus, deserunt eligendi quos ducimus
            exercitationem quod consequatur sapiente beatae voluptatibus qui
            rerum et, ea necessitatibus, cumque temporibus perspiciatis modi
            ipsum! Eos. Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Minus, deserunt eligendi quos ducimus exercitationem quod
            consequatur sapiente beatae voluptatibus qui rerum et, ea
            necessitatibus, cumque temporibus perspiciatis modi ipsum! Eos.
          </div>
        </section>
      </div>
    </CVLayout>
  );
}
