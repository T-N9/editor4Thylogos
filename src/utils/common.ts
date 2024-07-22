import normalizeClassNames from "@/shared/normalizeClassNames";

export function addClassNamesToElement(
    element: HTMLElement,
    ...classNames: Array<typeof undefined | boolean | null | string>
  ): void {
    const classesToAdd = normalizeClassNames(...classNames);
    if (classesToAdd.length > 0) {
      element.classList.add(...classesToAdd);
    }
  }