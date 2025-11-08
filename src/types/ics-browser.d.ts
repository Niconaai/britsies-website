declare module 'ics-browser' {
  export function addEvent(
    event: {
      title: string;
      description?: string;
      location?: string;
      begin: string;
      end: string;
    },
    filename?: string
  ): void;
}
