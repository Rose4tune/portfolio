import { ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";

type CustomRenderOptions = Omit<RenderOptions, "wrapper">;

function AllTheProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function customRender(ui: ReactElement, options?: CustomRenderOptions) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
